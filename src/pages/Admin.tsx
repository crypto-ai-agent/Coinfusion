import { Routes, Route } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import AdminDashboard from "./admin/AdminDashboard";
import { EducationalContentManager } from "./admin/EducationalContentManager";
import { QuizManager } from "./admin/QuizManager";
import { NewsManager } from "./admin/NewsManager";

export default function Admin() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 p-8 pt-20">
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