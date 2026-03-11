import { useState, useEffect, useRef } from "react";
import { Sparkles, MapPin, Volume2, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WidgetPreview } from "./WidgetPreview";
import { ChatMessageData } from "@/types/chat";

export type { ChatMessageData };

// Render simple markdown: **bold** → <strong>
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// Typewriter hook: reveals text word-by-word
function useTypewriter(fullText: string, isStreaming: boolean, speed = 40) {
  const [displayed, setDisplayed] = useState(isStreaming ? "" : fullText);
  const [done, setDone] = useState(!isStreaming);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayed(fullText);
      setDone(true);
      return;
    }
    setDisplayed("");
    indexRef.current = 0;
    setDone(false);

    const words = fullText.split(/(\s+)/);
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        setDisplayed(prev => prev + words[i]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [fullText, isStreaming, speed]);

  return { displayed, done };
}

// Attachment preview component
function AttachmentPreview({ attachment }: { attachment: { name: string; type: string; url: string } }) {
  const isImage = attachment.type.startsWith('image/');
  
  if (isImage) {
    return (
      <div className="mt-2 rounded-lg overflow-hidden max-w-[200px]">
        <img src={attachment.url} alt={attachment.name} className="w-full h-auto rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2 max-w-[200px]">
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-xs truncate">{attachment.name}</span>
    </div>
  );
}

interface ChatMessageProps {
  message: ChatMessageData;
  onFollowUp?: (question: string) => void;
  onStreamingDone?: () => void;
}

export function ChatMessage({ message, onFollowUp, onStreamingDone }: ChatMessageProps) {
  const isAI = message.sender === 'ai';
  const { displayed, done } = useTypewriter(
    message.content, 
    !!message.isStreaming
  );

  // Notify parent when streaming finishes
  useEffect(() => {
    if (message.isStreaming && done && onStreamingDone) {
      onStreamingDone();
    }
  }, [done, message.isStreaming, onStreamingDone]);

  return (
    <div className={`flex gap-2 sm:gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
        isAI 
          ? 'bg-[hsl(var(--exp-dark-navy))] text-white' 
          : 'bg-muted text-muted-foreground border border-border'
      }`}>
        {isAI ? (
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <span className="text-xs sm:text-sm font-semibold">C</span>
        )}
      </div>
      
      <div className={`flex flex-col min-w-0 max-w-[calc(100%-2.5rem)] sm:max-w-[85%] ${isAI ? '' : 'items-end'}`}>
        {/* Attachments (shown above bubble for user messages) */}
        {!isAI && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1 justify-end">
            {message.attachments.map(att => (
              <AttachmentPreview key={att.id} attachment={att} />
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div className={`rounded-2xl px-2.5 sm:px-4 py-2 sm:py-3 ${
          isAI 
            ? 'bg-muted text-foreground rounded-tl-sm' 
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        }`}>
          {message.content && (
            <p className="text-[11px] sm:text-sm leading-relaxed">
              {renderMarkdown(displayed)}
              {isAI && message.isStreaming && !done && (
                <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm align-middle" />
              )}
            </p>
          )}
          
          {/* Speaking indicator while streaming */}
          {isAI && message.isStreaming && !done && (
            <div className="flex items-center gap-1.5 mt-1.5 text-primary">
              <Volume2 className="h-3 w-3 animate-pulse" />
              <span className="text-[10px]">{/* Speaking indicator - no translation needed for UI animation */}Speaking...</span>
            </div>
          )}
          
          {/* Inline action button */}
          {message.action && done && (
            <Button
              variant="ghost"
              size="sm"
              onClick={message.action.onClick}
              className="mt-2 h-7 sm:h-8 px-2.5 sm:px-3 text-[11px] sm:text-xs rounded-full bg-primary/10 hover:bg-primary/20 text-primary gap-1.5"
            >
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {message.action.label}
            </Button>
          )}
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 px-1">
          Just now
        </span>
        
        {/* Widget preview - only show after streaming done */}
        {message.widget && done && (
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
