 import { useState } from "react";
 import { useLocation, useNavigate } from "react-router-dom";
 import { Home, LayoutDashboard, Users, DollarSign, Menu } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { MoreMenuSheet } from "./MoreMenuSheet";
 
 interface TabItem {
   icon: React.ComponentType<{ className?: string }>;
   label: string;
   path?: string;
   isMore?: boolean;
 }
 
 const tabs: TabItem[] = [
   { icon: Home, label: "Home", path: "/" },
   { icon: LayoutDashboard, label: "Perform", path: "/agent/dashboard" },
   { icon: Users, label: "Team", path: "/team/dashboard" },
   { icon: DollarSign, label: "RevShare", path: "/revshare/dashboard" },
   { icon: Menu, label: "More", isMore: true },
 ];
 
 export function MobileBottomNav() {
   const location = useLocation();
   const navigate = useNavigate();
   const [moreOpen, setMoreOpen] = useState(false);
 
   const isActive = (path?: string) => {
     if (!path) return false;
     if (path === "/") return location.pathname === "/";
     return location.pathname.startsWith(path);
   };
 
   const handleTabClick = (tab: TabItem) => {
     if (tab.isMore) {
       setMoreOpen(true);
     } else if (tab.path) {
       navigate(tab.path);
     }
   };
 
   return (
     <>
       <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-border pb-safe">
         <div className="flex h-[60px]">
           {tabs.map((tab) => {
             const Icon = tab.icon;
             const active = tab.isMore ? moreOpen : isActive(tab.path);
             
             return (
               <button
                 key={tab.label}
                 onClick={() => handleTabClick(tab)}
                 className={cn(
                   "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors",
                   active ? "text-exp-blue" : "text-muted-foreground"
                 )}
               >
                 <Icon className="h-5 w-5" />
                 <span className="text-[10px] font-medium">{tab.label}</span>
               </button>
             );
           })}
         </div>
       </nav>
 
       <MoreMenuSheet isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
     </>
   );
 }