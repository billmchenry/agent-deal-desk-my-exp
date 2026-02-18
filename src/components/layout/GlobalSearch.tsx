import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  User,
  Users,
  DollarSign,
  FileText,
  Calendar,
  GraduationCap,
  Wrench,
  BookOpen,
  HelpCircle,
  Award,
  Store,
  Settings,
  Bell,
  MessageSquare,
} from "lucide-react";
import { sidebarNavigation } from "@/data/mockData";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SearchItem {
  title: string;
  url?: string;
  icon: string;
  category: string;
  keywords?: string[];
  action?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, User, Users, DollarSign, FileText, Calendar, GraduationCap,
  Wrench, BookOpen, HelpCircle, Award, Store, Settings, Bell, MessageSquare, Search,
};

function buildSearchItems(onAskMira: () => void): SearchItem[] {
  const items: SearchItem[] = [];

  for (const section of Object.values(sidebarNavigation)) {
    for (const item of section.items) {
      if (item.url) {
        items.push({
          title: item.title,
          url: item.url,
          icon: item.icon,
          category: section.label,
          keywords: item.title === "Agent" ? ["GCI", "capping", "production"] : undefined,
        });
      }
      if (item.submenu) {
        for (const sub of item.submenu) {
          items.push({
            title: `${item.title} › ${sub.title}`,
            url: sub.url,
            icon: item.icon,
            category: section.label,
          });
        }
      }
    }
  }

  items.push(
    { title: "Ask Mira", icon: "MessageSquare", category: "ACTIONS", action: onAskMira, keywords: ["AI", "chat", "assistant"] },
    { title: "Personal Details", icon: "User", category: "ACTIONS", url: "/profile/personal-details", keywords: ["profile", "account"] },
    { title: "Settings", icon: "Settings", category: "ACTIONS", url: "/profile/settings", keywords: ["preferences", "config"] },
    { title: "Pulse", icon: "Search", category: "ACTIONS", url: "/pulse", keywords: ["news", "updates"] },
    { title: "Mira History", icon: "MessageSquare", category: "ACTIONS", url: "/mira/history", keywords: ["conversations", "chat history"] },
  );

  return items;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openChat } = useMiraChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchItems = useMemo(
    () => buildSearchItems(() => { openChat(); }),
    [openChat]
  );

  // Filter items based on query
  const filtered = useMemo(() => {
    if (!query.trim()) return searchItems;
    const q = query.toLowerCase();
    return searchItems.filter((item) => {
      const searchText = [item.title, ...(item.keywords || [])].join(" ").toLowerCase();
      return searchText.includes(q);
    });
  }, [query, searchItems]);

  // Group filtered items
  const grouped = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of filtered) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [filtered]);

  const flatFiltered = useMemo(() => filtered, [filtered]);
  const showDropdown = isFocused && query.trim().length > 0 && flatFiltered.length > 0;

  // Reset highlight when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut to focus
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
    if (item.action) {
      item.action();
    } else if (item.url) {
      navigate(item.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatFiltered[highlightedIndex]) {
        handleSelect(flatFiltered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Mobile: toggle inline search
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <div ref={containerRef} className="relative">
        {!mobileOpen ? (
          <Button variant="ghost" size="icon" onClick={() => { setMobileOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="fixed inset-x-0 top-0 z-50 flex items-center gap-2 bg-background border-b border-border px-3 h-16">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button variant="ghost" size="sm" onClick={() => { setMobileOpen(false); setQuery(""); setIsFocused(false); }}>
              Cancel
            </Button>
            {showDropdown && (
              <div className="absolute left-0 right-0 top-16 max-h-[60vh] overflow-y-auto bg-popover border-b border-border shadow-lg">
                <DropdownResults
                  grouped={grouped}
                  flatFiltered={flatFiltered}
                  highlightedIndex={highlightedIndex}
                  onSelect={handleSelect}
                  onHover={setHighlightedIndex}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 w-72 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-shadow">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg z-50">
          <DropdownResults
            grouped={grouped}
            flatFiltered={flatFiltered}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            onHover={setHighlightedIndex}
          />
        </div>
      )}
    </div>
  );
}

function DropdownResults({
  grouped,
  flatFiltered,
  highlightedIndex,
  onSelect,
  onHover,
}: {
  grouped: Map<string, SearchItem[]>;
  flatFiltered: SearchItem[];
  highlightedIndex: number;
  onSelect: (item: SearchItem) => void;
  onHover: (index: number) => void;
}) {
  let globalIndex = 0;

  return (
    <div className="py-1">
      {Array.from(grouped.entries()).map(([category, items]) => (
        <div key={category}>
          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {category}
          </div>
          {items.map((item) => {
            const idx = globalIndex++;
            const Icon = iconMap[item.icon];
            const isHighlighted = idx === highlightedIndex;
            return (
              <button
                key={item.title}
                onClick={() => onSelect(item)}
                onMouseEnter={() => onHover(flatFiltered.indexOf(item))}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                  isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
