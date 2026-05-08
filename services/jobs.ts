import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../constants';
import { ApiResponse, Job, JobMatch } from '../types';

class JobsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/jobs`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get AI-matched jobs for user
   */
  async getMatchedJobs(
    userId: string,
    limit: number = 10
  ): Promise<JobMatch[]> {
    try {
      const response = await this.api.get<ApiResponse<JobMatch[]>>(
        `/matched/${userId}`,
        {
          params: { limit },
        }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.get<ApiResponse<Job[]>>('/list', {
        params: { limit, offset, ...filters },
      });
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get job details
   */
  async getJobDetails(jobId: string): Promise<Job> {
    try {
      const response = await this.api.get<ApiResponse<Job>>(`/${jobId}`);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Accept a job
   */
  async acceptJob(jobId: string, userId: string): Promise<{
    jobId: string;
    status: 'accepted';
    acceptedAt: string;
  }> {
    try {
      const response = await this.api.post<
        ApiResponse<{
          jobId: string;
          status: 'accepted';
          acceptedAt: string;
        }>
      >(`/${jobId}/accept`, { userId });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<
        ApiResponse<{
          jobId: string;
          status: 'completed';
          completedAt: string;
        }>
      >(`/${jobId}/complete`, { userId, completionNotes });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<ApiResponse<{ success: boolean }>>(
        `/${jobId}/rate`,
        { userId, ...data }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's accepted jobs
   */
  async getUserAcceptedJobs(userId: string): Promise<Job[]> {
    try {
      const response = await this.api.get<ApiResponse<Job[]>>(
        `/user/${userId}/accepted`
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's completed jobs
   */
  async getUserCompletedJobs(userId: string): Promise<Job[]> {
    try {
      const response = await this.api.get<ApiResponse<Job[]>>(
        `/user/${userId}/completed`
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<ApiResponse<Job>>('/create', data);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search jobs
   */
  async searchJobs(query: string, limit: number = 20): Promise<Job[]> {
    try {
      const response = await this.api.get<ApiResponse<Job[]>>('/search', {
        params: { q: query, limit },
      });
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch jobs. Please try again.';
      return new Error(message);
    }
    return error;
  }
}

export const jobsService = new JobsService();
