import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Building,
} from "lucide-react";
import { jobService } from "../services/job.service";
import { Job } from "../types";
import { useStore } from "../store";
import { toast } from "react-toastify";
import { applicationService } from "../services/application.service";
import JobApplicationModal from "../components/JobApplicationModal";

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // check if user has already applied for the job
  const checkIfApplied = async (jobId: string) => {
    try {
      const response = await applicationService.getUserApplications();
      const applied = response.applications.some((application) =>
        typeof application.jobId === "object"
          ? application.job._id.toString() === jobId
          : application.jobId === jobId
      );
      setHasApplied(applied);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  useEffect(() => {
    if (id && currentUser?.role === "jobseeker") {
      checkIfApplied(id);
    }
  }, [id, currentUser]);

  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
    }
  }, [id]);

  const fetchJobDetails = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(jobId);
      setJob(response.job);
    } catch (error) {
      toast.error("Failed to load job details");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/jobs")}
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Jobs
      </button>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-6 mb-6`}
      >
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              job.type === "full-time"
                ? "bg-green-100 text-green-800"
                : job.type === "part-time"
                ? "bg-blue-100 text-blue-800"
                : job.type === "contract"
                ? "bg-purple-100 text-purple-800"
                : job.type === "internship"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-indigo-100 text-indigo-800"
            }`}
          >
            {job.type.replace("-", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Building size={20} className="mr-2 text-gray-500" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={20} className="mr-2 text-gray-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={20} className="mr-2 text-gray-500" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={20} className="mr-2 text-gray-500" />
            <span>
              Posted on {new Date(job.postedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="whitespace-pre-line">{job.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Requirements</h2>
          <ul className="list-disc pl-5 space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {currentUser?.role === "jobseeker" && (
          <button
            onClick={() => setShowApplicationModal(true)}
            disabled={hasApplied}
            className={`w-full py-3 rounded-lg transition ${
              hasApplied
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {hasApplied ? "Already Applied" : "Apply Now"}
          </button>
        )}
      </div>

      {showApplicationModal && (
        <JobApplicationModal
          jobId={job._id.toString()}
          jobTitle={job.title}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={() => setHasApplied(true)}
        />
      )}
    </div>
  );
}

export default JobDetails;
