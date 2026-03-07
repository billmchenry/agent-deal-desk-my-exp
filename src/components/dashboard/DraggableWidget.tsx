import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardWidget } from "@/types/dashboard";
import { useMiraChat } from "@/contexts/MiraChatContext";

interface DraggableWidgetProps {
  widget: DashboardWidget;
  isEditMode: boolean;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

export function DraggableWidget({ widget, isEditMode, onRemove, children }: DraggableWidgetProps) {
  const { focusWidgetId } = useMiraChat();
  const isFocused = focusWidgetId === widget.id;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isEditMode) {
    return (
      <div 
        id={`widget-${widget.id}`}
        data-widget-type={widget.type}
        className={cn(
          "transition-all duration-500",
          isFocused && "ring-2 ring-primary ring-offset-2 rounded-lg animate-pulse"
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 opacity-80 scale-[1.02]",
        "ring-2 ring-dashed ring-primary/30 rounded-lg p-1"
      )}
    >
      {/* Drag Handle - Always visible in edit mode */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3 top-4 z-10 h-10 w-6 flex items-center justify-center bg-primary text-primary-foreground rounded-l-md cursor-grab active:cursor-grabbing shadow-md hover:bg-primary/90 transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Delete Button - Always visible in edit mode */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute -right-2 -top-2 z-10 h-6 w-6 rounded-full shadow-md"
        onClick={() => onRemove(widget.id)}
        aria-label="Remove widget"
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
}
