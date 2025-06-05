import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Moon, Sun, LogIn, LogOut, User } from "lucide-react";
import { useStore } from "../store";
import { userService } from "../services/user.service";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogout = async () => {
    try {
      await userService.logout();

      // Clear user from store
      setCurrentUser(null);

      // Show success toast
      toast.success("Logged out successfully");

      // Redirect to home
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-md`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl">JobPortal</span>
            </Link>

            <div className="ml-10 hidden md:flex space-x-4">
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link to="/jobs" className="hover:text-blue-600">
                Jobs
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={
                    currentUser.role === "employer"
                      ? "/employer/dashboard"
                      : "/jobseeker/dashboard"
                  }
                  className="flex items-center hover:text-blue-600"
                >
                  <User size={20} className="mr-1" />
                  <span>{currentUser.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-blue-600"
                >
                  <LogOut size={20} className="mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center hover:text-blue-600"
                >
                  <LogIn size={20} className="mr-1" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
