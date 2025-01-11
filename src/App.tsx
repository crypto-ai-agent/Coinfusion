import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Education from "./pages/Education";
import News from "./pages/News";
import Rankings from "./pages/Rankings";
import CryptoDetails from "./pages/CryptoDetails";
import CryptoBasics from "./pages/educational/CryptoBasics";
import Security from "./pages/educational/Security";
import Investment from "./pages/educational/Investment";
import Advanced from "./pages/educational/Advanced";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/Dashboard";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/education" element={<Education />} />
          <Route path="/news" element={<News />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/crypto/:id" element={<CryptoDetails />} />
          <Route path="/education/crypto-basics" element={<CryptoBasics />} />
          <Route path="/education/security" element={<Security />} />
          <Route path="/education/investment" element={<Investment />} />
          <Route path="/education/advanced" element={<Advanced />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;