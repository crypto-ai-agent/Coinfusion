import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { List, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateList: () => void;
}

export const EmptyState = ({ onCreateList }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <List className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Watchlists Yet</h3>
          <p className="text-muted-foreground">
            Create your first watchlist to start tracking cryptocurrencies
          </p>
        </div>
        <Button onClick={onCreateList}>
          <Plus className="mr-2 h-4 w-4" />
          Create Your First List
        </Button>
      </CardContent>
    </Card>
  );
};