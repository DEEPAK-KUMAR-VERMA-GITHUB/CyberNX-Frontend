export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "remote";
  salary: string;
  description: string;
  requirements: string[];
  category: string;
  postedDate: string;
  employer: string | User;
  status: "active" | "closed";
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  appliedDate: string;
  coverLetter: string;
  resume: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "employer" | "jobseeker";
  company?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}
