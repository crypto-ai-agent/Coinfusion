import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        <Menu className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className="absolute bg-white shadow-lg">
          <Link to="/admin" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/admin/content" onClick={() => setIsOpen(false)}>Educational Content</Link>
          <Link to="/admin/quizzes" onClick={() => setIsOpen(false)}>Quizzes</Link>
          <Link to="/admin/news" onClick={() => setIsOpen(false)}>News</Link>
          <Link to="/admin/users" onClick={() => setIsOpen(false)}>User Profiles</Link>
        </div>
      )}
    </div>
  );
};
