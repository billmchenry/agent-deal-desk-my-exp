import { useEffect, useState } from "react";
import expLogo from "@/assets/logo-white.svg";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User, Users, DollarSign, FileText, Calendar, GraduationCap,
  Wrench, BookOpen, HelpCircle, Home, LayoutDashboard, Award,
  ChevronRight, Store, ChevronsLeft, ChevronsRight, Receipt } from
"lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavigation, SidebarNavItem } from "@/data/mockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";
import { useTranslation } from "@/hooks/useTranslation";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

const iconMap: Record<string, React.ComponentType<{className?: string;}>> = {
  Home, LayoutDashboard, User, Users, DollarSign, FileText,
  Calendar, GraduationCap, Wrench, BookOpen, HelpCircle, Award, Store, Receipt
};

const NAV_KEYS: Record<string, string> = {
  "MY DESK": "nav.myDesk",
  "BUSINESS & GROWTH": "nav.businessGrowth",
  "RESOURCES": "nav.resources",
  "Home": "nav.home",
  "Agent": "nav.agent",
  "Dashboard": "nav.dashboard",
  "Agent Production Details": "nav.agentProductionDetails",
  "ICON Program": "nav.iconProgram",
  "Broker Hub": "nav.brokerHub",
  "Custom Service Fees": "nav.customServiceFees",
  "Documents": "nav.documents",
  "Year-End": "nav.yearEnd",
  "Downloads": "nav.downloads",
  "Documents Portal": "nav.documentsPortal",
  "Events Calendar": "nav.eventsCalendar",
  "Team": "nav.team",
  "RevShare Earnings": "nav.revshareEarnings",
  "Organization": "nav.organization",
  "Organization Tree": "nav.organizationTree",
  "My RevShare Trends": "nav.myRevshareTrends",
  "Mentor Program": "nav.mentorProgram",

  "Tools": "nav.tools",
  "Knowledge Base": "nav.knowledgeBase",
  "Help Center": "nav.helpCenter",
  "Team Reconciliation": "nav.teamReconciliation",
  "Revenue Share Group": "nav.revShareGroup",
  "Financials": "nav.financials",
  "Transactions": "nav.transactions"
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
  const { t } = useTranslation();
  const { config } = useDemoConfig();
  const isCanada = config.countryMode === "canada";
  const isGlobal = config.countryMode === "global";

  const tn = (title: string) => NAV_KEYS[title] ? t(NAV_KEYS[title]) : title;

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
      setManuallyCollapsed((prev) => prev === item.title ? null : item.title);
    }
  };

  const handleParentClick = (item: SidebarNavItem) => {
    if (item.submenu) {
      // If already in this section, toggle collapse
      if (isInSection(location.pathname, item)) {
        setManuallyCollapsed((prev) => prev === item.title ? null : item.title);
      } else if (item.url) {
        // Navigate and ensure expanded
        navigate(item.url);
        setManuallyCollapsed(null);
      }
    } else if (item.url) {
      navigate(item.url);
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

    if (isCollapsed) {
      return (
        <Tooltip key={item.title}>
          <TooltipTrigger asChild>
            <a
              href={item.url}
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                isActive(item.url) && "bg-sidebar-accent"
              )}>
              
              {Icon && <Icon className="h-4 w-4" />}
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">
            {tn(item.title)}
          </TooltipContent>
        </Tooltip>);

    }

    if (hasSubmenu) {
      return (
        <Collapsible key={item.title} open={expanded}>
          <CollapsibleTrigger asChild>
            <button
              onClick={() => handleParentClick(item)}
              className={cn(
                "mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                isActive(item.url) && "bg-sidebar-accent"
              )}>
              {Icon && <Icon className="h-4 w-4" />}
              <span className="flex-1 text-start">{tn(item.title)}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-sidebar-foreground/60 transition-transform duration-200",
                  expanded && "rotate-90"
                )} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="ms-9 mt-1 space-y-0.5">
              {item.submenu?.map((subItem) =>
              <a
                key={subItem.url}
                href={subItem.url}
                className={cn(
                  "mx-2 flex items-center rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isActive(subItem.url) && "bg-sidebar-accent text-sidebar-foreground font-medium"
                )}>
                  {tn(subItem.title)}
                </a>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>);

    }

    return (
      <a
        key={item.title}
        href={item.url}
        className={cn(
          "mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
          isActive(item.url) && "bg-sidebar-accent"
        )}>
        
        {Icon && <Icon className="h-4 w-4" />}
        <span>{tn(item.title)}</span>
      </a>);

  };
  const globalHiddenTitles = ["Team", "Documents", "Mentor Program", "Broker Hub", "Custom Service Fees"];

  const filterNavItems = (items: SidebarNavItem[]): SidebarNavItem[] => {
    if (!isGlobal && !isCanada) return items;
    return items.
    filter((item) => !(isGlobal && globalHiddenTitles.includes(item.title))).
    map((item) => {
      if (!item.submenu) return item;
      const filteredSub = item.submenu.filter((sub) => {
        if (isCanada && sub.url === "/documents/year-end") return false;
        if (isGlobal && globalHiddenTitles.includes(sub.title)) return false;
        return true;
      });
      return { ...item, submenu: filteredSub };
    });
  };

  const renderSection = (section: {label: string;items: SidebarNavItem[];}, className?: string, showToggle?: boolean) =>
  <div className={cn("mb-4", className)}>
      {!isCollapsed ?
    <div className="mx-3 mb-2 flex items-center justify-between">
          <span className="mx-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/80">
            {tn(section.label)}
          </span>
          {showToggle &&
      <Tooltip>
              <TooltipTrigger asChild>
                <button
            onClick={toggleCollapse}
            className="flex h-6 w-6 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
            
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{t("common.collapsed")}</TooltipContent>
            </Tooltip>
      }
        </div> :
    showToggle ?
    <div className="mb-2 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
            onClick={toggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
            
                <ChevronsRight className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{t("common.expanded")}</TooltipContent>
          </Tooltip>
        </div> :
    null}
      <div className={cn("space-y-0.5", isCollapsed && "flex flex-col items-center")}>
        {filterNavItems(section.items).map(renderNavItem)}
      </div>
    </div>;


  return (
    <TooltipProvider delayDuration={0}>
      <aside
        aria-label="Main navigation"
        className={cn(
          "hidden lg:flex flex-col fixed start-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}>
        
        <div className={cn("flex h-16 items-center bg-sidebar transition-all duration-300 text-secondary-foreground",

        isCollapsed ? "justify-center px-2" : "gap-2 px-5"
        )}>
          <img
            src={expLogo}
            alt="eXp Realty"
            className={cn(
              "object-contain transition-all duration-300 brightness-0 invert",
              isCollapsed ? "h-6 w-10" : "h-10 max-w-[140px]"
            )} />
          
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto py-4">
          {renderSection(sidebarNavigation.myDesk, undefined, true)}
          {renderSection(sidebarNavigation.businessGrowth, "mt-4")}
          {renderSection(sidebarNavigation.resources, "mt-4")}
        </nav>
      </aside>
    </TooltipProvider>);

}