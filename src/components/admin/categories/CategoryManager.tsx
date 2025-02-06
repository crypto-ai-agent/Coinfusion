
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/content";
import { Tree, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CategoryManager = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
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

  const createMutation = useMutation({
    mutationFn: async (newCategory: Omit<Category, 'id'>) => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { data, error } = await supabase
        .from('content_categories')
        .update(category)
        .eq('id', category.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('content_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      parent_id: formData.get('parent_id') ? Number(formData.get('parent_id')) : null,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
    };

    if (selectedCategory) {
      updateMutation.mutate({ ...selectedCategory, ...categoryData });
    } else {
      createMutation.mutate(categoryData);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Categories</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCategory(null)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedCategory?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={selectedCategory?.description}
                />
              </div>
              <div>
                <Label htmlFor="parent_id">Parent Category</Label>
                <Select name="parent_id" defaultValue={selectedCategory?.parent_id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={selectedCategory?.icon}
                  placeholder="e.g., folder, book, etc."
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  defaultValue={selectedCategory?.color || "#000000"}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Tree className="h-5 w-5" style={{ color: category.color }} />
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this category?')) {
                    deleteMutation.mutate(category.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
