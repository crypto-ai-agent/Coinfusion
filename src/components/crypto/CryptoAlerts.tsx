
import { AlertTriangle, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CryptoAlertsProps {
  alerts?: string[];
  coinId: string;
  currentPrice: number;
}

export const CryptoAlerts = ({ alerts = [], coinId, currentPrice }: CryptoAlertsProps) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const { alerts: priceAlerts, createAlert, deleteAlert, isLoading } = usePriceAlerts(coinId);

  const handleCreateAlert = () => {
    if (!targetPrice) return;
    createAlert.mutate({
      coinId,
      targetPrice: Number(targetPrice),
      alertType,
    });
    setTargetPrice("");
  };

  return (
    <div className="space-y-4">
      {alerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mt-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              {alerts[0]}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Price Alerts
        </h3>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Target price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="flex-1"
          />
          <Select value={alertType} onValueChange={(value: "above" | "below") => setAlertType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above</SelectItem>
              <SelectItem value="below">Below</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateAlert} disabled={!targetPrice || isLoading}>
            Add Alert
          </Button>
        </div>

        <div className="space-y-2">
          {priceAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alert when price is {alert.alert_type}{" "}
                <span className="font-semibold">
                  ${alert.target_price.toLocaleString()}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAlert.mutate(alert.id)}
                disabled={deleteAlert.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
