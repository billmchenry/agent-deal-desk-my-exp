import { useState } from "react";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";
import { Sparkles } from "lucide-react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { useTranslation } from "@/hooks/useTranslation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isChatOpen, openChat, closeChat } = useMiraChat();
  const { isCollapsed } = useSidebarCollapse();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        {t("common.skipToMain")}
      </a>

      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <Sidebar />
      
      <MobileNavDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <main
        id="main-content"
        className={cn("min-h-screen px-4 lg:px-6 pt-20 pb-6 max-w-full overflow-x-hidden transition-all duration-300", isCollapsed ? "lg:ms-16" : "lg:ms-64")}
      >
        {children}
      </main>

      {!isChatOpen && (
        <Button
          onClick={openChat}
          className="fixed bottom-6 end-6 h-14 w-14 rounded-full shadow-lg bg-[#506CAA] hover:bg-[#506CAA]/90 z-40 overflow-hidden group"
          size="icon"
          aria-label={t("common.openMiraChat")}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine" />
          <Sparkles className="h-6 w-6 relative z-10" />
        </Button>
      )}

      <ChatPanel isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}
