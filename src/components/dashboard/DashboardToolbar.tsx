import { useState, useEffect } from "react";
import { Edit, RotateCcw, Check, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/contexts/DashboardContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function DashboardToolbar() {
  const {
    isEditMode,
    toggleEditMode,
    addWidget,
    isWidgetPinned,
    resetToDefault,
    lastSynced,
    isRefreshing,
    refreshData,
  } = useDashboard();
  const { openChat } = useMiraChat();

  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(lastSynced));
  

  // Update relative time every 30 seconds
  useEffect(() => {
    setRelativeTime(formatRelativeTime(lastSynced));
    
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(lastSynced));
    }, 30000);

    return () => clearInterval(interval);
  }, [lastSynced]);

  const handleReset = () => {
    resetToDefault();
    toast.success("Reset to default layout");
  };

  const handleRefresh = async () => {
    await refreshData();
    toast.success("Data refreshed");
  };

  const handleAskMira = () => {
    openChat();
  };

  const availableWidgets = Object.entries(WIDGET_REGISTRY).filter(
    ([type]) => !isWidgetPinned(type as WidgetType)
  );

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {/* Edit Mode Toggle */}
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
          >
            {isEditMode ? (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Done</span>
                <span className="xs:hidden">Done</span>
              </>
            ) : (
              <>
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Customize</span>
                <span className="sm:hidden">Edit</span>
              </>
            )}
          </Button>

          {/* Reset to Default - shown in edit mode */}
          {isEditMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset to Default</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Create Widgets with Mira */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Create Widgets</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {/* Ask Mira Option - Primary */}
              <DropdownMenuItem
                onClick={handleAskMira}
                className="bg-primary/5 text-primary focus:bg-primary/10 focus:text-primary"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-medium text-sm">Ask Mira for Insights</div>
                  <div className="text-xs opacity-80">Create personalized AI widgets</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Pre-built widgets */}
              {availableWidgets.length === 0 ? (
                <DropdownMenuItem disabled>All pre-built widgets added</DropdownMenuItem>
              ) : (
                availableWidgets.map(([type, config]) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => {
                      addWidget(type as WidgetType);
                      toast.success(`${config.title} added`);
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm">{config.title}</div>
                      <div className="text-xs text-muted-foreground">{config.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Last Synced Timestamp - Hidden in edit mode */}
          {!isEditMode && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50",
                isRefreshing && "opacity-50 cursor-not-allowed"
              )}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline">Synced {relativeTime}</span>
              <Clock className="h-3 w-3 sm:hidden" />
            </button>
          )}
        </div>

      </div>
    </>
  );
}
