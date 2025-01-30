import { Routes, Route, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Education } from "@/components/Education";
import { ContentViewer } from "@/components/education/ContentViewer";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { useNavigate } from "react-router-dom";
import Rankings from "@/pages/Rankings";
import NewsPage from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";

export default function App() {
  const navigate = useNavigate();

  const handleQuizComplete = async (score: number) => {
    navigate("/education");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/education" element={<Education />} />
        <Route path="/education/content/:id" element={<ContentViewer />} />
        <Route path="/education/:category/:id" element={<ContentViewer />} />
        <Route 
          path="/quiz/:quizId" 
          element={
            <QuizTaking 
              onComplete={handleQuizComplete} 
            />
          } 
        />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}