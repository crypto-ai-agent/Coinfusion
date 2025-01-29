import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PrivateRouteProps {
  element: React.ReactElement;
}

export const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};