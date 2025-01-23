import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};