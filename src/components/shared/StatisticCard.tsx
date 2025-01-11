import { Card } from "@/components/ui/card";

interface StatisticCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

export const StatisticCard = ({ 
  label, 
  value, 
  subValue, 
  className = "" 
}: StatisticCardProps) => {
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