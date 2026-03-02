import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'sidebarCollapsed';

type Listener = () => void;
const listeners = new Set<Listener>();

function readFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Boolean(JSON.parse(raw)) : false;
  } catch {
    return false;
  }
}

let collapsedState = readFromStorage();

function emit() {
  listeners.forEach((listener) => listener());
}

function setCollapsed(next: boolean) {
  collapsedState = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    collapsedState = readFromStorage();
    emit();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

function getSnapshot() {
  return collapsedState;
}

function getServerSnapshot() {
  return false;
}

export function useSidebarCollapse() {
  const isCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleCollapse = useCallback(() => {
    setCollapsed(!getSnapshot());
  }, []);

  return { isCollapsed, toggleCollapse };
}
