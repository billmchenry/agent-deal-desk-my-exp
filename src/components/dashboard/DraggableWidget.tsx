import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardWidget } from "@/types/dashboard";

interface DraggableWidgetProps {
  widget: DashboardWidget;
  isEditMode: boolean;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

export function DraggableWidget({ widget, isEditMode, onRemove, children }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 opacity-90",
        isEditMode && "ring-2 ring-dashed ring-primary/30 rounded-lg"
      )}
    >
      {isEditMode && (
        <>
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-6 flex items-center justify-center bg-primary text-primary-foreground rounded-l-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 z-10 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(widget.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </>
      )}
      
      <div className={cn(isEditMode && "pointer-events-none")}>
        {children}
      </div>
    </div>
  );
}
