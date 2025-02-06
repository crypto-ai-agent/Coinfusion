
import { Plus, ArrowUpDown, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface WatchlistControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderToggle: () => void;
  onCreateWatchlist: (name: string, type: string, description: string) => void;
}

const predefinedCategories = [
  { value: "memecoins", label: "Meme Coins" },
  { value: "ai", label: "AI Projects" },
  { value: "l1", label: "Layer 1" },
  { value: "defi", label: "DeFi" },
  { value: "gaming", label: "Gaming" },
  { value: "custom", label: "Custom" },
];

const sortOptions = [
  { value: "market_cap", label: "Market Cap" },
  { value: "price", label: "Price" },
  { value: "volume", label: "Volume" },
  { value: "change", label: "24h Change" },
];

export const WatchlistControls = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderToggle,
  onCreateWatchlist,
}: WatchlistControlsProps) => {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("custom");
  const [newListDescription, setNewListDescription] = useState("");

  const handleCreateWatchlist = () => {
    onCreateWatchlist(newListName, newListType, newListDescription);
    setIsCreatingList(false);
    setNewListName("");
    setNewListType("custom");
    setNewListDescription("");
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search coins..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-[200px]"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" onClick={onSortOrderToggle}>
        <ArrowUpDown className="h-4 w-4" />
      </Button>
      <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New List
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Watchlist</DialogTitle>
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
                  {predefinedCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
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
            <Button onClick={handleCreateWatchlist} className="w-full">
              Create Watchlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
