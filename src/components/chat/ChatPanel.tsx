import React, { useRef, useEffect, useState } from "react";
import { Sparkles, Send, ChevronDown, Plus, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { ChatMessageData } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const navigate = useNavigate();
  const { 
    currentMessages, 
    setCurrentMessages, 
    startNewChat, 
    getRecentConversations, 
    loadConversation,
    activeConversationId,
    conversations,
  } = useMiraChat();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const recentConversations = getRecentConversations(5);
  const currentTitle = activeConversationId 
    ? conversations.find(c => c.id === activeConversationId)?.title || "Mira AI"
    : "Mira AI";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const processMessage = (content: string) => {
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setCurrentMessages([...currentMessages, userMessage]);
    setInputValue("");

    // Simulate AI response after a short delay
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

  const handleViewAllHistory = () => {
    onClose();
    navigate('/mira/history');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-3 sm:px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-1 font-normal flex items-center gap-1 min-w-0">
                    <SheetTitle className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-[180px]">
                      {currentTitle}
                    </SheetTitle>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-popover">
                  {recentConversations.length > 0 ? (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Recent Conversations
                      </div>
                      {recentConversations.map(conv => (
                        <DropdownMenuItem 
                          key={conv.id} 
                          onClick={() => loadConversation(conv.id)}
                          className="flex flex-col items-start gap-0.5 cursor-pointer"
                        >
                          <span className="font-medium truncate w-full">{conv.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(conv.updatedAt, { addSuffix: true })}
                          </span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      No recent conversations
                    </div>
                  )}
                  <DropdownMenuItem onClick={handleViewAllHistory} className="cursor-pointer">
                    <History className="h-4 w-4 mr-2" />
                    View All History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleViewAllHistory} 
              className="h-8 w-8 shrink-0"
              title="History"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={startNewChat} 
              className="h-8 w-8 shrink-0"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
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
          {/* Suggestion Chips */}
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
      </SheetContent>
    </Sheet>
  );
}


