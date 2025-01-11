/**
 * A reusable component for external links with consistent styling and icon
 * @component
 */
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExternalLinkProps {
  /** The URL to link to */
  href: string;
  /** The text to display */
  children: React.ReactNode;
  /** Optional icon to display before the text */
  icon?: React.ReactNode;
  /** Optional variant style for the button */
  variant?: "default" | "outline" | "ghost";
}

export const ExternalLink = ({ 
  href, 
  children, 
  icon, 
  variant = "outline" 
}: ExternalLinkProps) => {
  return (
    <Button 
      variant={variant} 
      className="gap-2" 
      asChild
    >
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {icon}
        {children}
        <ExternalLinkIcon className="h-4 w-4 ml-1" />
      </a>
    </Button>
  );
};