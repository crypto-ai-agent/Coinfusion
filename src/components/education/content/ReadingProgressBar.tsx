import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";

interface ReadingProgressBarProps {
  value: number;
}

export const ReadingProgressBar = ({ value }: ReadingProgressBarProps) => {
  return (
    <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};