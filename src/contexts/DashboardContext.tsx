import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect, useRef } from "react";
import { DashboardWidget, DEFAULT_LAYOUT, WIDGET_REGISTRY, WidgetType } from "@/types/dashboard";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
}

// Context for dashboard state management
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // localStorage persistence
  const [storedWidgets, setStoredWidgets] = useLocalStorage<StoredWidgets | null>(
    'dashboard-widgets',
    null
  );

  // Initialize state from localStorage or defaults
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => 
    storedWidgets?.widgets ?? DEFAULT_LAYOUT
  );
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
