import React, { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, Send, History, ArrowLeft, MessageSquare, Search, Trash2, X, Maximize2, Minimize2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { ChatMessageData } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateWidgetId = (type: string) => `${type}-${Date.now()}`;

const aiResponses: Record<string, { text: string; widgetType?: 'forecast' | 'velocity' | 'pipeline'; widgetTitle?: string }> = {
  forecast: {
    text: "Your GCI is trending upward! You've earned $279K this year, which is 23% higher than last year. September and December were your strongest months.",
    widgetType: 'forecast',
    widgetTitle: 'Monthly GCI Trend',
  },
  velocity: {
    text: "Great news! Your listings are selling faster than the market average. Here's a breakdown of your current listing velocity metrics.",
    widgetType: 'velocity',
    widgetTitle: 'Listing Velocity',
  },
  pipeline: {
    text: "Here's your current pipeline overview. You have several active deals in various stages of the transaction process.",
    widgetType: 'pipeline',
    widgetTitle: 'Active Pipeline',
  },
};

const parseUserInput = (input: string): keyof typeof aiResponses | null => {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('forecast') || lowerInput.includes('revenue') || lowerInput.includes('projection') || lowerInput.includes('gci') || lowerInput.includes('trend') || lowerInput.includes('compare') || lowerInput.includes('projected')) {
    return 'forecast';
  }
  if (lowerInput.includes('velocity') || lowerInput.includes('fast') || lowerInput.includes('selling') || lowerInput.includes('listings')) {
    return 'velocity';
  }
  if (lowerInput.includes('pipeline') || lowerInput.includes('escrow') || lowerInput.includes('active deals') || lowerInput.includes('deals')) {
    return 'pipeline';
  }
  return null;
};

// Route-based suggestion chips
type SuggestionChip = { label: string; query: string };

const ROUTE_SUGGESTIONS: Record<string, SuggestionChip[]> = {
  '/agent/transactions': [
    { label: "Pending Deals", query: "Show me my pending transactions" },
    { label: "Closed This Month", query: "How many transactions did I close this month?" },
    { label: "Avg Days to Close", query: "What's my average days to close?" },
  ],
  '/agent/dashboard': [
    { label: "GCI Trends", query: "Show me my GCI trends" },
    { label: "Listing Velocity", query: "How fast are my listings selling?" },
    { label: "Active Pipeline", query: "What's in my active pipeline?" },
  ],
  '/agent/icon-program': [
    { label: "ICON Progress", query: "How close am I to ICON status?" },
    { label: "Cap Status", query: "Am I on track to hit my cap?" },
    { label: "Production Goals", query: "What are my remaining production goals?" },
  ],
  '/revshare': [
    { label: "RevShare Earnings", query: "Show me my revenue share earnings" },
    { label: "Organization Growth", query: "How is my organization growing?" },
    { label: "Sponsor Tree", query: "Show me my sponsor tree performance" },
  ],
  '/team': [
    { label: "Team Performance", query: "How is my team performing?" },
    { label: "Top Producers", query: "Who are my top producing agents?" },
    { label: "Team Volume", query: "What's my team's total volume?" },
  ],
};

const DEFAULT_SUGGESTIONS: SuggestionChip[] = [
  { label: "GCI Trends", query: "Show me my GCI trends" },
  { label: "Listing Velocity", query: "How fast are my listings selling?" },
  { label: "Active Pipeline", query: "What's in my active pipeline?" },
];

// Route-based welcome messages
const ROUTE_WELCOME_MESSAGES: Record<string, string> = {
  '/agent/transactions': "Hi! I'm Mira, your AI assistant. I can help you analyze your transactions — ask about pending deals, closing timelines, or volume breakdowns!",
  '/agent/dashboard': "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I'll give you insights you can pin to your dashboard! Try asking about your GCI trends, listing velocity, or pipeline.",
  '/agent/icon-program': "Hi! I'm Mira, your AI assistant. I can help you track your ICON progress — ask about your cap status, production goals, or award tiers!",
  '/revshare': "Hi! I'm Mira, your AI assistant. I can help with your revenue share — ask about earnings, organization growth, or sponsor tree performance!",
  '/team': "Hi! I'm Mira, your AI assistant. I can help you manage your team — ask about team performance, top producers, or recruiting trends!",
};

const DEFAULT_WELCOME_MESSAGE = "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I'll give you insights you can pin to your dashboard! Try asking about your GCI trends, listing velocity, or pipeline.";

