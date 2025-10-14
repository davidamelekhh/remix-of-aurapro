import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portal from "./pages/Portal";
import Landing from "./pages/Landing";
import ProAuth from "./pages/auth/ProAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import ProDashboard from "./pages/pro/ProDashboard";
import ProProjects from "./pages/pro/ProProjects";
import ProProjectNew from "./pages/pro/ProProjectNew";
import ProClients from "./pages/pro/ProClients";
import ProClientNew from "./pages/pro/ProClientNew";
import ProProjectDetail from "./pages/pro/ProProjectDetail";
import ProSettings from "./pages/pro/ProSettings";
import ProAnalytics from "./pages/pro/ProAnalytics";
import ProStakeholders from "./pages/pro/ProStakeholders";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProjectDetail from "./pages/client/ClientProjectDetail";
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
          {/* Landing & Portal Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/portal" element={<Portal />} />
          
          {/* Auth Routes */}
          <Route path="/auth/promoteur" element={<ProAuth />} />
          <Route path="/auth/client" element={<ClientAuth />} />
          
          {/* Client Routes - Protected */}
          <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/project/:id" element={<ProtectedRoute><ClientProjectDetail /></ProtectedRoute>} />
          
          {/* Pro Routes - Protected */}
          <Route path="/pro/dashboard" element={<ProtectedRoute><ProDashboard /></ProtectedRoute>} />
          <Route path="/pro/projects" element={<ProtectedRoute><ProProjects /></ProtectedRoute>} />
          <Route path="/pro/projects/new" element={<ProtectedRoute><ProProjectNew /></ProtectedRoute>} />
          <Route path="/pro/clients" element={<ProtectedRoute><ProClients /></ProtectedRoute>} />
          <Route path="/pro/clients/new" element={<ProtectedRoute><ProClientNew /></ProtectedRoute>} />
          <Route path="/pro/project/:id" element={<ProtectedRoute><ProProjectDetail /></ProtectedRoute>} />
          <Route path="/pro/analytics" element={<ProtectedRoute><ProAnalytics /></ProtectedRoute>} />
          <Route path="/pro/stakeholders" element={<ProtectedRoute><ProStakeholders /></ProtectedRoute>} />
          <Route path="/pro/settings" element={<ProtectedRoute><ProSettings /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
