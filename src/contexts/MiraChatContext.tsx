import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Conversation, ChatMessageData } from "@/types/chat";

interface MiraChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  openChatWithMessage: (message: string, widgetInfo?: { type: string; id: string; title: string }) => void;
  openChatWithQuery: (query: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  // Focus mode for scrolling to widgets
  focusWidgetId: string | null;
  setFocusWidgetId: (id: string | null) => void;
  // Conversation management
  conversations: Conversation[];
  activeConversationId: string | null;
  currentMessages: ChatMessageData[];
  setCurrentMessages: (messages: ChatMessageData[] | ((prev: ChatMessageData[]) => ChatMessageData[])) => void;
  loadConversation: (id: string) => void;
  saveCurrentConversation: (messages: ChatMessageData[]) => void;
  deleteConversation: (id: string) => void;
  getRecentConversations: (limit: number) => Conversation[];
  startNewChat: () => void;
  // Pending query for auto-send
  pendingQuery: string | null;
  clearPendingQuery: () => void;
}

const MiraChatContext = createContext<MiraChatContextType | undefined>(undefined);

const WELCOME_MESSAGE: ChatMessageData = {
  id: 'welcome',
  sender: 'ai',
  content: "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I'll give you insights you can pin to your dashboard! Try asking about your GCI trends, listing velocity, or pipeline.",
  timestamp: new Date(),
};

// Generate smart title from first user message
const generateTitle = (messages: ChatMessageData[]): string => {
  const firstUserMessage = messages.find(m => m.sender === 'user');
  if (!firstUserMessage) return 'New Conversation';
  
  const content = firstUserMessage.content.toLowerCase();
  
  // Smart title generation based on content keywords
  if (content.includes('gci') || content.includes('revenue') || content.includes('income')) {
    return 'GCI Analysis';
  }
  if (content.includes('pipeline') || content.includes('deals') || content.includes('escrow')) {
    return 'Pipeline Overview';
  }
  if (content.includes('velocity') || content.includes('how fast') || content.includes('selling')) {
    return 'Listing Velocity';
  }
  if (content.includes('trend') || content.includes('forecast') || content.includes('projection')) {
    return 'Trends & Forecast';
  }
  if (content.includes('compare') || content.includes('vs') || content.includes('versus')) {
    return 'Comparison Analysis';
  }
  if (content.includes('report') || content.includes('summary')) {
    return 'Performance Report';
  }
  
  // Fallback: Clean up and use first part of message
  const cleanContent = firstUserMessage.content
    .replace(/^(show me|tell me|what|how|can you|please|i want to|i need)/i, '')
    .trim();
  
  // Capitalize first letter of each word for title case
  const title = cleanContent.slice(0, 35)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return title + (cleanContent.length > 35 ? '...' : '') || 'New Conversation';
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
  const [focusWidgetId, setFocusWidgetId] = useState<string | null>(null);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const openChat = () => setIsChatOpen(true);
  
  const openChatWithQuery = useCallback((query: string) => {
    // Set the pending query to be processed by ChatPanel
    setPendingQuery(query);
    setIsChatOpen(true);
  }, []);
  
  const clearPendingQuery = useCallback(() => {
    setPendingQuery(null);
  }, []);
  
  const openChatWithMessage = useCallback((message: string, widgetInfo?: { type: string; id: string; title: string }) => {
    // Create a new AI message to show in the chat
    const aiMessage: ChatMessageData = {
      id: `mira-${Date.now()}`,
      sender: 'ai',
      content: message,
      timestamp: new Date(),
      widget: widgetInfo ? {
        type: widgetInfo.type as 'forecast' | 'velocity' | 'pipeline',
        id: widgetInfo.id,
        title: widgetInfo.title,
      } : undefined,
    };
    
    // Add to current messages (after welcome message)
    setCurrentMessages(prev => {
      // If only welcome message exists, add the new message
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [...prev, aiMessage];
      }
      // Otherwise append to existing conversation
      return [...prev, aiMessage];
    });
    
    setIsChatOpen(true);
  }, []);

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
      openChatWithMessage,
      openChatWithQuery,
      closeChat, 
      toggleChat,
      focusWidgetId,
      setFocusWidgetId,
      conversations,
      activeConversationId,
      currentMessages,
      setCurrentMessages,
      loadConversation,
      saveCurrentConversation,
      deleteConversation,
      getRecentConversations,
      startNewChat,
      pendingQuery,
      clearPendingQuery,
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
