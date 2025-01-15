import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LayoutPanelTop } from "lucide-react";
import { PopularGuidesManager } from "./PopularGuidesManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AVAILABLE_PAGES = [
  { value: 'education', label: 'Education' },
];

export const PageLayoutManager = () => {
  const [selectedPage] = useState("education");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Page Layout Manager</h2>
          <p className="text-sm text-muted-foreground">
            Manage the layout and content of different pages
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPage} disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_PAGES.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-6 bg-slate-50">
        <div className="flex items-center gap-2 mb-4">
          <LayoutPanelTop className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Popular Content Management</h3>
        </div>
        <div className="space-y-6">
          <div className="pb-6">
            <h4 className="text-md font-medium mb-4">Popular Guides</h4>
            <PopularGuidesManager />
          </div>
        </div>
      </Card>
    </div>
  );
};