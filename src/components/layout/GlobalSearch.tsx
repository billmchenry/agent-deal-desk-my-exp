import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, User, Users, DollarSign, FileText, Calendar, GraduationCap, Wrench, BookOpen, HelpCircle, Award, Store, Settings, Bell, MessageSquare } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { sidebarNavigation } from "@/data/mockData";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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

  // Flatten sidebar navigation
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

  // Add actions
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openChat: setMiraOpen } = useMiraChat();

  const searchItems = useMemo(
    () => buildSearchItems(() => { setOpen(false); setMiraOpen(); }),
    [setMiraOpen]
  );

  // Group items by category
  const grouped = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of searchItems) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [searchItems]);

  // Keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    if (item.action) {
      item.action();
    } else if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <>
      {/* Desktop trigger */}
      {!isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors w-64"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Mobile trigger */}
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>
      )}

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, actions, and more..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Array.from(grouped.entries()).map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <CommandItem
                    key={item.title}
                    value={[item.title, ...(item.keywords || [])].join(" ")}
                    onSelect={() => handleSelect(item)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{item.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
