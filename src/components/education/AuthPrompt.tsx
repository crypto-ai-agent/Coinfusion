import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AuthPrompt = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary/5 p-6 rounded-lg mb-8">
      <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
      <p className="text-gray-600 mb-4">
        Sign in to track your progress, earn points, and unlock achievements!
      </p>
      <Button onClick={() => navigate("/auth")} variant="default">
        Sign In to Get Started
      </Button>
    </div>
  );
};