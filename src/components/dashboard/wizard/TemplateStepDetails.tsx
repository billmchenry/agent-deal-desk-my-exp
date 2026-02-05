import { TemplateCategory, CATEGORY_STYLES } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TrendingUp, Users, Sparkles, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateStepDetailsProps {
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCategoryChange: (category: TemplateCategory) => void;
  onTagsChange: (tags: string) => void;
}

const categoryOptions: { value: TemplateCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'production', label: 'Production', icon: TrendingUp },
  { value: 'team', label: 'Team', icon: Users },
  { value: 'growth', label: 'Growth', icon: Sparkles },
  { value: 'custom', label: 'Custom', icon: LayoutGrid },
];

export function TemplateStepDetails({
  name,
  description,
  category,
  tags,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
  onTagsChange,
}: TemplateStepDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Template Details</h3>
        <p className="text-sm text-muted-foreground">
          Customize your template
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            placeholder="My Production Dashboard"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            placeholder="Describe what this template is for..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <div className="grid grid-cols-2 gap-2">
            {categoryOptions.map((option) => {
              const styles = CATEGORY_STYLES[option.value];
              const Icon = option.icon;
              const isSelected = category === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => onCategoryChange(option.value)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div className={cn("p-1.5 rounded", styles.bg)}>
                    <Icon className={cn("h-4 w-4", styles.text)} />
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-tags">Tags (Optional)</Label>
          <Input
            id="template-tags"
            placeholder="production, metrics, team"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Separate tags with commas
          </p>
        </div>
      </div>
    </div>
  );
}
