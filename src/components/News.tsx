import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  slug: string;
}

interface NewsProps {
  articles: NewsArticle[];
}

export const News = ({ articles }: NewsProps) => {
  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Latest Cryptocurrency News
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest cryptocurrency news, market trends, and industry developments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-2">{article.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(article.created_at), 'MMMM d, yyyy')}
                    </CardDescription>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {article.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {article.content.length > 200 
                    ? `${article.content.substring(0, 200)}...` 
                    : article.content}
                </p>
                <Link
                  to={`/news/${article.slug}`}
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center group"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};