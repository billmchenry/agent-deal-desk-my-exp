import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { DashboardWidget, DashboardTemplate, DEFAULT_LAYOUT, WIDGET_REGISTRY, WidgetType } from "@/types/dashboard";

interface DashboardContextType {
  // Widget state
  widgets: DashboardWidget[];
  isEditMode: boolean;
  
  // Widget actions
  addWidget: (type: WidgetType, customTitle?: string, content?: string) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (activeId: string, overId: string) => void;
  isWidgetPinned: (type: WidgetType) => boolean;
  
  // Edit mode
  toggleEditMode: () => void;
  
  // Templates
  templates: DashboardTemplate[];
  activeTemplateId: string | null;
  saveAsTemplate: (name: string) => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  resetToDefault: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_LAYOUT);
  const [isEditMode, setIsEditMode] = useState(false);
  const [templates, setTemplates] = useState<DashboardTemplate[]>([
    {
      id: 'default',
      name: 'Default Layout',
      widgets: DEFAULT_LAYOUT,
      createdAt: new Date(),
      isDefault: true,
    },
  ]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>('default');

  const addWidget = useCallback((type: WidgetType, customTitle?: string, content?: string) => {
    const registry = WIDGET_REGISTRY[type];
    const newWidget: DashboardWidget = {
      id: `${type}-${Date.now()}`,
      type,
      title: customTitle || registry.title,
      size: registry.defaultSize,
      column: registry.defaultColumn,
      content,
    };
    setWidgets(prev => [newWidget, ...prev]);
    setActiveTemplateId(null); // Mark as modified
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    setActiveTemplateId(null);
  }, []);

  const reorderWidgets = useCallback((activeId: string, overId: string) => {
    setWidgets(prev => {
      const oldIndex = prev.findIndex(w => w.id === activeId);
      const newIndex = prev.findIndex(w => w.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newWidgets = [...prev];
      const [removed] = newWidgets.splice(oldIndex, 1);
      newWidgets.splice(newIndex, 0, removed);
      
      return newWidgets;
    });
    setActiveTemplateId(null);
  }, []);

  const isWidgetPinned = useCallback((type: WidgetType) => {
    return widgets.some(w => w.type === type);
  }, [widgets]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const saveAsTemplate = useCallback((name: string) => {
    const newTemplate: DashboardTemplate = {
      id: `template-${Date.now()}`,
      name,
      widgets: [...widgets],
      createdAt: new Date(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newTemplate.id);
  }, [widgets]);

  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setWidgets([...template.widgets]);
      setActiveTemplateId(templateId);
    }
  }, [templates]);

  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId || t.isDefault));
  }, []);

  const resetToDefault = useCallback(() => {
    setWidgets([...DEFAULT_LAYOUT]);
    setActiveTemplateId('default');
  }, []);

  const value = useMemo(() => ({
    widgets,
    isEditMode,
    addWidget,
    removeWidget,
    reorderWidgets,
    isWidgetPinned,
    toggleEditMode,
    templates,
    activeTemplateId,
    saveAsTemplate,
    loadTemplate,
    deleteTemplate,
    resetToDefault,
  }), [
    widgets,
    isEditMode,
    addWidget,
    removeWidget,
    reorderWidgets,
    isWidgetPinned,
    toggleEditMode,
    templates,
    activeTemplateId,
    saveAsTemplate,
    loadTemplate,
    deleteTemplate,
    resetToDefault,
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
