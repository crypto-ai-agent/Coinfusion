import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PopularGuides } from "@/components/PopularGuides";
import { Education as EducationSection } from "@/components/Education";
import { SearchBar } from "@/components/education/SearchBar";
import { SearchResults } from "@/components/education/SearchResults";
import { Header } from "@/components/education/Header";

const EducationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ['educational-content', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('educational_content')
        .select('*')
        .eq('published', true);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredContent = content?.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header isAuthenticated={isAuthenticated} />
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <EducationSection />
          <PopularGuides />
          {searchQuery && filteredContent && (
            <SearchResults results={filteredContent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;