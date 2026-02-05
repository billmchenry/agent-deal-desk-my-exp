import { TemplateVisibility } from "@/types/dashboard";
import { Lock, Users, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateStepVisibilityProps {
  visibility: TemplateVisibility;
  onVisibilityChange: (visibility: TemplateVisibility) => void;
}

const visibilityOptions: { value: TemplateVisibility; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see this template',
    icon: Lock,
  },
  {
    value: 'team',
    label: 'Team',
    description: 'Share with your team members',
    icon: Users,
  },
  {
    value: 'public',
    label: 'Public',
    description: 'List on the marketplace',
    icon: Globe,
  },
];

export function TemplateStepVisibility({
  visibility,
  onVisibilityChange,
}: TemplateStepVisibilityProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Visibility</h3>
        <p className="text-sm text-muted-foreground">
          Choose who can see your template
        </p>
      </div>

      <div className="space-y-2">
        {visibilityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = visibility === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onVisibilityChange(option.value)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg border transition-colors text-left",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected
                    ? "border-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </div>

              <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary/10" : "bg-muted")}>
                <Icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
              </div>

              <div className="flex-1">
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
