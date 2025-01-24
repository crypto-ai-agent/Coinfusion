import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "./admin/AdminDashboard";
import { EducationalContentManager } from "./admin/EducationalContentManager";
import { QuizManager } from "./admin/QuizManager";
import { NewsManager } from "./admin/NewsManager";

export default function Admin() {
  return (
    <div className="flex min-h-screen pt-16">
      <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r">
        <nav className="p-4 space-y-2">
          <h2 className="font-semibold mb-4 text-lg">Admin Dashboard</h2>
          <div className="space-y-1">
            <a href="/admin" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
              Dashboard
            </a>
            <a href="/admin/content" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
              Educational Content
            </a>
            <a href="/admin/quizzes" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
              Quizzes
            </a>
            <a href="/admin/news" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
              News
            </a>
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