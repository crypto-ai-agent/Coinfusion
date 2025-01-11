import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Investment = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/education">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Education Hub
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-primary mb-4">Investment Strategies</h1>
            <p className="text-gray-600 text-lg">Master the art of crypto investing</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2>Investment Fundamentals</h2>
            <p>
              Successful cryptocurrency investment requires a combination of research, strategy, and risk 
              management. Understanding these fundamentals will help you make informed decisions.
            </p>

            <h2>Key Investment Strategies</h2>
            <ul>
              <li>
                <strong>Dollar-Cost Averaging (DCA):</strong> Investing fixed amounts at regular intervals.
              </li>
              <li>
                <strong>Portfolio Diversification:</strong> Spreading investments across different assets.
              </li>
              <li>
                <strong>Long-term Holding:</strong> The "HODL" strategy for long-term value appreciation.
              </li>
            </ul>

            <h2>Risk Management</h2>
            <p>Essential principles for managing investment risks:</p>
            <ul>
              <li>Never invest more than you can afford to lose</li>
              <li>Set clear entry and exit strategies</li>
              <li>Keep track of market trends and news</li>
              <li>Understand the projects you invest in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;