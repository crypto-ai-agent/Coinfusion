import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { List, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { CoinData } from "@/utils/types/crypto";

interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
}

export const WatchlistDashboard = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("watchlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching watchlists",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setWatchlists(data || []);
    }
    setIsLoading(false);
  };

  const handleCreateList = () => {
    navigate("/rankings?tab=watchlists&action=create");
  };

  const handleViewList = (id: string) => {
    navigate(`/rankings?tab=watchlists&list=${id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Watchlists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Watchlists</CardTitle>
        <Button onClick={handleCreateList} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create List
        </Button>
      </CardHeader>
      <CardContent>
        {watchlists.length === 0 ? (
          <div className="text-center py-8">
            <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Watchlists Yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create your first watchlist to track your favorite cryptocurrencies
            </p>
            <Button onClick={handleCreateList}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {watchlists.map((watchlist) => (
              <div
                key={watchlist.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{watchlist.name}</h4>
                  {watchlist.description && (
                    <p className="text-sm text-gray-500">{watchlist.description}</p>
                  )}
                  <span className="text-xs text-gray-400 mt-1">
                    Type: {watchlist.list_type}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewList(watchlist.id)}
                >
                  View List
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};