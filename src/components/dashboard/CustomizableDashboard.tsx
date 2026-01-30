import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDashboard } from "@/contexts/DashboardContext";
import { DraggableWidget } from "./DraggableWidget";
import { WidgetRenderer } from "./WidgetRenderer";
import { DashboardToolbar } from "./DashboardToolbar";
import { cn } from "@/lib/utils";

export function CustomizableDashboard() {
  const { widgets, isEditMode, removeWidget, reorderWidgets } = useDashboard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderWidgets(active.id as string, over.id as string);
    }
  };

  const mainWidgets = widgets.filter((w) => w.column === "main");
  const sidebarWidgets = widgets.filter((w) => w.column === "sidebar");

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <DashboardToolbar />
        {isEditMode && (
          <p className="text-sm text-muted-foreground">
            Drag widgets to reorder • Hover to delete
          </p>
        )}
      </div>

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <SortableContext
              items={mainWidgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              {mainWidgets.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  isEditMode={isEditMode}
                  onRemove={removeWidget}
                >
                  <WidgetRenderer widget={widget} />
                </DraggableWidget>
              ))}
            </SortableContext>

            {mainWidgets.length === 0 && (
              <div className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center",
                "border-muted-foreground/25 text-muted-foreground"
              )}>
                <p className="text-lg font-medium">No widgets in main area</p>
                <p className="text-sm">Click "Add Widget" to add content</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SortableContext
              items={sidebarWidgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              {sidebarWidgets.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  isEditMode={isEditMode}
                  onRemove={removeWidget}
                >
                  <WidgetRenderer widget={widget} />
                </DraggableWidget>
              ))}
            </SortableContext>

            {sidebarWidgets.length === 0 && isEditMode && (
              <div className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center",
                "border-muted-foreground/25 text-muted-foreground"
              )}>
                <p className="text-sm">Sidebar area empty</p>
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
