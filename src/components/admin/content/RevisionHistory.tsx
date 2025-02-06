
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Content } from '@/types/content';
import { format } from 'date-fns';

interface RevisionHistoryProps {
  content: Content;
}

export function RevisionHistory({ content }: RevisionHistoryProps) {
  if (!content.revision_history?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No revision history available
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {content.revision_history.map((revision, index) => (
          <div key={index} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm font-medium">Version {revision.version}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {format(new Date(revision.timestamp), 'PPp')}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Editor: {revision.editor_id}
              </span>
            </div>
            <div className="text-sm space-y-1">
              {Object.entries(revision.changes).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-medium">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

