import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalDetails from "./pages/profile/PersonalDetails";
import Settings from "./pages/profile/Settings";
import AgentDashboard from "./pages/agent/Dashboard";
import IconProgram from "./pages/agent/IconProgram";
import CappingHistory from "./pages/agent/CappingHistory";
import Transactions from "./pages/agent/Transactions";
import TeamDashboard from "./pages/team/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile/personal-details" element={<PersonalDetails />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/icon-program" element={<IconProgram />} />
          <Route path="/agent/capping-history" element={<CappingHistory />} />
          <Route path="/agent/transactions" element={<Transactions />} />
          <Route path="/team/dashboard" element={<TeamDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
