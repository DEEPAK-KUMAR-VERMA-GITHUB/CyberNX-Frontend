import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStore } from "./store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCheck from "./components/AuthCheck";
import CreateJob from "./pages/CreateJob";

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <BrowserRouter>
        <AuthCheck />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute requiredRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/new-job"
              element={
                <ProtectedRoute requiredRole="employer">
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobseeker/dashboard"
              element={
                <ProtectedRoute requiredRole="jobseeker">
                  <JobSeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
