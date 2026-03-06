import { useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleAlert, CheckCircle, ExternalLink, Check, Target } from "lucide-react";
import { IconStatusBanner } from "@/components/agent/IconStatusBanner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";

type YearOption = { value: string; label: string };

function YearToggle({
  options,
  value,
  onChange,
  label,
}: {
  options: YearOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={value === opt.value ? "default" : "secondary"}
            className="min-h-[44px] px-3 text-xs font-medium"
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto min-w-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const cappingYearOptions: YearOption[] = [
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
];

const benefitYearOptions: YearOption[] = [
  { value: "2025-2026", label: "2025-26" },
  { value: "2024-2025", label: "2024-25" },
  { value: "2023-2024", label: "2023-24" },
];

export default function IconProgram() {
  const { t } = useTranslation();
  useDocumentTitle(t("icon.title"));
  const [activeTab, setActiveTab] = useState("production");
  const [cappingYear, setCappingYear] = useState("2026");
  const [benefitYear, setBenefitYear] = useState("2025-2026");

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        {/* Page Title */}
        <h1 className="text-page-title font-semibold text-foreground">{t("icon.title")}</h1>

        {/* Compact Hero Banner */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--exp-navy))] via-[hsl(var(--exp-navy-light))] to-[hsl(var(--exp-blue))] p-4 sm:p-6 text-white">
          {/* Decorative background */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-[hsl(var(--exp-gold))]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[hsl(var(--exp-gold))]/20 text-[hsl(var(--exp-gold-light))] border-[hsl(var(--exp-gold))]/30 hover:bg-[hsl(var(--exp-gold))]/30">
                <Target className="me-1 h-3 w-3" />
                {t("icon.programBadge")}
              </Badge>
            </div>
            <p className="text-page-title font-bold text-white mb-1">{t("icon.pillarsComplete").replace("{pct}", "33")}</p>
            <p className="text-sm text-white/70">{t("icon.keepGoing")}</p>
          </div>
        </Card>

        {/* Status Summary Banner */}
        <IconStatusBanner activeTab={activeTab} onTabChange={setActiveTab} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* ICON Production Tab */}
          <TabsContent value="production">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-sm font-semibold text-foreground">{t("icon.productionOverview")}</h2>
              <YearToggle options={cappingYearOptions} value={cappingYear} onChange={setCappingYear} label={t("icon.cappingYear")} />
            </div>


            {/* Top Row: Company Commission + Capped Transaction Fees */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-foreground">{t("icon.companyCommission")}</h3>
                  <Progress value={26.16} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">$4,186.17</span>
                    <span className="text-sm font-medium text-foreground">26.16%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("icon.completeGoal").replace("{amount}", "$16K").replace("{goal}", t("icon.companyCommission").toLowerCase())}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-foreground">{t("icon.cappedTransactionFees")}</h3>
                  <Progress value={0} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">$0.00</span>
                    <span className="text-sm font-medium text-foreground">0%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("icon.completeGoal").replace("{amount}", "$5K").replace("{goal}", t("icon.cappedTransactionFees").toLowerCase())}
                  </p>
                </CardContent>
              </Card>
            </div>


            {/* Qualify - Option 2 */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-section-title font-medium">{t("icon.qualifyOption2")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Company Commission */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">{t("icon.companyCommission")}</h4>
                    <Progress value={26.16} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">$4,186.17</span>
                      <span className="text-sm font-medium text-foreground">26.16%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("common.goal")}: $16K</p>
                  </div>

                  {/* GCI */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">{t("icon.gci")}</h4>
                    <Progress value={4.19} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">$20,930.87</span>
                      <span className="text-sm font-medium text-foreground">4.19%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("common.goal")}: $500K</p>
                  </div>

                  {/* Closed Transactions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">{t("icon.closedTransactions")}</h4>
                    <Progress value={50} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">5 of 10</span>
                      <span className="text-sm font-medium text-foreground">50%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("icon.closeTxns").replace("{count}", "10")}</p>
                  </div>

                  {/* ICON Qualifying Fee */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">{t("icon.qualifyingFee")}</h4>
                    <Badge variant="destructive" className="mt-1">{t("icon.notPaid")}</Badge>
                    <p className="text-xs text-muted-foreground">
                      {t("icon.qualifyingFeeNote")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> {t("icon.noteProduction")}{" "}
                <a href="mailto:iconaward@exprealty.net" className="text-primary hover:underline">
                  iconaward@exprealty.net
                </a>{" "}
                {t("icon.toInquire")}
              </p>
            </div>
          </TabsContent>

          {/* ICON Cultural Tab */}
          <TabsContent value="cultural">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-sm font-semibold text-foreground">{t("icon.culturalTitle")}</h2>
              <YearToggle options={benefitYearOptions} value={benefitYear} onChange={setBenefitYear} label={t("icon.benefitYear")} />
            </div>

            {/* Compact success banner */}
            <div className="bg-[hsl(var(--exp-green))]/10 border border-[hsl(var(--exp-green))]/20 rounded-lg p-3 flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--exp-green))] flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                You have achieved your ICON Cultural goal for 2025 – 2026
              </span>
            </div>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> In the month following completion of the Cultural Requirements during the ICON Cultural Benefit Year, a final audit will be completed to verify if the ICON agent has met the Cultural Commitment points requirements to earn the additional stock award.
              </p>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-sm font-semibold text-foreground">Event Overview</h2>
              <YearToggle options={benefitYearOptions} value={benefitYear} onChange={setBenefitYear} label="Benefit Year" />
            </div>

            {/* Compact success banner */}
            <div className="bg-[hsl(var(--exp-green))]/10 border border-[hsl(var(--exp-green))]/20 rounded-lg p-3 flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--exp-green))] flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                You have achieved your events goal for 2025 – 2026
              </span>
            </div>

            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Events Attended</h3>
                  <span className="text-stat-value font-bold text-foreground">02</span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-muted-foreground">Goal</span>
                  <div className="flex-1">
                    <Progress value={100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-foreground">100%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Attend 2 events to achieve the goal</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-foreground">
                      <span className="font-medium">Event 1</span>: Regional Rally Spring 2025
                    </span>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Attended
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-foreground">
                      <span className="font-medium">Event 2</span>: EXPCON 2025
                    </span>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Attended
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> ICON agents have the opportunity to earn a stock award of up to an additional $4,000 worth of EXPI common stock in the month following attendance of eXp approved events; a stock award of $2,000 worth of EXPI common stock will be issued for each event attended, for a maximum of two events per ICON Cultural Benefit Year.
              </p>
            </div>
          </TabsContent>

          {/* Stock Grants Tab */}
          <TabsContent value="stockgrants">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-sm font-semibold text-foreground">Grants Overview</h2>
              <YearToggle options={benefitYearOptions} value={benefitYear} onChange={setBenefitYear} label="Benefit Year" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                { title: "Production", amount: "$8,000" },
                { title: "Cultural", amount: "$4,000" },
                { title: "Event 1", amount: "$2,000" },
                { title: "Event 2", amount: "$2,000" },
              ].map((grant) => (
                <Card key={grant.title} className="border-t-2 border-t-[hsl(var(--exp-green))]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{grant.title}</h3>
                      <p className="text-section-title font-bold text-foreground mt-1">{grant.amount}</p>
                    </div>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Awarded
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mb-4">
              <a
                href="https://www.morganstanley.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open Morgan Stanley at Work
              </a>
            </div>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> All stock awards are subject to a one month delay, and will be posted by the last day of the month following the award date.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
