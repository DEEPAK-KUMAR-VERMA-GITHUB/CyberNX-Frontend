import { Job } from "../types";
import api from "./api";

export const jobService = {
  // Get all jobs with optional filters
  getAllJobs: async (
    filters = {}
  ): Promise<{ success: boolean; count: number; jobs: Job[] }> => {
    const queryString = new URLSearchParams(
      filters as Record<string, string>
    ).toString();
    const response = await api.get(`/jobs?${queryString}`);
    return response;
  },

  // Get job by ID
  getJobById: async (id: string): Promise<{ success: boolean; job: Job }> => {
    const response = await api.get(`/jobs/${id}`);
    return response;
  },

  // Create new job
  createJob: async (
    jobData: Omit<Job, "id" | "postedDate" | "employer">
  ): Promise<{ success: boolean; message: string; job: Job }> => {
    const response = await api.post("/jobs", jobData);
    return response;
  },

  // Update job
  updateJob: async (
    id: string,
    jobData: Partial<Job>
  ): Promise<{ success: boolean; message: string; job: Job }> => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response;
  },

  // Delete job
  deleteJob: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/jobs/${id}`);
    return response;
  },

  // Get employer's jobs
  getEmployerJobs: async (): Promise<{
    success: boolean;
    count: number;
    jobs: Job[];
  }> => {
    const response = await api.get("/jobs/employer/jobs");
    return response;
  },
};
