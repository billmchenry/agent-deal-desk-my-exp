import { Sparkles } from "lucide-react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isChatOpen, openChat, closeChat } = useMiraChat();

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-[calc(100vh-4rem)] p-4 lg:p-6 pb-24">
        {children}
      </main>

      {/* Floating Mira Chat Button with Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={openChat}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
          {/* Badge hint */}
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center border-2 border-background">
            +
          </span>
        </Button>
      </div>

      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}
