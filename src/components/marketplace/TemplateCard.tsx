import { DashboardTemplate, CATEGORY_STYLES } from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Download, TrendingUp, Users, Sparkles, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: DashboardTemplate;
  onInstall: (id: string) => void;
}

const categoryIcons = {
  production: TrendingUp,
  team: Users,
  growth: Sparkles,
  custom: LayoutGrid,
};

export function TemplateCard({ template, onInstall }: TemplateCardProps) {
  const categoryStyle = CATEGORY_STYLES[template.category];
  const CategoryIcon = categoryIcons[template.category];

  const initials = template.createdBy.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Badge className={cn(categoryStyle.bg, categoryStyle.text, "border-0 gap-1")}>
          <CategoryIcon className="h-3 w-3" />
          {categoryStyle.label}
        </Badge>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{template.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
        {template.description}
      </p>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={template.createdBy.avatar} alt={template.createdBy.name} />
            <AvatarFallback className="text-xs bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {template.createdBy.name}
            </span>
            {template.createdBy.badge === 'star' && (
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Download className="h-3 w-3" />
            {template.installCount}
          </span>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onInstall(template.id)}>
            Install
          </Button>
        </div>
      </div>
    </Card>
  );
}
