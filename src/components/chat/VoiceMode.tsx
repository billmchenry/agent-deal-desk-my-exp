import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAKE_TRANSCRIPTS = [
  "Show me my GCI trends",
  "How fast are my listings selling?",
  "What's in my active pipeline?",
  "How close am I to ICON status?",
  "Am I on track to hit my cap?",
];

interface VoiceInputBarProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  onStopListening: () => void;
}

export function VoiceInputBar({ onTranscript, isListening, onStopListening }: VoiceInputBarProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isListening) { setDots(""); return; }
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, [isListening]);

  useEffect(() => {
    if (!isListening) return;
    timeoutRef.current = setTimeout(() => {
      const fakeText = FAKE_TRANSCRIPTS[Math.floor(Math.random() * FAKE_TRANSCRIPTS.length)];
      onStopListening();
      onTranscript(fakeText);
    }, 2500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isListening, onTranscript, onStopListening]);

  if (!isListening) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-8 w-8 rounded-full bg-destructive/20 animate-ping" />
        <div className="relative h-8 w-8 rounded-full bg-destructive flex items-center justify-center">
          <Mic className="h-4 w-4 text-destructive-foreground" />
        </div>
      </div>
      <span className="text-sm text-foreground flex-1">Listening{dots}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onStopListening}
        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
      >
        <Square className="h-4 w-4" />
      </Button>
    </div>
  );
}
