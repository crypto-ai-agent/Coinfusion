
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface PriceAlertsManagerProps {
  coinId: string;
  currentPrice: number;
}

export const PriceAlertsManager = ({ coinId, currentPrice }: PriceAlertsManagerProps) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createAlert = async () => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create price alerts",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("price_alerts")
        .insert({
          user_id: session.session.user.id,
          coin_id: coinId,
          target_price: Number(targetPrice),
          alert_type: alertType,
        });

      if (error) throw error;

      toast({
        title: "Alert created",
        description: `You will be notified when the price goes ${alertType} $${targetPrice}`,
      });

      setTargetPrice("");
    } catch (error: any) {
      toast({
        title: "Error creating alert",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Bell className="h-5 w-5" />
        Set Price Alert
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
        <Button onClick={createAlert} disabled={!targetPrice || isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Alert
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        Current price: ${currentPrice.toLocaleString()}
      </div>
    </div>
  );
};
