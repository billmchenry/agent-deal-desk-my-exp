import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface UniversalFilterBarProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  /** Extra content rendered on the left side after the title */
  titleExtra?: ReactNode;
}

export function UniversalFilterBar({
  title,
  subtitle,
  children,
  className,
  titleExtra,
}: UniversalFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2",
        className
      )}
    >
      {/* Left: title */}
      {(title || titleExtra) && (
        <div className="flex items-center gap-3 shrink-0">
          {title && (
            <div>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground font-secondary">{subtitle}</p>
              )}
            </div>
          )}
          {titleExtra}
        </div>
      )}

      {/* Right: filter slots */}
      {children && (
        <div className="flex items-center gap-2 flex-wrap">{children}</div>
      )}
    </div>
  );
}
