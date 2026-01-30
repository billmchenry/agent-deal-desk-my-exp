import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X } from "lucide-react";
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
    text: "Based on your current trajectory, here's your projected Revenue Share for the next 6 months. Your consistent recruiting efforts are showing strong momentum!",
    widgetType: 'forecast',
    widgetTitle: 'Revenue Share Forecast',
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
  if (lowerInput.includes('forecast') || lowerInput.includes('revenue share') || lowerInput.includes('projection')) {
    return 'forecast';
  }
  if (lowerInput.includes('velocity') || lowerInput.includes('fast') || lowerInput.includes('selling') || lowerInput.includes('listings')) {
    return 'velocity';
  }
  if (lowerInput.includes('pipeline') || lowerInput.includes('escrow') || lowerInput.includes('active deals')) {
    return 'pipeline';
  }
  return null;
};

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: 'welcome',
      sender: 'ai',
      content: "Hi! I'm Mira, your AI assistant. Ask me about your forecast, listing velocity, or pipeline to see insights you can pin to your dashboard.",
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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responseType = parseUserInput(inputValue);
      
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
          content: "I can help you with insights about your forecast, listing velocity, or pipeline. Try asking something like 'Show me my forecast' or 'How fast are my listings selling?'",
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <SheetTitle className="text-base">Mira AI</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask about your insights..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
