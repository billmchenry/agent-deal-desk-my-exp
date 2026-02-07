import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  DollarSign,
  FileText,
  Calendar,
  GraduationCap,
  Wrench,
  BookOpen,
  HelpCircle,
  Home,
  LayoutDashboard,
  Award,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavigation, SidebarNavItem } from "@/data/mockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
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
};

/** Check if the current path belongs to a submenu section */
function isInSection(pathname: string, item: SidebarNavItem): boolean {
  if (!item.submenu) return false;
  return item.submenu.some((sub) => pathname.startsWith(sub.url.split("/").slice(0, 3).join("/")));
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [manuallyCollapsed, setManuallyCollapsed] = useState<string | null>(null);

  // Determine which section should be expanded based on current route
  const getAutoExpandedItem = (pathname: string): string | null => {
    for (const section of Object.values(sidebarNavigation)) {
      for (const item of section.items) {
        if (isInSection(pathname, item)) return item.title;
      }
    }
    return null;
  };

  const autoExpanded = getAutoExpandedItem(location.pathname);

  // Reset manual collapse when navigating to a different section
  useEffect(() => {
    if (manuallyCollapsed && autoExpanded !== manuallyCollapsed) {
      setManuallyCollapsed(null);
    }
  }, [autoExpanded]);

  const isExpanded = (item: SidebarNavItem): boolean => {
    const inSection = isInSection(location.pathname, item);
    if (inSection && manuallyCollapsed === item.title) return false;
    return inSection;
  };

  const handleChevronClick = (e: React.MouseEvent, item: SidebarNavItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInSection(location.pathname, item)) {
      setManuallyCollapsed((prev) => (prev === item.title ? null : item.title));
    }
  };

  const handleParentClick = (item: SidebarNavItem) => {
    if (item.url) {
      navigate(item.url);
      setManuallyCollapsed(null);
    }
  };

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url;
  };

  const renderNavItem = (item: SidebarNavItem) => {
    const Icon = iconMap[item.icon];
    const hasSubmenu = !!item.submenu;
    const expanded = hasSubmenu && isExpanded(item);

    if (hasSubmenu) {
      return (
        <Collapsible
          key={item.title}
          open={expanded}
        >
          <div className="flex items-center mx-2">
            <button
              onClick={() => handleParentClick(item)}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                isActive(item.url) && "bg-sidebar-accent"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </button>
            <CollapsibleTrigger asChild>
              <button
                onClick={(e) => handleChevronClick(e, item)}
                className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-sidebar-foreground/50 transition-transform duration-200",
                    expanded && "rotate-90"
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="ml-9 mt-1 space-y-0.5">
              {item.submenu?.map((subItem) => (
                <a
                  key={subItem.url}
                  href={subItem.url}
                  className={cn(
                    "mx-2 flex items-center rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    isActive(subItem.url) && "bg-sidebar-accent text-sidebar-foreground font-medium"
                  )}
                >
                  {subItem.title}
                </a>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <a
        key={item.title}
        href={item.url}
        className={cn(
          "mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
          isActive(item.url) && "bg-sidebar-accent"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{item.title}</span>
      </a>
    );
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar">
      {/* Sidebar Header with Logo */}
      <div className="flex h-16 items-center gap-1 px-5 border-b border-border bg-white">
        <span className="text-xl font-bold leading-none text-foreground">MY</span>
        <span className="text-xl leading-none text-muted-foreground">|</span>
        <span className="text-xl font-bold leading-none text-exp-blue">eXp</span>
      </div>

      <nav className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto py-4">
        {/* MY DESK Section */}
        <div className="mb-4">
          <span className="mx-5 mb-2 block text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            {sidebarNavigation.myDesk.label}
          </span>
          <div className="space-y-0.5">
            {sidebarNavigation.myDesk.items.map(renderNavItem)}
          </div>
        </div>

        {/* BUSINESS & GROWTH Section */}
        <div className="mb-4 mt-4">
          <span className="mx-5 mb-2 block text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            {sidebarNavigation.businessGrowth.label}
          </span>
          <div className="space-y-0.5">
            {sidebarNavigation.businessGrowth.items.map(renderNavItem)}
          </div>
        </div>

        {/* RESOURCES Section */}
        <div className="mt-4">
          <span className="mx-5 mb-2 block text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            {sidebarNavigation.resources.label}
          </span>
          <div className="space-y-0.5">
            {sidebarNavigation.resources.items.map(renderNavItem)}
          </div>
        </div>
      </nav>
    </aside>
  );
}
