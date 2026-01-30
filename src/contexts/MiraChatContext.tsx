import { createContext, useContext, useState, ReactNode } from "react";

interface MiraChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const MiraChatContext = createContext<MiraChatContextType | undefined>(undefined);

export function MiraChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <MiraChatContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat }}>
      {children}
    </MiraChatContext.Provider>
  );
}

export function useMiraChat() {
  const context = useContext(MiraChatContext);
  if (context === undefined) {
    throw new Error("useMiraChat must be used within a MiraChatProvider");
  }
  return context;
}
