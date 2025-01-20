import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Education from "@/pages/Education";
import Rankings from "@/pages/Rankings";
import News from "@/pages/News";
import CryptoDetails from "@/pages/CryptoDetails";
import ProfileManagement from "@/pages/ProfileManagement";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { EducationalContentManager } from "@/pages/admin/EducationalContentManager";
import { NewsManager } from "@/pages/admin/NewsManager";
import { QuizManager } from "@/pages/admin/QuizManager";
import WatchlistsPage from "@/pages/dashboard/Watchlists";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/watchlists" element={<WatchlistsPage />} />
        <Route path="/education" element={<Education />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/news" element={<News />} />
        <Route path="/crypto/:id" element={<CryptoDetails />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/education" element={<EducationalContentManager />} />
        <Route path="/admin/news" element={<NewsManager />} />
        <Route path="/admin/quizzes" element={<QuizManager />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;