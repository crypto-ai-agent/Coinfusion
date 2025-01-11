import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface SearchResultsProps {
  results: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    slug: string;
  }>;
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  const navigate = useNavigate();

  if (!results.length) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-3">{item.content}</p>
              <Button
                variant="link"
                className="mt-4 p-0"
                onClick={() => navigate(`/education/${item.slug}`)}
              >
                Read more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};