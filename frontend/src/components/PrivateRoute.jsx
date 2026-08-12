import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards routes that require a logged-in user (redirects to /login otherwise)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
