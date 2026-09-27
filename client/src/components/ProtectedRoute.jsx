import { Navigate } from "react-router-dom";
import { useAuthStore } from "../services/store";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
