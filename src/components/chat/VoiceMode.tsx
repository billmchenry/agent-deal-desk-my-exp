import { useState, useEffect, useCallback, useRef } from "react";
import { X, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceModeProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

type VoiceState = "idle" | "listening" | "processing" | "speaking";

const FAKE_TRANSCRIPTS = [
  "Show me my GCI trends",
  "How fast are my listings selling?",
  "What's in my active pipeline?",
  "How close am I to ICON status?",
  "Am I on track to hit my cap?",
];

export function VoiceMode({ isOpen, onClose, onTranscript }: VoiceModeProps) {
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [dots, setDots] = useState("");
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(Array(5).fill(0.3));
  const animationRef = useRef<number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Animate wave bars
  useEffect(() => {
    if (state === "listening" || state === "speaking") {
      const animate = () => {
        setWaveAmplitudes(
          Array(5).fill(0).map(() => 
            state === "listening" 
              ? 0.3 + Math.random() * 0.7 
              : 0.2 + Math.random() * 0.5
          )
        );
        animationRef.current = requestAnimationFrame(() => {
          setTimeout(() => {
            animationRef.current = requestAnimationFrame(animate);
          }, 120);
        });
      };
      animate();
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      setWaveAmplitudes(Array(5).fill(0.3));
    }
  }, [state]);

  // Processing dots animation
  useEffect(() => {
    if (state === "processing") {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? "" : prev + ".");
      }, 400);
      return () => clearInterval(interval);
    }
    setDots("");
  }, [state]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setState("idle");
      setTranscript("");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isOpen]);

  const startListening = useCallback(() => {
    setState("listening");
    setTranscript("");

    // Simulate listening for 2-3 seconds, then "transcribe"
    timeoutRef.current = setTimeout(() => {
      setState("processing");

      const fakeText = FAKE_TRANSCRIPTS[Math.floor(Math.random() * FAKE_TRANSCRIPTS.length)];

      // Simulate processing for 1 second
      timeoutRef.current = setTimeout(() => {
        setTranscript(fakeText);
        setState("speaking");

        // Simulate AI "speaking" for 2 seconds, then send
        timeoutRef.current = setTimeout(() => {
          onTranscript(fakeText);
          setState("idle");
          setTranscript("");
        }, 2500);
      }, 1000);
    }, 2000 + Math.random() * 1000);
  }, [onTranscript]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState("idle");
    setTranscript("");
  }, []);

  if (!isOpen) return null;

  const stateLabel = {
    idle: "Tap the mic to start",
    listening: "Listening...",
    processing: `Thinking${dots}`,
    speaking: "Mira is speaking...",
  };

  const stateColor = {
    idle: "text-muted-foreground",
    listening: "text-destructive",
    processing: "text-primary",
    speaking: "text-primary",
  };

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-between py-8">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-4">
        <span className="text-sm font-medium text-muted-foreground">Voice Mode</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: Waveform + Status */}
      <div className="flex flex-col items-center gap-6">
        {/* Waveform visualizer */}
        <div className="flex items-center gap-1.5 h-16">
          {waveAmplitudes.map((amp, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 rounded-full transition-all duration-150",
                state === "listening" ? "bg-destructive" : 
                state === "speaking" ? "bg-primary" : "bg-muted-foreground/30"
              )}
              style={{ height: `${amp * 64}px` }}
            />
          ))}
        </div>

        {/* Status label */}
        <p className={cn("text-sm font-medium", stateColor[state])}>
          {stateLabel[state]}
        </p>

        {/* Transcript preview */}
        {transcript && (
          <div className="max-w-[280px] text-center">
            <p className="text-sm text-foreground italic">"{transcript}"</p>
          </div>
        )}

        {/* Speaking indicator */}
        {state === "speaking" && (
          <div className="flex items-center gap-2 text-primary">
            <Volume2 className="h-4 w-4 animate-pulse" />
            <span className="text-xs">Playing response...</span>
          </div>
        )}
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="icon"
          onClick={state === "listening" ? stopListening : startListening}
          disabled={state === "processing" || state === "speaking"}
          className={cn(
            "h-16 w-16 rounded-full transition-all",
            state === "listening"
              ? "bg-destructive hover:bg-destructive/90 scale-110 shadow-lg shadow-destructive/25"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {state === "listening" ? (
            <MicOff className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Mic className="h-6 w-6 text-primary-foreground" />
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          {state === "listening" ? "Tap to stop" : state === "idle" ? "Tap to speak" : ""}
        </span>
      </div>
    </div>
  );
}
