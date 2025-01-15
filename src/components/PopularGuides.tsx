import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PopularGuides = () => {
  const { data: popularSelection } = useQuery({
    queryKey: ['popularGuideSelection'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popular_guide_selections')
        .select('guide_ids')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: guides } = useQuery({
    queryKey: ['popularGuides', popularSelection?.guide_ids],
    queryFn: async () => {
      if (!popularSelection?.guide_ids?.length) {
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .order('created_at')
          .limit(4);
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .in('id', popularSelection.guide_ids);
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Popular Guides
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our most-read educational content and earn points
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides?.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{guide.category}</Badge>
                  <Badge variant="outline">{guide.points} pts</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{guide.read_time}</span>
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/education/${guide.category.toLowerCase().replace(' ', '-')}/${guide.id}`}
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center group"
                  >
                    Start reading
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{guide.progress || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};