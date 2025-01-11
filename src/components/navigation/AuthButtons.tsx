import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  onSignIn: (e: React.MouseEvent) => void;
  onLogout: () => void;
}

export const AuthButtons = ({ isAuthenticated, onSignIn, onLogout }: AuthButtonsProps) => {
  const navigate = useNavigate();

  return isAuthenticated ? (
    <Button
      variant="ghost"
      onClick={onLogout}
      className="w-full mt-4"
    >
      Sign Out
    </Button>
  ) : (
    <Button
      variant="default"
      onClick={onSignIn}
      className="w-full mt-4"
    >
      Sign In
    </Button>
  );
};