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
import { Sparkles } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { useDemoConfig } from "@/contexts/DemoConfigContext";
import { DraggableWidget } from "./DraggableWidget";
import { WidgetRenderer } from "./WidgetRenderer";
import { MentorProgramWidget } from "./MentorProgramWidget";
import { DashboardToolbar } from "./DashboardToolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Widget-specific removal messages
const WIDGET_REMOVAL_MESSAGES: Record<string, string> = {
  'forecast': "I've removed that forecast. Let me know if you need a different view!",
  'velocity': "I've removed the Listing Velocity widget. Want to try a different metric instead?",
  'pipeline': "I've removed your Pipeline widget. Need a different way to track your deals?",
  'hero-banner': "I've removed Capping Progress. Want me to add a different goal tracker?",
  'stats-row': "I've removed Key Stats. Let me know if you want specific metrics instead!",
  'action-center': "I've removed Action Center. Want me to suggest other widgets?",
  'promo-carousel': "I've removed Promotions. Looking for something more specific?",
  'news-training': "I've removed News & Training. Want a more focused feed instead?",
  'connect-upline': "I've removed Connect Upline. Need a different way to stay connected?",
  'ai-insight': "I've removed that insight. Want me to generate a new one?",
};

export function CustomizableDashboard() {
  const { widgets, isEditMode, removeWidget, reorderWidgets } = useDashboard();
  const { openChat } = useMiraChat();

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
    <div className="space-y-4 min-w-0 max-w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <DashboardToolbar />
      </div>
      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-6 lg:grid-cols-3 min-w-0 max-w-full">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 min-w-0 max-w-full">
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
                <p className="text-sm mb-4">Add pre-built widgets or ask Mira for personalized insights</p>
                <Button
                  variant="outline"
                  onClick={openChat}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Chat with Mira
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 min-w-0 max-w-full">
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
