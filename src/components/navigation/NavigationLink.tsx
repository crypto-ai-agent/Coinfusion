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
  return (
    <Link
      to={href}
      className={`text-gray-700 hover:text-primary transition-colors ${
        currentPath === href ? "text-primary" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};