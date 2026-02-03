import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Conversation, ChatMessageData } from "@/types/chat";

interface MiraChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  // Conversation management
  conversations: Conversation[];
  activeConversationId: string | null;
  currentMessages: ChatMessageData[];
  setCurrentMessages: (messages: ChatMessageData[]) => void;
  loadConversation: (id: string) => void;
  saveCurrentConversation: (messages: ChatMessageData[]) => void;
  deleteConversation: (id: string) => void;
  getRecentConversations: (limit: number) => Conversation[];
  startNewChat: () => void;
}

const MiraChatContext = createContext<MiraChatContextType | undefined>(undefined);

const WELCOME_MESSAGE: ChatMessageData = {
  id: 'welcome',
  sender: 'ai',
  content: "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I'll give you insights you can pin to your dashboard! Try asking about your GCI trends, listing velocity, or pipeline.",
  timestamp: new Date(),
};

// Generate title from first user message
const generateTitle = (messages: ChatMessageData[]): string => {
  const firstUserMessage = messages.find(m => m.sender === 'user');
  if (!firstUserMessage) return 'New Conversation';
  return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '');
};

// Generate preview from first AI response (excluding welcome message)
const generatePreview = (messages: ChatMessageData[]): string => {
  const firstAIResponse = messages.find(m => m.sender === 'ai' && m.id !== 'welcome');
  if (!firstAIResponse) return '';
  return firstAIResponse.content.slice(0, 100) + (firstAIResponse.content.length > 100 ? '...' : '');
};

export function MiraChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessageData[]>([WELCOME_MESSAGE]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    // Auto-save conversation when closing if there are user messages
    const hasUserMessages = currentMessages.some(m => m.sender === 'user');
    if (hasUserMessages) {
      saveCurrentConversation(currentMessages);
    }
  }, [currentMessages]);
  
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  const saveCurrentConversation = useCallback((messages: ChatMessageData[]) => {
    const hasUserMessages = messages.some(m => m.sender === 'user');
    if (!hasUserMessages) return;

    const now = new Date();
    
    if (activeConversationId) {
      // Update existing conversation
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages, updatedAt: now, preview: generatePreview(messages) }
          : conv
      ));
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: generateTitle(messages),
        messages,
        createdAt: now,
        updatedAt: now,
        preview: generatePreview(messages),
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    }
  }, [activeConversationId]);

  const loadConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentMessages(conversation.messages);
      setActiveConversationId(id);
      setIsChatOpen(true);
    }
  }, [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setCurrentMessages([WELCOME_MESSAGE]);
    }
  }, [activeConversationId]);

  const getRecentConversations = useCallback((limit: number): Conversation[] => {
    return conversations
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }, [conversations]);

  const startNewChat = useCallback(() => {
    // Save current conversation before starting new one
    const hasUserMessages = currentMessages.some(m => m.sender === 'user');
    if (hasUserMessages && !activeConversationId) {
      saveCurrentConversation(currentMessages);
    }
    setActiveConversationId(null);
    setCurrentMessages([WELCOME_MESSAGE]);
  }, [currentMessages, activeConversationId, saveCurrentConversation]);

  return (
    <MiraChatContext.Provider value={{ 
      isChatOpen, 
      openChat, 
      closeChat, 
      toggleChat,
      conversations,
      activeConversationId,
      currentMessages,
      setCurrentMessages,
      loadConversation,
      saveCurrentConversation,
      deleteConversation,
      getRecentConversations,
      startNewChat,
    }}>
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
