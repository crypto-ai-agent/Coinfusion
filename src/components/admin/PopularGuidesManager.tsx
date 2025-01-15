import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GuideSelector } from "./GuideSelector";

export const PopularGuidesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  const { data: popularGuides } = useQuery({
    queryKey: ['popularGuides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popular_guide_selections')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      setSelectedGuides(data?.guide_ids || []);
      return data;
    },
  });

  const updatePopularGuidesMutation = useMutation({
    mutationFn: async (guideIds: string[]) => {
      const { error } = await supabase
        .from('popular_guide_selections')
        .upsert({
          id: popularGuides?.id,
          guide_ids: guideIds,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popularGuides'] });
      queryClient.invalidateQueries({ queryKey: ['popularGuideSelection'] });
      toast({
        title: "Success",
        description: "Popular guides updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateGuides = (guideIds: string[]) => {
    setSelectedGuides(guideIds);
    updatePopularGuidesMutation.mutate(guideIds);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Popular Guides</h3>
      <p className="text-sm text-muted-foreground">
        Select up to 4 guides to display in the Popular Guides section.
      </p>
      <GuideSelector
        onSelect={handleUpdateGuides}
        selectedGuides={selectedGuides}
      />
    </div>
  );
};