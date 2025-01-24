import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "./admin/AdminDashboard";
import { EducationalContentManager } from "./admin/EducationalContentManager";
import { QuizManager } from "./admin/QuizManager";
import { NewsManager } from "./admin/NewsManager";
import { Link, useLocation } from "react-router-dom";

export default function Admin() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-accent" : "";
  };

  return (
    <div className="flex min-h-screen pt-16">
      <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r">
        <nav className="p-4 space-y-2">
          <h2 className="font-semibold mb-4 text-lg">Admin Dashboard</h2>
          <div className="space-y-1">
            <Link 
              to="/admin" 
              className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent ${isActive('/admin')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/content" 
              className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent ${isActive('/admin/content')}`}
            >
              Educational Content
            </Link>
            <Link 
              to="/admin/quizzes" 
              className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent ${isActive('/admin/quizzes')}`}
            >
              Quizzes
            </Link>
            <Link 
              to="/admin/news" 
              className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent ${isActive('/admin/news')}`}
            >
              News
            </Link>
          </div>
        </nav>
      </div>
      
      <div className="flex-1 ml-64 p-8">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<EducationalContentManager />} />
          <Route path="quizzes" element={<QuizManager />} />
          <Route path="news" element={<NewsManager />} />
        </Routes>
      </div>
    </div>
  );
}