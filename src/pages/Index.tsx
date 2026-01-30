import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { DraggableWidget, DropZone } from "@/components/dashboard/DraggableWidget";
import { WidgetRenderer } from "@/components/dashboard/WidgetRenderer";
import { WidgetGallery } from "@/components/dashboard/WidgetGallery";
import { TemplateManager } from "@/components/dashboard/TemplateManager";
import { useLayout } from "@/contexts/LayoutContext";

const Index = () => {
  const { getWidgetsByZone, widgets } = useLayout();

  const mainWidgets = getWidgetsByZone('main');
  const sidebarWidgets = getWidgetsByZone('sidebar');

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome to eXp!</h1>
        <p className="text-muted-foreground">Hi Clifford!</p>
      </div>

      {/* Layout Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Your Dashboard</h2>
        <div className="flex gap-2">
          <WidgetGallery />
          <TemplateManager />
        </div>
      </div>

      {/* Stats Row - Fixed */}
      <div className="mb-6">
        <StatsRow />
      </div>

      {/* Dynamic Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Zone (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {mainWidgets.length === 0 ? (
            <DropZone zone="main" isEmpty />
          ) : (
            <>
              {mainWidgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  index={index}
                  zone="main"
                >
                  <WidgetRenderer widget={widget} />
                </DraggableWidget>
              ))}
              <DropZone zone="main" />
            </>
          )}
        </div>

        {/* Sidebar Zone (1 col) */}
        <div className="space-y-6">
          {sidebarWidgets.length === 0 ? (
            <DropZone zone="sidebar" isEmpty />
          ) : (
            <>
              {sidebarWidgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  index={index}
                  zone="sidebar"
                >
                  <WidgetRenderer widget={widget} />
                </DraggableWidget>
              ))}
              <DropZone zone="sidebar" />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
