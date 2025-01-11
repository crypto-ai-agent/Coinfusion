import { ExternalLink, Globe, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CryptoLinksProps {
  website: string;
  twitter_handle?: string;
  github_repo?: string;
  whitepaper?: string;
  contract_address?: string;
}

export const CryptoLinks = ({
  website,
  twitter_handle,
  github_repo,
  whitepaper,
  contract_address
}: CryptoLinksProps) => {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Links & Resources</h2>
      
      {contract_address && (
        <div className="mb-6">
          <p className="text-gray-500 mb-2">Smart Contract</p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 p-2 rounded flex-1 overflow-hidden text-ellipsis font-mono">
              {contract_address}
            </code>
            <Button variant="outline" size="icon" asChild>
              <a href={`https://etherscan.io/address/${contract_address}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="gap-2" asChild>
          <a href={website} target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4" />
            Website
          </a>
        </Button>
        
        {twitter_handle && (
          <Button variant="outline" className="gap-2" asChild>
            <a href={`https://twitter.com/${twitter_handle}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
          </Button>
        )}
        
        {github_repo && (
          <Button variant="outline" className="gap-2" asChild>
            <a href={github_repo} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}
        
        {whitepaper && (
          <Button variant="outline" className="gap-2" asChild>
            <a href={whitepaper} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Whitepaper
            </a>
          </Button>
        )}
      </div>
    </section>
  );
};