import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card className="text-center p-6">
        <h2 className="text-xl font-semibold mb-2">Content Not Found</h2>
        <p className="text-gray-600 mb-4">
          The content you're looking for might have been moved or deleted.
        </p>
        <Button onClick={() => navigate("/education")}>
          Return to Education Hub
        </Button>
      </Card>
    </div>
  );
};