import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
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
            <h1 className="text-4xl font-bold text-primary mb-4">Crypto Security</h1>
            <p className="text-gray-600 text-lg">Essential security practices for protecting your investments</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2>Protecting Your Crypto Assets</h2>
            <p>
              Security is paramount in the cryptocurrency world. With digital assets becoming increasingly 
              valuable, it's essential to understand and implement proper security measures.
            </p>

            <h2>Best Practices</h2>
            <ul>
              <li>
                <strong>Use Hardware Wallets:</strong> Store significant amounts in cold storage using 
                hardware wallets.
              </li>
              <li>
                <strong>Enable 2FA:</strong> Always use two-factor authentication on exchanges and wallets.
              </li>
              <li>
                <strong>Backup Your Keys:</strong> Safely store your private keys and recovery phrases.
              </li>
            </ul>

            <h2>Common Security Threats</h2>
            <ul>
              <li>Phishing attacks targeting crypto holders</li>
              <li>Fake websites and applications</li>
              <li>Social engineering attempts</li>
              <li>Malware designed to steal crypto assets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;