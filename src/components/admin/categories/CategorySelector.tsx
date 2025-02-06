
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategories: number[];
  onSelect: (categoryIds: number[]) => void;
  multiple?: boolean;
}

export const CategorySelector = ({
  selectedCategories,
  onSelect,
  multiple = false,
}: CategorySelectorProps) => {
  const [open, setOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const selectedItems = categories?.filter(cat => 
    selectedCategories.includes(cat.id)
  ) || [];

  const toggleCategory = (categoryId: number) => {
    if (multiple) {
      const newSelection = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      onSelect(newSelection);
    } else {
      onSelect([categoryId]);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedItems.length > 0 
              ? multiple 
                ? `${selectedItems.length} categories selected`
                : selectedItems[0].name
              : "Select categories..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => toggleCategory(category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category.id) 
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {multiple && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
