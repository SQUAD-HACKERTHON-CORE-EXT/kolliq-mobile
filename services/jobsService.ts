import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'
import { ONBOARDING_CONFIG } from '../constants'

const toNumber = (value: any, fallback = 0) => {
  const parsed = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeJob = (job: any) => ({
  id: String(job?.job_id ?? job?.id ?? job?.pk ?? job?.job ?? ''),
  job_id: String(job?.job_id ?? job?.id ?? job?.pk ?? job?.job ?? ''),
  title: job?.title ?? job?.job_title ?? 'Untitled Job',
  description: job?.description ?? '',
  pay: toNumber(job?.pay_per_worker ?? job?.pay ?? job?.amount ?? 0),
  pay_per_worker: toNumber(job?.pay_per_worker ?? job?.pay ?? job?.amount ?? 0),
  duration: job?.duration ?? (job?.duration_hours ? String(job.duration_hours) : undefined),
  duration_hours: toNumber(job?.duration_hours ?? job?.duration ?? 0),
  location: job?.location_area ?? job?.location ?? job?.city ?? 'Unknown location',
  location_area: job?.location_area ?? job?.location ?? job?.city ?? 'Unknown location',
  distance: toNumber(job?.distance_km ?? job?.distance ?? 0) || undefined,
  distance_km: toNumber(job?.distance_km ?? job?.distance ?? 0),
  employerId: String(job?.employer_id ?? job?.employerId ?? ''),
  employerName: job?.employer_name ?? job?.employer ?? job?.business_name ?? 'Employer',
  employer_name: job?.employer_name ?? job?.employer ?? job?.business_name ?? 'Employer',
  employerRating: toNumber(job?.employer_rating ?? job?.rating ?? 0),
  employer_rating: toNumber(job?.employer_rating ?? job?.rating ?? 0),
  skills: Array.isArray(job?.skills) ? job.skills : job?.skill_required ? [job.skill_required] : [],
  skill_required: job?.skill_required ?? job?.skill ?? job?.category ?? '',
  languages: Array.isArray(job?.languages) ? job.languages : undefined,
  requiredAvailability: job?.requiredAvailability ?? job?.required_availability,
  workers_needed: toNumber(job?.workers_needed ?? job?.workersNeeded ?? 1),
  status: job?.status ?? 'open',
  createdAt: job?.createdAt ?? job?.created_at ?? new Date().toISOString(),
  acceptedBy: job?.acceptedBy ?? job?.accepted_by,
  match_score: toNumber(job?.match_score ?? job?.matchScore ?? 0),
  score_breakdown: {
    location: toNumber(job?.score_breakdown?.location ?? job?.score_breakdown?.location_score ?? 0),
    skill: toNumber(job?.score_breakdown?.skill ?? job?.score_breakdown?.skill_score ?? 0),
    availability: toNumber(job?.score_breakdown?.availability ?? job?.score_breakdown?.availability_score ?? 0),
  },
  escrow_funded: Boolean(job?.escrow_funded ?? job?.is_escrow_funded ?? false),
  // Added field for applications
  applications_count: toNumber(job?.applications_count ?? 0),
  applicants: job?.applicants || [],

  // Backend OAS includes escrow instructions for employer flows.
  // Keep as-is (shape can include account_number, bank_name, reference, amount, etc.).
  escrow_instructions: job?.escrow_instructions,
})

const unwrapJobs = (response: any) => {
  const payload = response?.jobs ?? response?.applications ?? response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.jobs)) return payload.jobs
  if (Array.isArray(payload?.applications)) return payload.applications
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

const unwrapJobsFeedResponse = (response: any) => {
  const payload = response?.data ?? response ?? {}
  const jobs = unwrapJobs(payload).map(normalizeJob)
  return {
    jobs,
    count: toNumber(payload?.count ?? jobs.length, jobs.length),
    message: payload?.message ?? '',
  }
}

export const getJobsFeed = async () => {
  const response = await apiClient.get(ENDPOINTS.JOBS_FEED)
  return unwrapJobs(response).map(normalizeJob)
}

export const getJobsFeedResponse = async () => {
  const response: any = await apiClient.get(ENDPOINTS.JOBS_FEED)
  console.log('📋 JOBS FEED RESPONSE:', JSON.stringify(response?.data || response, null, 2));
  return unwrapJobsFeedResponse(response)
}

export const getJobDetail = async (jobId: string) => {
  const response: any = await apiClient.get(`/api/jobs/${jobId}/`)
  console.log(`📋 JOB DETAIL [${jobId}]:`, JSON.stringify(response?.data || response, null, 2));
  return normalizeJob(response?.data || response)
}

export const acceptJob = async (job_id: string) => {
  const response = await apiClient.post(ENDPOINTS.ACCEPT_JOB, { job_id })
  return response
}

export const createJob = async (data: {
  title: string
  description?: string
  location_area: string
  location_city?: string
  pay_per_worker: number | string
  workers_needed?: number | string
  required_skills?: string[]
  start_date?: string
  availability?: string
  location_lat?: string
  location_lng?: string
}) => {
  // Map frontend data to the specific API spec provided
  // Final mapping to match server's exact vocabulary
  const getSkillSlug = (skill: string) => {
    const s = skill.toLowerCase().trim();

    if (s === 'other') return 'other';

    // Keep "Market Assistant" aligned with worker onboarding IDs.
    // Onboarding uses: market_assistant
    if (s.includes('market_assistant')) return 'market_assistant';
    if (s.includes('market assistant') || s === 'market assistant') return 'market_assistant';

    return s.replace(/[^\w ]+/g, '').replace(/ +/g, '_');
  };

  const firstSkill = data.required_skills && data.required_skills.length > 0 ? data.required_skills[0] : 'delivery';
  const isCustom = !ONBOARDING_CONFIG.SKILLS.map(s => s.toLowerCase()).includes(firstSkill.toLowerCase()) && firstSkill.toLowerCase() !== 'other';

  const payload = {
    title: data.title,
    description: data.description || '',
    skill_required: isCustom ? 'other' : getSkillSlug(firstSkill),
    // Provide both shapes: singular `skill_required` and `skills` array
    skills: [getSkillSlug(firstSkill)],
    workers_needed: Number(data.workers_needed || 1),
    location_area: data.location_area,
    location_city: data.location_city || '',
    // API expects strings for these numeric/location values based on the spec
    location_lat: data.location_lat || "0.0",
    location_lng: data.location_lng || "0.0",
    pay_per_worker: String(data.pay_per_worker),
    duration_hours: data.availability || "8.0",
    start_time: data.start_date || new Date().toISOString(),
    source_channel: "mobile_app"
  }

  console.log('📤 Posting Job Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_JOB, payload)
    return response
  } catch (error: any) {
    if (error.response) {
      console.log('❌ Job Creation Failed:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

export const completeJob = async (job_id: string, worker_id?: string) => {
  const body: any = { job_id }
  if (worker_id) body.worker_id = worker_id
  const response = await apiClient.post(ENDPOINTS.COMPLETE_JOB, body)
  return response
}

export const getMyJobs = async () => {
  const response = await apiClient.get(ENDPOINTS.MY_JOBS)
  return unwrapJobs(response).map(normalizeJob)
}

export const rateJob = async (data: {
  job_id: string
  to_user_id: string
  stars: number
  comment?: string
}) => {
  const response = await apiClient.post(ENDPOINTS.RATE_JOB, data)
  return response
}

export const getUserRatings = async (userId: string) => {
  const response = await apiClient.get(`/api/jobs/ratings/${userId}/`)
  return response
}
