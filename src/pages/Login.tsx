import { LogIn } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userService } from "../services/user.service";
import { useStore } from "../store";

function Login() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}/dashboard`);
    }
  }, [currentUser, navigate]);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };
    let isValid = true;

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors.");
      return;
    }

    setLoading(true);

    try {
      const response = await userService.login(
        formData.email,
        formData.password
      );
      toast.success("Login successful!");

      if (response.user) {
        setCurrentUser(response.user);
        navigate(`/${response.user.role}/dashboard`);
      } else {
        setErrors((prev) => ({ ...prev, general: "Invalid credentials" }));
      }
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";

      // Show toast error
      toast.error(errorMessage);

      // Set general error
      setErrors((prev) => ({ ...prev, general: errorMessage }));

      // Handle specific field errors if available in the response
      if (err.response?.data?.errors) {
        const fieldErrors = err.response.data.errors;
        setErrors((prev) => ({
          ...prev,
          email: fieldErrors.email || "",
          password: fieldErrors.password || "",
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
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className={`w-full p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } border focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            <p>
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
