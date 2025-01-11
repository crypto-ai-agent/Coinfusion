import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const CryptoBasics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkCompletion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from('user_progress')
        .select('completed_content')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setIsCompleted(data.completed_content.includes('Crypto Basics'));
      }
    };

    checkCompletion();

    // Track reading progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const markAsCompleted = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('completed_content, total_points')
      .eq('user_id', session.user.id)
      .single();

    if (currentProgress && !currentProgress.completed_content.includes('Crypto Basics')) {
      const { error } = await supabase
        .from('user_progress')
        .update({
          completed_content: [...currentProgress.completed_content, 'Crypto Basics'],
          total_points: currentProgress.total_points + 100,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
      } else {
        setIsCompleted(true);
        toast({
          title: "Congratulations! 🎉",
          description: "You've earned 100 points for completing Crypto Basics!",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/education">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Education Hub
              </Button>
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-4">Crypto Basics</h1>
                <p className="text-gray-600 text-lg">Understanding the fundamentals of cryptocurrency</p>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <Award className="h-5 w-5" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2>What is Cryptocurrency?</h2>
            <p>
              Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. 
              Unlike traditional currencies issued by central banks, cryptocurrencies are typically 
              decentralized systems based on blockchain technology.
            </p>

            <h2>Key Concepts</h2>
            <ul>
              <li>
                <strong>Blockchain:</strong> A distributed ledger that records all transactions across a 
                network of computers.
              </li>
              <li>
                <strong>Decentralization:</strong> No single entity controls the network, making it 
                resistant to manipulation.
              </li>
              <li>
                <strong>Cryptography:</strong> Advanced encryption techniques secure transactions and 
                control the creation of new units.
              </li>
            </ul>

            <h2>Getting Started</h2>
            <p>
              To begin your cryptocurrency journey, you'll need to understand a few basic components:
            </p>
            <ol>
              <li>Digital wallets for storing your cryptocurrencies</li>
              <li>Cryptocurrency exchanges for buying and selling</li>
              <li>Basic security practices to protect your investments</li>
            </ol>
          </div>

          {readingProgress > 90 && !isCompleted && (
            <div className="fixed bottom-8 right-8">
              <Button 
                onClick={markAsCompleted}
                className="shadow-lg"
              >
                <Award className="mr-2 h-4 w-4" />
                Mark as Completed
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoBasics;
