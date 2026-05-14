import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

const toNumber = (value: any, fallback = 0) => {
  const parsed = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeJob = (job: any) => ({
  id: String(job?.job_id ?? job?.id ?? job?.pk ?? ''),
  job_id: String(job?.job_id ?? job?.id ?? job?.pk ?? ''),
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
  status: job?.status ?? 'open',
  createdAt: job?.createdAt ?? job?.created_at ?? new Date().toISOString(),
  acceptedBy: job?.acceptedBy ?? job?.accepted_by,
  match_score: toNumber(job?.match_score ?? job?.matchScore ?? 0),
  escrow_funded: Boolean(job?.escrow_funded ?? job?.is_escrow_funded ?? false),
})

const unwrapJobs = (response: any) => {
  const payload = response?.jobs ?? response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.jobs)) return payload.jobs
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

export const getJobsFeed = async () => {
  const response = await apiClient.get(ENDPOINTS.JOBS_FEED)
  return unwrapJobs(response).map(normalizeJob)
}

export const getJobDetail = async (jobId: string) => {
  const response = await apiClient.get(`/api/jobs/${jobId}/`)
  return normalizeJob(response)
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
  pay_per_worker: number
  workers_needed?: number
  required_skills?: string[]
  start_date?: string
  availability?: string
}) => {
  const response = await apiClient.post(ENDPOINTS.CREATE_JOB, data)
  return response
}

export const completeJob = async (job_id: string, worker_id?: string) => {
  const body: any = { job_id }
  if (worker_id) body.worker_id = worker_id
  const response = await apiClient.post(ENDPOINTS.COMPLETE_JOB, body)
  return response
}

export const getMyJobs = async () => {
  const response = await apiClient.get(ENDPOINTS.MY_JOBS)
  return response
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
