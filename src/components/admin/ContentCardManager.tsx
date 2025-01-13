import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GuideSelector } from "./GuideSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CardType = "guide_collection" | "quiz_section" | "progress_tracker" | "featured_content" | "ai_highlight" | "news_collection";

type ContentCard = {
  id: string;
  title: string;
  description: string | null;
  card_type: CardType;
  content_ids: string[];
  display_order: number;
  is_active: boolean;
  style_variant: string;
  guides: any[];
  layout_type: string;
  header_title: string | null;
  header_description: string | null;
};

export const ContentCardManager = () => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<ContentCard | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cards, isLoading } = useQuery({
    queryKey: ['contentCards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_cards')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as ContentCard[];
    },
  });

  const createCardMutation = useMutation({
    mutationFn: async (newCard: Omit<ContentCard, 'id'>) => {
      const { error } = await supabase
        .from('content_cards')
        .insert([newCard]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentCards'] });
      toast({
        title: "Success",
        description: "Card created successfully.",
      });
      setIsAddingCard(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create card.",
        variant: "destructive",
      });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: async (card: ContentCard) => {
      const { error } = await supabase
        .from('content_cards')
        .update({
          title: card.title,
          description: card.description,
          card_type: card.card_type,
          content_ids: card.content_ids,
          display_order: card.display_order,
          is_active: card.is_active,
          style_variant: card.style_variant,
          guides: card.guides,
          layout_type: card.layout_type,
          header_title: card.header_title,
          header_description: card.header_description,
        })
        .eq('id', card.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentCards'] });
      toast({
        title: "Success",
        description: "Card updated successfully.",
      });
      setEditingCard(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update card.",
        variant: "destructive",
      });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_cards')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentCards'] });
      toast({
        title: "Success",
        description: "Card deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete card.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cardData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      card_type: formData.get('card_type') as CardType,
      content_ids: [],
      display_order: parseInt(formData.get('display_order') as string),
      is_active: formData.get('is_active') === 'true',
      style_variant: formData.get('style_variant') as string,
      layout_type: formData.get('layout_type') as string,
      header_title: formData.get('header_title') as string,
      header_description: formData.get('header_description') as string,
      guides: editingCard?.guides || [],
    };

    if (editingCard) {
      updateCardMutation.mutate({ ...cardData, id: editingCard.id });
    } else {
      createCardMutation.mutate(cardData);
    }
  };

  const handleGuideSelection = (guides: string[]) => {
    if (editingCard) {
      updateCardMutation.mutate({
        ...editingCard,
        guides: guides.map(id => ({ id })),
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content Cards</h2>
        <Button onClick={() => setIsAddingCard(true)}>Add New Card</Button>
      </div>

      {(isAddingCard || editingCard) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Card Title"
            defaultValue={editingCard?.title}
            required
          />
          <Textarea
            name="description"
            placeholder="Card Description"
            defaultValue={editingCard?.description || ''}
          />
          <Input
            name="header_title"
            placeholder="Header Title"
            defaultValue={editingCard?.header_title || ''}
          />
          <Textarea
            name="header_description"
            placeholder="Header Description"
            defaultValue={editingCard?.header_description || ''}
          />
          <Select name="card_type" defaultValue={editingCard?.card_type || 'guide_collection'}>
            <SelectTrigger>
              <SelectValue placeholder="Select card type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guide_collection">Guide Collection</SelectItem>
              <SelectItem value="quiz_section">Quiz Section</SelectItem>
              <SelectItem value="progress_tracker">Progress Tracker</SelectItem>
              <SelectItem value="featured_content">Featured Content</SelectItem>
              <SelectItem value="ai_highlight">AI Highlight</SelectItem>
              <SelectItem value="news_collection">News Collection</SelectItem>
            </SelectContent>
          </Select>
          <Select name="layout_type" defaultValue={editingCard?.layout_type || 'default'}>
            <SelectTrigger>
              <SelectValue placeholder="Select layout type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="display_order"
            type="number"
            placeholder="Display Order"
            defaultValue={editingCard?.display_order || 0}
            required
          />
          <Select name="is_active" defaultValue={String(editingCard?.is_active ?? true)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select name="style_variant" defaultValue={editingCard?.style_variant || 'default'}>
            <SelectTrigger>
              <SelectValue placeholder="Style Variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="expanded">Expanded</SelectItem>
            </SelectContent>
          </Select>
          {editingCard && editingCard.card_type === 'guide_collection' && (
            <div className="pt-4">
              <GuideSelector
                onSelect={handleGuideSelection}
                selectedGuides={editingCard.guides?.map(g => g.id) || []}
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddingCard(false);
                setEditingCard(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCard ? 'Update' : 'Create'} Card
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {cards?.map((card) => (
          <div key={card.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
                <div className="mt-2 space-x-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {card.card_type}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Order: {card.display_order}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    card.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {card.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCard(card)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this card?')) {
                      deleteCardMutation.mutate(card.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};