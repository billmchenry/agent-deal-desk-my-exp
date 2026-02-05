import { useState } from "react";
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
  X,
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
};

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url;
  };

  const handleItemClick = (item: SidebarNavItem) => {
    if (item.submenu) {
      setExpandedItem((prev) => (prev === item.title ? null : item.title));
    } else if (item.url) {
      navigate(item.url);
      onClose();
    }
  };

  const handleSubItemClick = (url: string) => {
    navigate(url);
    onClose();
  };

  const renderNavItem = (item: SidebarNavItem) => {
    const Icon = iconMap[item.icon];
    const isExpanded = expandedItem === item.title;
    const hasSubmenu = !!item.submenu;

    return (
      <div key={item.title}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "text-foreground hover:bg-muted",
            isActive(item.url) && "bg-muted text-exp-blue"
          )}
        >
          {Icon && <Icon className="h-5 w-5 shrink-0" />}
          <span className="flex-1 text-left">{item.title}</span>
          {hasSubmenu && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )
          )}
        </button>

        {hasSubmenu && isExpanded && (
          <div className="ml-8 mt-1 space-y-1 border-l border-border pl-3">
            {item.submenu?.map((subItem) => (
              <button
                key={subItem.url}
                onClick={() => handleSubItemClick(subItem.url)}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive(subItem.url) && "bg-muted text-exp-blue font-medium"
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
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="flex h-16 items-center justify-between border-b px-4">
          <SheetTitle className="flex items-center gap-1">
            <span className="text-xl font-bold text-foreground">MY</span>
            <span className="text-xl text-muted-foreground">|</span>
            <span className="text-xl font-bold text-exp-blue">eXp</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 overflow-y-auto p-4">
          {/* MY DESK Section */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {sidebarNavigation.myDesk.label}
            </span>
            <div className="space-y-1">
              {sidebarNavigation.myDesk.items.map(renderNavItem)}
            </div>
          </div>

          {/* BUSINESS & GROWTH Section */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {sidebarNavigation.businessGrowth.label}
            </span>
            <div className="space-y-1">
              {sidebarNavigation.businessGrowth.items.map(renderNavItem)}
            </div>
          </div>

          {/* RESOURCES Section */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {sidebarNavigation.resources.label}
            </span>
            <div className="space-y-1">
              {sidebarNavigation.resources.items.map(renderNavItem)}
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
