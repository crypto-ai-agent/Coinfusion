
import React from 'react';
import { useState } from 'react';
import { Content } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, Send, ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentWorkflowManagerProps {
  content: Content;
  onWorkflowUpdate: (updatedContent: Content) => void;
}

export function ContentWorkflowManager({ content, onWorkflowUpdate }: ContentWorkflowManagerProps) {
  const [date, setDate] = useState<Date | undefined>(
    content.scheduled_publish_at ? new Date(content.scheduled_publish_at) : undefined
  );
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-500',
      in_review: 'bg-blue-500',
      changes_requested: 'bg-yellow-500',
      approved: 'bg-green-500',
      scheduled: 'bg-purple-500',
      published: 'bg-emerald-500',
      archived: 'bg-red-500',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  };

  const handleStatusChange = async (newStatus: Content['workflow_status']) => {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .update({
          workflow_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id)
        .select()
        .single();

      if (error) throw error;

      onWorkflowUpdate(data);
      toast({
        title: 'Status Updated',
        description: `Content status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSchedule = async () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a publish date',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('educational_content')
        .update({
          workflow_status: 'scheduled',
          scheduled_publish_at: date.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id)
        .select()
        .single();

      if (error) throw error;

      onWorkflowUpdate(data);
      toast({
        title: 'Content Scheduled',
        description: `Content will be published on ${format(date, 'PPP')}`,
      });
    } catch (error) {
      console.error('Error scheduling content:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule content',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Publishing Workflow</h3>
        <Badge variant="outline" className={cn("text-white", getStatusColor(content.workflow_status || 'draft'))}>
          {content.workflow_status || 'draft'}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_review')}
          disabled={content.workflow_status === 'in_review'}
        >
          <Send className="w-4 h-4 mr-2" />
          Send for Review
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('changes_requested')}
          disabled={content.workflow_status === 'changes_requested'}
        >
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          Request Changes
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('approved')}
          disabled={content.workflow_status === 'approved'}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Schedule publish</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              initialFocus
            />
            <div className="p-2 border-t">
              <Button size="sm" className="w-full" onClick={handleSchedule}>
                <Clock className="w-4 h-4 mr-2" />
                Set Schedule
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('published')}
          disabled={content.workflow_status === 'published'}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Publish Now
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('archived')}
          disabled={content.workflow_status === 'archived'}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Archive
        </Button>
      </div>

      {content.scheduled_publish_at && (
        <div className="text-sm text-muted-foreground">
          Scheduled to publish: {format(new Date(content.scheduled_publish_at), 'PPP')}
        </div>
      )}
    </div>
  );
}

