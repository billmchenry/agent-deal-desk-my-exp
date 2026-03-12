import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Search, X, Contact, Award, Users, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { AgentContactSheet, type AgentContactData } from "@/components/revshare/AgentContactSheet";
import { UniversalFilterBar } from "@/components/filters";

// --- Data types ---
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

// --- Mock data (reduced to ~10 top-level, with nested children) ---
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

const orgTree: OrgTreeAgent[] = [
  {
    id: 1, name: "Robert Alan Crawford", location: "San Francisco, CA", level: 1,
    revShare: 48520.44, contribution: 0, orgSize: 22, icon: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Robert Alan Crawford", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", { icon: "Yes", city: "San Francisco", state: "CA", stateOfPrimaryLicense: "CA", capPct: 92, groupSize: 22, totalRevenueShare: 48520.44 }),
    children: [
      {
        id: 101, name: "Karen Elizabeth Mitchell", location: "Oakland, CA", level: 2, revShare: 8450.00, contribution: 2100.00, orgSize: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        contactData: makeContact("Karen Elizabeth Mitchell", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Oakland", groupSize: 5 }),
        children: [
          { id: 1011, name: "Liam Chen", location: "Berkeley, CA", level: 3, revShare: 1420.00, contribution: 1420.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Liam Chen", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Karen Elizabeth Mitchell", city: "Berkeley" }) },
          { id: 1012, name: "Olivia Foster", location: "Walnut Creek, CA", level: 3, revShare: 1380.00, contribution: 1380.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Olivia Foster", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Karen Elizabeth Mitchell", city: "Walnut Creek" }) },
          { id: 1013, name: "Noah Williams", location: "Concord, CA", level: 3, revShare: 1245.00, contribution: 1245.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Noah Williams", "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Karen Elizabeth Mitchell", city: "Concord" }) },
          { id: 1014, name: "Sophia Patel", location: "Fremont, CA", level: 3, revShare: 980.00, contribution: 980.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Sophia Patel", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Karen Elizabeth Mitchell", city: "Fremont" }) },
          { id: 1015, name: "Ethan Brooks", location: "San Leandro, CA", level: 3, revShare: 1325.00, contribution: 1325.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Ethan Brooks", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Karen Elizabeth Mitchell", city: "San Leandro" }) },
        ],
      },
      {
        id: 102, name: "Derek James Sullivan", location: "San Jose, CA", level: 2, revShare: 7820.00, contribution: 1500.00, orgSize: 4,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        contactData: makeContact("Derek James Sullivan", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "San Jose", groupSize: 4 }),
        children: [
          { id: 1021, name: "Rachel Kim", location: "Santa Clara, CA", level: 3, revShare: 2100.00, contribution: 2100.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Rachel Kim", "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Santa Clara" }) },
          { id: 1022, name: "Jason Ortiz", location: "Sunnyvale, CA", level: 3, revShare: 1800.00, contribution: 1800.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Jason Ortiz", "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Sunnyvale" }) },
          { id: 1023, name: "Emily Watson", location: "Mountain View, CA", level: 3, revShare: 1220.00, contribution: 1220.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Emily Watson", "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Mountain View" }) },
          { id: 1024, name: "Marcus Pham", location: "Palo Alto, CA", level: 3, revShare: 1200.00, contribution: 1200.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Marcus Pham", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Palo Alto" }) },
        ],
      },
      {
        id: 103, name: "Natalie Grace Harper", location: "Daly City, CA", level: 2, revShare: 6200.00, contribution: 1800.00, orgSize: 3,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        contactData: makeContact("Natalie Grace Harper", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Daly City", groupSize: 3 }),
        children: [
          { id: 1031, name: "Sophie Turner", location: "South San Francisco, CA", level: 3, revShare: 1600.00, contribution: 1600.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Sophie Turner", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Natalie Grace Harper", city: "South San Francisco" }) },
          { id: 1032, name: "David Nguyen", location: "San Mateo, CA", level: 3, revShare: 1400.00, contribution: 1400.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face", contactData: makeContact("David Nguyen", "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Natalie Grace Harper", city: "San Mateo" }) },
          { id: 1033, name: "Amanda Reeves", location: "Redwood City, CA", level: 3, revShare: 1400.00, contribution: 1400.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Amanda Reeves", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Natalie Grace Harper", city: "Redwood City" }) },
        ],
      },
      { id: 104, name: "Christopher Paul Mitchell", location: "Richmond, CA", level: 2, revShare: 4890.00, contribution: 4890.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Christopher Paul Mitchell", "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Richmond" }) },
      { id: 105, name: "Victoria Lynn Patterson", location: "Hayward, CA", level: 2, revShare: 4320.00, contribution: 4320.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Victoria Lynn Patterson", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Hayward" }) },
      { id: 106, name: "Brandon Lee Cooper", location: "Pleasanton, CA", level: 2, revShare: 3980.00, contribution: 3980.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Brandon Lee Cooper", "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Pleasanton" }) },
      { id: 107, name: "Melissa Ann Richardson", location: "Livermore, CA", level: 2, revShare: 3540.00, contribution: 3540.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Melissa Ann Richardson", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Livermore" }) },
      { id: 108, name: "Tyler James Henderson", location: "Dublin, CA", level: 2, revShare: 3120.00, contribution: 3120.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Tyler James Henderson", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Dublin" }) },
      { id: 109, name: "Priya Sharma", location: "Castro Valley, CA", level: 2, revShare: 2890.00, contribution: 2890.00, orgSize: 0, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Priya Sharma", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Castro Valley" }) },
      { id: 110, name: "Carlos Mendez", location: "Union City, CA", level: 2, revShare: 3310.44, contribution: 3310.44, orgSize: 0, avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Carlos Mendez", "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Robert Alan Crawford", city: "Union City" }) },
    ],
  },
];

