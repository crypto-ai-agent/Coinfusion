import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReloadIcon } from "@radix-ui/react-icons";

interface AdminRouteProps {
  element: React.ReactElement;
}

export const AdminRoute = ({ element }: AdminRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();

  console.log('AdminRoute - Auth State:', { user, isAdmin, isLoading });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ReloadIcon className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('Access denied: User is not admin');
    return <Navigate to="/" replace />;
  }

  return element;
};