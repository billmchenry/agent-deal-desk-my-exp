import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect, useRef } from "react";
import { DashboardWidget, DashboardTemplate, DEFAULT_LAYOUT, WIDGET_REGISTRY, WidgetType } from "@/types/dashboard";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface StoredWidgets {
  widgets: DashboardWidget[];
  lastUpdated: string;
}

interface StoredTemplates {
  templates: DashboardTemplate[];
  activeTemplateId: string | null;
}

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

  // Data refresh
  lastSynced: Date;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
}

// Context for dashboard state management
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'default',
    name: 'Default Layout',
    widgets: DEFAULT_LAYOUT,
    createdAt: new Date(),
    isDefault: true,
  },
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  // localStorage persistence
  const [storedWidgets, setStoredWidgets] = useLocalStorage<StoredWidgets | null>(
    'dashboard-widgets',
    null
  );
  const [storedTemplates, setStoredTemplates] = useLocalStorage<StoredTemplates | null>(
    'dashboard-templates',
    null
  );

  // Initialize state from localStorage or defaults
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => 
    storedWidgets?.widgets ?? DEFAULT_LAYOUT
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [templates, setTemplates] = useState<DashboardTemplate[]>(() => 
    storedTemplates?.templates ?? DEFAULT_TEMPLATES
  );
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(() => 
    storedTemplates?.activeTemplateId ?? 'default'
  );

  // Data refresh state
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persist widgets to localStorage whenever they change (skip initial mount)
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setStoredWidgets({
      widgets,
      lastUpdated: new Date().toISOString(),
    });
  }, [widgets, setStoredWidgets]);

  // Persist templates to localStorage whenever they change
  useEffect(() => {
    setStoredTemplates({
      templates,
      activeTemplateId,
    });
  }, [templates, activeTemplateId, setStoredTemplates]);

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

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate data refresh (in real app, this would fetch from API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSynced(new Date());
    setIsRefreshing(false);
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
    lastSynced,
    isRefreshing,
    refreshData,
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
    lastSynced,
    isRefreshing,
    refreshData,
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
