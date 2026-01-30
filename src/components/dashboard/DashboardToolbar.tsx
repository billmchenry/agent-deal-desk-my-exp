import { useState } from "react";
import { Edit, Save, Plus, RotateCcw, LayoutTemplate, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboard } from "@/contexts/DashboardContext";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { WIDGET_REGISTRY, WidgetType } from "@/types/dashboard";
import { toast } from "sonner";

export function DashboardToolbar() {
  const {
    isEditMode,
    toggleEditMode,
    addWidget,
    isWidgetPinned,
    templates,
    activeTemplateId,
    saveAsTemplate,
    loadTemplate,
    resetToDefault,
  } = useDashboard();

  const { openChat } = useMiraChat();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      saveAsTemplate(templateName.trim());
      toast.success(`Template "${templateName}" saved`);
      setTemplateName("");
      setSaveDialogOpen(false);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    loadTemplate(templateId);
    toast.success("Layout loaded");
  };

  const handleReset = () => {
    resetToDefault();
    toast.success("Reset to default layout");
  };

  const handleAskMira = () => {
    openChat();
    toast.info("Ask Mira for personalized insights you can pin!");
  };

  const availableWidgets = Object.entries(WIDGET_REGISTRY).filter(
    ([type]) => !isWidgetPinned(type as WidgetType)
  );

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
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

        {/* Templates - Hidden on very small screens */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 hidden xs:flex">
              <LayoutTemplate className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {templates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => handleLoadTemplate(template.id)}
                className="flex items-center justify-between"
              >
                <span>{template.name}</span>
                {template.id === activeTemplateId && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
              <Save className="h-4 w-4 mr-2" />
              Save Current Layout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Layout Template</DialogTitle>
            <DialogDescription>
              Give your custom layout a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTemplate()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
