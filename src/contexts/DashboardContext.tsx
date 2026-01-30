import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface DashboardWidget {
  id: string;
  type: 'forecast' | 'velocity' | 'pipeline';
  title: string;
  pinnedAt: Date;
}

interface DashboardContextType {
  widgets: DashboardWidget[];
  pinnedIds: Set<string>;
  addWidget: (widget: Omit<DashboardWidget, 'pinnedAt'>) => void;
  removeWidget: (id: string) => void;
  isWidgetPinned: (id: string) => boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const addWidget = useCallback((widget: Omit<DashboardWidget, 'pinnedAt'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      pinnedAt: new Date(),
    };
    setWidgets(prev => [newWidget, ...prev]);
    setPinnedIds(prev => new Set(prev).add(widget.id));
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    setPinnedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isWidgetPinned = useCallback((id: string) => {
    return pinnedIds.has(id);
  }, [pinnedIds]);

  return (
    <DashboardContext.Provider value={{ widgets, pinnedIds, addWidget, removeWidget, isWidgetPinned }}>
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
