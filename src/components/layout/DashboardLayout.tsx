import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";
import { useMiraChat } from "@/contexts/MiraChatContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isChatOpen, openChat, closeChat } = useMiraChat();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <Sidebar />
      
      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Main Content - Shrinks when chat panel is open on desktop */}
      <main className={`lg:ml-64 min-h-screen px-4 lg:px-6 pt-20 pb-6 max-w-full overflow-x-hidden transition-all duration-300 ${
        isChatOpen ? 'lg:mr-[28rem]' : ''
      }`}>
        {children}
      </main>

      {/* Floating Mira Chat Button */}
      <Button
        onClick={openChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}
