import { Check, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Generic confidence level helper
export function getConfidenceLevelGeneric(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 85) return 'high';
  if (confidence >= 70) return 'medium';
  return 'low';
}

// Read-only field display component with optional edit mode
export function ReviewField({
  label,
  value,
  editing,
  type = 'text',
  options,
  onChange,
  confidence,
  placeholder = '—',
  confidenceThreshold = 85,
}: {
  label: string;
  value: string | number | undefined;
  editing: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'select' | 'percentage';
  options?: { value: string; label: string }[];
  onChange: (value: any) => void;
  confidence?: number;
  placeholder?: string;
  confidenceThreshold?: number;
}) {
  const confidenceLevel = confidence ? getConfidenceLevelGeneric(confidence) : 'high';
  const needsReview = confidenceLevel !== 'high';

  const formatDisplayValue = () => {
    if (value === undefined || value === null || value === '') return placeholder;
    
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    if (type === 'date' && value) {
      return new Date(value as string).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (type === 'select' && options) {
      const option = options.find(o => o.value === value);
      return option?.label || String(value);
    }
    return String(value);
  };

  if (!editing) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn(
          "text-sm font-medium text-foreground",
          needsReview && "text-warning"
        )}>
          {formatDisplayValue()}
        </p>
      </div>
    );
  }

  // Edit mode
  if (type === 'select' && options) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Select value={String(value || '')} onValueChange={onChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Input
        type={type === 'currency' || type === 'number' || type === 'percentage' ? 'number' : type}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(type === 'number' || type === 'currency' || type === 'percentage' ? Number(val) : val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-8 text-sm"
        step={type === 'percentage' ? '0.1' : undefined}
      />
    </div>
  );
}

// Section card component with Edit/Done toggle
export function SectionCard({
  title,
  badge,
  badgeVariant = 'default',
  editing,
  onEdit,
  onSave,
  children,
  isMobile = false,
}: {
  title: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary';
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  children: React.ReactNode;
  isMobile?: boolean;
}) {
  const badgeClasses = badgeVariant === 'secondary' 
    ? 'bg-muted text-muted-foreground' 
    : 'bg-primary/10 text-primary';

  if (isMobile) {
    return (
      <div className="border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              {badge && (
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", badgeClasses)}>
                  {badge}
                </span>
              )}
            </div>
            {editing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-8 px-3 text-xs text-primary hover:text-primary"
              >
                <Check className="w-3 h-3 mr-1" />
                Done
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 px-3 text-xs text-primary hover:text-primary"
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="pb-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {badge && (
              <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", badgeClasses)}>
                {badge}
              </span>
            )}
          </div>
          {editing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="h-7 px-2 text-xs text-primary hover:text-primary"
            >
              <Check className="w-3 h-3 mr-1" />
              Done
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-7 px-2 text-xs text-primary hover:text-primary"
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// Mobile section navigation pills
export function MobileSectionNav({
  sections,
  activeSection,
  onSelect,
}: {
  sections: { id: string; label: string }[];
  activeSection: string;
  onSelect: (section: string) => void;
}) {
  return (
    <div className="flex justify-start gap-2 p-3 border-b border-border bg-background sticky top-0 z-10 overflow-x-auto">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            activeSection === id 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// Auto-filled field box with green/blue styling
export function AutoFilledField({
  label,
  value,
  source,
  editing,
  onEdit,
  type = 'text',
  isFilled,
}: {
  label: string;
  value: string | number | undefined;
  source?: string;
  editing: boolean;
  onEdit: (value: any) => void;
  type?: 'text' | 'number';
  isFilled: boolean;
}) {
  return (
    <div className={cn(
      "rounded-lg border-2 p-3",
      isFilled
        ? "border-green-100 bg-green-50/30 dark:border-green-900/50 dark:bg-green-950/20"
        : editing
          ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
          : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
    )}>
      <div className="flex items-center gap-2 mb-2">
        {isFilled ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <p className="text-xs font-medium text-green-700 dark:text-green-300">
              {label}{source ? ` (${source})` : ''}
            </p>
          </>
        ) : (
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300">{label}</p>
        )}
      </div>
      {editing ? (
        <Input
          type={type}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value || ''}
          onChange={(e) => onEdit(type === 'number' ? Number(e.target.value) : e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="h-8 text-sm bg-white dark:bg-background"
        />
      ) : (
        <p className="text-sm font-medium text-foreground">
          {value || <span className="text-muted-foreground italic">Not provided</span>}
        </p>
      )}
    </div>
  );
}