function getWelcomeMessageForRoute(pathname: string): string {
  if (ROUTE_WELCOME_MESSAGES[pathname]) return ROUTE_WELCOME_MESSAGES[pathname];
  const prefixMatch = Object.keys(ROUTE_WELCOME_MESSAGES).find(route => pathname.startsWith(route) && route !== '/agent/dashboard');
  if (prefixMatch) return ROUTE_WELCOME_MESSAGES[prefixMatch];
  return DEFAULT_WELCOME_MESSAGE;
}

function getSuggestionsForRoute(pathname: string): SuggestionChip[] {
  // Exact match first
  if (ROUTE_SUGGESTIONS[pathname]) return ROUTE_SUGGESTIONS[pathname];
  // Prefix match (e.g. /revshare/trends matches /revshare)
  const prefixMatch = Object.keys(ROUTE_SUGGESTIONS).find(route => pathname.startsWith(route) && route !== '/agent/dashboard');
  if (prefixMatch) return ROUTE_SUGGESTIONS[prefixMatch];
  return DEFAULT_SUGGESTIONS;
}

// Shared chat content component
interface ChatContentProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  currentMessages: ChatMessageData[];
  handleFollowUp: (question: string) => void;
  processMessage: (content: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSend: () => void;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredConversations: any[];
  handleLoadConversation: (id: string) => void;
  handleDeleteConversation: (e: React.MouseEvent, id: string) => void;
  swipedId: string | null;
  setSwipedId: (id: string | null) => void;
  isMobile: boolean;
  onClose: () => void;
  suggestions: SuggestionChip[];
  pathname: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

function ChatContent({
  showHistory,
  setShowHistory,
  currentMessages,
  handleFollowUp,
  processMessage,
  inputValue,
  setInputValue,
  handleKeyPress,
  handleSend,
  messagesContainerRef,
  searchQuery,
  setSearchQuery,
  filteredConversations,
  handleLoadConversation,
  handleDeleteConversation,
  swipedId,
  setSwipedId,
  isMobile,
  onClose,
  suggestions,
  pathname,
  isExpanded,
  onToggleExpand,
}: ChatContentProps) {
  // History sidebar content (reused in both layouts)
  const historyContent = (
    <div className="h-full flex flex-col bg-background min-h-0">
      {!isExpanded && (
        <div className="px-3 sm:px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowHistory(false)} 
              className="h-8 w-8 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold text-sm sm:text-base">Chat History</h2>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="px-3 sm:px-4 py-3 border-b shrink-0">
          <h2 className="font-semibold text-sm sm:text-base">History</h2>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-3 sm:px-4 py-2 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredConversations.length > 0 ? (
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className="relative group"
                onTouchStart={() => isMobile && setSwipedId(conv.id)}
                onTouchEnd={() => isMobile && setTimeout(() => setSwipedId(null), 3000)}
              >
                <button
                  onClick={() => handleLoadConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all min-h-[44px] flex items-start gap-3 ${
                    swipedId === conv.id ? 'translate-x-[-60px]' : ''
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(conv.updatedAt, { addSuffix: true })} · {conv.messages.length} messages
                    </p>
                  </div>
                  
                  {/* Desktop hover delete button */}
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </button>
                
                {/* Mobile swipe delete button */}
                {isMobile && swipedId === conv.id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-14 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No results for "{searchQuery}"</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start chatting with Mira!</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  // Chat main content
  const chatContent = (
    <div className="h-full flex flex-col min-h-0">
      <div className="px-3 sm:px-4 py-3 border-b shrink-0 bg-background relative z-10">
        <div className={`flex items-center justify-between w-full ${isMobile ? "" : "pr-8"}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm sm:text-base">Mira AI</span>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            {!isMobile && onToggleExpand && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleExpand} 
                className="h-8 w-8 shrink-0"
                title={isExpanded ? "Exit full screen" : "Full screen"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            {!isExpanded && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowHistory(true)} 
                className="h-8 w-8 shrink-0"
                title="History"
              >
                <History className="h-4 w-4" />
              </Button>
            )}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
        <div className="flex flex-col gap-4 sm:gap-6">
          {currentMessages.map((message) => {
            const displayMessage = message.id === 'welcome'
              ? { ...message, content: getWelcomeMessageForRoute(pathname) }
              : message;
            return (
              <ChatMessage 
                key={displayMessage.id} 
                message={displayMessage} 
                onFollowUp={handleFollowUp}
              />
            );
          })}
        </div>
      </div>

      <div className="p-3 sm:p-4 border-t bg-background shrink-0 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {suggestions.map((chip) => (
            <Button
              key={chip.label}
              variant="outline"
              size="sm"
              onClick={() => processMessage(chip.query)}
              className="h-7 sm:h-8 px-2.5 sm:px-3 text-[11px] sm:text-xs rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 whitespace-nowrap shrink-0"
            >
              {chip.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ask about your insights..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-sm"
          />
          <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()} className="h-9 w-9 sm:h-10 sm:w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Expanded: side-by-side layout with history on the left
  if (isExpanded) {
    return (
      <div className="flex h-full min-h-0">
        <div className="w-80 lg:w-96 border-r shrink-0 h-full">
          {historyContent}
        </div>
        <div className="flex-1 h-full min-w-0">
          {chatContent}
        </div>
      </div>
    );
  }

  // Normal: sliding panel layout
  return (
    <div 
      className="flex w-[200%] h-full min-h-0 transition-transform duration-300 ease-out"
      style={{ transform: showHistory ? 'translateX(-50%)' : 'translateX(0)' }}
    >
      <div className="w-1/2 h-full">
        {chatContent}
      </div>
      <div className="w-1/2 h-full">
        {historyContent}
      </div>
    </div>
  );
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const isMobile = useIsMobile();
  const { 
    currentMessages, 
    setCurrentMessages, 
    loadConversation,
    deleteConversation,
    conversations,
    pendingQuery,
    clearPendingQuery,
  } = useMiraChat();
  const location = useLocation();
  const [inputValue, setInputValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleLoadConversation = (id: string) => {
    loadConversation(id);
    setShowHistory(false);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
    setSwipedId(null);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations
    .filter(conv => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        conv.title.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query) ||
        conv.messages.some(m => m.content.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // Reset history view and expanded state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowHistory(false);
      setIsExpanded(false);
    }
  }, [isOpen]);

  // Process pending query when chat opens
  useEffect(() => {
    if (isOpen && pendingQuery) {
      // Small delay to ensure panel is fully rendered
      const timer = setTimeout(() => {
        processMessage(pendingQuery);
        clearPendingQuery();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pendingQuery, clearPendingQuery]);

  const processMessage = (content: string) => {
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const responseType = parseUserInput(content);
      
      let aiMessage: ChatMessageData;
      
      if (responseType && aiResponses[responseType]) {
        const response = aiResponses[responseType];
        const widgetId = generateWidgetId(response.widgetType!);
        
        aiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: response.text,
          widget: {
            type: response.widgetType!,
            id: widgetId,
            title: response.widgetTitle!,
          },
          timestamp: new Date(),
        };
      } else {
        aiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: "I can help you with insights about your GCI trends, listing velocity, or pipeline. Try asking something like 'Analyze my GCI trends' or 'How fast are my listings selling?'",
          timestamp: new Date(),
        };
      }

      setCurrentMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    processMessage(inputValue.trim());
  };

  const handleFollowUp = (question: string) => {
    processMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const contentProps = {
    showHistory,
    setShowHistory,
    currentMessages,
    handleFollowUp,
    processMessage,
    inputValue,
    setInputValue,
    handleKeyPress,
    handleSend,
    messagesContainerRef,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    handleLoadConversation,
    handleDeleteConversation,
    swipedId,
    setSwipedId,
    isMobile,
    onClose,
    suggestions: getSuggestionsForRoute(location.pathname),
    pathname: location.pathname,
    isExpanded,
    onToggleExpand: () => setIsExpanded(prev => !prev),
  };

  // Mobile: Use Drawer (slides up from bottom)
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent hideHandle className="h-[85vh] p-0 flex flex-col overflow-hidden min-h-0">
          <ChatContent {...contentProps} />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop expanded: Full-screen overlay
  if (isExpanded) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) { setIsExpanded(false); onClose(); } }}>
        <SheetContent side="right" className="w-full sm:max-w-none inset-0 p-0 flex flex-col overflow-hidden">
          <div className="w-full h-full flex flex-col">
            <ChatContent {...contentProps} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Sheet (slides in from right)
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col overflow-hidden">
        <ChatContent {...contentProps} />
      </SheetContent>
    </Sheet>
  );
}
