// OrganizationTree.tsx — Complete self-contained Organization Tree page

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Contact, Award, Users, UserPlus, Trophy, ShieldCheck, ChevronRight, ArrowLeft, TrendingUp, DollarSign, Network, ArrowUpDown } from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { AgentContactSheet, type AgentContactData } from "@/components/revshare/AgentContactSheet";
import { UniversalFilterBar } from "@/components/filters";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════
// DATA TYPES
// ═══════════════════════════════════════════════════════
interface OrgTreeAgent {
  id: number;
  name: string;
  location: string;
  level: number;
  revShare: number;
  contribution: number;
  orgSize: number;
  avatar: string;
  icon?: boolean;
  children?: OrgTreeAgent[];
  contactData?: AgentContactData;
}

// ═══════════════════════════════════════════════════════
// MOCK DATA FACTORY
// ═══════════════════════════════════════════════════════
const makeContact = (name: string, avatar: string, overrides?: Partial<AgentContactData>): AgentContactData => ({
  agentName: name,
  agentId: `AGT-${Math.floor(100000 + Math.random() * 900000)}`,
  email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ").slice(-1)[0].toLowerCase()}@exp.com`,
  phoneNumber: `(${Math.floor(200 + Math.random() * 800)}) 555-${String(Math.floor(1000 + Math.random() * 9000))}`,
  city: overrides?.city || "Roseville",
  state: overrides?.state || "CA",
  stateOfPrimaryLicense: overrides?.stateOfPrimaryLicense || "CA",
  agentSponsorName: overrides?.agentSponsorName || "Michael Thompson",
  status: "Active",
  icon: overrides?.icon || "No",
  capPct: overrides?.capPct ?? Math.floor(40 + Math.random() * 60),
  totalRevenueShare: overrides?.totalRevenueShare ?? Math.floor(1000 + Math.random() * 9000),
  revenueShareEarned: overrides?.revenueShareEarned ?? Math.floor(500 + Math.random() * 12000),
  totalVolume: overrides?.totalVolume ?? Math.floor(2000000 + Math.random() * 8000000),
  totalUnits: overrides?.totalUnits ?? Math.floor(5 + Math.random() * 30),
  totalGci: overrides?.totalGci ?? Math.floor(50000 + Math.random() * 250000),
  groupSize: overrides?.groupSize ?? 0,
  avatarUrl: avatar,
});

