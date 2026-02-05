import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Find which parent contains the active route and auto-expand it
  const findParentWithActiveChild = (pathname: string): string | null => {
    for (const section of Object.values(sidebarNavigation)) {
      for (const item of section.items) {
        if (item.submenu) {
          const hasActiveChild = item.submenu.some((sub) => sub.url === pathname);
          if (hasActiveChild) return item.title;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const activeParent = findParentWithActiveChild(location.pathname);
    if (activeParent) {
      setExpandedItem(activeParent);
    }
  }, [location.pathname]);

  const handleItemClick = (item: SidebarNavItem) => {
    if (item.submenu) {
      setExpandedItem((prev) => (prev === item.title ? null : item.title));
    }
  };

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url;
  };

  const renderNavItem = (item: SidebarNavItem) => {
    const Icon = iconMap[item.icon];
    const isExpanded = expandedItem === item.title;
    const hasSubmenu = !!item.submenu;

    if (hasSubmenu) {
      return (
        <Collapsible
          key={item.title}
          open={isExpanded}
          onOpenChange={() => handleItemClick(item)}
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </button>
          </CollapsibleTrigger>
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 transform bg-sidebar transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
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
    </>
  );
}
