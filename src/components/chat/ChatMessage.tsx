import { Sparkles, User } from "lucide-react";
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
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === 'ai';

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
        
        <span className="text-[10px] text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
