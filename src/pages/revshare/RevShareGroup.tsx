import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { AgentContactSheet } from "@/components/revshare/AgentContactSheet";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Badge } from "@/components/ui/badge";
import { SearchFilter } from "@/components/filters/SearchFilter";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface RevShareGroupAgent {
  agentName: string;
  groupSize: number;
  level: number;
  businessType: string;
  capPct: number;
  transactionVolume: number;
  totalTransactions: number;
  totalRevenueShare: number;
  stateOfPrimaryLicense: string;
  isOffboarding: string;
  status: string;
  agentSponsorName: string;
  icon: string;
  // Optional columns
  agentId: string;
  email: string;
  phoneNumber: string;
  state: string;
  anniversaryDate: string;
  influencerStatus: string;
  ure: number;
  mentorName: string;
  secondaryEmail: string;
  city: string;
  postalCode: string;
  country: string;
  joinDate: string;
  expRealtyDate: string;
  lastRevShareTransaction: string;
  revenueShareEarned: number;
  yearsWithExp: number;
  company: string;
  qualificationDate: string;
  revShareEligible: string;
  totalUnits: number;
  totalVolume: number;
  totalGci: number;
  teamName: string;
  teamRole: string;
  teamStatus: string;
  currency: string;
}

const mockData: RevShareGroupAgent[] = [
  {
    agentName: "Rachel Morrison", groupSize: 12, level: 1, businessType: "Residential", capPct: 80, transactionVolume: 2450000, totalTransactions: 6, totalRevenueShare: 1247.50, stateOfPrimaryLicense: "CA", isOffboarding: "No", status: "Active", agentSponsorName: "Michael Thompson", icon: "Yes",
    agentId: "AGT-293847", email: "rachel.morrison@exp.com", phoneNumber: "(916) 555-1234", state: "California", anniversaryDate: "2022-03-15", influencerStatus: "BETA", ure: 3, mentorName: "James Anderson", secondaryEmail: "rachel.m@gmail.com", city: "Sacramento", postalCode: "95814", country: "United States", joinDate: "2022-03-01", expRealtyDate: "2022-03-15", lastRevShareTransaction: "2025-12-10", revenueShareEarned: 3842.75, yearsWithExp: 3, company: "eXp Realty of California Inc", qualificationDate: "2022-06-01", revShareEligible: "Yes", totalUnits: 18, totalVolume: 7250000, totalGci: 217500, teamName: "Thompson Realty Partners", teamRole: "Member", teamStatus: "Active", currency: "USD",
  },
  {
    agentName: "Daniel Crawford", groupSize: 8, level: 1, businessType: "Commercial", capPct: 65, transactionVolume: 1890000, totalTransactions: 5, totalRevenueShare: 982.30, stateOfPrimaryLicense: "CA", isOffboarding: "No", status: "Active", agentSponsorName: "Michael Thompson", icon: "No",
    agentId: "AGT-384756", email: "daniel.crawford@exp.com", phoneNumber: "(916) 555-2345", state: "California", anniversaryDate: "2023-01-10", influencerStatus: "Leaders", ure: 2, mentorName: "David Williams", secondaryEmail: "d.crawford@gmail.com", city: "Folsom", postalCode: "95630", country: "United States", joinDate: "2023-01-05", expRealtyDate: "2023-01-10", lastRevShareTransaction: "2025-11-28", revenueShareEarned: 2156.40, yearsWithExp: 2, company: "eXp Realty of California Inc", qualificationDate: "2023-04-15", revShareEligible: "Yes", totalUnits: 14, totalVolume: 5670000, totalGci: 170100, teamName: "Thompson Realty Partners", teamRole: "Member", teamStatus: "Active", currency: "USD",
  },
  {
    agentName: "Amanda Chen-Rodriguez", groupSize: 5, level: 2, businessType: "Residential", capPct: 100, transactionVolume: 1520000, totalTransactions: 4, totalRevenueShare: 645.80, stateOfPrimaryLicense: "WA", isOffboarding: "No", status: "Active", agentSponsorName: "Rachel Morrison", icon: "No",
    agentId: "AGT-475869", email: "amanda.cr@exp.com", phoneNumber: "(206) 555-3456", state: "Washington", anniversaryDate: "2023-06-20", influencerStatus: "Builders", ure: 1, mentorName: "", secondaryEmail: "", city: "Seattle", postalCode: "98101", country: "United States", joinDate: "2023-06-15", expRealtyDate: "2023-06-20", lastRevShareTransaction: "2025-12-05", revenueShareEarned: 1489.20, yearsWithExp: 2, company: "eXp Realty of Washington Inc", qualificationDate: "2023-09-01", revShareEligible: "Yes", totalUnits: 10, totalVolume: 4120000, totalGci: 123600, teamName: "", teamRole: "", teamStatus: "", currency: "USD",
  },
  {
    agentName: "Marcus Anthony Blake", groupSize: 3, level: 2, businessType: "Residential", capPct: 45, transactionVolume: 1150000, totalTransactions: 3, totalRevenueShare: 412.60, stateOfPrimaryLicense: "CA", isOffboarding: "Yes", status: "Offboarding", agentSponsorName: "Rachel Morrison", icon: "No",
    agentId: "AGT-586974", email: "marcus.blake@exp.com", phoneNumber: "(916) 555-4567", state: "California", anniversaryDate: "2024-02-10", influencerStatus: "Agents", ure: 0, mentorName: "Maria Garcia", secondaryEmail: "m.blake@gmail.com", city: "Roseville", postalCode: "95661", country: "United States", joinDate: "2024-02-01", expRealtyDate: "2024-02-10", lastRevShareTransaction: "2025-10-15", revenueShareEarned: 687.30, yearsWithExp: 1, company: "eXp Realty of California Inc", qualificationDate: "2024-05-01", revShareEligible: "No", totalUnits: 6, totalVolume: 2340000, totalGci: 70200, teamName: "", teamRole: "", teamStatus: "", currency: "USD",
  },
  {
    agentName: "Jennifer Walsh", groupSize: 15, level: 3, businessType: "Residential", capPct: 92, transactionVolume: 785000, totalTransactions: 2, totalRevenueShare: 198.45, stateOfPrimaryLicense: "TX", isOffboarding: "No", status: "Active", agentSponsorName: "Daniel Crawford", icon: "Yes",
    agentId: "AGT-697085", email: "jennifer.walsh@exp.com", phoneNumber: "(512) 555-5678", state: "Texas", anniversaryDate: "2021-11-05", influencerStatus: "BETA", ure: 5, mentorName: "", secondaryEmail: "j.walsh@outlook.com", city: "Austin", postalCode: "78701", country: "United States", joinDate: "2021-10-28", expRealtyDate: "2021-11-05", lastRevShareTransaction: "2025-12-12", revenueShareEarned: 5234.10, yearsWithExp: 4, company: "eXp Realty of Texas Inc", qualificationDate: "2022-01-15", revShareEligible: "Yes", totalUnits: 22, totalVolume: 8950000, totalGci: 268500, teamName: "Walsh Premier Group", teamRole: "Team_Leader", teamStatus: "Active", currency: "USD",
  },
  {
    agentName: "Sarah Johnson", groupSize: 2, level: 3, businessType: "Referral", capPct: 30, transactionVolume: 320000, totalTransactions: 1, totalRevenueShare: 87.20, stateOfPrimaryLicense: "FL", isOffboarding: "No", status: "Active", agentSponsorName: "Daniel Crawford", icon: "No",
    agentId: "AGT-708196", email: "sarah.johnson@exp.com", phoneNumber: "(305) 555-6789", state: "Florida", anniversaryDate: "2024-08-01", influencerStatus: "Agents", ure: 0, mentorName: "Jennifer Walsh", secondaryEmail: "", city: "Miami", postalCode: "33101", country: "United States", joinDate: "2024-07-25", expRealtyDate: "2024-08-01", lastRevShareTransaction: "2025-09-20", revenueShareEarned: 187.50, yearsWithExp: 1, company: "eXp Realty of Florida Inc", qualificationDate: "", revShareEligible: "Yes", totalUnits: 3, totalVolume: 980000, totalGci: 29400, teamName: "", teamRole: "", teamStatus: "", currency: "USD",
  },
  {
    agentName: "Robert Martinez", groupSize: 7, level: 4, businessType: "Residential", capPct: 78, transactionVolume: 1680000, totalTransactions: 4, totalRevenueShare: 523.90, stateOfPrimaryLicense: "AZ", isOffboarding: "No", status: "Active", agentSponsorName: "Amanda Chen-Rodriguez", icon: "No",
    agentId: "AGT-819207", email: "robert.martinez@exp.com", phoneNumber: "(602) 555-7890", state: "Arizona", anniversaryDate: "2022-09-12", influencerStatus: "Leaders", ure: 2, mentorName: "", secondaryEmail: "r.martinez@yahoo.com", city: "Phoenix", postalCode: "85001", country: "United States", joinDate: "2022-09-05", expRealtyDate: "2022-09-12", lastRevShareTransaction: "2025-11-30", revenueShareEarned: 2890.60, yearsWithExp: 3, company: "eXp Realty of Arizona Inc", qualificationDate: "2022-12-01", revShareEligible: "Yes", totalUnits: 16, totalVolume: 6480000, totalGci: 194400, teamName: "", teamRole: "", teamStatus: "", currency: "USD",
  },
  {
    agentName: "Emily Davis", groupSize: 1, level: 5, businessType: "Residential", capPct: 55, transactionVolume: 540000, totalTransactions: 2, totalRevenueShare: 142.30, stateOfPrimaryLicense: "NV", isOffboarding: "No", status: "Active", agentSponsorName: "Robert Martinez", icon: "No",
    agentId: "AGT-920318", email: "emily.davis@exp.com", phoneNumber: "(702) 555-8901", state: "Nevada", anniversaryDate: "2024-04-18", influencerStatus: "Agents", ure: 0, mentorName: "Robert Martinez", secondaryEmail: "", city: "Las Vegas", postalCode: "89101", country: "United States", joinDate: "2024-04-10", expRealtyDate: "2024-04-18", lastRevShareTransaction: "2025-12-01", revenueShareEarned: 342.80, yearsWithExp: 1, company: "eXp Realty of Nevada Inc", qualificationDate: "2024-07-15", revShareEligible: "Yes", totalUnits: 4, totalVolume: 1620000, totalGci: 48600, teamName: "", teamRole: "", teamStatus: "", currency: "USD",
  },
];

