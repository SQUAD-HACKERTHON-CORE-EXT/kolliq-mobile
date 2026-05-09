import api from './api';
import { ApiResponse, Job, JobMatch } from '../types';

class JobsService {

  /**
   * Get AI-matched jobs for user
   */
  async getMatchedJobs(
    userId: string,
    limit: number = 10
  ): Promise<JobMatch[]> {
    const response = await api.get<ApiResponse<JobMatch[]>>(
      `/jobs/matched/${userId}`,
      {
        params: { limit },
      }
    );
    return response.data.data || [];
  }

  /**
   * Get all available jobs
   */
  async getJobs(
    limit: number = 20,
    offset: number = 0,
    filters?: {
      location?: string;
      skill?: string;
      minPay?: number;
      maxPay?: number;
    }
  ): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>('/jobs/list', {
      params: { limit, offset, ...filters },
    });
    return response.data.data || [];
  }

  /**
   * Get job details
   */
  async getJobDetails(jobId: string): Promise<Job> {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${jobId}`);
    return response.data.data!;
  }

  /**
   * Accept a job
   */
  async acceptJob(jobId: string, userId: string): Promise<{
    jobId: string;
    status: 'accepted';
    acceptedAt: string;
  }> {
    const response = await api.post<
      ApiResponse<{
        jobId: string;
        status: 'accepted';
        acceptedAt: string;
      }>
    >(`/jobs/${jobId}/accept`, { userId });
    return response.data.data!;
  }

  /**
   * Complete a job
   */
  async completeJob(
    jobId: string,
    userId: string,
    completionNotes?: string
  ): Promise<{
    jobId: string;
    status: 'completed';
    completedAt: string;
  }> {
    const response = await api.post<
      ApiResponse<{
        jobId: string;
        status: 'completed';
        completedAt: string;
      }>
    >(`/jobs/${jobId}/complete`, { userId, completionNotes });
    return response.data.data!;
  }

  /**
   * Rate a job/user
   */
  async rateExperience(
    jobId: string,
    userId: string,
    data: {
      rating: number; // 1-5
      review?: string;
      ratedUserId: string; // The other user being rated
    }
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/jobs/${jobId}/rate`,
      { userId, ...data }
    );
    return response.data.data!;
  }

  /**
   * Get user's accepted jobs
   */
  async getUserAcceptedJobs(userId: string): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>(
      `/jobs/user/${userId}/accepted`
    );
    return response.data.data || [];
  }

  /**
   * Get user's completed jobs
   */
  async getUserCompletedJobs(userId: string): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>(
      `/jobs/user/${userId}/completed`
    );
    return response.data.data || [];
  }

  /**
   * Post a job (for employers)
   */
  async postJob(data: {
    employerId: string;
    title: string;
    description: string;
    pay: number;
    duration?: string;
    location: string;
    skills: string[];
    languages?: string[];
    requiredAvailability?: string;
  }): Promise<Job> {
    const response = await api.post<ApiResponse<Job>>('/jobs/create', data);
    return response.data.data!;
  }

  /**
   * Search jobs
   */
  async searchJobs(query: string, limit: number = 20): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>('/jobs/search', {
      params: { q: query, limit },
    });
    return response.data.data || [];
  }
}

export const jobsService = new JobsService();
