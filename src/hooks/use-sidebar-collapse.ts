import { useLocalStorage } from './use-local-storage';
import { useCallback } from 'react';

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebarCollapsed', false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  return { isCollapsed, toggleCollapse };
}
