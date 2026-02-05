import { TemplateCategory, TemplateVisibility, CATEGORY_STYLES } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, Globe, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateStepReviewProps {
  name: string;
  description: string;
  category: TemplateCategory;
  visibility: TemplateVisibility;
  selectedCount: number;
}

const visibilityLabels: Record<TemplateVisibility, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  private: { label: 'Private', icon: Lock },
  team: { label: 'Team', icon: Users },
  public: { label: 'Public', icon: Globe },
};

export function TemplateStepReview({
  name,
  description,
  category,
  visibility,
  selectedCount,
}: TemplateStepReviewProps) {
  const categoryStyle = CATEGORY_STYLES[category];
  const visibilityInfo = visibilityLabels[visibility];
  const VisibilityIcon = visibilityInfo.icon;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Review & Create</h3>
        <p className="text-sm text-muted-foreground">
          Confirm your template details
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
          <p className="font-medium">{name || 'Untitled Template'}</p>
        </div>

        {description && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Description</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
            <Badge className={cn(categoryStyle.bg, categoryStyle.text, "border-0")}>
              {categoryStyle.label}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Visibility</p>
            <div className="flex items-center gap-1.5 text-sm">
              <VisibilityIcon className="h-4 w-4 text-muted-foreground" />
              <span>{visibilityInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Insights</p>
          <div className="flex items-center gap-1.5 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{selectedCount} selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
