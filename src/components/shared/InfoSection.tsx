/**
 * A reusable section component for displaying grouped information with a title
 * @component
 */
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface InfoSectionProps {
  /** The title of the section */
  title: string;
  /** The content to display within the section */
  children: ReactNode;
  /** Optional CSS classes to apply to the section */
  className?: string;
}

export const InfoSection = ({ 
  title, 
  children, 
  className = "" 
}: InfoSectionProps) => {
  return (
    <Card className={`bg-white rounded-lg shadow-lg p-6 space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </Card>
  );
};