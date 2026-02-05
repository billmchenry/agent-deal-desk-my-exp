import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/DashboardContext";
import { TemplateCategory, TemplateVisibility } from "@/types/dashboard";
import { WizardProgress } from "./wizard/WizardProgress";
import { TemplateStepInsights } from "./wizard/TemplateStepInsights";
import { TemplateStepDetails } from "./wizard/TemplateStepDetails";
import { TemplateStepVisibility } from "./wizard/TemplateStepVisibility";
import { TemplateStepReview } from "./wizard/TemplateStepReview";
import { toast } from "sonner";

interface CreateTemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTemplateWizard({ isOpen, onClose }: CreateTemplateWizardProps) {
  const { widgets, createTemplate } = useDashboard();
  
  const [step, setStep] = useState(1);
  const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("production");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<TemplateVisibility>("private");

  const resetWizard = () => {
    setStep(1);
    setSelectedWidgetIds([]);
    setName("");
    setDescription("");
    setCategory("production");
    setTags("");
    setVisibility("private");
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedWidgetIds.length > 0;
      case 2:
        return name.trim().length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreate = () => {
    const selectedWidgets = widgets.filter((w) => selectedWidgetIds.includes(w.id));
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    createTemplate({
      name: name.trim(),
      description: description.trim(),
      category,
      tags: parsedTags,
      visibility,
      widgets: selectedWidgets,
    });

    toast.success("Template created successfully!");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Create a Template</DialogTitle>
          </div>
          <div className="space-y-1">
            <WizardProgress currentStep={step} totalSteps={4} />
            <p className="text-xs text-muted-foreground text-right">
              Step {step} of 4
            </p>
          </div>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <TemplateStepInsights
              widgets={widgets}
              selectedWidgetIds={selectedWidgetIds}
              onSelectionChange={setSelectedWidgetIds}
            />
          )}

          {step === 2 && (
            <TemplateStepDetails
              name={name}
              description={description}
              category={category}
              tags={tags}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
              onTagsChange={setTags}
            />
          )}

          {step === 3 && (
            <TemplateStepVisibility
              visibility={visibility}
              onVisibilityChange={setVisibility}
            />
          )}

          {step === 4 && (
            <TemplateStepReview
              name={name}
              description={description}
              category={category}
              visibility={visibility}
              selectedCount={selectedWidgetIds.length}
            />
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          {step === 1 ? (
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {step < 4 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next Step
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Check className="h-4 w-4 mr-1" />
              Create Template
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
