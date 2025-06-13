import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../store";
import { applicationService } from "../services/application.service";
import { jobService } from "../services/job.service";

function JobSeekerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [userApplications, setUserApplications] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applicationData, setApplicationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (currentUser?._id) {
          // Get user applications
          const { applications } =
            await applicationService.getUserApplications();
          setUserApplications(applications);

          // Get job details for each application

          const jobs = applications?.map((app) => app.jobId) || [];
          const jobsMap = {};
          jobs.forEach((job) => {
            jobsMap[job._id] = job;
          });
          setAppliedJobs(jobsMap);

          // Generate chart data
          generateApplicationData(applications);
        } else {
          setApplicationData(generateEmptyWeekData());
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setApplicationData(generateEmptyWeekData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const generateEmptyWeekData = () => {
    const weekLabels = [];
    for (let i = 5; i >= 0; i--) {
      weekLabels.push(`Week ${6 - i}`);
    }
    return weekLabels.map((week) => ({ week, applications: 0 }));
  };

  const generateApplicationData = (applications) => {
    // Initialize data for the past 6 weeks
    const weekLabels = [];
    const weekData = {};

    for (let i = 5; i >= 0; i--) {
      const weekLabel = `Week ${6 - i}`;
      weekLabels.push(weekLabel);
      weekData[weekLabel] = 0;
    }

    // Count applications per week
    applications.forEach((app) => {
      const appDate = new Date(app.appliedDate);
      const now = new Date();
      const diffTime = now - appDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 42) {
        // Within last 6 weeks
        const weekIndex = Math.min(5, Math.floor(diffDays / 7));
        const weekLabel = `Week ${6 - weekIndex}`;
        weekData[weekLabel]++;
      }
    });

    // Format data for chart
    const chartData = weekLabels.map((week) => ({
      week,
      applications: weekData[week],
    }));

    setApplicationData(chartData);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Seeker Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">
            {userApplications.length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Under Review</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {userApplications.filter((app) => app.status === "Pending").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Accepted</h3>
          <p className="text-3xl font-bold text-green-600">
            {userApplications.filter((app) => app.status === "Accepted").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {userApplications.filter((app) => app.status === "Rejected").length}
          </p>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-xl font-bold mb-4">Application Activity</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Application History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Applied Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.length > 0 ? (
                userApplications.map((app) => {
                  return (
                    <tr
                      key={app._id}
                      className={`${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {app?.jobId?.title || "Unknown Job"}
                      </td>
                      <td className="px-6 py-4">
                        {app?.jobId?.company || "Unknown Company"}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(app.appliedDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            app.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
