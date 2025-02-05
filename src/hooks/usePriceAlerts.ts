
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PriceAlert {
  id: string;
  coin_id: string;
  target_price: number;
  alert_type: 'above' | 'below';
  is_triggered: boolean;
  created_at: string;
  triggered_at: string | null;
  notification_sent: boolean;
}

export const usePriceAlerts = (coinId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['priceAlerts', coinId, userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const query = supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', userId);
        
      if (coinId) {
        query.eq('coin_id', coinId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!userId,
  });

  const createAlert = useMutation({
    mutationFn: async ({ coinId, targetPrice, alertType }: { 
      coinId: string; 
      targetPrice: number; 
      alertType: 'above' | 'below'; 
    }) => {
      if (!userId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: userId,
          coin_id: coinId,
          target_price: targetPrice,
          alert_type: alertType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts'] });
      toast({
        title: 'Price Alert Created',
        description: 'You will be notified when the price target is reached.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Creating Alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts'] });
      toast({
        title: 'Price Alert Deleted',
        description: 'The price alert has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    alerts,
    isLoading,
    createAlert,
    deleteAlert,
  };
};
