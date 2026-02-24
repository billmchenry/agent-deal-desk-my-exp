import { useState } from "react";
import { Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser, userProfile } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationsSheet } from "./NotificationsSheet";
import { AccountSheet } from "./AccountSheet";
import { GlobalSearch } from "./GlobalSearch";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-white px-3 sm:px-4 lg:px-6 max-w-[100vw] overflow-x-hidden transition-all duration-300", isCollapsed ? "lg:left-16" : "lg:left-64")}>
        {/* Left Section - Hamburger on mobile */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:block">
          <GlobalSearch />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search */}
          <div className="lg:hidden">
            <GlobalSearch />
          </div>

          {/* Get Help */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Get Help</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => isMobile && setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-exp-red text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu - Desktop uses dropdown, Mobile uses sheet */}
          {isMobile ? (
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 pl-2 pr-1"
              onClick={() => setAccountOpen(true)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-exp-blue text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-exp-blue text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="bg-exp-blue text-primary-foreground text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{userProfile.agentId}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile/personal-details" className="cursor-pointer">
                    Personal Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">Version 2.1.0</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Mobile Sheets */}
      <NotificationsSheet 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
      <AccountSheet 
        isOpen={accountOpen} 
        onClose={() => setAccountOpen(false)} 
      />
    </>
  );
}
