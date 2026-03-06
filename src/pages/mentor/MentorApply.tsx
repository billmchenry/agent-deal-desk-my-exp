import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MentorStepIndicator } from "@/components/mentor/MentorStepIndicator";
import { StepYourInfo } from "@/components/mentor/steps/StepYourInfo";
import { StepExperience } from "@/components/mentor/steps/StepExperience";
import { StepMentorship } from "@/components/mentor/steps/StepMentorship";
import { StepGoals } from "@/components/mentor/steps/StepGoals";
import { StepSkills } from "@/components/mentor/steps/StepSkills";
import { StepAbout } from "@/components/mentor/steps/StepAbout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import mentorHeader from "@/assets/mentor-program-header.png";

export default function MentorApply() {
  const { t } = useTranslation();
  useDocumentTitle(t("mentor.mentorApplication"));
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const stepLabels = [
    t("mentor.yourInformation"),
    t("mentor.realEstateExperience"),
    t("mentor.mentorshipCoachingExp"),
    t("mentor.goalsAndIntentions"),
    t("mentor.skillsAssessment"),
    t("mentor.aboutTheMentor"),
  ];

  const updateData = (newData: Record<string, any>) => setFormData(newData);

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.acknowledgment) {
      toast.error(t("mentor.acceptAcknowledgment"));
      return;
    }
    sessionStorage.setItem("mentorScenario", "pending");
    toast.success(t("mentor.applicationSubmittedSuccess"));
    navigate("/mentor");
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepYourInfo />;
      case 2: return <StepExperience data={formData} onChange={updateData} />;
      case 3: return <StepMentorship data={formData} onChange={updateData} />;
      case 4: return <StepGoals data={formData} onChange={updateData} />;
      case 5: return <StepSkills data={formData} onChange={updateData} />;
      case 6: return <StepAbout data={formData} onChange={updateData} />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        {/* Header */}
        <div className="bg-card rounded-xl p-6 flex flex-col items-center">
          <div className="bg-white rounded-xl px-8 py-4 inline-block">
            <img src={mentorHeader} alt="eXp Realty Mentor Program" className="h-12 md:h-14 object-contain" />
          </div>
          <h2 className="text-lg font-bold text-foreground mt-4">{t("mentor.mentorApplication")}</h2>
        </div>

        {/* Step indicator */}
        <MentorStepIndicator currentStep={step} steps={stepLabels} />

        {/* Step content */}
        {renderStep()}

        {/* Footer buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/mentor")}
          >
            {t("mentor.cancel")}
          </Button>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev}>
                {t("mentor.previous")}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => toast.info(t("mentor.progressSaved"))}
            >
              {t("mentor.saveProgress")}
            </Button>
            {step < 6 ? (
              <Button onClick={handleNext}>
                {t("mentor.next")}
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                {t("mentor.submitApplication")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}