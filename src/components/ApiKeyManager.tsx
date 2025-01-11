import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('CMC_API_KEY', apiKey.trim());
      setApiKey("");
      toast({
        title: "API Key Saved",
        description: "Your CoinMarketCap API key has been saved successfully.",
      });
    }
  };

  return (
    <div className="flex gap-2 max-w-md mx-auto p-4">
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter CoinMarketCap API Key"
        className="flex-1"
      />
      <Button onClick={handleSaveKey}>Save Key</Button>
    </div>
  );
};