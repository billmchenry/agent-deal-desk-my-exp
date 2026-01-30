import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Save, Layout, RotateCcw, Trash2 } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";

export function TemplateManager() {
  const { templates, saveTemplate, loadTemplate, deleteTemplate, resetToDefault } = useLayout();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadConfirmOpen, setLoadConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleSave = () => {
    if (templateName.trim()) {
      saveTemplate(templateName.trim());
      setTemplateName("");
      setSaveDialogOpen(false);
    }
  };

  const handleLoadConfirm = () => {
    if (selectedTemplateId) {
      loadTemplate(selectedTemplateId);
      setSelectedTemplateId(null);
      setLoadConfirmOpen(false);
    }
  };

  const handleResetConfirm = () => {
    resetToDefault();
    setResetConfirmOpen(false);
  };

  const initiateLoad = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setLoadConfirmOpen(true);
  };

  return (
    <>
      <div className="flex gap-2">
        {/* Save Button */}
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSaveDialogOpen(true)}>
          <Save className="h-4 w-4" />
          Save Layout
        </Button>

        {/* Templates Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Layout className="h-4 w-4" />
              Templates
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {templates.length === 0 ? (
              <DropdownMenuItem disabled>No saved templates</DropdownMenuItem>
            ) : (
              templates.map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  className="flex items-center justify-between group"
                >
                  <span 
                    className="flex-1 cursor-pointer"
                    onClick={() => initiateLoad(template.id)}
                  >
                    {template.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setResetConfirmOpen(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Layout Template</DialogTitle>
            <DialogDescription>
              Save your current dashboard layout as a template to restore later.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!templateName.trim()}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Confirmation */}
      <AlertDialog open={loadConfirmOpen} onOpenChange={setLoadConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Load Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current dashboard layout. Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadConfirm}>Load Template</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset your dashboard to the default layout. Your saved templates will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm}>Reset Layout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
