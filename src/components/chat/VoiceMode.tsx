import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, Square, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessageData } from "@/types/chat";

const FAKE_TRANSCRIPTS = [
  "Show me my GCI trends",
  "How fast are my listings selling?",
  "What's in my active pipeline?",
  "How close am I to ICON status?",
  "Am I on track to hit my cap?",
];

// Typewriter for voice mode AI responses
function useVoiceTypewriter(text: string, active: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState(active ? "" : text);
  const [done, setDone] = useState(!active);

  useEffect(() => {
    if (!active) { setDisplayed(text); setDone(true); return; }
    setDisplayed(""); setDone(false);
    const words = text.split(/(\s+)/);
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) { setDisplayed(prev => prev + words[i]); i++; }
      else { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return { displayed, done };
}

// Single voice message row
function VoiceMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.sender === 'user';
  const { displayed, done } = useVoiceTypewriter(
    message.content,
    !isUser && !!message.isStreaming
  );

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-muted text-foreground rounded-full px-4 py-2 max-w-[80%]">
          <p className="text-sm">"{message.content}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-1">
      <p className="text-lg leading-relaxed text-foreground">
        {displayed}
        {message.isStreaming && !done && (
          <span className="inline-block w-1.5 h-5 bg-primary ml-0.5 animate-pulse rounded-sm align-middle" />
        )}
      </p>
    </div>
  );
}

interface VoiceModeViewProps {
  messages: ChatMessageData[];
  onEnd: () => void;
  onTranscript: (text: string) => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export function VoiceModeView({
  messages,
  onEnd,
  onTranscript,
  isListening,
  onStartListening,
  onStopListening,
}: VoiceModeViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate transcription after listening
  useEffect(() => {
    if (!isListening) return;
    timeoutRef.current = setTimeout(() => {
      const fakeText = FAKE_TRANSCRIPTS[Math.floor(Math.random() * FAKE_TRANSCRIPTS.length)];
      onStopListening();
      onTranscript(fakeText);
    }, 2500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isListening, onTranscript, onStopListening]);

  const handleSendText = () => {
    if (!inputValue.trim()) return;
    onTranscript(inputValue.trim());
    setInputValue("");
  };

  // Filter to only voice-session messages (skip welcome)
  const voiceMessages = messages.filter(m => m.id !== 'welcome');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-3 shrink-0">
        <p className="text-sm text-muted-foreground font-medium">Mira <span className="text-primary">Voice</span></p>
      </div>

      {/* Messages area - large plain text */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
        <div className="flex flex-col gap-5">
          {voiceMessages.length === 0 && !isListening && (
            <p className="text-lg text-muted-foreground">Hey there! What's on your mind today?</p>
          )}
          {voiceMessages.map((msg) => (
            <VoiceMessage key={msg.id} message={msg} />
          ))}
          {isListening && (
            <div className="flex justify-end">
              <div className="bg-muted text-muted-foreground rounded-full px-4 py-2 animate-pulse">
                <p className="text-sm">Listening...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-3 border-t bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendText(); } }}
            className="flex-1 text-sm rounded-full h-10"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={isListening ? onStopListening : onStartListening}
            className="h-10 w-10 shrink-0 text-muted-foreground"
          >
            {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onEnd}
            className="h-10 px-5 rounded-full bg-primary text-primary-foreground font-medium gap-2"
          >
            <Ellipsis className="h-4 w-4" />
            End
          </Button>
        </div>
      </div>
    </div>
  );
}

// Keep the old inline bar export for backward compat (no longer used but safe)
export function VoiceInputBar({ onTranscript, isListening, onStopListening }: {
  onTranscript: (text: string) => void;
  isListening: boolean;
  onStopListening: () => void;
}) {
  if (!isListening) return null;
  return null;
}
