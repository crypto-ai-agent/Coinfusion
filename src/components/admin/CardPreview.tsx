import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContentCard = {
  id: string;
  title: string;
  description: string | null;
  card_type: string;
};

export const CardPreview = ({ cardId }: { cardId: string }) => {
  const { data: card, isLoading } = useQuery({
    queryKey: ['cardPreview', cardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_cards')
        .select('id, title, description, card_type')
        .eq('id', cardId)
        .single();
      
      if (error) throw error;
      return data as ContentCard;
    },
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded" />;
  }

  if (!card) {
    return null;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-medium">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 mt-1">{card.description}</p>
      )}
      <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">
        {card.card_type}
      </span>
    </div>
  );
};