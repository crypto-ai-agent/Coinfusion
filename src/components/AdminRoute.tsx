import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  element: React.ReactElement;
}

export const AdminRoute = ({ element }: AdminRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};