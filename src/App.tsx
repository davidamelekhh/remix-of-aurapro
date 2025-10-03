import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import ProDashboard from "./pages/pro/ProDashboard";
import ProProjects from "./pages/pro/ProProjects";
import ProClients from "./pages/pro/ProClients";
import ProProjectDetail from "./pages/pro/ProProjectDetail";
import NotFound from "./pages/NotFound";

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
          
          {/* Pro Routes */}
          <Route path="/pro/dashboard" element={<ProDashboard />} />
          <Route path="/pro/projects" element={<ProProjects />} />
          <Route path="/pro/clients" element={<ProClients />} />
          <Route path="/pro/project/:id" element={<ProProjectDetail />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
