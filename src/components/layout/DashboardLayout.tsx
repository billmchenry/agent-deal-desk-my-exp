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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isChatOpen, openChat, closeChat } = useMiraChat();
  const { isCollapsed } = useSidebarCollapse();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <Sidebar />
      
      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main
        id="main-content"
        className={cn("min-h-screen px-4 lg:px-6 pt-20 pb-6 max-w-full overflow-x-hidden transition-all duration-300", isCollapsed ? "lg:ml-16" : "lg:ml-64")}
      >
        {children}
      </main>

      {/* Floating Mira Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={openChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
          size="icon"
          aria-label="Open Mira chat"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}
