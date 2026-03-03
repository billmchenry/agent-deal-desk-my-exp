import { useState } from "react";
import { ExternalLink, Pencil, Type } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLocale, type Language, type DateFormatOption, type TimeFormatOption, type NumberFormatOption, type FontSizeOption } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const languageOptions: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr-CA", label: "Français (Canada)" },
  { value: "es", label: "Español" },
  { value: "zh", label: "中文 (简体)" },
  { value: "ja", label: "日本語" },
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
];

const dateFormatOptions: DateFormatOption[] = [
  "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD",
  "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD",
  "DD Mon, YYYY",
];

const timeFormatOptions: { value: TimeFormatOption; label: string }[] = [
  { value: "12h", label: "12 Hours (2:30 PM)" },
  { value: "24h", label: "24 Hours (14:30)" },
];

const numberFormatOptions: { value: NumberFormatOption; label: string }[] = [
  { value: "en-US", label: "1,000,000.50" },
  { value: "de-DE", label: "1.000.000,50" },
  { value: "en-IN", label: "10,00,000.50 (Lakhs)" },
];

const fontSizeOptions: { value: FontSizeOption; label: string; desc: string }[] = [
  { value: "normal", label: "Normal", desc: "Default (16px)" },
  { value: "large", label: "Large", desc: "18px base" },
  { value: "x-large", label: "Extra Large", desc: "20px base" },
];

type DialogType = "language" | "dateFormat" | "timeFormat" | "numberFormat" | "fontSize" | null;

function getLanguageLabel(lang: Language) {
  return languageOptions.find((o) => o.value === lang)?.label ?? lang;
}

function getNumberFormatLabel(nf: NumberFormatOption) {
  return numberFormatOptions.find((o) => o.value === nf)?.label ?? nf;
}

export function SettingsTab() {
  const { t } = useTranslation();
  const locale = useLocale();
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  return (
    <div className="space-y-6">
      {/* Locale Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t("settings.locale")}</p>
            <p className="font-medium text-foreground">🇺🇸 USA</p>
          </div>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10"
            onClick={() => toast.info(t("settings.notAvailable"))}
          >
            {t("settings.changeLocale")}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PreferenceCard
          label={t("settings.language")}
          value={getLanguageLabel(locale.language)}
          onClick={() => setOpenDialog("language")}
        />
        <PreferenceCard
          label={t("settings.dateFormat")}
          value={locale.dateFormat}
          onClick={() => setOpenDialog("dateFormat")}
        />
        <PreferenceCard
          label={t("settings.timeFormat")}
          value={locale.timeFormat === "12h" ? "12hrs" : "24hrs"}
          onClick={() => setOpenDialog("timeFormat")}
        />
        <PreferenceCard
          label={t("settings.numberFormat")}
          value={getNumberFormatLabel(locale.numberFormat)}
          onClick={() => setOpenDialog("numberFormat")}
        />
      </div>

      {/* Font Size */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-primary/10">
              <Type className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t("settings.fontSize")}</p>
              <p className="font-medium text-foreground">
                {locale.fontSize === "normal" ? t("settings.normal") : locale.fontSize === "large" ? t("settings.large") : t("settings.extraLarge")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenDialog("fontSize")}
            className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`${t("common.edit")} ${t("settings.fontSize")}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          label={t("settings.security")}
          value={t("settings.changePassword")}
          onClick={() => toast.info(t("settings.notAvailable"))}
        />
        <ActionCard
          label={t("settings.login")}
          value={t("settings.unlinkSocial")}
          onClick={() => toast.info(t("settings.notAvailable"))}
        />
      </div>

      {/* App Version */}
      <div className="pt-4">
        <p className="text-xs text-muted-foreground">{t("settings.appVersion")}</p>
        <p className="text-sm text-foreground">3.36.0</p>
      </div>

      {/* ── Dialogs ── */}

      {/* Language */}
      <Dialog open={openDialog === "language"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("settings.language")}</DialogTitle></DialogHeader>
          <RadioGroup value={locale.language} onValueChange={(v) => { locale.setLanguage(v as Language); setOpenDialog(null); }}>
            {languageOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={opt.value} id={`lang-${opt.value}`} />
                <Label htmlFor={`lang-${opt.value}`} className="font-normal cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>

      {/* Date Format */}
      <Dialog open={openDialog === "dateFormat"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("settings.dateFormat")}</DialogTitle></DialogHeader>
          <RadioGroup value={locale.dateFormat} onValueChange={(v) => { locale.setDateFormat(v as DateFormatOption); setOpenDialog(null); }}>
            {dateFormatOptions.map((opt) => (
              <div key={opt} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={opt} id={`df-${opt}`} />
                <Label htmlFor={`df-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>

      {/* Time Format */}
      <Dialog open={openDialog === "timeFormat"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("settings.timeFormat")}</DialogTitle></DialogHeader>
          <RadioGroup value={locale.timeFormat} onValueChange={(v) => { locale.setTimeFormat(v as TimeFormatOption); setOpenDialog(null); }}>
            {timeFormatOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={opt.value} id={`tf-${opt.value}`} />
                <Label htmlFor={`tf-${opt.value}`} className="font-normal cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>

      {/* Number Format */}
      <Dialog open={openDialog === "numberFormat"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("settings.numberFormat")}</DialogTitle></DialogHeader>
          <RadioGroup value={locale.numberFormat} onValueChange={(v) => { locale.setNumberFormat(v as NumberFormatOption); setOpenDialog(null); }}>
            {numberFormatOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={opt.value} id={`nf-${opt.value}`} />
                <Label htmlFor={`nf-${opt.value}`} className="font-normal cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>

      {/* Font Size */}
      <Dialog open={openDialog === "fontSize"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("settings.fontSize")}</DialogTitle></DialogHeader>
          <RadioGroup value={locale.fontSize} onValueChange={(v) => { locale.setFontSize(v as FontSizeOption); setOpenDialog(null); }}>
            {fontSizeOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={opt.value} id={`fs-${opt.value}`} />
                <Label htmlFor={`fs-${opt.value}`} className="font-normal cursor-pointer">
                  {opt.label} <span className="text-muted-foreground text-xs">— {opt.desc}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PreferenceCard({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="font-medium text-foreground">{value}</p>
        </div>
        <button
          onClick={onClick}
          className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={`Edit ${label}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}

function ActionCard({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="font-medium text-foreground">{value}</p>
        </div>
        <button
          onClick={onClick}
          className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={`Open ${label}`}
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
