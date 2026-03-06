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
  Sparkles,
} from "lucide-react";
import { sidebarNavigation } from "@/data/mockData";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SearchItem {
  title: string;
  description?: string;
  url?: string;
  icon: string;
  category: string;
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
          description: item.submenu ? `${item.submenu.map(s => s.title).join(", ")}` : undefined,
          url: item.url,
          icon: item.icon,
          category: section.label,
        });
      }
      if (item.submenu) {
        for (const sub of item.submenu) {
          items.push({
            title: sub.title,
            description: `${item.title} › ${sub.title}`,
            url: sub.url,
            icon: item.icon,
            category: section.label,
          });
        }
      }
    }
  }

  items.push(
    { title: "Ask Mira", description: "AI assistant", icon: "MessageSquare", category: "ACTIONS", action: onAskMira },
    { title: "Personal Details", description: "View and edit your profile", icon: "User", category: "ACTIONS", url: "/profile/personal-details" },
    { title: "Settings", description: "Preferences and configuration", icon: "Settings", category: "ACTIONS", url: "/profile/settings" },
    { title: "Pulse", description: "News and updates", icon: "Search", category: "ACTIONS", url: "/pulse" },
    { title: "Mira History", description: "Past conversations", icon: "MessageSquare", category: "ACTIONS", url: "/mira/history" },
  );

  return items;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openChat, openChatWithQuery } = useMiraChat();
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
      const searchText = [item.title, item.description || ""].join(" ").toLowerCase();
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
  const showDropdown = isFocused && query.trim().length > 0;

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

  const handleMiraSelect = () => {
    const q = query.trim();
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
    openChatWithQuery(q);
  };

  // Total items for keyboard nav = filtered results + 1 Mira row
  const totalNavItems = flatFiltered.length + 1;
  const miraIndex = flatFiltered.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, totalNavItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex === miraIndex) {
        handleMiraSelect();
      } else if (flatFiltered[highlightedIndex]) {
        handleSelect(flatFiltered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Mobile: toggle inline search
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile search is open
  useEffect(() => {
    if (!isMobile) return;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [mobileOpen, isMobile]);

  const closeMobileSearch = () => {
    setMobileOpen(false);
    setQuery("");
    setIsFocused(false);
  };

  if (isMobile) {
    return (
      <div ref={containerRef} className="relative">
        <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]" onClick={() => { setMobileOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
          <Search className="h-5 w-5" />
        </Button>
        {mobileOpen && (
          <>
            {/* Full-screen overlay - use min-h with dvh for mobile Safari */}
            <div
              className="fixed inset-0 z-[60] bg-background"
              style={{ minHeight: '100dvh' }}
              onClick={closeMobileSearch}
            />
            {/* Search bar + results */}
            <div
              className="fixed inset-0 z-[70] flex flex-col bg-background"
              style={{ minHeight: '100dvh' }}
            >
              <div className="flex items-center gap-2 px-3 h-16 shrink-0 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search..."
                  aria-label="Search"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-[44px] shrink-0"
                  onClick={closeMobileSearch}
                >
                  Cancel
                </Button>
              </div>
              {showDropdown && (
                <div className="flex-1 overflow-y-auto bg-background">
                  <DropdownResults
                    grouped={grouped}
                    flatFiltered={flatFiltered}
                    highlightedIndex={highlightedIndex}
                    onSelect={handleSelect}
                    onHover={setHighlightedIndex}
                    query={query}
                    miraIndex={miraIndex}
                    onMiraSelect={handleMiraSelect}
                  />
                </div>
              )}
            </div>
          </>
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
          aria-label="Search"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute inset-x-0 top-full mt-1 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg z-50">
          <DropdownResults
            grouped={grouped}
            flatFiltered={flatFiltered}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            onHover={setHighlightedIndex}
            query={query}
            miraIndex={miraIndex}
            onMiraSelect={handleMiraSelect}
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
  query,
  miraIndex,
  onMiraSelect,
}: {
  grouped: Map<string, SearchItem[]>;
  flatFiltered: SearchItem[];
  highlightedIndex: number;
  onSelect: (item: SearchItem) => void;
  onHover: (index: number) => void;
  query: string;
  miraIndex: number;
  onMiraSelect: () => void;
}) {
  let globalIndex = 0;
  const hasResults = flatFiltered.length > 0;
  const isMiraHighlighted = highlightedIndex === miraIndex;

  return (
    <div className="py-1">
      {hasResults && Array.from(grouped.entries()).map(([category, items]) => (
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
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-start transition-colors",
                  isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{item.title}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {/* Mira AI suggestion */}
      {query.trim() && (
        <>
          {hasResults && <div className="mx-3 border-t border-border" />}
          <button
            onClick={onMiraSelect}
            onMouseEnter={() => onHover(miraIndex)}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2.5 text-sm text-start transition-colors",
              isMiraHighlighted ? "bg-primary/10 text-primary" : "hover:bg-primary/5",
              !hasResults && "py-3"
            )}
          >
            <Sparkles className={cn("h-4 w-4 shrink-0", isMiraHighlighted ? "text-primary" : "text-primary/70")} />
            <div className="flex flex-col min-w-0">
              <span className="truncate font-medium">
                Ask Mira: "{query.trim()}"
              </span>
              {!hasResults && (
                <span className="text-xs text-muted-foreground">No pages found — ask Mira instead</span>
              )}
            </div>
          </button>
        </>
      )}
    </div>
  );
}
