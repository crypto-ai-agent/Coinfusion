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
      className={`text-gray-300 hover:text-[#8B5CF6] transition-colors ${
        currentPath === href ? "text-[#D946EF]" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};