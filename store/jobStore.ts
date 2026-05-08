import { create } from 'zustand';
import { Job, JobMatch } from '../types';

interface JobStore {
  jobs: Job[];
  matchedJobs: JobMatch[];
  acceptedJobs: Job[];
  isLoading: boolean;
  error: string | null;

  setJobs: (jobs: Job[]) => void;
  setMatchedJobs: (matches: JobMatch[]) => void;
  setAcceptedJobs: (jobs: Job[]) => void;
  addAcceptedJob: (job: Job) => void;
  removeAcceptedJob: (jobId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  matchedJobs: [],
  acceptedJobs: [],
  isLoading: false,
  error: null,

  setJobs: (jobs) => set({ jobs }),

  setMatchedJobs: (matches) => set({ matchedJobs: matches }),

  setAcceptedJobs: (jobs) => set({ acceptedJobs: jobs }),

  addAcceptedJob: (job) =>
    set((state) => ({
      acceptedJobs: [job, ...state.acceptedJobs],
    })),

  removeAcceptedJob: (jobId) =>
    set((state) => ({
      acceptedJobs: state.acceptedJobs.filter((j) => j.id !== jobId),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
