import { useState } from "react";
import { Edit, Save, Plus, RotateCcw, LayoutTemplate, Check, X } from "lucide-react";
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

  const availableWidgets = Object.entries(WIDGET_REGISTRY).filter(
    ([type]) => !isWidgetPinned(type as WidgetType)
  );

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Edit Mode Toggle */}
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={toggleEditMode}
          className="gap-2"
        >
          {isEditMode ? (
            <>
              <Check className="h-4 w-4" />
              Done Editing
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Customize
            </>
          )}
        </Button>

        {/* Add Widget */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Widget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {availableWidgets.length === 0 ? (
              <DropdownMenuItem disabled>All widgets added</DropdownMenuItem>
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
                    <div className="font-medium">{config.title}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Templates */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Templates
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
