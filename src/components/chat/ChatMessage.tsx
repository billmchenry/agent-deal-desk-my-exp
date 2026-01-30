import { Sparkles } from "lucide-react";
import { WidgetPreview } from "./WidgetPreview";

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
  onFollowUp?: (question: string) => void;
}

export function ChatMessage({ message, onFollowUp }: ChatMessageProps) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isAI 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground border border-border'
      }`}>
        {isAI ? (
          <Sparkles className="h-5 w-5" />
        ) : (
          <span className="text-sm font-semibold">C</span>
        )}
      </div>
      
      <div className={`flex flex-col max-w-[85%] ${isAI ? '' : 'items-end'}`}>
        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 ${
          isAI 
            ? 'bg-muted text-foreground rounded-tl-sm' 
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <span className="text-[11px] text-muted-foreground mt-1 px-1">
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
