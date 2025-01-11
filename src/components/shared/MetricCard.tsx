/**
 * A reusable card component for displaying metric information with a label and value
 * @component
 */
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  /** The label text to display above the value */
  label: string;
  /** The primary value to display */
  value: string | number;
  /** Optional secondary value or description */
  subValue?: string;
  /** Optional CSS classes to apply to the card */
  className?: string;
}

export const MetricCard = ({ 
  label, 
  value, 
  subValue, 
  className = "" 
}: MetricCardProps) => {
  return (
    <Card className={`p-4 ${className}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {subValue && (
        <p className="text-sm text-gray-500">{subValue}</p>
      )}
    </Card>
  );
};