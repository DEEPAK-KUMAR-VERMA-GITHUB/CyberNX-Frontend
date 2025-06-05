import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useStore } from "../store";
import { userService } from "../services/user.service";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    company: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      company: "",
      general: "",
    };
    let isValid = true;

    // Name validation
    if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain at least 8 characters with uppercase, lowercase, number, and special character";
      isValid = false;
    }

    // Company validation for employers
    if (formData.role === "employer" && !formData.company) {
      newErrors.company = "Company name is required for employer accounts";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      company: "",
      general: "",
    });

    // validate form
    if (!validateForm()) {
      toast.error("Please fix the form errors.");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as "employer" | "jobseeker",
        ...(formData.role === "employer" && { company: formData.company }),
      };

      await userService.register(userData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";

      // Show toast error
      toast.error(errorMessage);

      // Set general error
      setErrors((prev) => ({ ...prev, general: errorMessage }));

      // Handle specific field errors if available in the response
      if (err.response?.data?.errors) {
        const fieldErrors = err.response.data.errors;
        setErrors((prev) => ({
          ...prev,
          name: fieldErrors.name || "",
          email: fieldErrors.email || "",
          password: fieldErrors.password || "",
          company: fieldErrors.company || "",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-8`}
      >
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            ) : (
              <p className="text-xs mt-1 text-gray-500">
                Password must be at least 8 characters with uppercase,
                lowercase, number, and special character.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Account Type
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {formData.role === "employer" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } border focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600"
            } text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
