import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

export const getJobsFeed = async () => {
  const response = await apiClient.get(ENDPOINTS.JOBS_FEED)
  return response.data
}

export const getJobDetail = async (jobId: string) => {
  const response = await apiClient.get(`/api/jobs/${jobId}/`)
  return response.data
}

export const acceptJob = async (job_id: string) => {
  const response = await apiClient.post(ENDPOINTS.ACCEPT_JOB, { job_id })
  return response.data
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
  return response.data
}

export const completeJob = async (job_id: string, worker_id?: string) => {
  const body: any = { job_id }
  if (worker_id) body.worker_id = worker_id
  const response = await apiClient.post(ENDPOINTS.COMPLETE_JOB, body)
  return response.data
}

export const getMyJobs = async () => {
  const response = await apiClient.get(ENDPOINTS.MY_JOBS)
  return response.data
}

export const rateJob = async (data: {
  job_id: string
  to_user_id: string
  stars: number
  comment?: string
}) => {
  const response = await apiClient.post(ENDPOINTS.RATE_JOB, data)
  return response.data
}

export const getUserRatings = async (userId: string) => {
  const response = await apiClient.get(`/api/jobs/ratings/${userId}/`)
  return response.data
}