function getYesNoBadge(val: string) {
  if (val === "Yes") return <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">Yes</Badge>;
  return <Badge className="bg-muted text-muted-foreground hover:bg-muted">No</Badge>;
}

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">Active</Badge>;
    case "offboarding":
      return <Badge className="bg-exp-gold/10 text-exp-gold border-exp-gold/20 hover:bg-exp-gold/10">Offboarding</Badge>;
    case "inactive":
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function RevShareGroup() {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  const navigate = useNavigate();
  useDocumentTitle(t("revgroup.title"));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<RevShareGroupAgent | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: t("txn.allStatuses") },
    { value: "active", label: "Active" },
    { value: "offboarding", label: "Offboarding" },
    { value: "inactive", label: "Inactive" },
  ];

  const uniqueLevels = Array.from(new Set(mockData.map((r) => r.level))).sort((a, b) => a - b);
  const levelOptions = [
    { value: "all", label: t("revgroup.allLevels") },
    ...uniqueLevels.map((l) => ({ value: String(l), label: `${t("revgroup.level")} ${l}` })),
  ];

  const filteredData = mockData.filter((r) => {
    if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter) return false;
    if (levelFilter !== "all" && String(r.level) !== levelFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.agentName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.agentSponsorName.toLowerCase().includes(q) ||
      r.agentId.toLowerCase().includes(q)
    );
  });

  const columns: ColumnDef<RevShareGroupAgent>[] = [
    // --- Default visible (13) ---
    { key: "agentName", header: "revgroup.agentName", type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "groupSize", header: "revgroup.groupSize", type: "number", sortable: true, defaultVisible: true },
    { key: "level", header: "revgroup.level", type: "number", sortable: true, defaultVisible: true },
    { key: "businessType", header: "revgroup.businessType", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "capPct", header: "revgroup.capPct", type: "number", sortable: true, defaultVisible: true, render: (val) => <span className="font-secondary">{Number(val)}%</span> },
    { key: "transactionVolume", header: "revgroup.transactionVolume", type: "currency", sortable: true, defaultVisible: false, currencyCodeKey: "currency" },
    { key: "totalTransactions", header: "revgroup.totalTransactions", type: "number", sortable: true, defaultVisible: true },
    { key: "totalRevenueShare", header: "revgroup.totalRevenueShare", type: "currency", sortable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "stateOfPrimaryLicense", header: "revgroup.stateOfPrimaryLicense", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "isOffboarding", header: "revgroup.isOffboarding", type: "badge", sortable: true, filterable: true, defaultVisible: true, render: (val) => getYesNoBadge(String(val)) },
    { key: "status", header: "revgroup.status", type: "badge", sortable: true, filterable: true, defaultVisible: true },
    { key: "agentSponsorName", header: "revgroup.agentSponsorName", type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "icon", header: "revgroup.icon", type: "badge", sortable: true, filterable: true, defaultVisible: true, render: (val) => getYesNoBadge(String(val)) },

    // --- Optional (hidden by default) ---
    { key: "agentId", header: "revgroup.agentId", type: "string", sortable: true, defaultVisible: false },
    { key: "email", header: "revgroup.email", type: "string", sortable: true, defaultVisible: false },
    { key: "phoneNumber", header: "revgroup.phoneNumber", type: "string", defaultVisible: false },
    { key: "state", header: "revgroup.state", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "anniversaryDate", header: "revgroup.anniversaryDate", type: "date", sortable: true, defaultVisible: false },
    { key: "influencerStatus", header: "revgroup.influencerStatus", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "ure", header: "revgroup.ure", type: "number", sortable: true, defaultVisible: false },
    { key: "mentorName", header: "revgroup.mentorName", type: "string", sortable: true, defaultVisible: false },
    { key: "secondaryEmail", header: "revgroup.secondaryEmail", type: "string", defaultVisible: false },
    { key: "city", header: "revgroup.city", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "postalCode", header: "revgroup.postalCode", type: "string", sortable: true, defaultVisible: false },
    { key: "country", header: "revgroup.country", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "joinDate", header: "revgroup.joinDate", type: "date", sortable: true, defaultVisible: false },
    { key: "expRealtyDate", header: "revgroup.expRealtyDate", type: "date", sortable: true, defaultVisible: false },
    { key: "lastRevShareTransaction", header: "revgroup.lastRevShareTransaction", type: "date", sortable: true, defaultVisible: false },
    { key: "revenueShareEarned", header: "revgroup.revenueShareEarned", type: "currency", sortable: true, defaultVisible: false, currencyCodeKey: "currency" },
    { key: "yearsWithExp", header: "revgroup.yearsWithExp", type: "number", sortable: true, defaultVisible: false },
    { key: "company", header: "revgroup.company", type: "string", sortable: true, defaultVisible: false },
    { key: "qualificationDate", header: "revgroup.qualificationDate", type: "date", sortable: true, defaultVisible: false },
    { key: "revShareEligible", header: "revgroup.revShareEligible", type: "badge", sortable: true, filterable: true, defaultVisible: false, render: (val) => getYesNoBadge(String(val)) },
    { key: "totalUnits", header: "revgroup.totalUnits", type: "number", sortable: true, defaultVisible: false },
    { key: "totalVolume", header: "revgroup.totalVolume", type: "currency", sortable: true, defaultVisible: false, currencyCodeKey: "currency" },
    { key: "totalGci", header: "revgroup.totalGci", type: "currency", sortable: true, defaultVisible: false, currencyCodeKey: "currency" },
    { key: "teamName", header: "revgroup.teamName", type: "string", sortable: true, defaultVisible: false },
    { key: "teamRole", header: "revgroup.teamRole", type: "string", sortable: true, defaultVisible: false },
    { key: "teamStatus", header: "revgroup.teamStatus", type: "badge", sortable: true, filterable: true, defaultVisible: false },
  ];

  const mobileCardRender = (row: RevShareGroupAgent) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        {getStatusBadge(row.status)}
        <span className="text-xs text-muted-foreground font-secondary">L{row.level}</span>
      </div>
      <p className="text-sm font-medium text-foreground font-primary">{row.agentName}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground font-secondary">{formatCurrency(row.totalRevenueShare)}</span>
        <span>{row.stateOfPrimaryLicense}</span>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => navigate("/revshare/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("revgroup.backToRevShare")}
        </Button>

        <UniversalFilterBar title={t("revgroup.title")}>
          <DropdownFilter
            label={t("revgroup.status")}
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <DropdownFilter
            label={t("revgroup.level")}
            options={levelOptions}
            value={levelFilter}
            onChange={setLevelFilter}
          />
          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder={t("revgroup.searchPlaceholder")}
          />
        </UniversalFilterBar>

        <DataTable
          data={filteredData}
          columns={columns}
          searchableKeys={["agentName", "email", "agentSponsorName", "agentId"]}
          onRowClick={(row) => { setSelectedAgent(row); setSheetOpen(true); }}
          defaultPageSize={25}
          defaultSort={{ key: "level", direction: "asc" }}
          csvFilename="revshare-group"
          mobileCardRender={mobileCardRender}
        />

        <AgentContactSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          agent={selectedAgent}
        />
      </div>
    </DashboardLayout>
  );
}