import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GuideSelector } from "./GuideSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

export const PopularGuidesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  const { data: popularGuides, isLoading: isLoadingPopularGuides, error: popularGuidesError } = useQuery({
    queryKey: ['popularGuides'],
    queryFn: async () => {
      console.log('Fetching popular guides selections...');
      const { data, error } = await supabase
        .from('popular_guide_selections')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching popular guides:', error);
        toast({
          title: "Error fetching guides",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Fetched popular guides selections:', data);
      if (data?.guide_ids) {
        setSelectedGuides(data.guide_ids);
      }
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000, // Add staleTime to prevent unnecessary refetches
  });

  const updatePopularGuidesMutation = useMutation({
    mutationFn: async (guideIds: string[]) => {
      console.log('Updating popular guides with:', guideIds);
      
      // First, check if we have an existing record
      const { data: existingData, error: fetchError } = await supabase
        .from('popular_guide_selections')
        .select('id')
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error checking existing guides:', fetchError);
        throw fetchError;
      }

      const { error } = await supabase
        .from('popular_guide_selections')
        .upsert({
          id: existingData?.id || undefined, // Use undefined for new records
          guide_ids: guideIds,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });
      
      if (error) {
        console.error('Error updating popular guides:', error);
        throw error;
      }

      console.log('Successfully updated guides');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popularGuides'] });
      toast({
        title: "Success",
        description: "Popular guides updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateGuides = (guideIds: string[]) => {
    console.log('Handling guide update with:', guideIds);
    setSelectedGuides(guideIds);
    updatePopularGuidesMutation.mutate(guideIds);
  };

  if (popularGuidesError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading popular guides. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoadingPopularGuides) {
    return (
      <div className="flex items-center justify-center p-8">
        <ReloadIcon className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading popular guides...</span>
      </div>
    );
  }

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