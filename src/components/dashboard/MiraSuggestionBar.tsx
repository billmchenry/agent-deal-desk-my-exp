import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { label: "How can I increase my GCI?", query: "How can I increase my gross commission income?" },
  { label: "Am I on track to cap?", query: "Am I on track to hit my cap this year?" },
  { label: "Analyze my volume trends", query: "Analyze my total volume trends" },
  { label: "Compare to last month", query: "Compare my performance to last month" },
];

export function MiraSuggestionBar() {
  const { openChatWithQuery } = useMiraChat();

  return (
    <div className="flex gap-3 mt-6 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
      {SUGGESTIONS.map((suggestion) => (
        <Button
          key={suggestion.label}
          variant="outline"
          onClick={() => openChatWithQuery(suggestion.query)}
          className={cn(
            "gap-2 px-4 py-2 h-auto rounded-lg text-sm shrink-0 whitespace-nowrap",
            "border-border/50 hover:border-primary/50 hover:bg-primary/5",
            "transition-colors"
          )}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          {suggestion.label}
        </Button>
      ))}
    </div>
  );
}
