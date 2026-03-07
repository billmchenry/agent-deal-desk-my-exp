import React, { useEffect, useRef, useState, useCallback } from "react";
import { Mic, Square, Ellipsis, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessageData, ChatAttachment } from "@/types/chat";

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
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < words.length) {
        const word = words[idx];
        idx++;
        setDisplayed(prev => prev + word);
      } else {
        clearInterval(interval);
        setDone(true);
      }
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
      <div className="flex flex-col items-end gap-1">
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-end">
            {message.attachments.map(att => (
              att.type.startsWith('image/') ? (
                <img key={att.id} src={att.url} alt={att.name} className="h-20 w-20 rounded-lg object-cover" />
              ) : (
                <div key={att.id} className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">{att.name}</span>
                </div>
              )
            ))}
          </div>
        )}
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: ChatAttachment[] = Array.from(files).slice(0, 5).map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setPendingAttachments(prev => [...prev, ...newAttachments].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        {pendingAttachments.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pendingAttachments.map(att => (
              <div key={att.id} className="relative shrink-0 group">
                {att.type.startsWith('image/') ? (
                  <img src={att.url} alt={att.name} className="h-14 w-14 rounded-lg object-cover border border-border" />
                ) : (
                  <div className="h-14 w-14 rounded-lg border border-border bg-muted flex flex-col items-center justify-center gap-0.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground">{att.name.split('.').pop()}</span>
                  </div>
                )}
                <button
                  onClick={() => { const a = pendingAttachments.find(x => x.id === att.id); if (a) URL.revokeObjectURL(a.url); setPendingAttachments(prev => prev.filter(x => x.id !== att.id)); }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                >×</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.csv" onChange={handleFileSelect} className="hidden" />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-10 w-10 shrink-0 text-muted-foreground" aria-label="Attach files">
            <Plus className="h-4 w-4" />
          </Button>
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
            aria-label={isListening ? "Stop listening" : "Toggle listening"}
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
