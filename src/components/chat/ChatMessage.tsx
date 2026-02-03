import { Sparkles } from "lucide-react";
import { WidgetPreview } from "./WidgetPreview";
import { ChatMessageData } from "@/types/chat";

export type { ChatMessageData };

interface ChatMessageProps {
  message: ChatMessageData;
  onFollowUp?: (question: string) => void;
}

export function ChatMessage({ message, onFollowUp }: ChatMessageProps) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-2 sm:gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
        isAI 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground border border-border'
      }`}>
        {isAI ? (
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <span className="text-xs sm:text-sm font-semibold">C</span>
        )}
      </div>
      
      <div className={`flex flex-col min-w-0 max-w-[calc(100%-2.5rem)] sm:max-w-[85%] ${isAI ? '' : 'items-end'}`}>
        {/* Message bubble */}
        <div className={`rounded-2xl px-2.5 sm:px-4 py-2 sm:py-3 ${
          isAI 
            ? 'bg-muted text-foreground rounded-tl-sm' 
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        }`}>
          <p className="text-[11px] sm:text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 px-1">
          Just now
        </span>
        
        {/* Widget preview with insights and follow-ups */}
        {message.widget && (
          <WidgetPreview 
            type={message.widget.type}
            id={message.widget.id}
            title={message.widget.title}
            onFollowUp={onFollowUp}
          />
        )}
      </div>
    </div>
  );
}
