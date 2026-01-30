import { Sparkles } from "lucide-react";

interface AIInsightWidgetProps {
  content: string;
  compact?: boolean;
}

export function AIInsightWidget({ content, compact }: AIInsightWidgetProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-4 w-4" />
        <span className="text-xs font-medium">Mira AI Insight</span>
      </div>
      <p className={`text-foreground leading-relaxed ${compact ? "text-sm" : "text-base"}`}>
        {content}
      </p>
    </div>
  );
}
