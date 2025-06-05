import { Navigate } from "react-router-dom";
import { useStore } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "employer" | "jobseeker";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const currentUser = useStore((state) => state.currentUser);

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
