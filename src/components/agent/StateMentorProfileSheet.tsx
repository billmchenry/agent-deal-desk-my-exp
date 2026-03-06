import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Mail, MapPin, Facebook, Linkedin, Globe, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { StateMentor, Mentee } from "@/data/mentorMockData";
import { mockMentees } from "@/data/mentorMockData";
import { MenteeContactSheet } from "@/components/mentor/MenteeContactSheet";
import { useTranslation } from "@/hooks/useTranslation";

interface StateMentorProfileSheetProps {
  mentor: StateMentor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function StateMentorProfileSheet({ mentor, open, onOpenChange }: StateMentorProfileSheetProps) {
  const { t } = useTranslation();
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);

  if (!mentor) return null;

  const initials = getInitials(mentor.name);
  const mentees = mockMentees.filter((m) => mentor.menteeIds.includes(m.id) && m.status === "Active");

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg p-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-5">
              <SheetHeader className="pb-0">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1 mb-3"
                  onClick={() => onOpenChange(false)}
                  aria-label={t("broker.back")}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {t("broker.back")}
                </button>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="pt-1">
                    <SheetTitle className="text-lg text-left">{mentor.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {mentor.city}, {mentor.state} {mentor.postalCode}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              {/* Bio */}
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <DetailSection title={t("broker.locationsServiced")} items={mentor.locationsServiced} />
                <DetailSection title={t("broker.licenses")} items={mentor.licenses.map((l) => `${l.state} — ${l.number}`)} />
                <DetailSection title={t("broker.languages")} items={mentor.languages} />
                <DetailSection title={t("broker.mls")} items={mentor.mls} />
                <DetailSection title={t("broker.specializations")} items={mentor.specializations} />
                <DetailSection title={t("broker.certifications")} items={mentor.certifications} />
              </div>

              <Separator />

              {/* Contact */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t("broker.contact")}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`tel:${mentor.phone}`}>
                      <Phone className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      {t("broker.call")}
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`mailto:${mentor.primaryEmail}`}>
                      <Mail className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      {t("broker.email")}
                    </a>
                  </Button>
                </div>
                {(mentor.facebook || mentor.linkedin || mentor.website) && (
                  <div className="flex gap-2">
                    {mentor.facebook && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={mentor.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {mentor.linkedin && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {mentor.website && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={mentor.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Active Mentees */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {t("broker.activeMentees")} ({mentees.length})
                </h3>
                {mentees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("broker.noActiveMentees")}</p>
                ) : (
                  <div className="space-y-2">
                    {mentees.map((mentee) => (
                      <button
                        key={mentee.id}
                        type="button"
                        className="w-full flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors text-left cursor-pointer"
                        onClick={() => setSelectedMentee(mentee)}
                        aria-label={`${mentee.agentName} — ${mentee.transactionsRemaining} ${t("broker.txnsRemaining")}`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {getInitials(mentee.agentName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{mentee.agentName}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span>{mentee.transactionsRemaining} {t("broker.txnsRemaining")}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" aria-hidden="true" />
                              {t("broker.joined")} {mentee.joinDate}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <MenteeContactSheet
        open={!!selectedMentee}
        onOpenChange={(o) => { if (!o) setSelectedMentee(null); }}
        mentee={selectedMentee}
      />
    </>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground">{item}</li>
        ))}
      </ul>
    </div>
  );
}
