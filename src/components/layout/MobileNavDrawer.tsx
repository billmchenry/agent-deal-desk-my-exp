 import { useState } from "react";
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
   ArrowLeft,
   X,
 } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { sidebarNavigation, SidebarNavItem } from "@/data/mockData";
 import {
   Drawer,
   DrawerContent,
   DrawerHeader,
   DrawerTitle,
   DrawerClose,
 } from "@/components/ui/drawer";
 
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
 
 interface ActiveSection {
   key: string;
   label: string;
   items: { title: string; url: string }[];
 }
 
 export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
   const location = useLocation();
   const navigate = useNavigate();
   const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);
 
   const isActive = (url?: string) => {
     if (!url) return false;
     return location.pathname === url;
   };
 
   const handleItemClick = (item: SidebarNavItem) => {
     if (item.submenu) {
       // Navigate to section detail view
       setActiveSection({
         key: item.title,
         label: item.title,
         items: item.submenu,
       });
     } else if (item.url) {
       // Navigate directly and close drawer
       navigate(item.url);
       onClose();
       setActiveSection(null);
     }
   };
 
   const handleSubItemClick = (url: string) => {
     navigate(url);
     onClose();
     setActiveSection(null);
   };
 
   const handleBack = () => {
     setActiveSection(null);
   };
 
   const handleOpenChange = (open: boolean) => {
     if (!open) {
       onClose();
       // Reset section view when drawer closes
       setTimeout(() => setActiveSection(null), 300);
     }
   };
 
   const renderNavItem = (item: SidebarNavItem) => {
     const Icon = iconMap[item.icon];
     const hasSubmenu = !!item.submenu;
 
     return (
       <button
         key={item.title}
         onClick={() => handleItemClick(item)}
         className={cn(
           "min-h-[44px] flex items-center gap-4 px-4 py-3 w-full text-left",
           "text-white hover:bg-white/10 transition-colors rounded-lg",
           isActive(item.url) && "bg-white/15"
         )}
       >
         {Icon && <Icon className="h-5 w-5 text-white shrink-0" />}
         <span className="flex-1 text-base font-medium">{item.title}</span>
         {hasSubmenu && <ChevronRight className="h-5 w-5 text-white/70 shrink-0" />}
       </button>
     );
   };
 
   return (
     <Drawer open={isOpen} onOpenChange={handleOpenChange}>
       <DrawerContent
         className="bg-exp-navy border-exp-navy max-h-[85vh]"
         hideHandle
       >
         <div className="overflow-hidden">
           {/* Slide container */}
           <div
             className="flex w-[200%] transition-transform duration-300 ease-out"
             style={{ transform: activeSection ? "translateX(-50%)" : "translateX(0)" }}
           >
             {/* Main Menu View */}
             <div className="w-1/2 min-w-0">
               <DrawerHeader className="flex flex-row items-center justify-between border-b border-white/10 px-4 py-3">
                 <DrawerClose asChild>
                   <button className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2">
                     <X className="h-6 w-6 text-white" />
                   </button>
                 </DrawerClose>
                 <DrawerTitle className="text-white flex items-center gap-1">
                   <span className="text-xl font-bold">MY</span>
                   <span className="text-xl text-white/50">|</span>
                   <span className="text-xl font-bold text-exp-blue">eXp</span>
                 </DrawerTitle>
                 <div className="w-[44px]" /> {/* Spacer for centering */}
               </DrawerHeader>
 
               <nav className="overflow-y-auto max-h-[calc(85vh-60px)] px-2 py-4">
                 {/* MY DESK Section */}
                 <div className="mb-6">
                   <span className="px-4 mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                     {sidebarNavigation.myDesk.label}
                   </span>
                   <div className="space-y-1">
                     {sidebarNavigation.myDesk.items.map(renderNavItem)}
                   </div>
                 </div>
 
                 {/* BUSINESS & GROWTH Section */}
                 <div className="mb-6">
                   <span className="px-4 mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                     {sidebarNavigation.businessGrowth.label}
                   </span>
                   <div className="space-y-1">
                     {sidebarNavigation.businessGrowth.items.map(renderNavItem)}
                   </div>
                 </div>
 
                 {/* RESOURCES Section */}
                 <div>
                   <span className="px-4 mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                     {sidebarNavigation.resources.label}
                   </span>
                   <div className="space-y-1">
                     {sidebarNavigation.resources.items.map(renderNavItem)}
                   </div>
                 </div>
               </nav>
             </div>
 
             {/* Section Detail View */}
             <div className="w-1/2 min-w-0">
               <DrawerHeader className="flex flex-row items-center border-b border-white/10 px-4 py-3">
                 <button
                   onClick={handleBack}
                   className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
                 >
                   <ArrowLeft className="h-6 w-6 text-white" />
                 </button>
                 <DrawerTitle className="text-white text-lg font-semibold flex-1 text-center pr-[44px]">
                   {activeSection?.label}
                 </DrawerTitle>
               </DrawerHeader>
 
               <nav className="overflow-y-auto max-h-[calc(85vh-60px)] px-2 py-4">
                 <div className="space-y-1">
                   {activeSection?.items.map((subItem) => (
                     <button
                       key={subItem.url}
                       onClick={() => handleSubItemClick(subItem.url)}
                       className={cn(
                         "min-h-[44px] flex items-center px-4 py-3 w-full text-left",
                         "text-white hover:bg-white/10 transition-colors rounded-lg",
                         isActive(subItem.url) && "bg-white/15"
                       )}
                     >
                       <span className="text-base font-medium">{subItem.title}</span>
                     </button>
                   ))}
                 </div>
               </nav>
             </div>
           </div>
         </div>
       </DrawerContent>
     </Drawer>
   );
 }