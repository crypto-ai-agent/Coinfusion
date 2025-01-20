import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface WatchlistIndicatorProps {
  watchlists: Array<{ id: string; name: string; coin_id: string }>;
}

export const WatchlistIndicator = ({ watchlists }: WatchlistIndicatorProps) => {
  if (watchlists.length === 0) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="text-sm text-gray-500">
          <List className="h-4 w-4 mr-1" />
          In {watchlists.length} list{watchlists.length > 1 ? 's' : ''}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Current Lists</h4>
          <div className="space-y-1">
            {watchlists.map((list) => (
              <Link
                key={list.id}
                to={`/rankings?tab=watchlists&list=${list.id}`}
                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {list.name}
              </Link>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};