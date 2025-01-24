import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "./admin/AdminDashboard";
import { EducationalContentManager } from "./admin/EducationalContentManager";
import { QuizManager } from "./admin/QuizManager";
import { NewsManager } from "./admin/NewsManager";
import { UserProfilesManager } from "@/components/admin/UserProfilesManager";

export default function Admin() {
  return (
    <div className="flex min-h-screen pt-16">
      <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r">
        <nav className="p-4 space-y-2">
          <AdminSection />
        </nav>
      </div>
      
      <div className="flex-1 ml-64 p-8">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<EducationalContentManager />} />
          <Route path="quizzes" element={<QuizManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="users" element={<UserProfilesManager />} />
        </Routes>
      </div>
    </div>
  );
}