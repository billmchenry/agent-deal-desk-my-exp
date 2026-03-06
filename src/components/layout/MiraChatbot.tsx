import { useState } from "react";
import { Sparkles, Mic, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MiraChatbot() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 start-1/2 transform -translate-x-1/2 rtl:translate-x-1/2 lg:start-[calc(50%+8rem)] z-50 w-[calc(100%-2rem)] max-w-2xl">
      <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 shadow-lg">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <Input
          type="text"
          placeholder="Ask Mira about your insights and trends..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
