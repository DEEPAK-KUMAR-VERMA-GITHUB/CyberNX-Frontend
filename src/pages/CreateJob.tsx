import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { jobService } from "../services/job.service";
import { useStore } from "../store";
import { toast } from "react-toastify";

function CreateJob() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [formData, setFormData] = useState({
    title: "",
    company: currentUser?.company || "",
    location: "",
    type: "full-time",
    salary: "",
    description: "",
    category: "",
    requirements: [""],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: updatedRequirements }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const updatedRequirements = [...formData.requirements];
      updatedRequirements.splice(index, 1);
      setFormData((prev) => ({ ...prev, requirements: updatedRequirements }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty requirements
    const filteredRequirements = formData.requirements.filter(
      (req) => req.trim() !== ""
    );

    if (filteredRequirements.length === 0) {
      toast.error("Please add at least one job requirement");
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        requirements: filteredRequirements,
      };

      await jobService.createJob(jobData);
      toast.success("Job posted successfully");
      navigate("/employer/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-6`}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
                readOnly={!!currentUser?.company}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $50,000 - $70,000"
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                  className={`flex-1 p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  } border focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter a job requirement"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={formData.requirements.length <= 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="mt-2 flex items-center text-blue-600 hover:underline"
            >
              <Plus size={16} className="mr-1" />
              Add Requirement
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600"
            } text-white py-3 rounded-lg hover:bg-blue-700 transition`}
          >
            {loading ? "Posting Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
