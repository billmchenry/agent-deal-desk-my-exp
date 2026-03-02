import { useLocalStorage } from './use-local-storage';
import { useCallback, useEffect, useRef } from 'react';

const XL_BREAKPOINT = 1280;

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebarCollapsed', false);
  const manualOverride = useRef(false);

  const toggleCollapse = useCallback(() => {
    manualOverride.current = true;
    setIsCollapsed((prev: boolean) => !prev);
  }, [setIsCollapsed]);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${XL_BREAKPOINT}px)`);

    const onChange = () => {
      manualOverride.current = false;
      setIsCollapsed(!mql.matches);
    };

    if (!manualOverride.current) {
      setIsCollapsed(!mql.matches);
    }

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [setIsCollapsed]);

  return { isCollapsed, toggleCollapse };
}
