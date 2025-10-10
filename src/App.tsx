import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portal from "./pages/Portal";
import ProAuth from "./pages/auth/ProAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import ProDashboard from "./pages/pro/ProDashboard";
import ProProjects from "./pages/pro/ProProjects";
import ProProjectNew from "./pages/pro/ProProjectNew";
import ProClients from "./pages/pro/ProClients";
import ProClientNew from "./pages/pro/ProClientNew";
import ProProjectDetail from "./pages/pro/ProProjectDetail";
import ProSettings from "./pages/pro/ProSettings";
import ClientDashboard from "./pages/client/ClientDashboard";
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
          {/* Portal Route */}
          <Route path="/" element={<Portal />} />
          
          {/* Auth Routes */}
          <Route path="/auth/promoteur" element={<ProAuth />} />
          <Route path="/auth/client" element={<ClientAuth />} />
          
          {/* Client Routes - Protected */}
          <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          
          {/* Pro Routes - Protected */}
          <Route path="/pro/dashboard" element={<ProtectedRoute><ProDashboard /></ProtectedRoute>} />
          <Route path="/pro/projects" element={<ProtectedRoute><ProProjects /></ProtectedRoute>} />
          <Route path="/pro/projects/new" element={<ProtectedRoute><ProProjectNew /></ProtectedRoute>} />
          <Route path="/pro/clients" element={<ProtectedRoute><ProClients /></ProtectedRoute>} />
          <Route path="/pro/clients/new" element={<ProtectedRoute><ProClientNew /></ProtectedRoute>} />
          <Route path="/pro/project/:id" element={<ProtectedRoute><ProProjectDetail /></ProtectedRoute>} />
          <Route path="/pro/settings" element={<ProtectedRoute><ProSettings /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
