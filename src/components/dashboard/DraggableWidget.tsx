import { ReactNode, useState, DragEvent } from "react";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLayout, LayoutWidget } from "@/contexts/LayoutContext";

interface DraggableWidgetProps {
  widget: LayoutWidget;
  children: ReactNode;
  index: number;
  zone: 'main' | 'sidebar';
}

export function DraggableWidget({ widget, children, index, zone }: DraggableWidgetProps) {
  const { removeWidget, reorderWidgets, draggedWidget, setDraggedWidget } = useLayout();
  const [isHovered, setIsHovered] = useState(false);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('widgetId', widget.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedWidget(widget.id);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setDropPosition(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDropPosition(e.clientY < midY ? 'before' : 'after');
  };

  const handleDragLeave = () => {
    setDropPosition(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('widgetId');
    
    if (draggedId && draggedId !== widget.id) {
      const targetPosition = dropPosition === 'before' ? index : index + 1;
      reorderWidgets(draggedId, targetPosition, zone);
    }
    
    setDropPosition(null);
    setDraggedWidget(null);
  };

  const isDragging = draggedWidget === widget.id;

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-50 scale-[0.98]",
        dropPosition === 'before' && "pt-4",
        dropPosition === 'after' && "pb-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator - before */}
      {dropPosition === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-full animate-pulse" />
      )}

      {/* Drag handle */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          "absolute left-2 top-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border cursor-grab active:cursor-grabbing transition-opacity duration-200",
          isHovered || isDragging ? "opacity-100" : "opacity-0"
        )}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-2 top-2 z-10 h-7 w-7 bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onClick={() => removeWidget(widget.id)}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Widget content */}
      <div className={cn(
        "transition-all duration-200 rounded-lg",
        isDragging && "ring-2 ring-primary ring-offset-2"
      )}>
        {children}
      </div>

      {/* Drop indicator - after */}
      {dropPosition === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
}

interface DropZoneProps {
  zone: 'main' | 'sidebar';
  isEmpty?: boolean;
}

export function DropZone({ zone, isEmpty = false }: DropZoneProps) {
  const { reorderWidgets, draggedWidget, widgets } = useLayout();
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('widgetId');
    
    if (draggedId) {
      const zoneWidgets = widgets.filter(w => w.zone === zone);
      reorderWidgets(draggedId, zoneWidgets.length, zone);
    }
    
    setIsOver(false);
  };

  if (!draggedWidget && !isEmpty) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center",
        isOver 
          ? "border-primary bg-primary/10 text-primary" 
          : "border-muted-foreground/30 text-muted-foreground",
        isEmpty && !draggedWidget && "py-12"
      )}
    >
      <p className="text-sm">
        {isEmpty ? "Drop widgets here or click 'Add Widget' to get started" : "Drop here"}
      </p>
    </div>
  );
}
