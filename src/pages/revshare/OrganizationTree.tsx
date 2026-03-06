import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Search, X, Contact, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { AgentContactSheet, type AgentContactData } from "@/components/revshare/AgentContactSheet";

// --- Data types ---
interface OrgTreeAgent {
  id: number;
  name: string;
  location: string;
  level: number;
  revShare: string;
  contribution: string;
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
    id: 1, name: "Samantha Rose Bennett", location: "Roseville, CA", level: 1,
    revShare: "$6,487.88", contribution: "53.51 USD", orgSize: 5, icon: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Samantha Rose Bennett", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", { icon: "Yes", capPct: 88, groupSize: 5, totalRevenueShare: 6487.88 }),
    children: [
      {
        id: 101, name: "Kevin Park", location: "Roseville, CA", level: 2, revShare: "$1,245.00", contribution: "0.00 USD", orgSize: 3,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        contactData: makeContact("Kevin Park", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett", groupSize: 3 }),
        children: [
          { id: 1011, name: "Liam Chen", location: "Folsom, CA", level: 3, revShare: "$420.00", contribution: "420.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Liam Chen", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Kevin Park" }) },
          { id: 1012, name: "Olivia Foster", location: "Sacramento, CA", level: 3, revShare: "$380.00", contribution: "380.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Olivia Foster", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Kevin Park" }) },
          { id: 1013, name: "Noah Williams", location: "Elk Grove, CA", level: 3, revShare: "$445.00", contribution: "445.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Noah Williams", "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Kevin Park" }) },
        ],
      },
      { id: 102, name: "Diana Reyes", location: "Sacramento, CA", level: 2, revShare: "$987.50", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Diana Reyes", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett" }) },
      { id: 103, name: "Thomas Grant", location: "Lincoln, CA", level: 2, revShare: "$2,100.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Thomas Grant", "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett" }) },
      { id: 104, name: "Priya Sharma", location: "Folsom, CA", level: 2, revShare: "$1,560.00", contribution: "0.00 USD", orgSize: 0, icon: true, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Priya Sharma", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", { icon: "Yes", agentSponsorName: "Samantha Rose Bennett" }) },
      { id: 105, name: "Carlos Mendez", location: "Roseville, CA", level: 2, revShare: "$595.38", contribution: "595.38 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Carlos Mendez", "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Samantha Rose Bennett" }) },
    ],
  },
  {
    id: 2, name: "Derek James Sullivan", location: "Lincoln, CA", level: 1,
    revShare: "$8,234.56", contribution: "0.00 USD", orgSize: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Derek James Sullivan", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", { city: "Lincoln", groupSize: 3, totalRevenueShare: 8234.56 }),
    children: [
      { id: 201, name: "Rachel Kim", location: "Lincoln, CA", level: 2, revShare: "$3,100.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Rachel Kim", "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Lincoln" }) },
      { id: 202, name: "Jason Ortiz", location: "Rocklin, CA", level: 2, revShare: "$2,800.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Jason Ortiz", "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Rocklin" }) },
      { id: 203, name: "Emily Watson", location: "Auburn, CA", level: 2, revShare: "$2,334.56", contribution: "2,334.56 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Emily Watson", "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Derek James Sullivan", city: "Auburn" }) },
    ],
  },
  {
    id: 3, name: "Natalie Grace Harper", location: "Roseville, CA", level: 1,
    revShare: "$4,980.00", contribution: "0.00 USD", orgSize: 0,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Natalie Grace Harper", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", { totalRevenueShare: 4980 }),
  },
  {
    id: 4, name: "Marcus Antonio Rivera", location: "Folsom, CA", level: 1,
    revShare: "$3,890.00", contribution: "0.00 USD", orgSize: 2,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Marcus Antonio Rivera", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", { city: "Folsom", groupSize: 2, totalRevenueShare: 3890 }),
    children: [
      { id: 401, name: "Sophie Turner", location: "Folsom, CA", level: 2, revShare: "$1,940.00", contribution: "1,940.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", contactData: makeContact("Sophie Turner", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Marcus Antonio Rivera", city: "Folsom" }) },
      { id: 402, name: "David Nguyen", location: "El Dorado Hills, CA", level: 2, revShare: "$1,950.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face", contactData: makeContact("David Nguyen", "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face", { agentSponsorName: "Marcus Antonio Rivera", city: "El Dorado Hills" }) },
    ],
  },
  {
    id: 5, name: "Christopher Paul Mitchell", location: "Citrus Heights, CA", level: 1,
    revShare: "$2,890.00", contribution: "0.00 USD", orgSize: 0, icon: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Christopher Paul Mitchell", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", { icon: "Yes", city: "Citrus Heights", totalRevenueShare: 2890 }),
  },
  {
    id: 6, name: "Victoria Lynn Patterson", location: "Orangevale, CA", level: 1,
    revShare: "$2,420.00", contribution: "0.00 USD", orgSize: 0,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Victoria Lynn Patterson", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", { city: "Orangevale", totalRevenueShare: 2420 }),
  },
  {
    id: 7, name: "Amanda Claire Foster", location: "Roseville, CA", level: 1,
    revShare: "$2,215.00", contribution: "0.00 USD", orgSize: 0,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Amanda Claire Foster", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", { totalRevenueShare: 2215 }),
  },
  {
    id: 8, name: "Brandon Lee Cooper", location: "Elk Grove, CA", level: 1,
    revShare: "$2,100.00", contribution: "0.00 USD", orgSize: 0,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Brandon Lee Cooper", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", { city: "Elk Grove", totalRevenueShare: 2100 }),
  },
  {
    id: 9, name: "Melissa Ann Richardson", location: "Citrus Heights, CA", level: 1,
    revShare: "$1,815.00", contribution: "1,815.00 USD", orgSize: 0,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Melissa Ann Richardson", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", { city: "Citrus Heights", totalRevenueShare: 1815 }),
  },
  {
    id: 10, name: "Tyler James Henderson", location: "Granite Bay, CA", level: 1,
    revShare: "$1,490.00", contribution: "0.00 USD", orgSize: 0,
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    contactData: makeContact("Tyler James Henderson", "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", { city: "Granite Bay", totalRevenueShare: 1490 }),
  },
];

