import { Sparkles, User, Pin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/DashboardContext";
import { WidgetPreview } from "./WidgetPreview";
import { toast } from "sonner";
import { useState } from "react";

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  widget?: {
    type: 'forecast' | 'velocity' | 'pipeline';
    id: string;
    title: string;
  };
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === 'ai';
  const { addWidget } = useDashboard();
  const [isPinned, setIsPinned] = useState(false);

  const handlePinMessage = () => {
    // Create a short title from the first few words
    const words = message.content.split(' ').slice(0, 4).join(' ');
    const title = words.length < message.content.length ? `${words}...` : words;
    
    addWidget('ai-insight', title, message.content);
    setIsPinned(true);
    toast.success("Insight pinned to your dashboard!");
  };

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAI 
          ? 'bg-primary/10 text-primary' 
          : 'bg-muted text-muted-foreground'
      }`}>
        {isAI ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      
      <div className={`flex flex-col max-w-[80%] ${isAI ? '' : 'items-end'}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isAI 
            ? 'bg-muted text-foreground rounded-tl-sm' 
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.widget && (
          <WidgetPreview 
            type={message.widget.type}
            id={message.widget.id}
            title={message.widget.title}
          />
        )}

        {/* Pin button for AI messages without a widget preview */}
        {isAI && !message.widget && message.id !== 'welcome' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePinMessage}
            disabled={isPinned}
            className={`mt-1 h-7 text-xs ${
              isPinned 
                ? 'text-green-600 hover:text-green-600' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isPinned ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Pinned
              </>
            ) : (
              <>
                <Pin className="h-3 w-3 mr-1" />
                Pin to Dashboard
              </>
            )}
          </Button>
        )}
        
        <span className="text-[10px] text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
