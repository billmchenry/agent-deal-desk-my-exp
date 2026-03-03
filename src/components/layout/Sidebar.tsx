import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User, Users, DollarSign, FileText, Calendar, GraduationCap,
  Wrench, BookOpen, HelpCircle, Home, LayoutDashboard, Award,
  ChevronRight, Store, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavigation, SidebarNavItem } from "@/data/mockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, LayoutDashboard, User, Users, DollarSign, FileText,
  Calendar, GraduationCap, Wrench, BookOpen, HelpCircle, Award, Store,
};

function isInSection(pathname: string, item: SidebarNavItem): boolean {
  if (!item.submenu) return false;
  return item.submenu.some((sub) => pathname.startsWith(sub.url.split("/").slice(0, 3).join("/")));
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [manuallyCollapsed, setManuallyCollapsed] = useState<string | null>(null);
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  const getAutoExpandedItem = (pathname: string): string | null => {
    for (const section of Object.values(sidebarNavigation)) {
      for (const item of section.items) {
        if (isInSection(pathname, item)) return item.title;
      }
    }
    return null;
  };

  const autoExpanded = getAutoExpandedItem(location.pathname);

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

    // Collapsed mode: icon-only with tooltip
    if (isCollapsed) {
      return (
        <Tooltip key={item.title}>
          <TooltipTrigger asChild>
            <a
              href={item.url}
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                isActive(item.url) && "bg-sidebar-accent"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    // Expanded mode (existing logic)
    if (hasSubmenu) {
      return (
        <Collapsible key={item.title} open={expanded}>
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
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
                aria-label={`${expanded ? "Collapse" : "Expand"} ${item.title}`}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-sidebar-foreground/60 transition-transform duration-200",
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

  const renderSection = (section: { label: string; items: SidebarNavItem[] }, className?: string, showToggle?: boolean) => (
    <div className={cn("mb-4", className)}>
      {!isCollapsed ? (
        <div className="mx-3 mb-2 flex items-center justify-between">
          <span className="mx-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            {section.label}
          </span>
          {showToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleCollapse}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Collapse sidebar</TooltipContent>
            </Tooltip>
          )}
        </div>
      ) : showToggle ? (
        <div className="mb-2 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleCollapse}
                className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        </div>
      ) : null}
      <div className={cn("space-y-0.5", isCollapsed && "flex flex-col items-center")}>
        {section.items.map(renderNavItem)}
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        aria-label="Main navigation"
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-border bg-background transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "gap-1 px-5"
        )}>
          <span className="text-xl font-bold leading-none text-foreground">MY</span>
          {!isCollapsed && (
            <>
              <span className="text-xl leading-none text-muted-foreground">|</span>
              <span className="text-xl font-bold leading-none text-exp-blue">eXp</span>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col overflow-y-auto py-4">
          {renderSection(sidebarNavigation.myDesk, undefined, true)}
          {renderSection(sidebarNavigation.businessGrowth, "mt-4")}
          {renderSection(sidebarNavigation.resources, "mt-4")}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
