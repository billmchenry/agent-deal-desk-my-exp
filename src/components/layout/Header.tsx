import { Bell, HelpCircle, Sparkles, ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser, userProfile } from "@/data/mockData";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 lg:pl-[17rem] lg:pr-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold leading-none text-exp-navy">MY</span>
          <span className="text-xl leading-none text-muted-foreground">|</span>
          <span className="text-xl font-bold leading-none text-exp-blue">eXp</span>
        </div>
        
        {/* Welcome Message - Hidden on mobile */}
        <span className="hidden md:inline text-sm text-muted-foreground">
          Welcome, <span className="font-medium text-foreground">{currentUser.name}</span>
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Get Help */}
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>Get Help</span>
        </Button>

        {/* Mira AI Assistant */}
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
          <Sparkles className="h-4 w-4 text-exp-purple" />
          <span>Mira</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-exp-red text-[10px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
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
      </div>
    </header>
  );
}