const getLevelColor = (level: number) => {
  const colors: Record<number, string> = {
    1: "bg-yellow-400", 2: "bg-green-400", 3: "bg-blue-400", 4: "bg-purple-400",
  };
  return colors[level] || "bg-gray-400";
};

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
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <Card
      className={`overflow-hidden transition-shadow ${hasChildren ? "cursor-pointer hover:shadow-md hover:border-primary/30" : ""}`}
      onClick={hasChildren ? onClick : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
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
            <p className="font-medium text-foreground text-sm truncate">{agent.name}</p>
            <p className="text-xs text-muted-foreground">{agent.location}</p>
          </div>
          {onOpenContact && (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenContact(); }}
              className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-primary shrink-0 min-h-[48px] min-w-[48px] md:min-h-[44px] md:min-w-[44px]"
              aria-label={`View contact card for ${agent.name}`}
            >
              <Contact className="h-5 w-5 md:h-4 md:w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge className={`${getLevelColor(agent.level)} text-white text-xs`}>
            Level {agent.level}
          </Badge>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("orgTree.contributedRevShare")}:</span>
            <Badge className="bg-primary text-primary-foreground text-xs font-medium">{agent.revShare}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("orgTree.individualContribution")}:</span>
            <span className="text-foreground">{agent.contribution}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t("orgTree.orgSize")}:</span>
            <span className="text-foreground">{agent.orgSize}</span>
            {agent.icon && (
              <Badge variant="outline" className="text-xs text-primary border-primary ml-auto">
                ICON
              </Badge>
            )}
          </div>
        </div>
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

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Breadcrumb trail: show parent avatars with dashed connector */}
      {breadcrumb.length > 1 && (
        <div className="flex items-center gap-0">
          {breadcrumb.slice(0, -1).map((parent, i) => (
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
              <Badge className={`${getLevelColor(agent.level)} text-white text-xs mt-2`}>
                Level {agent.level}
              </Badge>
              <div className="mt-2 space-y-1 text-xs">
                <div>
                  <Badge className="bg-primary text-primary-foreground text-xs font-medium">
                    {t("orgTree.contributedRevShare")}: {agent.revShare}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {t("orgTree.individualContribution")}: {agent.contribution}
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
  useDocumentTitle("Organization Tree");
  const { t } = useTranslation();

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-page-title font-bold text-foreground">{t("nav.organizationTree")}</h1>
            <span className="text-primary hover:underline cursor-pointer text-sm">View in Beta</span>
          </div>
        </div>

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="pl-9 w-[350px]"
            />
          </div>
        </div>

        {/* Current level header */}
        <div className="mb-6">
          <p className="text-lg font-medium text-foreground mb-1">
            {headerName} - Level {headerLevel}
          </p>
          <p className="text-sm text-muted-foreground">{flaCount} FLAs</p>
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
