import React, { useRef, useEffect, useState } from "react";
import { Sparkles, Send, History, ArrowLeft, MessageSquare, Search, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const isMobile = useIsMobile();
  const { 
    currentMessages, 
    setCurrentMessages, 
    loadConversation,
    deleteConversation,
    conversations,
  } = useMiraChat();
  const [inputValue, setInputValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // Reset history view when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowHistory(false);
    }
  }, [isOpen]);

  const processMessage = (content: string) => {
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setCurrentMessages([...currentMessages, userMessage]);
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

      setCurrentMessages([...currentMessages, userMessage, aiMessage]);
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


  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col overflow-hidden">
        {/* Sliding container for chat and history views */}
        <div 
          className="flex w-[200%] h-full transition-transform duration-300 ease-out"
          style={{ transform: showHistory ? 'translateX(-50%)' : 'translateX(0)' }}
        >
          {/* Chat View */}
          <div className="w-1/2 h-full flex flex-col">
            <SheetHeader className="px-3 sm:px-4 py-3 border-b shrink-0">
              <div className="flex items-center justify-between w-full pr-8">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                  <SheetTitle className="text-sm sm:text-base">Mira AI</SheetTitle>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowHistory(true)} 
                  className="h-8 w-8"
                  title="History"
                >
                  <History className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4 sm:gap-6">
                {currentMessages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    onFollowUp={handleFollowUp}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="p-3 sm:p-4 border-t bg-background shrink-0 space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {[
                  { label: "GCI Trends", query: "Show me my GCI trends" },
                  { label: "Listing Velocity", query: "How fast are my listings selling?" },
                  { label: "Active Pipeline", query: "What's in my active pipeline?" },
                ].map((chip) => (
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

          {/* History View */}
          <div className="w-1/2 h-full flex flex-col bg-background">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
