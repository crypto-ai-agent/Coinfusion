import { Link } from "react-router-dom";

interface NavigationLinkProps {
  href: string;
  currentPath: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const NavigationLink = ({
  href,
  currentPath,
  onClick,
  children,
  className = "",
}: NavigationLinkProps) => {
  const isActive = currentPath === href;
  
  return (
    <Link
      to={href}
      className={`text-foreground hover:text-primary transition-colors ${
        isActive ? "text-primary font-medium" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};