// ═══════════════════════════════════════════════════════
// MOCK ORG TREE (5 levels deep)
// ═══════════════════════════════════════════════════════
const orgTree: OrgTreeAgent[] = [
  {
    id: 0, name: "Robert Alan Crawford", location: "San Francisco, CA", level: 1,
    revShare: 48520.44, contribution: 0, orgSize: 22, icon: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Robert Alan Crawford", "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", { icon: "Yes", city: "San Francisco", groupSize: 22, totalRevenueShare: 48520.44 }),
    children: [
      {
        id: 50, name: "Jennifer Marie Dawson", location: "Sacramento, CA", level: 2,
        revShare: 36522.44, contribution: 0, orgSize: 20, icon: true,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        contactData: makeContact("Jennifer Marie Dawson", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", { icon: "Yes", city: "Sacramento", groupSize: 20, totalRevenueShare: 36522.44, agentSponsorName: "Robert Alan Crawford" }),
        children: [
          {
            id: 1, name: "Samantha Rose Bennett", location: "Roseville, CA", level: 3,
            revShare: 6487.88, contribution: 53.51, orgSize: 5, icon: true,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
            contactData: makeContact("Samantha Rose Bennett", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", { icon: "Yes", capPct: 88, groupSize: 5, totalRevenueShare: 6487.88, agentSponsorName: "Jennifer Marie Dawson" }),
            children: [
              {
                id: 101, name: "Kevin Park", location: "Roseville, CA", level: 4, revShare: 1245.00, contribution: 0, orgSize: 3,
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
                contactData: makeContact("Kevin Park", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett", groupSize: 3 }),
                children: [
                  { id: 1011, name: "Liam Chen", location: "Folsom, CA", level: 5, revShare: 420.00, contribution: 420.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Liam Chen", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Kevin Park" }) },
                  { id: 1012, name: "Olivia Foster", location: "Sacramento, CA", level: 5, revShare: 380.00, contribution: 380.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Olivia Foster", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Kevin Park" }) },
                  { id: 1013, name: "Noah Williams", location: "Elk Grove, CA", level: 5, revShare: 445.00, contribution: 445.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Noah Williams", "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Kevin Park" }) },
                ],
              },
              { id: 102, name: "Diana Reyes", location: "Sacramento, CA", level: 4, revShare: 987.50, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Diana Reyes", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett" }) },
              { id: 103, name: "Thomas Grant", location: "Lincoln, CA", level: 4, revShare: 2100.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Thomas Grant", "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett" }) },
              { id: 104, name: "Priya Sharma", location: "Folsom, CA", level: 4, revShare: 1560.00, contribution: 0, orgSize: 0, icon: true, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Priya Sharma", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", { icon: "Yes", agentSponsorName: "Samantha Rose Bennett" }) },
              { id: 105, name: "Carlos Mendez", location: "Roseville, CA", level: 4, revShare: 595.38, contribution: 595.38, orgSize: 0, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Carlos Mendez", "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett" }) },
            ],
          },
          {
            id: 2, name: "Derek James Sullivan", location: "Lincoln, CA", level: 3,
            revShare: 8234.56, contribution: 0, orgSize: 3,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            contactData: makeContact("Derek James Sullivan", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", { city: "Lincoln", groupSize: 3, totalRevenueShare: 8234.56, agentSponsorName: "Jennifer Marie Dawson" }),
            children: [
              { id: 201, name: "Rachel Kim", location: "Lincoln, CA", level: 4, revShare: 3100.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Rachel Kim", "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Lincoln" }) },
              { id: 202, name: "Jason Ortiz", location: "Rocklin, CA", level: 4, revShare: 2800.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Jason Ortiz", "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Rocklin" }) },
              { id: 203, name: "Emily Watson", location: "Auburn, CA", level: 4, revShare: 2334.56, contribution: 2334.56, orgSize: 0, avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Emily Watson", "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Auburn" }) },
            ],
          },
          { id: 3, name: "Natalie Grace Harper", location: "Roseville, CA", level: 3, revShare: 4980.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Natalie Grace Harper", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", { totalRevenueShare: 4980, agentSponsorName: "Jennifer Marie Dawson" }) },
          {
            id: 4, name: "Marcus Antonio Rivera", location: "Folsom, CA", level: 3,
            revShare: 3890.00, contribution: 0, orgSize: 2,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            contactData: makeContact("Marcus Antonio Rivera", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", { city: "Folsom", groupSize: 2, totalRevenueShare: 3890, agentSponsorName: "Jennifer Marie Dawson" }),
            children: [
              { id: 401, name: "Sophie Turner", location: "Folsom, CA", level: 4, revShare: 1940.00, contribution: 1940.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Sophie Turner", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Marcus Antonio Rivera", city: "Folsom" }) },
              { id: 402, name: "David Nguyen", location: "El Dorado Hills, CA", level: 4, revShare: 1950.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face", contactData: makeContact("David Nguyen", "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Marcus Antonio Rivera", city: "El Dorado Hills" }) },
            ],
          },
          { id: 5, name: "Christopher Paul Mitchell", location: "Citrus Heights, CA", level: 3, revShare: 2890.00, contribution: 0, orgSize: 0, icon: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Christopher Paul Mitchell", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", { icon: "Yes", city: "Citrus Heights", totalRevenueShare: 2890, agentSponsorName: "Jennifer Marie Dawson" }) },
          { id: 6, name: "Victoria Lynn Patterson", location: "Orangevale, CA", level: 3, revShare: 2420.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Victoria Lynn Patterson", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", { city: "Orangevale", totalRevenueShare: 2420, agentSponsorName: "Jennifer Marie Dawson" }) },
          { id: 7, name: "Amanda Claire Foster", location: "Roseville, CA", level: 3, revShare: 2215.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Amanda Claire Foster", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", { totalRevenueShare: 2215, agentSponsorName: "Jennifer Marie Dawson" }) },
          { id: 8, name: "Brandon Lee Cooper", location: "Elk Grove, CA", level: 3, revShare: 2100.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Brandon Lee Cooper", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", { city: "Elk Grove", totalRevenueShare: 2100, agentSponsorName: "Jennifer Marie Dawson" }) },
          { id: 9, name: "Melissa Ann Richardson", location: "Citrus Heights, CA", level: 3, revShare: 1815.00, contribution: 1815.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Melissa Ann Richardson", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", { city: "Citrus Heights", totalRevenueShare: 1815, agentSponsorName: "Jennifer Marie Dawson" }) },
          { id: 10, name: "Tyler James Henderson", location: "Granite Bay, CA", level: 3, revShare: 1490.00, contribution: 0, orgSize: 0, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Tyler James Henderson", "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", { city: "Granite Bay", totalRevenueShare: 1490, agentSponsorName: "Jennifer Marie Dawson" }) },
        ],
      },
      {
        id: 51, name: "Patrick Wayne Douglas", location: "Oakland, CA", level: 2,
        revShare: 11998.00, contribution: 0, orgSize: 2,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        contactData: makeContact("Patrick Wayne Douglas", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", { city: "Oakland", groupSize: 2, totalRevenueShare: 11998, agentSponsorName: "Robert Alan Crawford" }),
        children: [
          { id: 511, name: "Grace Liu", location: "Oakland, CA", level: 3, revShare: 5200.00, contribution: 5200.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Grace Liu", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Patrick Wayne Douglas", city: "Oakland" }) },
          { id: 512, name: "Ryan Mitchell", location: "Berkeley, CA", level: 3, revShare: 6798.00, contribution: 6798.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Ryan Mitchell", "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Patrick Wayne Douglas", city: "Berkeley" }) },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// STYLE HELPERS
// ═══════════════════════════════════════════════════════
const getLevelBorderColor = (level: number) => {
  const colors: Record<number, string> = {
    1: "border-l-exp-gold",
    2: "border-l-exp-blue",
    3: "border-l-exp-slate-blue",
    4: "border-l-exp-moss-grey",
    5: "border-l-exp-charcoal-blue",
  };
  return colors[level] || "border-l-muted-foreground";
};

const getLevelBadgeStyle = (level: number) => {
  const styles: Record<number, string> = {
    1: "bg-exp-gold/15 text-exp-gold border-exp-gold/30",
    2: "bg-exp-blue/15 text-exp-blue border-exp-blue/30",
    3: "bg-exp-slate-blue/15 text-exp-slate-blue border-exp-slate-blue/30",
    4: "bg-exp-moss-grey/15 text-exp-moss-grey border-exp-moss-grey/30",
    5: "bg-exp-charcoal-blue/15 text-exp-charcoal-blue border-exp-charcoal-blue/30",
  };
  return styles[level] || "bg-muted text-muted-foreground border-border";
};

// ═══════════════════════════════════════════════════════
// HERO STAT COMPONENT
// ═══════════════════════════════════════════════════════
function HeroStat({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-white/60" />
        <p className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">{label}</p>
      </div>
      <p className={`text-lg font-bold font-secondary tabular-nums ${accent || "text-white"}`}>{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// AGENT CARD COMPONENT
// ═══════════════════════════════════════════════════════
function AgentCard({
  agent,
  onClick,
  onOpenContact,
  index,
}: {
  agent: OrgTreeAgent;
  onClick?: () => void;
  onOpenContact?: () => void;
  index: number;
}) {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card className={`overflow-hidden transition-shadow hover:shadow-md border-l-4 ${getLevelBorderColor(agent.level)}`}>
        <CardContent className="p-5 flex flex-col gap-3">
          {/* ── Top: Agent info ── */}
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              {/* Avatar with optional ICON badge */}
              <Avatar className="h-14 w-14">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback className="bg-muted text-sm font-semibold">
                  {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {agent.icon && (
                <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                  <Award className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Name, location, badges */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-[15px] leading-tight truncate">
                {agent.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {agent.location}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0 rounded-full ${getLevelBadgeStyle(agent.level)}`}>
                  L{agent.level}
                </Badge>
                {agent.icon && (
                  <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0 rounded-full bg-exp-green/15 text-exp-green border-exp-green/30">
                    ICON
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact button */}
            {onOpenContact && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onOpenContact(); }}
                className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label={`View contact – ${agent.name}`}
              >
                <Contact className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* ── Middle: 3-column stats bar ── */}
          <div className="border-t border-border pt-3">
            <div className="grid grid-cols-3 divide-x divide-border text-center">
              <div className="px-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Rev Share
                </p>
                <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
                  {formatCurrency(agent.revShare)}
                </p>
              </div>
              <div className="px-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Contribution
                </p>
                <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
                  {formatCurrency(agent.contribution)}
                </p>
              </div>
              <div className="px-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Org Size
                </p>
                <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
                  {agent.orgSize}
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom: View Org button ── */}
          {hasChildren && (
            <div className="border-t border-border pt-2">
              <button
                onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors py-1"
                aria-label={`View Org – ${agent.name}`}
              >
                <Users className="h-3.5 w-3.5" />
                View Org ({agent.orgSize})
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// PATH RIBBON NAVIGATION
// ═══════════════════════════════════════════════════════
function PathRibbon({
  navStack,
  onNavigate,
}: {
  navStack: OrgTreeAgent[];
  onNavigate: (index: number) => void;
}) {
  const ancestors = [
    { id: -1, name: "Michael Thompson", level: 0, avatar: "" },
    ...navStack.map(a => ({ id: a.id, name: a.name, level: a.level, avatar: a.avatar })),
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap px-1 py-2">
      {ancestors.map((agent, i) => {
        const isLast = i === ancestors.length - 1;
        const firstName = agent.name.split(" ")[0];
        const lastName = agent.name.split(" ").slice(-1)[0];

        return (
          <div key={agent.id} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-white/40 shrink-0" />
            )}
            <button
              onClick={() => !isLast && onNavigate(i - 1)}
              disabled={isLast}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isLast
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              {agent.avatar ? (
                <Avatar className="h-5 w-5">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback className="text-[8px] bg-white/20">
                    {firstName[0]}{lastName[0]}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Users className="h-3.5 w-3.5" />
              )}
              {firstName} {lastName}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════
export default function OrganizationTree() {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  useDocumentTitle(t("nav.organizationTree"));

  const [navStack, setNavStack] = useState<OrgTreeAgent[]>([]);
  const [sortOrder, setSortOrder] = useState<"high-low" | "low-high">("high-low");
  const [contactSheetOpen, setContactSheetOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<AgentContactData | null>(null);

  const currentAgent = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  const unsortedAgents = currentAgent?.children ?? orgTree;
  const displayedAgents = [...unsortedAgents].sort((a, b) =>
    sortOrder === "high-low" ? b.revShare - a.revShare : a.revShare - b.revShare
  );

  const flaCount = displayedAgents.length;
  const headerName = currentAgent ? currentAgent.name : "Michael Thompson";
  const headerLevel = currentAgent ? currentAgent.level : 0;

  const totalRevShare = displayedAgents.reduce((sum, a) => sum + a.revShare, 0);
  const totalOrg = displayedAgents.reduce((sum, a) => sum + a.orgSize, 0) + displayedAgents.length;
  const iconCount = displayedAgents.filter(a => a.icon).length;

  const handleDrillDown = (agent: OrgTreeAgent) => {
    if (agent.children && agent.children.length > 0) {
      setNavStack((prev) => [...prev, agent]);
    }
  };

  const handleNavigate = (index: number) => {
    if (index < 0) {
      setNavStack([]);
    } else {
      setNavStack((prev) => prev.slice(0, index + 1));
    }
  };

  const handleOpenContact = (agent: OrgTreeAgent) => {
    if (agent.contactData) {
      setSelectedContact(agent.contactData);
      setContactSheetOpen(true);
    }
  };

  return (
    <DashboardLayout>
      {/* Page title bar */}
      <UniversalFilterBar
        title={t("nav.organizationTree")}
        subtitle={t("orgTree.viewInBeta")}
      />

      {/* ── Hero Stats Banner ── */}
      <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <Network className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">{headerName}</p>
                <p className="text-white/60 text-sm">
                  Level {headerLevel} • {flaCount} FLAs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <HeroStat icon={DollarSign} label="Total Rev Share" value={formatCurrency(totalRevShare)} />
              <HeroStat icon={Users} label="Direct FLAs" value={flaCount} />
              <HeroStat icon={Network} label="Total Org" value={totalOrg} />
              <HeroStat icon={TrendingUp} label="ICON Agents" value={iconCount} accent="text-exp-green" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Performance Snapshot ── */}
      <div className="mb-6">
        <p className="text-section-title font-semibold text-foreground mb-3">Performance Snapshot</p>
        <div className="rounded-xl bg-muted/30 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: totalOrg, label: "Total Organization Size" },
              { value: flaCount, label: "Agents who have joined the organization (year-to-date)" },
              { value: iconCount, label: "Agents with ICON status" },
              { value: 2, label: "Count of Team Leaders" },
            ].map((stat) => (
              <Card key={stat.label} className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <p className="text-stat-value font-bold text-foreground font-secondary tabular-nums">{stat.value}</p>
                  <Info className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-1" />
                </div>
                <p className="text-xs text-muted-foreground leading-snug mt-2">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Path Ribbon (appears when drilled in) ── */}
      <AnimatePresence>
        {navStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 rounded-lg bg-gradient-to-r from-exp-dark-navy to-exp-charcoal-blue overflow-hidden"
          >
            <PathRibbon navStack={navStack} onNavigate={handleNavigate} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter & Actions bar ── */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(prev => prev === "high-low" ? "low-high" : "high-low")}
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
          RevShare {sortOrder === "high-low" ? "↓" : "↑"}
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
      </div>

      {/* ── Agent Card Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedAgents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onClick={() => handleDrillDown(agent)}
            onOpenContact={agent.contactData ? () => handleOpenContact(agent) : undefined}
            index={index}
          />
        ))}
      </div>

      {/* ── Contact Sheet ── */}
      <AgentContactSheet
        open={contactSheetOpen}
        onOpenChange={setContactSheetOpen}
        agent={selectedContact}
      />
    </DashboardLayout>
  );
}
