import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

export type WidgetType =
  | 'hero-banner'
  | 'action-center'
  | 'promotional-carousel'
  | 'news-training'
  | 'connect-upline'
  | 'forecast'
  | 'velocity'
  | 'pipeline';

export interface LayoutWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: number;
  zone: 'main' | 'sidebar';
  pinnedAt: string; // ISO string for serialization
  isDefault?: boolean;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  createdAt: string;
  widgets: Array<{
    type: WidgetType;
    position: number;
    zone: 'main' | 'sidebar';
  }>;
}

interface LayoutContextType {
  widgets: LayoutWidget[];
  templates: LayoutTemplate[];
  draggedWidget: string | null;
  addWidget: (type: WidgetType, zone?: 'main' | 'sidebar') => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (draggedId: string, targetPosition: number, targetZone: 'main' | 'sidebar') => void;
  moveWidgetToZone: (widgetId: string, targetZone: 'main' | 'sidebar') => void;
  setDraggedWidget: (id: string | null) => void;
  saveTemplate: (name: string) => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  resetToDefault: () => void;
  getWidgetsByZone: (zone: 'main' | 'sidebar') => LayoutWidget[];
  isWidgetOnDashboard: (type: WidgetType) => boolean;
}

const widgetTitles: Record<WidgetType, string> = {
  'hero-banner': 'Capping Progress',
  'action-center': 'Action Center',
  'promotional-carousel': 'Promotions',
  'news-training': 'News & Training',
  'connect-upline': 'Connect with Upline',
  'forecast': 'Revenue Forecast',
  'velocity': 'Listing Velocity',
  'pipeline': 'Active Pipeline',
};

