import { Info } from "lucide-react";
import { useDemoConfig } from "@/contexts/DemoConfigContext";
import { useTranslation } from "@/hooks/useTranslation";

interface CanadianDisclaimerProps {
  variant: "agent" | "teamLead";
  email: string;
}

export function CanadianDisclaimer({ variant, email }: CanadianDisclaimerProps) {
  const { config } = useDemoConfig();
  const { t } = useTranslation();

  if (config.countryMode !== "canada") return null;

  const title = variant === "agent"
    ? t("disclaimer.canadianAgentTitle")
    : t("disclaimer.canadianTeamLeadTitle");

  const message = t("disclaimer.canadianMessage").replace("{email}", email);
  const paragraphs = message.split("\n").filter(Boolean);

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex gap-3">
      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-muted-foreground">{p}</p>
        ))}
      </div>
    </div>
  );
}
