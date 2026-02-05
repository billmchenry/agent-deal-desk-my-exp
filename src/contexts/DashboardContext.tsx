import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect, useRef } from "react";
import { DashboardWidget, DashboardTemplate, DEFAULT_LAYOUT, WIDGET_REGISTRY, WidgetType, TemplateCategory, TemplateVisibility } from "@/types/dashboard";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { currentUser } from "@/data/mockData";

interface StoredWidgets {
  widgets: DashboardWidget[];
  lastUpdated: string;
}

interface DashboardContextType {
  // Widget state
  widgets: DashboardWidget[];
  isEditMode: boolean;
  
  // Widget actions
  addWidget: (type: WidgetType, customTitle?: string, content?: string) => string;
  removeWidget: (id: string) => DashboardWidget | undefined;
  reorderWidgets: (activeId: string, overId: string) => void;
  isWidgetPinned: (type: WidgetType) => boolean;
  getWidgetById: (id: string) => DashboardWidget | undefined;
  
  // Edit mode
  toggleEditMode: () => void;
  
  // Reset
  resetToDefault: () => void;

  // Data refresh
  lastSynced: Date;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;

  // Template state and actions
  templates: DashboardTemplate[];
  createTemplate: (data: {
    name: string;
    description: string;
    category: TemplateCategory;
    tags: string[];
    visibility: TemplateVisibility;
    widgets: DashboardWidget[];
  }) => string;
  deleteTemplate: (id: string) => void;
  applyTemplate: (id: string) => void;
  updateTemplate: (id: string, updates: Partial<DashboardTemplate>) => void;
}

// Context for dashboard state management
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // localStorage persistence for widgets
  const [storedWidgets, setStoredWidgets] = useLocalStorage<StoredWidgets | null>(
    'dashboard-widgets',
    null
  );

  // localStorage persistence for templates
  const [storedTemplates, setStoredTemplates] = useLocalStorage<DashboardTemplate[]>(
    'dashboard-templates',
    []
  );

  // Initialize state from localStorage or defaults (with safety check for corrupted data)
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    const stored = storedWidgets?.widgets;
    return Array.isArray(stored) ? stored : DEFAULT_LAYOUT;
  });
  const [templates, setTemplates] = useState<DashboardTemplate[]>(() => storedTemplates);
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Persist templates to localStorage
  const isTemplateInitialMount = useRef(true);

  useEffect(() => {
    if (isTemplateInitialMount.current) {
      isTemplateInitialMount.current = false;
      return;
    }
    setStoredTemplates(templates);
  }, [templates, setStoredTemplates]);

  const addWidget = useCallback((type: WidgetType, customTitle?: string, content?: string): string => {
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
    return newWidget.id;
  }, []);

  const removeWidget = useCallback((id: string): DashboardWidget | undefined => {
    let removedWidget: DashboardWidget | undefined;
    setWidgets(prev => {
      removedWidget = prev.find(w => w.id === id);
      return prev.filter(w => w.id !== id);
    });
    return removedWidget;
  }, []);

  const getWidgetById = useCallback((id: string): DashboardWidget | undefined => {
    return widgets.find(w => w.id === id);
  }, [widgets]);

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
  }, []);

  const isWidgetPinned = useCallback((type: WidgetType) => {
    return widgets.some(w => w.type === type);
  }, [widgets]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const resetToDefault = useCallback(() => {
    setWidgets([...DEFAULT_LAYOUT]);
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate data refresh (in real app, this would fetch from API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSynced(new Date());
    setIsRefreshing(false);
  }, []);

  // Template actions
  const createTemplate = useCallback((data: {
    name: string;
    description: string;
    category: TemplateCategory;
    tags: string[];
    visibility: TemplateVisibility;
    widgets: DashboardWidget[];
  }): string => {
    const now = new Date().toISOString();
    const newTemplate: DashboardTemplate = {
      id: `template-${Date.now()}`,
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags,
      visibility: data.visibility,
      widgets: data.widgets,
      createdAt: now,
      updatedAt: now,
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      rating: 0,
      installCount: 0,
      isOwned: true,
    };
    setTemplates(prev => [newTemplate, ...prev]);
    return newTemplate.id;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  const applyTemplate = useCallback((id: string) => {
    const allTemplates = [...templates];
    const template = allTemplates.find(t => t.id === id);
    if (template) {
      // Create new widget instances with new IDs to avoid conflicts
      const newWidgets = template.widgets.map(w => ({
        ...w,
        id: `${w.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      setWidgets(newWidgets);
    }
  }, [templates]);

  const updateTemplate = useCallback((id: string, updates: Partial<DashboardTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === id 
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    ));
  }, []);

  const value = useMemo(() => ({
    widgets,
    isEditMode,
    addWidget,
    removeWidget,
    reorderWidgets,
    isWidgetPinned,
    getWidgetById,
    toggleEditMode,
    resetToDefault,
    lastSynced,
    isRefreshing,
    refreshData,
    templates,
    createTemplate,
    deleteTemplate,
    applyTemplate,
    updateTemplate,
  }), [
    widgets,
    isEditMode,
    addWidget,
    removeWidget,
    reorderWidgets,
    isWidgetPinned,
    getWidgetById,
    toggleEditMode,
    resetToDefault,
    lastSynced,
    isRefreshing,
    refreshData,
    templates,
    createTemplate,
    deleteTemplate,
    applyTemplate,
    updateTemplate,
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
