export interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  coin_count?: number;
  created_at: string;
}