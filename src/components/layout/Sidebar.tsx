import { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Home,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/mockData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Users,
  DollarSign,
  FileText,
  Calendar,
  GraduationCap,
  Wrench,
  BookOpen,
  HelpCircle,
  Sparkles,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url;
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
          "fixed left-0 top-0 z-40 h-screen w-64 transform bg-sidebar transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex h-16 items-center gap-1 px-5 border-b border-sidebar-border">
          <span className="text-xl font-bold leading-none text-white">MY</span>
          <span className="text-xl leading-none text-sidebar-foreground/60">|</span>
          <span className="text-xl font-bold leading-none text-exp-blue">eXp</span>
        </div>

        <nav className="flex h-full flex-col overflow-y-auto py-4">
          {/* Home Link */}
          <a
            href="/"
            className={cn(
              "mx-2 mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
              location.pathname === "/" && "bg-sidebar-accent"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Home</span>
          </a>

          {/* Divider */}
          <div className="mx-4 my-2 h-px bg-sidebar-border" />

          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isExpanded = expandedItems.includes(item.title);

            if (item.hasSubmenu) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className="mx-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="h-5 w-5" />}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isExpanded && item.submenu && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.url}
                          href={subItem.url}
                          className={cn(
                            "mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                            isActive(subItem.url) && "bg-sidebar-accent text-sidebar-foreground"
                          )}
                        >
                          {subItem.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={item.title}
                href={item.url}
                className={cn(
                  "mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                  isActive(item.url) && "bg-sidebar-accent"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="font-medium">{item.title}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
