import React, { useState } from "react";
import { X } from "lucide-react";
import { applicationService } from "../services/application.service";
import { toast } from "react-toastify";
import { useStore } from "../store";

interface JobApplicationModalProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}) => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      toast.error("Please provide a cover letter");
      return;
    }

    setLoading(true);

    try {
      await applicationService.applyForJob(jobId, coverLetter, resume);
      toast.success("Application submitted successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-xl w-full max-w-md`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Apply for {jobTitle}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Resume</label>
            <input
              type="url"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter resume URL..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              placeholder="Explain why you're a good fit for this position..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${
                loading ? "opacity-70" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;
