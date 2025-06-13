import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Briefcase } from "lucide-react";
import { jobService } from "../services/job.service";
import { Job } from "../types";
import { useStore } from "../store";

function Jobs() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    location: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const response = await jobService.getAllJobs(activeFilters);
      setJobs(response.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Find Your Next Job</h1>

      {/* Search and Filter */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-4 rounded-lg shadow-md mb-6`}
      >
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search jobs..."
                className={`w-full p-3 pl-10 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Filter size={20} className="mr-2" />
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-8 rounded-lg shadow-md text-center`}
        >
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No jobs found</h2>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition`}
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{job.title}</h2>
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

              <div className="mb-4">
                <p className="text-gray-500">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>

              <p className="mb-4 line-clamp-2">{job.description}</p>

              <div className="flex justify-between items-center">
                <span className="font-semibold">{job.salary}</span>
                <span className="text-sm text-gray-500">
                  {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;
