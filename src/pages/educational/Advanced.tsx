import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Advanced = () => {
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
            <h1 className="text-4xl font-bold text-primary mb-4">Advanced Topics</h1>
            <p className="text-gray-600 text-lg">Deep dive into DeFi, NFTs, and emerging trends</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2>Decentralized Finance (DeFi)</h2>
            <p>
              DeFi represents a shift from traditional, centralized financial systems to peer-to-peer 
              finance enabled by decentralized technologies built on blockchain.
            </p>

            <h2>Key DeFi Concepts</h2>
            <ul>
              <li>
                <strong>Lending and Borrowing:</strong> Protocols that enable peer-to-peer lending.
              </li>
              <li>
                <strong>Yield Farming:</strong> Strategies for earning rewards by providing liquidity.
              </li>
              <li>
                <strong>Automated Market Makers (AMMs):</strong> Decentralized exchange mechanisms.
              </li>
            </ul>

            <h2>NFTs and Digital Assets</h2>
            <p>Understanding non-fungible tokens and their applications:</p>
            <ul>
              <li>Digital art and collectibles</li>
              <li>Gaming assets and virtual real estate</li>
              <li>Tokenization of real-world assets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advanced;