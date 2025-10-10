import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import Auth from "./pages/Auth";
import ProDashboard from "./pages/pro/ProDashboard";
import ProProjects from "./pages/pro/ProProjects";
import ProProjectNew from "./pages/pro/ProProjectNew";
import ProClients from "./pages/pro/ProClients";
import ProClientNew from "./pages/pro/ProClientNew";
import ProProjectDetail from "./pages/pro/ProProjectDetail";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          
          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Pro Routes - Protected */}
          <Route path="/pro/dashboard" element={<ProtectedRoute><ProDashboard /></ProtectedRoute>} />
          <Route path="/pro/projects" element={<ProtectedRoute><ProProjects /></ProtectedRoute>} />
          <Route path="/pro/projects/new" element={<ProtectedRoute><ProProjectNew /></ProtectedRoute>} />
          <Route path="/pro/clients" element={<ProtectedRoute><ProClients /></ProtectedRoute>} />
          <Route path="/pro/clients/new" element={<ProtectedRoute><ProClientNew /></ProtectedRoute>} />
          <Route path="/pro/project/:id" element={<ProtectedRoute><ProProjectDetail /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
