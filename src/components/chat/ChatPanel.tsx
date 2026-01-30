import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatMessageData } from "./ChatMessage";

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
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: 'welcome',
      sender: 'ai',
      content: "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I'll give you insights you can pin to your dashboard! Try asking about your GCI trends, listing velocity, or pipeline.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processMessage = (content: string) => {
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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

      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    processMessage(inputValue.trim());
  };

  const handleFollowUp = (question: string) => {
    processMessage(question);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        content: "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I'll give you insights you can pin to your dashboard! Try asking about your GCI trends, listing velocity, or pipeline.",
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-3 sm:px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <SheetTitle className="text-sm sm:text-base">Mira AI</SheetTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleNewChat} className="text-muted-foreground text-xs sm:text-sm h-8">
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">New Chat</span>
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4 sm:gap-6">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onFollowUp={handleFollowUp}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 sm:p-4 border-t bg-background shrink-0">
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
