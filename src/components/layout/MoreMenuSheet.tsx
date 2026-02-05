 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import {
   FileText,
   Calendar,
   GraduationCap,
   Award,
   Wrench,
   BookOpen,
   HelpCircle,
   ChevronDown,
   ChevronRight,
 } from "lucide-react";
 import { cn } from "@/lib/utils";
 import {
   Drawer,
   DrawerContent,
   DrawerHeader,
   DrawerTitle,
 } from "@/components/ui/drawer";
 
 interface MenuItem {
   icon: React.ComponentType<{ className?: string }>;
   label: string;
   path?: string;
   submenu?: { title: string; url: string }[];
 }
 
 const menuItems: MenuItem[] = [
   {
     icon: FileText,
     label: "Documents",
     submenu: [
       { title: "All Documents", url: "/documents/all" },
       { title: "Templates", url: "/documents/templates" },
     ],
   },
   { icon: Calendar, label: "Events Calendar", path: "/events" },
   { icon: Award, label: "ICON Program", path: "/agent/icon-program" },
   { icon: GraduationCap, label: "Mentor Program", path: "/mentor" },
   { icon: Wrench, label: "Tools", path: "/tools" },
   { icon: BookOpen, label: "Knowledge Base", path: "/knowledge" },
   { icon: HelpCircle, label: "Help Center", path: "/help" },
 ];
 
 interface MoreMenuSheetProps {
   isOpen: boolean;
   onClose: () => void;
 }
 
 export function MoreMenuSheet({ isOpen, onClose }: MoreMenuSheetProps) {
   const navigate = useNavigate();
   const [expandedItem, setExpandedItem] = useState<string | null>(null);
 
   const handleItemClick = (item: MenuItem) => {
     if (item.submenu) {
       setExpandedItem(expandedItem === item.label ? null : item.label);
     } else if (item.path) {
       navigate(item.path);
       onClose();
       setExpandedItem(null);
     }
   };
 
   const handleSubItemClick = (url: string) => {
     navigate(url);
     onClose();
     setExpandedItem(null);
   };
 
   const handleOpenChange = (open: boolean) => {
     if (!open) {
       onClose();
       setTimeout(() => setExpandedItem(null), 300);
     }
   };
 
   return (
     <Drawer open={isOpen} onOpenChange={handleOpenChange}>
       <DrawerContent className="bg-white max-h-[70vh]">
         <DrawerHeader className="border-b border-border px-4 py-3">
           <DrawerTitle className="text-center text-base font-semibold">
             More Options
           </DrawerTitle>
         </DrawerHeader>
 
         <nav className="overflow-y-auto p-2">
           {menuItems.map((item) => {
             const Icon = item.icon;
             const hasSubmenu = !!item.submenu;
             const isExpanded = expandedItem === item.label;
 
             return (
               <div key={item.label}>
                 <button
                   onClick={() => handleItemClick(item)}
                   className={cn(
                     "min-h-[44px] flex items-center gap-3 px-4 py-3 w-full text-left",
                     "text-foreground hover:bg-muted transition-colors rounded-lg"
                   )}
                 >
                   <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                   <span className="flex-1 text-sm font-medium">{item.label}</span>
                   {hasSubmenu && (
                     isExpanded ? (
                       <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                     ) : (
                       <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                     )
                   )}
                 </button>
 
                 {/* Submenu items */}
                 {hasSubmenu && isExpanded && (
                   <div className="ml-4 border-l border-border">
                     {item.submenu?.map((subItem) => (
                       <button
                         key={subItem.url}
                         onClick={() => handleSubItemClick(subItem.url)}
                         className={cn(
                           "min-h-[40px] flex items-center px-4 py-2.5 w-full text-left",
                           "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-lg"
                         )}
                       >
                         <span className="text-sm">{subItem.title}</span>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             );
           })}
         </nav>
       </DrawerContent>
     </Drawer>
   );
 }