import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
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
  ChevronRight,
  ChevronDown,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavigation, SidebarNavItem } from "@/data/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [manuallyToggled, setManuallyToggled] = useState<Set<string>>(new Set());

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url;
  };

  const isExpanded = (item: SidebarNavItem): boolean => {
    const inSection = isInSection(location.pathname, item);
    const toggled = manuallyToggled.has(item.title);
    // If manually toggled, flip the default state
    if (toggled) return !inSection;
    return inSection;
  };

  // Reset manual toggles when route changes
  useEffect(() => {
    setManuallyToggled(new Set());
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setManuallyToggled((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const handleParentClick = (item: SidebarNavItem) => {
    if (item.submenu) {
      // Toggle submenu only, don't navigate
      toggleSection(item.title);
    } else if (item.url) {
      navigate(item.url);
      onClose();
    }
  };

  const handleChevronClick = (e: React.MouseEvent, item: SidebarNavItem) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSection(item.title);
  };

  const handleSubItemClick = (url: string) => {
    navigate(url);
    onClose();
  };

  const renderNavItem = (item: SidebarNavItem) => {
    const Icon = iconMap[item.icon];
    const hasSubmenu = !!item.submenu;
    const expanded = hasSubmenu && isExpanded(item);

    return (
      <div key={item.title}>
        <div className="flex items-center mx-2">
          <button
            onClick={() => handleParentClick(item)}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              isActive(item.url) && "bg-sidebar-accent"
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className="flex-1 text-left">{item.title}</span>
          </button>
          {hasSubmenu && (
            <button
              onClick={(e) => handleChevronClick(e, item)}
              className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/50 shrink-0" />
              )}
            </button>
          )}
        </div>

        {hasSubmenu && expanded && (
          <div className="ml-9 mt-1 space-y-0.5">
            {item.submenu?.map((subItem) => (
              <button
                key={subItem.url}
                onClick={() => handleSubItemClick(subItem.url)}
                className={cn(
                  "mx-2 flex w-full items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isActive(subItem.url) && "bg-sidebar-accent text-sidebar-foreground font-medium"
                )}
              >
                {subItem.title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-sm p-0 bg-sidebar flex flex-col overflow-x-hidden">
        <SheetHeader className="flex h-16 items-center justify-between border-b border-border px-5 bg-white">
          <SheetTitle className="flex items-center gap-1">
            <span className="text-xl font-bold text-foreground">MY</span>
            <span className="text-xl text-muted-foreground">|</span>
            <span className="text-xl font-bold text-exp-blue">eXp</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col flex-1 overflow-y-auto py-4">
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
      </SheetContent>
    </Sheet>
  );
}
