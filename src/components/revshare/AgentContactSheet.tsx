import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Building2, Award, Users } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import type { RevShareGroupAgent } from "@/pages/revshare/RevShareGroup";

// Deterministic avatar from agent name
const avatarUrls: Record<string, string> = {
  "Rachel Morrison": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "Daniel Crawford": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "Amanda Chen-Rodriguez": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "Marcus Anthony Blake": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "Jennifer Walsh": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "Sarah Johnson": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "Robert Martinez": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
  "Emily Davis": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface AgentContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: RevShareGroupAgent | null;
}

export function AgentContactSheet({ open, onOpenChange, agent }: AgentContactSheetProps) {
  const { formatCurrency, formatNumber } = useFormatters();
  const { t } = useTranslation();

  if (!agent) return null;

  const avatarUrl = avatarUrls[agent.agentName] || "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0" aria-label={`${agent.agentName} contact card`}>
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header with avatar */}
            <SheetHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarImage src={avatarUrl} alt={agent.agentName} />
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {getInitials(agent.agentName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-bold text-foreground font-primary">
                    {agent.agentName}
                  </SheetTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        agent.status === "Active"
                          ? "bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10"
                          : agent.status === "Offboarding"
                          ? "bg-exp-gold/10 text-exp-gold border-exp-gold/20 hover:bg-exp-gold/10"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                    >
                      {agent.status}
                    </Badge>
                    {agent.icon === "Yes" && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                        <Award className="h-3 w-3 mr-1" />
                        ICON
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-secondary">{agent.agentId}</p>
                </div>
              </div>
            </SheetHeader>

            <Separator />

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {t("profile.contact")}
              </h3>
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/50 transition-colors min-h-[44px] group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-primary group-hover:underline truncate">{agent.email}</p>
                  <p className="text-xs text-muted-foreground">{t("revgroup.email")}</p>
                </div>
              </a>
              <a
                href={`tel:${agent.phoneNumber.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/50 transition-colors min-h-[44px] group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-primary group-hover:underline">{agent.phoneNumber}</p>
                  <p className="text-xs text-muted-foreground">{t("revgroup.phoneNumber")}</p>
                </div>
              </a>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {t("revgroup.location")}
              </h3>
              <div className="flex items-center gap-3 p-2.5 -mx-2.5 min-h-[44px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    {agent.city}{agent.state ? `, ${agent.state}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("revgroup.city")} / {t("revgroup.state")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 -mx-2.5 min-h-[44px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{agent.stateOfPrimaryLicense}</p>
                  <p className="text-xs text-muted-foreground">{t("revgroup.stateOfPrimaryLicense")}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Sponsor */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {t("revgroup.agentSponsorName")}
              </h3>
              <div className="flex items-center gap-3 p-2.5 -mx-2.5 min-h-[44px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-sm text-foreground">{agent.agentSponsorName}</p>
              </div>
            </div>

            <Separator />

            {/* Production */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {t("revgroup.production")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-card p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{t("revgroup.totalRevenueShare")}</p>
                  <p className="text-lg font-bold text-foreground font-secondary">
                    {formatCurrency(agent.totalRevenueShare)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{t("revgroup.revenueShareEarned")}</p>
                  <p className="text-lg font-bold text-foreground font-secondary">
                    {formatCurrency(agent.revenueShareEarned)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{t("revgroup.totalVolume")}</p>
                  <p className="text-lg font-bold text-foreground font-secondary">
                    {formatCurrency(agent.totalVolume)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{t("revgroup.totalUnits")}</p>
                  <p className="text-lg font-bold text-foreground font-secondary">
                    {formatNumber(agent.totalUnits)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{t("revgroup.totalGci")}</p>
                  <p className="text-lg font-bold text-foreground font-secondary">
                    {formatCurrency(agent.totalGci)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">{t("revgroup.groupSize")}</p>
                  <p className="text-lg font-bold text-foreground font-secondary">
                    {formatNumber(agent.groupSize)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}