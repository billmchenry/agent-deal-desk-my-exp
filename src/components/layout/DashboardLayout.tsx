 import { Sparkles } from "lucide-react";
 import { Header } from "./Header";
 import { Sidebar } from "./Sidebar";
 import { MobileBottomNav } from "./MobileBottomNav";
 import { ChatPanel } from "@/components/chat/ChatPanel";
 import { Button } from "@/components/ui/button";
 import { useMiraChat } from "@/contexts/MiraChatContext";
 
 interface DashboardLayoutProps {
   children: React.ReactNode;
 }
 
 export function DashboardLayout({ children }: DashboardLayoutProps) {
   const { isChatOpen, openChat, closeChat } = useMiraChat();
 
   return (
     <div className="min-h-screen bg-background w-full overflow-x-hidden">
       <Header />
       <Sidebar />
       
       {/* Main Content - Shrinks when chat panel is open on desktop */}
       <main className={`lg:ml-64 min-h-screen px-4 lg:px-6 pt-20 pb-28 lg:pb-6 max-w-full overflow-x-hidden transition-all duration-300 ${
         isChatOpen ? 'lg:mr-[28rem]' : ''
       }`}>
         {children}
       </main>
 
       {/* Floating Mira Chat Button - Positioned above tab bar on mobile */}
       <Button
         onClick={openChat}
         className="fixed bottom-[76px] right-4 h-12 w-12 lg:bottom-6 lg:right-6 lg:h-14 lg:w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
         size="icon"
       >
         <Sparkles className="h-5 w-5 lg:h-6 lg:w-6" />
       </Button>
 
       {/* Mobile Bottom Navigation */}
       <MobileBottomNav />
 
       {/* Chat Panel */}
       <ChatPanel isOpen={isChatOpen} onClose={closeChat} />
     </div>
   );
 }
