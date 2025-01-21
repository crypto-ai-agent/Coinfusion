import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WatchlistGrid } from "@/components/dashboard/watchlist/WatchlistGrid";
import { EmptyState } from "@/components/dashboard/watchlist/EmptyState";
import type { Watchlist } from "@/types/watchlist";

const WatchlistsPage = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("custom");
  const [newListDescription, setNewListDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchWatchlists();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchWatchlists = async () => {
    try {
      const { data: watchlistsData, error: watchlistsError } = await supabase
        .from("watchlists")
        .select(`
          *,
          watchlist_items (count)
        `)
        .order("created_at", { ascending: false });

      if (watchlistsError) throw watchlistsError;

      const watchlistsWithCount = watchlistsData.map(watchlist => ({
        ...watchlist,
        coin_count: watchlist.watchlist_items?.[0]?.count || 0
      }));

      setWatchlists(watchlistsWithCount);
    } catch (error) {
      toast({
        title: "Error fetching watchlists",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("watchlists")
        .insert({
          name: newListName,
          description: newListDescription,
          list_type: newListType,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Watchlist created",
        description: "Your new watchlist has been created successfully",
      });

      resetForm();
      await fetchWatchlists();
    } catch (error) {
      toast({
        title: "Error creating watchlist",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleUpdateList = async () => {
    if (!selectedWatchlist) return;

    try {
      const { error } = await supabase
        .from("watchlists")
        .update({
          name: newListName,
          description: newListDescription,
          list_type: newListType,
        })
        .eq("id", selectedWatchlist.id);

      if (error) throw error;

      toast({
        title: "Watchlist updated",
        description: "Your watchlist has been updated successfully",
      });

      resetForm();
      await fetchWatchlists();
    } catch (error) {
      toast({
        title: "Error updating watchlist",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteList = async (watchlistId: string) => {
    try {
      const { error } = await supabase
        .from("watchlists")
        .delete()
        .eq("id", watchlistId);

      if (error) throw error;

      toast({
        title: "Watchlist deleted",
        description: "Your watchlist has been deleted successfully",
      });

      await fetchWatchlists();
    } catch (error) {
      toast({
        title: "Error deleting watchlist",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleEditList = (watchlist: Watchlist) => {
    setSelectedWatchlist(watchlist);
    setNewListName(watchlist.name);
    setNewListType(watchlist.list_type);
    setNewListDescription(watchlist.description || "");
    setIsEditing(true);
  };

  const handleViewList = (id: string) => {
    navigate(`/rankings?tab=watchlists&list=${id}`);
  };

  const resetForm = () => {
    setNewListName("");
    setNewListType("custom");
    setNewListDescription("");
    setSelectedWatchlist(null);
    setIsEditing(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6 pt-16">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">My Watchlists</h1>
                <p className="text-muted-foreground">
                  Manage and organize your cryptocurrency watchlists
                </p>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New List
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : watchlists.length === 0 ? (
              <EmptyState onCreateList={() => setIsEditing(true)} />
            ) : (
              <WatchlistGrid
                watchlists={watchlists}
                onEdit={handleEditList}
                onDelete={handleDeleteList}
                onView={handleViewList}
              />
            )}

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedWatchlist ? "Edit Watchlist" : "Create New Watchlist"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedWatchlist
                      ? "Update your watchlist details"
                      : "Create a new watchlist to track cryptocurrencies"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="listName">List Name</Label>
                    <Input
                      id="listName"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="My Watchlist"
                    />
                  </div>
                  <div>
                    <Label htmlFor="listType">List Type</Label>
                    <Select value={newListType} onValueChange={setNewListType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="defi">DeFi</SelectItem>
                        <SelectItem value="nft">NFT</SelectItem>
                        <SelectItem value="meme">Meme Coins</SelectItem>
                        <SelectItem value="layer1">Layer 1</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="listDescription">Description (Optional)</Label>
                    <Input
                      id="listDescription"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      placeholder="Description of your watchlist"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={selectedWatchlist ? handleUpdateList : handleCreateList}>
                    {selectedWatchlist ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WatchlistsPage;