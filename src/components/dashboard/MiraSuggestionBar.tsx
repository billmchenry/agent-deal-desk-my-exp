import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { label: "GCI trends", query: "Show me my GCI trends" },
  { label: "Pipeline overview", query: "What's in my pipeline?" },
  { label: "Listing velocity", query: "How fast are my listings selling?" },
  { label: "Compare to last year", query: "Compare my performance to last year" },
];

export function MiraSuggestionBar() {
  const { openChatWithQuery } = useMiraChat();
  const [isDismissed, setIsDismissed] = useLocalStorage("mira-suggestions-dismissed", false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center gap-2 py-2 overflow-x-auto",
      "scrollbar-none -mx-1 px-1"
    )}>
      {/* Mira label with icon */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-primary-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
          Ask Mira:
        </span>
      </div>

      {/* Suggestion chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion.label}
            variant="outline"
            size="sm"
            onClick={() => openChatWithQuery(suggestion.query)}
            className={cn(
              "h-8 px-3 text-xs rounded-full whitespace-nowrap shrink-0",
              "border-border/50 hover:border-primary/50 hover:bg-primary/5",
              "transition-colors"
            )}
          >
            {suggestion.label}
          </Button>
        ))}
      </div>

      {/* Dismiss button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDismissed(true)}
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground ml-auto"
        title="Dismiss suggestions"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