const getDefaultWidgets = (): LayoutWidget[] => [
  { id: 'default-hero', type: 'hero-banner', title: 'Capping Progress', position: 0, zone: 'main', pinnedAt: new Date().toISOString(), isDefault: true },
  { id: 'default-action', type: 'action-center', title: 'Action Center', position: 1, zone: 'main', pinnedAt: new Date().toISOString(), isDefault: true },
  { id: 'default-carousel', type: 'promotional-carousel', title: 'Promotions', position: 2, zone: 'main', pinnedAt: new Date().toISOString(), isDefault: true },
  { id: 'default-news', type: 'news-training', title: 'News & Training', position: 0, zone: 'sidebar', pinnedAt: new Date().toISOString(), isDefault: true },
  { id: 'default-upline', type: 'connect-upline', title: 'Connect with Upline', position: 1, zone: 'sidebar', pinnedAt: new Date().toISOString(), isDefault: true },
];

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [storedWidgets, setStoredWidgets] = useLocalStorage<LayoutWidget[]>('dashboard-layout', getDefaultWidgets());
  const [storedTemplates, setStoredTemplates] = useLocalStorage<LayoutTemplate[]>('dashboard-templates', []);
  const [widgets, setWidgets] = useState<LayoutWidget[]>(storedWidgets);
  const [templates, setTemplates] = useState<LayoutTemplate[]>(storedTemplates);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  // Sync to localStorage when widgets change
  useEffect(() => {
    setStoredWidgets(widgets);
  }, [widgets, setStoredWidgets]);

  useEffect(() => {
    setStoredTemplates(templates);
  }, [templates, setStoredTemplates]);

  const addWidget = useCallback((type: WidgetType, zone: 'main' | 'sidebar' = 'main') => {
    const existingOfType = widgets.find(w => w.type === type);
    if (existingOfType) {
      toast.error(`${widgetTitles[type]} is already on your dashboard`);
      return;
    }

    const zoneWidgets = widgets.filter(w => w.zone === zone);
    const maxPosition = zoneWidgets.length > 0 ? Math.max(...zoneWidgets.map(w => w.position)) : -1;

    const newWidget: LayoutWidget = {
      id: `widget-${type}-${Date.now()}`,
      type,
      title: widgetTitles[type],
      position: maxPosition + 1,
      zone,
      pinnedAt: new Date().toISOString(),
    };

    setWidgets(prev => [...prev, newWidget]);
    toast.success(`${widgetTitles[type]} added to dashboard`);
  }, [widgets]);

  const removeWidget = useCallback((id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;

    setWidgets(prev => {
      const filtered = prev.filter(w => w.id !== id);
      // Recalculate positions for the zone
      const zoneWidgets = filtered.filter(w => w.zone === widget.zone);
      const reordered = zoneWidgets.map((w, idx) => ({ ...w, position: idx }));
      const otherWidgets = filtered.filter(w => w.zone !== widget.zone);
      return [...otherWidgets, ...reordered];
    });

    toast.success(`${widget.title} removed`, {
      action: {
        label: 'Undo',
        onClick: () => setWidgets(prev => [...prev, widget]),
      },
    });
  }, [widgets]);

  const reorderWidgets = useCallback((draggedId: string, targetPosition: number, targetZone: 'main' | 'sidebar') => {
    setWidgets(prev => {
      const dragged = prev.find(w => w.id === draggedId);
      if (!dragged) return prev;

      const otherWidgets = prev.filter(w => w.id !== draggedId);
      const targetZoneWidgets = otherWidgets
        .filter(w => w.zone === targetZone)
        .sort((a, b) => a.position - b.position);

      // Insert at target position
      targetZoneWidgets.splice(targetPosition, 0, { ...dragged, zone: targetZone });

      // Recalculate positions
      const reorderedTarget = targetZoneWidgets.map((w, idx) => ({ ...w, position: idx }));
      
      // Handle other zone
      const otherZone = targetZone === 'main' ? 'sidebar' : 'main';
      const otherZoneWidgets = otherWidgets
        .filter(w => w.zone === otherZone)
        .sort((a, b) => a.position - b.position)
        .map((w, idx) => ({ ...w, position: idx }));

      return [...reorderedTarget, ...otherZoneWidgets];
    });
  }, []);

  const moveWidgetToZone = useCallback((widgetId: string, targetZone: 'main' | 'sidebar') => {
    setWidgets(prev => {
      const widget = prev.find(w => w.id === widgetId);
      if (!widget || widget.zone === targetZone) return prev;

      const zoneWidgets = prev.filter(w => w.zone === targetZone);
      const maxPosition = zoneWidgets.length > 0 ? Math.max(...zoneWidgets.map(w => w.position)) : -1;

      return prev.map(w => 
        w.id === widgetId 
          ? { ...w, zone: targetZone, position: maxPosition + 1 }
          : w
      );
    });
  }, []);

  const saveTemplate = useCallback((name: string) => {
    const template: LayoutTemplate = {
      id: `template-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      widgets: widgets.map(w => ({
        type: w.type,
        position: w.position,
        zone: w.zone,
      })),
    };

    setTemplates(prev => [...prev, template]);
    toast.success(`Template "${name}" saved`);
  }, [widgets]);

  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const loadedWidgets: LayoutWidget[] = template.widgets.map((tw, idx) => ({
      id: `widget-${tw.type}-${Date.now()}-${idx}`,
      type: tw.type,
      title: widgetTitles[tw.type],
      position: tw.position,
      zone: tw.zone,
      pinnedAt: new Date().toISOString(),
    }));

    setWidgets(loadedWidgets);
    toast.success(`Template "${template.name}" loaded`);
  }, [templates]);

  const deleteTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (template) {
      toast.success(`Template "${template.name}" deleted`);
    }
  }, [templates]);

  const resetToDefault = useCallback(() => {
    setWidgets(getDefaultWidgets());
    toast.success('Layout reset to default');
  }, []);

  const getWidgetsByZone = useCallback((zone: 'main' | 'sidebar') => {
    return widgets
      .filter(w => w.zone === zone)
      .sort((a, b) => a.position - b.position);
  }, [widgets]);

  const isWidgetOnDashboard = useCallback((type: WidgetType) => {
    return widgets.some(w => w.type === type);
  }, [widgets]);

  return (
    <LayoutContext.Provider value={{
      widgets,
      templates,
      draggedWidget,
      addWidget,
      removeWidget,
      reorderWidgets,
      moveWidgetToZone,
      setDraggedWidget,
      saveTemplate,
      loadTemplate,
      deleteTemplate,
      resetToDefault,
      getWidgetsByZone,
      isWidgetOnDashboard,
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
