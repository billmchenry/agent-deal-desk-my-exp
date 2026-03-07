import { useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Phone, MessageSquare, Mail, Globe, QrCode } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mockData";

const DEPARTMENTS = [
  "Expert Care",
  "Revenue Share",
  "Mentor",
  "Stock",
  "ICON",
  "1099",
  "Broker",
  "Unsure",
] as const;

export default function HelpCenter() {
  useDocumentTitle(t("nav.helpCenter"));
  const { t } = useTranslation();
  const [emailOpen, setEmailOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    message: "",
  });

  const handleCallUs = () => {
    window.open("tel:+18334397872", "_self");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        <h1 className="text-page-title font-bold text-foreground">{t("help.title")}</h1>

        <h2 className="text-section-title font-semibold text-foreground">{t("help.getHelp")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Expert Care Desk */}
          <Card className="border bg-muted/20">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-section-title font-semibold">{t("help.expertCareDesk")}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <a
                    href="https://expworld.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline hover:text-primary/80"
                  >
                    Exp world
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <a
                    href="mailto:eXpertCare@exprealty.net"
                    className="text-sm text-primary underline hover:text-primary/80"
                  >
                    eXpertCare@exprealty.net
                  </a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t("help.expertCareAvailable")}</p>
              <Button onClick={handleCallUs} aria-label={t("help.callUs")}>
                {t("help.callUs")}
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="border bg-muted/20">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-section-title font-semibold">{t("help.liveChat")}</h3>
              <p className="text-sm text-muted-foreground">{t("help.liveChatDesc")}</p>
              <p className="text-sm text-muted-foreground">{t("help.liveChatHoursMF")}</p>
              <p className="text-sm text-muted-foreground">{t("help.liveChatHoursWeekend")}</p>
              <Button onClick={() => setChatOpen(true)} aria-label={t("help.startChat")}>
                {t("help.startChat")}
              </Button>
            </CardContent>
          </Card>

          {/* Email Us */}
          <Card className="border bg-muted/20">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-section-title font-semibold">{t("help.emailUs")}</h3>
              <p className="text-sm text-muted-foreground">{t("help.emailUsDesc")}</p>
              <Button onClick={() => setEmailOpen(true)} aria-label={t("help.sendEmail")}>
                {t("help.sendEmail")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Us Sheet */}
      <Sheet open={emailOpen} onOpenChange={setEmailOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t("help.emailUs")}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Department picker */}
            <div className="space-y-3">
              <h3 className="font-semibold">{t("help.chooseDepartment")}</h3>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept) => (
                  <Badge
                    key={dept}
                    variant={selectedDept === dept ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm transition-colors",
                      selectedDept === dept
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedDept(dept)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedDept(dept);
                    }}
                    aria-pressed={selectedDept === dept}
                  >
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <h3 className="font-semibold">{t("help.provideDetails")}</h3>
              <div className="space-y-2">
                <Label htmlFor="help-fullname">{t("help.fullName")}</Label>
                <Input
                  id="help-fullname"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="help-email">{t("help.emailLabel")}</Label>
                <Input
                  id="help-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="help-phone">{t("help.phoneNumber")}</Label>
                <Input
                  id="help-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="help-message">{t("help.typeMessage")}</Label>
                <Textarea
                  id="help-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  maxLength={4000}
                  placeholder={t("help.typeMessage")}
                />
                <p className="text-xs text-muted-foreground text-right tabular-nums">
                  {form.message.length}/4000
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setEmailOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={() => setEmailOpen(false)}>
                {t("help.sendEmail")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Live Chat Sheet (not Mira) */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t("help.liveChatTitle")}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">{t("help.liveChatWelcome")}</p>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("help.liveChatNote")}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
