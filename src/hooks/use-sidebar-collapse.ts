import { useLocalStorage } from './use-local-storage';
import { useCallback, useEffect, useRef } from 'react';

const XL_BREAKPOINT = 1280;

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebarCollapsed', false);
  const manualOverride = useRef(false);

  const toggleCollapse = useCallback(() => {
    manualOverride.current = true;
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  // Auto-collapse below xl, auto-expand at xl+ (unless manually overridden)
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${XL_BREAKPOINT}px)`);

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (manualOverride.current) return;
      setIsCollapsed(!('matches' in e ? e.matches : (e as MediaQueryList).matches));
    };

    // Set initial state based on viewport
    if (!manualOverride.current) {
      setIsCollapsed(!mql.matches);
    }

    mql.addEventListener('change', onChange as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener('change', onChange as (e: MediaQueryListEvent) => void);
  }, [setIsCollapsed]);

  return { isCollapsed, toggleCollapse };
}
