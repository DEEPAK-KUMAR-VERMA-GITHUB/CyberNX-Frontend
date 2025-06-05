import { Application } from "../types";
import api from "./api";

export const applicationService = {
  // Apply for a job
  applyForJob: async (
    jobId: string,
    coverLetter: string,
    resume: string
  ): Promise<{
    success: boolean;
    message: string;
    application: Application;
  }> => {
    const response = await api.post("/applications/apply", {
      jobId,
      coverLetter,
      resume,
    });
    return response.data;
  },

  // Get user's applications
  getUserApplications: async (): Promise<{
    success: boolean;
    count: number;
    applications: Application[];
  }> => {
    const response = await api.get("/applications/user");
    return response.data;
  },

  // Get job applications (for employers)
  getJobApplications: async (
    jobId: string
  ): Promise<{
    success: boolean;
    count: number;
    applications: Application[];
  }> => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },
};
