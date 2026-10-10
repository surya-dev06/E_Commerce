import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "./Loaders";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader label="Checking your session..." />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
