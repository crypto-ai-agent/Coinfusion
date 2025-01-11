import { AlertTriangle } from "lucide-react";

interface CryptoAlertsProps {
  alerts?: string[];
}

export const CryptoAlerts = ({ alerts = [] }: CryptoAlertsProps) => {
  if (!alerts.length) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
        <p className="text-sm text-yellow-700">
          {alerts[0]}
        </p>
      </div>
    </div>
  );
};