const getLevelBadgeClass = (level: number) => {
  const classes: Record<number, string> = {
    1: "bg-blue-100 text-blue-700 border-blue-200",
    2: "bg-green-100 text-green-700 border-green-200",
    3: "bg-purple-100 text-purple-700 border-purple-200",
    4: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return classes[level] || "bg-muted text-muted-foreground border-border";
};

// Helper to count all agents recursively
function countAllAgents(agents: OrgTreeAgent[]): number {
  return agents.reduce((sum, a) => sum + 1 + (a.children ? countAllAgents(a.children) : 0), 0);
}

function countIconAgents(agents: OrgTreeAgent[]): number {
  return agents.reduce((sum, a) => (a.icon ? 1 : 0) + sum + (a.children ? countIconAgents(a.children) : 0), 0);
}

function sumRevShare(agents: OrgTreeAgent[]): number {
  return agents.reduce((sum, a) => sum + a.revShare + (a.children ? sumRevShare(a.children) : 0), 0);
}

// --- Hero Banner ---
function HeroBanner({
  name,
  level,
  flaCount,
  agents,
}: {
  name: string;
  level: number;
  flaCount: number;
  agents: OrgTreeAgent[];
}) {
  const { formatCurrency } = useFormatters();

  const totalRevShare = useMemo(() => sumRevShare(agents), [agents]);
  const totalOrg = useMemo(() => countAllAgents(agents), [agents]);
  const iconCount = useMemo(() => countIconAgents(agents), [agents]);

  const stats = [
    { label: "TOTAL REV SHARE", value: formatCurrency(totalRevShare), highlight: false },
    { label: "DIRECT FLAS", value: String(flaCount), highlight: false },
    { label: "TOTAL ORG", value: String(totalOrg), highlight: false },
    { label: "ICON AGENTS", value: String(iconCount), highlight: true },
  ];

  return (
    <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-4">
          {/* Agent info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">{name}</p>
              <p className="text-white/60 text-sm">Level {level} • {flaCount} FLAs</p>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5"
              >
                <p className="text-[10px] font-semibold tracking-wider text-white/60 uppercase mb-1">
                  {stat.label}
                </p>
                <p className={`text-lg font-bold font-secondary tabular-nums ${stat.highlight ? "text-exp-green" : "text-white"}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Agent Card Component ---
function AgentCard({
  agent,
  onClick,
  onOpenContact,
}: {
  agent: OrgTreeAgent;
  onClick?: () => void;
  onOpenContact?: () => void;
}) {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md border-l-4 border-l-amber-400">
      <CardContent className="p-5 flex flex-col gap-3">
        {/* Top: Avatar + Name/Location + Contact icon */}
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={agent.avatar} />
              <AvatarFallback className="bg-muted">
                {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {agent.icon && (
              <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                <Award className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-[15px] leading-tight">{agent.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{agent.location}</p>
          </div>
          {onOpenContact && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onOpenContact(); }}
              className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label={`${t("common.viewContact")} – ${agent.name}`}
            >
              <Contact className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Level + ICON badges */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getLevelBadgeClass(agent.level)}`}>
            L{agent.level}
          </Badge>
          {agent.icon && (
            <Badge variant="outline" className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border-green-200">
              ICON
            </Badge>
          )}
        </div>

        {/* 3-column stats with vertical dividers */}
        <div className="border-t border-border pt-3">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="text-center px-2">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                REV SHARE
              </p>
              <p className="text-base font-bold text-foreground font-secondary tabular-nums">
                {formatCurrency(agent.revShare)}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                CONTRIBUTION
              </p>
              <p className="text-base font-bold text-foreground font-secondary tabular-nums">
                {formatCurrency(agent.contribution)}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                ORG SIZE
              </p>
              <p className="text-base font-bold text-foreground font-secondary tabular-nums">
                {agent.orgSize}
              </p>
            </div>
          </div>
        </div>

        {/* View Org link — centered */}
        {hasChildren && (
          <div className="border-t border-border pt-3">
            <button
              onClick={onClick}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors w-full justify-center"
              aria-label={`${t("orgTree.viewOrg")} – ${agent.name}`}
            >
              <Users className="h-4 w-4" />
              {t("orgTree.viewOrg")} ({agent.orgSize})
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Selected Agent Header Card (shown at top when drilled in) ---
function SelectedAgentCard({
  agent,
  breadcrumb,
  onClose,
}: {
  agent: OrgTreeAgent;
  breadcrumb: OrgTreeAgent[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Breadcrumb trail: show parent avatars with dashed connector */}
      {breadcrumb.length > 1 && (
        <div className="flex items-center gap-0">
          {breadcrumb.slice(0, -1).map((parent) => (
            <div key={parent.id} className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-dashed border-muted-foreground/40">
                <AvatarImage src={parent.avatar} />
                <AvatarFallback className="bg-muted text-xs">
                  {parent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="w-6 border-t-2 border-dashed border-muted-foreground/40" />
            </div>
          ))}
        </div>
      )}

      <Card className="overflow-hidden max-w-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-14 w-14">
                <AvatarImage src={agent.avatar} />
                <AvatarFallback className="bg-muted">
                  {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {agent.icon && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Award className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.location}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
                  aria-label="Close and go back"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Badge variant="outline" className={`text-[11px] font-semibold px-2 py-0.5 ${getLevelBadgeClass(agent.level)}`}>
                L{agent.level}
              </Badge>
              <div className="mt-2 space-y-1 text-xs">
                <div>
                  <Badge className="bg-primary text-primary-foreground text-xs font-medium">
                    {t("orgTree.contributedRevShare")}: {formatCurrency(agent.revShare)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {t("orgTree.individualContribution")}: {formatCurrency(agent.contribution)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t("orgTree.orgSize")}: {agent.orgSize}</span>
                  {agent.icon && (
                    <Badge variant="outline" className="text-xs text-primary border-primary">
                      ICON
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Page ---
export default function OrganizationTree() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.organizationTree"));

  // Navigation stack: each entry is the agent whose children we're viewing
  const [navStack, setNavStack] = useState<OrgTreeAgent[]>([]);
  const [contactSheetOpen, setContactSheetOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<AgentContactData | null>(null);

  const currentAgent = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  const displayedAgents = currentAgent?.children ?? orgTree;

  const flaCount = displayedAgents.length;
  const headerName = currentAgent ? currentAgent.name : "Michael Thompson";
  const headerLevel = currentAgent ? currentAgent.level : 0;

  const handleDrillDown = (agent: OrgTreeAgent) => {
    if (agent.children && agent.children.length > 0) {
      setNavStack((prev) => [...prev, agent]);
    }
  };

  const handleGoBack = () => {
    setNavStack((prev) => prev.slice(0, -1));
  };

  const handleOpenContact = (agent: OrgTreeAgent) => {
    if (agent.contactData) {
      setSelectedContact(agent.contactData);
      setContactSheetOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <UniversalFilterBar
          title={t("nav.organizationTree")}
          titleExtra={<span className="text-primary hover:underline cursor-pointer text-sm">{t("orgTree.viewInBeta")}</span>}
        />

        {/* Hero Banner */}
        <HeroBanner
          name={headerName}
          level={headerLevel}
          flaCount={flaCount}
          agents={displayedAgents}
        />

        {/* Selected agent header card when drilled in */}
        {currentAgent && (
          <SelectedAgentCard
            agent={currentAgent}
            breadcrumb={navStack}
            onClose={handleGoBack}
          />
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select defaultValue="high-low">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("orgTree.sortByRevShare")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-low">{t("orgTree.highToLow")}</SelectItem>
              <SelectItem value="low-high">{t("orgTree.lowToHigh")}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t("agent.download")}
          </Button>

          <div className="flex-1" />

          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="ps-9 w-[350px]"
            />
          </div>
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => handleDrillDown(agent)}
              onOpenContact={agent.contactData ? () => handleOpenContact(agent) : undefined}
            />
          ))}
        </div>

        <AgentContactSheet
          open={contactSheetOpen}
          onOpenChange={setContactSheetOpen}
          agent={selectedContact}
        />
      </div>
    </DashboardLayout>
  );
}
