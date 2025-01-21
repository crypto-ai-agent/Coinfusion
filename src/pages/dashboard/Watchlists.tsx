import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  created_at: string;
  coin_count?: number;
}

const WatchlistsPage = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("custom");
  const [newListDescription, setNewListDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        navigate("/auth");
        return;
      }

      const { data: watchlistsData, error: watchlistsError } = await supabase
        .from("watchlists")
        .select("*, watchlist_items(count)")
        .order("created_at", { ascending: false });

      if (watchlistsError) throw watchlistsError;

      const watchlistsWithCount = watchlistsData.map(watchlist => ({
        ...watchlist,
        coin_count: watchlist.watchlist_items?.[0]?.count || 0
      }));

      setWatchlists(watchlistsWithCount);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching watchlists",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleCreateList = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("watchlists")
        .insert({
          name: newListName,
          description: newListDescription,
          list_type: newListType,
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Watchlist created",
        description: "Your new watchlist has been created successfully",
      });

      setNewListName("");
      setNewListType("custom");
      setNewListDescription("");
      setIsEditing(false);
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

      setIsEditing(false);
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

  const handleViewList = (watchlistId: string) => {
    navigate(`/rankings?tab=watchlists&list=${watchlistId}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">My Watchlists</h1>
                <p className="text-muted-foreground">
                  Manage and organize your cryptocurrency watchlists
                </p>
              </div>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New List
                  </Button>
                </DialogTrigger>
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
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={selectedWatchlist ? handleUpdateList : handleCreateList}>
                      {selectedWatchlist ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : watchlists.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No Watchlists Yet</h3>
                    <p className="text-muted-foreground">
                      Create your first watchlist to start tracking cryptocurrencies
                    </p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First List
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlists.map((watchlist) => (
                  <Card key={watchlist.id}>
                    <CardHeader>
                      <CardTitle>{watchlist.name}</CardTitle>
                      {watchlist.description && (
                        <CardDescription>{watchlist.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Type: {watchlist.list_type}</span>
                          <span>{watchlist.coin_count} coins</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewList(watchlist.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditList(watchlist)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Watchlist</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this watchlist? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteList(watchlist.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WatchlistsPage;