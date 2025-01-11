import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const PopularGuides = () => {
  const guides = [
    {
      title: "Getting Started with Crypto",
      description: "Learn the basics of cryptocurrency and blockchain technology",
      readTime: "5 min read",
      category: "Beginner",
      points: 50,
      progress: 0,
    },
    {
      title: "Crypto Security 101",
      description: "Essential security practices for protecting your investments",
      readTime: "8 min read",
      category: "Security",
      points: 75,
      progress: 0,
    },
    {
      title: "Investment Strategies",
      description: "Build and manage your crypto portfolio effectively",
      readTime: "10 min read",
      category: "Investment",
      points: 100,
      progress: 0,
    },
    {
      title: "Understanding DeFi",
      description: "Explore the world of decentralized finance",
      readTime: "12 min read",
      category: "Advanced",
      points: 125,
      progress: 0,
    },
  ];

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
          {guides.map((guide) => (
            <Card key={guide.title} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{guide.category}</Badge>
                  <Badge variant="outline">{guide.points} pts</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{guide.readTime}</span>
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Link
                    to="/education"
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center group"
                  >
                    Start reading
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{guide.progress}%</span>
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