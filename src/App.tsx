import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { MiraChatProvider } from "@/contexts/MiraChatContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalDetails from "./pages/profile/PersonalDetails";
import Settings from "./pages/profile/Settings";
import AgentDashboard from "./pages/agent/Dashboard";
import IconProgram from "./pages/agent/IconProgram";
import AgentTransactions from "./pages/agent/Transactions";
import TeamDashboard from "./pages/team/Dashboard";
import TeamReconciliation from "./pages/team/Reconciliation";
import RevShareDashboard from "./pages/revshare/Dashboard";
import OrganizationReporting from "./pages/revshare/Organization";
import OrganizationTree from "./pages/revshare/OrganizationTree";
import RevShareTrends from "./pages/revshare/Trends";
import RevShareGroup from "./pages/revshare/RevShareGroup";
import Financials from "./pages/revshare/Financials";
import Pulse from "./pages/Pulse";
import MiraHistory from "./pages/mira/History";

import DocumentsPortal from "./pages/documents/DocumentsPortal";
import DocumentsYearEnd from "./pages/documents/YearEnd";
import DocumentsDownloads from "./pages/documents/Downloads";
import MentorProgram from "./pages/mentor/MentorProgram";


const queryClient = new QueryClient();

// Providers wrap the entire app for state management
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleProvider>
        <MiraChatProvider>
          <DashboardProvider>
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
                
                <Route path="/agent/transactions" element={<AgentTransactions />} />
                <Route path="/team/dashboard" element={<TeamDashboard />} />
                <Route path="/team/reconciliation" element={<TeamReconciliation />} />
                <Route path="/revshare/dashboard" element={<RevShareDashboard />} />
                <Route path="/revshare/organization" element={<OrganizationReporting />} />
                <Route path="/revshare/organization-tree" element={<OrganizationTree />} />
                <Route path="/revshare/trends" element={<RevShareTrends />} />
                <Route path="/revshare/group" element={<RevShareGroup />} />
                <Route path="/revshare/financials" element={<Financials />} />
                <Route path="/pulse" element={<Pulse />} />
                <Route path="/mira/history" element={<MiraHistory />} />
                
                <Route path="/documents/portal" element={<DocumentsPortal />} />
                <Route path="/documents/year-end" element={<DocumentsYearEnd />} />
                <Route path="/documents/downloads" element={<DocumentsDownloads />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </TooltipProvider>
          </DashboardProvider>
        </MiraChatProvider>
      </LocaleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
