
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentRecord {
  title: string;
  [key: string]: any;
}

export const useContentRealtime = (
  contentType: 'guide' | 'educational' | 'news',
  onUpdate?: () => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    const tableName = contentType === 'news' 
      ? 'news_articles' 
      : contentType === 'guide' 
        ? 'guides' 
        : 'educational_content';

    const channel = supabase
      .channel('content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log('Content change detected:', payload);
          
          const changeType = payload.eventType;
          const record = payload.new || payload.old as ContentRecord;
          
          toast({
            title: `Content ${changeType}`,
            description: `${record.title} has been ${changeType === 'INSERT' ? 'created' : changeType === 'UPDATE' ? 'updated' : 'deleted'}`,
          });

          if (onUpdate) {
            onUpdate();
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Listening for changes on ${tableName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentType, onUpdate, toast]);
};
