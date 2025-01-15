import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ContentCard = {
  id: string;
  title: string;
  description: string | null;
  card_type: string;
  style_variant: string;
};

export const CardPreview = ({ cardId }: { cardId: string }) => {
  const { data: card, isLoading, error } = useQuery({
    queryKey: ['cardPreview', cardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_cards')
        .select('id, title, description, card_type, style_variant')
        .eq('id', cardId)
        .maybeSingle();
      
      if (error) throw error;
      return data as ContentCard | null;
    },
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load card preview</AlertDescription>
      </Alert>
    );
  }

  if (!card) {
    return (
      <Alert>
        <AlertDescription>This content card no longer exists</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{card.title}</h3>
        <div className="flex gap-2">
          <Badge variant="secondary">{card.card_type}</Badge>
          <Badge variant="outline">{card.style_variant}</Badge>
        </div>
      </div>
      {card.description && (
        <p className="text-sm text-muted-foreground">{card.description}</p>
      )}
    </div>
  );
};