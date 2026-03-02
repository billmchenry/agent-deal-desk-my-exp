import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sidebarCollapsed';
const SIDEBAR_CHANGE_EVENT = 'sidebar-collapse-change';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Boolean(JSON.parse(raw)) : false;
  } catch {
    return false;
  }
}

function persistCollapsed(value: boolean) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
}

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => readCollapsed());

  useEffect(() => {
    const syncState = () => {
      setIsCollapsed(readCollapsed());
    };

    window.addEventListener('storage', syncState);
    window.addEventListener(SIDEBAR_CHANGE_EVENT, syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener(SIDEBAR_CHANGE_EVENT, syncState);
    };
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      persistCollapsed(next);
      return next;
    });
  }, []);

  return { isCollapsed, toggleCollapse };
}
