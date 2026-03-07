import React, { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, Send, History, ArrowLeft, MessageSquare, Search, Trash2, X, Maximize2, Minimize2, AudioWaveform, Plus, FileText, Mic, Square } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { ChatMessageData, ChatAttachment } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import { VoiceModeView } from "./VoiceMode";

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
  processMessage: (content: string, attachments?: ChatAttachment[]) => void;
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
  isVoiceMode: boolean;
  isVoiceListening: boolean;
  onStartVoiceMode: () => void;
  onEndVoiceMode: () => void;
  onStartVoiceListening: () => void;
  onStopVoiceListening: () => void;
  onVoiceTranscript: (text: string) => void;
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
  isVoiceMode,
  isVoiceListening,
  onStartVoiceMode,
  onEndVoiceMode,
  onStartVoiceListening,
  onStopVoiceListening,
  onVoiceTranscript,
}: ChatContentProps) {
  const { t } = useTranslation();
  const [pendingAttachments, setPendingAttachments] = React.useState<ChatAttachment[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: ChatAttachment[] = Array.from(files).slice(0, 5).map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setPendingAttachments(prev => [...prev, ...newAttachments].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments(prev => {
      const att = prev.find(a => a.id === id);
      if (att) URL.revokeObjectURL(att.url);
      return prev.filter(a => a.id !== id);
    });
  };

  const handleSendWithAttachments = () => {
    const content = inputValue.trim();
    if (!content && pendingAttachments.length === 0) return;
    processMessage(
      content || `Shared ${pendingAttachments.length} file(s)`,
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );
    setInputValue('');
    setPendingAttachments([]);
  };

  // Main chat STT state
  const [isMainListening, setIsMainListening] = React.useState(false);
  const mainSttTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const [mainListeningDots, setMainListeningDots] = React.useState("");

  React.useEffect(() => {
    if (!isMainListening) { setMainListeningDots(""); return; }
    const interval = setInterval(() => {
      setMainListeningDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, [isMainListening]);

  React.useEffect(() => {
    if (!isMainListening) return;
    const FAKE_TRANSCRIPTS = [
      "Show me my GCI trends",
      "How fast are my listings selling?",
      "What's in my active pipeline?",
      "How close am I to ICON status?",
      "Am I on track to hit my cap?",
    ];
    mainSttTimeoutRef.current = setTimeout(() => {
      const fakeText = FAKE_TRANSCRIPTS[Math.floor(Math.random() * FAKE_TRANSCRIPTS.length)];
      setIsMainListening(false);
      processMessage(fakeText);
    }, 2500);
    return () => { if (mainSttTimeoutRef.current) clearTimeout(mainSttTimeoutRef.current); };
  }, [isMainListening, processMessage]);

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
              aria-label={t("chat.backToChat")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold text-sm sm:text-base">{t("chat.chatHistory")}</h2>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="px-3 sm:px-4 py-3 border-b shrink-0">
          <h2 className="font-semibold text-sm sm:text-base">{t("chat.history")}</h2>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-3 sm:px-4 py-2 border-b shrink-0">
        <div className="relative">
          <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("chat.searchConversations")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-8 h-9 text-sm"
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
                  className={`w-full text-start p-3 rounded-lg hover:bg-muted/50 transition-all min-h-[44px] flex items-start gap-3 ${
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
            <p className="text-sm">{t("chat.noResultsFor")} "{searchQuery}"</p>
            <p className="text-xs mt-1">{t("chat.tryDifferentSearch")}</p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t("chat.noConversationsYet")}</p>
            <p className="text-xs mt-1">{t("chat.startChatting")}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  // Chat main content
  const chatContent = (
    <div className="h-full flex flex-col min-h-0 relative">
      <div className="px-3 sm:px-4 py-3 border-b shrink-0 bg-background relative z-10">
        <div className={`flex items-center justify-between w-full ${isMobile ? "" : "pe-8"}`}>
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
                aria-label={isExpanded ? t("chat.exitFullScreen") : t("chat.fullScreen")}
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
            {(
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

        {/* Pending attachment previews */}
        {pendingAttachments.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pendingAttachments.map(att => (
              <div key={att.id} className="relative shrink-0 group">
                {att.type.startsWith('image/') ? (
                  <img src={att.url} alt={att.name} className="h-16 w-16 rounded-lg object-cover border border-border" />
                ) : (
                  <div className="h-16 w-16 rounded-lg border border-border bg-muted flex flex-col items-center justify-center gap-1 px-1">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center">{att.name.split('.').pop()}</span>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-1.5 -end-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {isMainListening ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-8 w-8 rounded-full bg-destructive/20 animate-ping" />
              <div className="relative h-8 w-8 rounded-full bg-destructive flex items-center justify-center">
                <Mic className="h-4 w-4 text-destructive-foreground" />
              </div>
            </div>
            <span className="text-sm text-foreground flex-1">{t("chat.listening")}{mainListeningDots}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMainListening(false)}
              className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-muted-foreground hover:text-primary"
              title="Attach files"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Input
              placeholder={t("chat.askAboutInsights")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendWithAttachments(); } }}
              className="flex-1 text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMainListening(true)}
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-muted-foreground hover:text-primary"
              title="Speech to text"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onStartVoiceMode}
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-muted-foreground hover:text-primary"
              title="Voice mode"
            >
              <AudioWaveform className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleSendWithAttachments} disabled={!inputValue.trim() && pendingAttachments.length === 0} className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Voice mode: replaces entire chat content
  if (isVoiceMode) {
    return (
      <VoiceModeView
        messages={currentMessages}
        onEnd={onEndVoiceMode}
        onTranscript={onVoiceTranscript}
        isListening={isVoiceListening}
        onStartListening={onStartVoiceListening}
        onStopListening={onStopVoiceListening}
      />
    );
  }

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
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
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

  // Auto-scroll while AI is streaming (typewriter animation)
  useEffect(() => {
    const hasStreaming = currentMessages.some(m => m.isStreaming);
    if (!hasStreaming) return;

    const interval = setInterval(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentMessages]);

  // Reset history view and expanded state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowHistory(false);
      setIsExpanded(false);
      setIsVoiceMode(false);
      setIsVoiceListening(false);
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

  const processMessage = (content: string, attachments?: ChatAttachment[]) => {
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      attachments,
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
          isStreaming: true,
        };
      } else {
        aiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: "I can help you with insights about your GCI trends, listing velocity, or pipeline. Try asking something like 'Analyze my GCI trends' or 'How fast are my listings selling?'",
          timestamp: new Date(),
          isStreaming: true,
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
    isVoiceMode,
    isVoiceListening,
    onStartVoiceMode: () => { setIsVoiceMode(true); setIsVoiceListening(true); },
    onEndVoiceMode: () => {
      setIsVoiceMode(false);
      setIsVoiceListening(false);
      // Clear streaming flags so messages don't re-animate in normal chat
      setCurrentMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
    },
    onStartVoiceListening: () => setIsVoiceListening(true),
    onStopVoiceListening: () => setIsVoiceListening(false),
    onVoiceTranscript: (text: string) => processMessage(text),
  };

  // Mobile: Fixed full-screen panel (no overlay)
  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden transition-transform duration-300 ease-out">
        <ChatContent {...contentProps} />
      </div>
    );
  }

  // Desktop expanded: Full-screen overlay (intentional)
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

  // Desktop: Floating chat popup (bottom-right, no overlay)
  if (!isOpen) return null;
  return (
    <div className="fixed bottom-6 end-6 w-[420px] h-[600px] z-50 border bg-background shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out">
      <ChatContent {...contentProps} />
    </div>
  );
}
