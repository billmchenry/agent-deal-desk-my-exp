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
import { GrowthAndDevelopmentRows } from "./GrowthAndDevelopmentRows";
import { MentorProgramWidget } from "./MentorProgramWidget";
import { DashboardToolbar } from "./DashboardToolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardWidget } from "@/types/dashboard";

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
  'disc-assessment': "I've removed the DISC Assessment card.",
  'nps-survey': "I've removed the NPS Survey card.",
  'ai-insight': "I've removed that insight. Want me to generate a new one?",
};

// Types that are grouped together as a single draggable unit
const GROUPED_MAIN_TYPES = new Set(["hero-banner", "stats-row"]);
const GROUP_ID_PREFIX = "group-capping-stats";

export function CustomizableDashboard() {
  const { widgets, isEditMode, removeWidget, reorderWidgets, setWidgetOrder } = useDashboard();
  const { openChat } = useMiraChat();
  const { config, setMentorMode } = useDemoConfig();

  const showMentorWidget = config.mentorMode === "needs_mentor" || config.mentorMode === "pairing_underway";

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

  const mainWidgets = widgets.filter((w) => w.column === "main");
  const sidebarWidgets = widgets.filter((w) => w.column === "sidebar");
  const hasPromoWidget = mainWidgets.some((w) => w.type === "promo-carousel");

  // Find grouped widgets
  const heroBanner = mainWidgets.find(w => w.type === "hero-banner");
  const statsRow = mainWidgets.find(w => w.type === "stats-row");
  const hasGroup = !!(heroBanner && statsRow);

  // Build sortable items list: group becomes one item
  type RenderItem = { kind: 'single'; widget: DashboardWidget } | { kind: 'group'; id: string };
  const mainSortableIds: string[] = [];
  const mainRenderItems: RenderItem[] = [];
  let groupInserted = false;

  mainWidgets.forEach((widget) => {
    if (hasGroup && GROUPED_MAIN_TYPES.has(widget.type)) {
      if (!groupInserted) {
        mainSortableIds.push(GROUP_ID_PREFIX);
        mainRenderItems.push({ kind: 'group', id: GROUP_ID_PREFIX });
        groupInserted = true;
      }
    } else {
      mainSortableIds.push(widget.id);
      mainRenderItems.push({ kind: 'single', widget });
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if this involves main sortable items with a group
    const activeInMain = mainSortableIds.includes(activeId);
    const overInMain = mainSortableIds.includes(overId);

    if (hasGroup && activeInMain && overInMain) {
      // Reorder the sortable IDs
      const newOrder = [...mainSortableIds];
      const fromIdx = newOrder.indexOf(activeId);
      const toIdx = newOrder.indexOf(overId);
      if (fromIdx === -1 || toIdx === -1) return;
      const [moved] = newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, moved);

      // Expand group back to individual widget IDs
      const expandedIds: string[] = [];
      newOrder.forEach(id => {
        if (id === GROUP_ID_PREFIX) {
          expandedIds.push(heroBanner!.id, statsRow!.id);
        } else {
          expandedIds.push(id);
        }
      });

      // Rebuild full widget array
      const widgetMap = new Map(widgets.map(w => [w.id, w]));
      const newWidgets = [
        ...expandedIds.map(id => widgetMap.get(id)!).filter(Boolean),
        ...sidebarWidgets,
      ];
      setWidgetOrder(newWidgets);
    } else {
      // Sidebar or non-grouped: use standard reorder
      reorderWidgets(activeId, overId);
    }
  };

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
              items={mainSortableIds}
              strategy={verticalListSortingStrategy}
            >
              {(() => {
                const elements: React.ReactNode[] = [];
                let mentorInserted = false;

                mainRenderItems.forEach((item) => {
                  if (item.kind === 'group') {
                    // Create a virtual widget for the DraggableWidget wrapper
                    const groupWidget: DashboardWidget = {
                      id: GROUP_ID_PREFIX,
                      type: 'hero-banner',
                      title: 'Capping & Stats',
                      size: 'large',
                      column: 'main',
                    };
                    elements.push(
                      <DraggableWidget
                        key={GROUP_ID_PREFIX}
                        widget={groupWidget}
                        isEditMode={isEditMode}
                        onRemove={() => {
                          removeWidget(heroBanner!.id);
                          removeWidget(statsRow!.id);
                        }}
                      >
                        <div className="space-y-4">
                          <WidgetRenderer widget={heroBanner!} />
                          <WidgetRenderer widget={statsRow!} />
                        </div>
                      </DraggableWidget>
                    );

                    if (showMentorWidget && !mentorInserted) {
                      elements.push(
                        <MentorProgramWidget
                          key="mentor-widget"
                          status={config.mentorMode as "needs_mentor" | "pairing_underway"}
                          onStatusChange={setMentorMode}
                        />
                      );
                      mentorInserted = true;
                    }
                  } else {
                    const widget = item.widget;
                    const isPromo = widget.type === "promo-carousel";
                    const widgetEl = (
                      <DraggableWidget
                        key={widget.id}
                        widget={widget}
                        isEditMode={isEditMode}
                        onRemove={removeWidget}
                      >
                        <WidgetRenderer widget={widget} />
                      </DraggableWidget>
                    );
                    elements.push(
                      isPromo ? (
                        <div key={widget.id + "-wrap"} className="hidden lg:block">{widgetEl}</div>
                      ) : widgetEl
                    );
                  }
                });

                if (showMentorWidget && !mentorInserted && !hasGroup) {
                  elements.unshift(
                    <MentorProgramWidget
                      key="mentor-widget"
                      status={config.mentorMode as "needs_mentor" | "pairing_underway"}
                      onStatusChange={setMentorMode}
                    />
                  );
                }

                return elements;
              })()}
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

      {/* Growth & Development rows – bottom of page on mobile */}
      {hasPromoWidget && (
        <div className="lg:hidden">
          <GrowthAndDevelopmentRows />
        </div>
      )}
    </div>
  );
}
