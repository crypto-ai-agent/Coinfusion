import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Watchlist } from "../../../types/watchlist";

interface WatchlistGridProps {
  watchlists: Watchlist[];
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const WatchlistGrid = ({ watchlists, onEdit, onDelete, onView }: WatchlistGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {watchlists.map((watchlist) => (
        <Card key={watchlist.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span>{watchlist.name}</span>
            </CardTitle>
            {watchlist.description && (
              <p className="text-sm text-muted-foreground">{watchlist.description}</p>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Type: {watchlist.list_type}</span>
                <span>{watchlist.coin_count || 0} coins</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(watchlist.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(watchlist)}
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
                        onClick={() => onDelete(watchlist.id)}
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
  );
};