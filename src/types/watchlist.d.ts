
export interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  coin_count?: number;
  created_at: string;
  default_sort_by?: string;
  default_sort_order?: 'asc' | 'desc';
  user_id: string;
}
