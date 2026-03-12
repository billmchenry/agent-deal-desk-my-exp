import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Download, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { AgentTransactionsView, type AgentDetail, type AgentTransaction } from "@/components/revshare/AgentTransactionsView";
import { TransactionRevShareSheet } from "@/components/revshare/TransactionRevShareSheet";
import { DateRangeFilter, type DateRange } from "@/components/filters/DateRangeFilter";
import { startOfYear, startOfMonth, endOfMonth, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";

// ── Types ──

interface AgentRevShareRow {
  agentName: string;
  uuid: string;
  level: number;
  country: string;
  state: string;
  totalRevShare: number;
  currency: string;
}

interface PeriodicRow {
  date: string;
  initialRevShare: number;
  adjustment: number;
  finalRevShare: number;
  transactionCount6Mo: number;
  memberCount: number;
  monthly: string;
  batchNumber: number;
  currency: string;
}

interface PayNowDeal {
  id: string;
  agentName: string;
  address: string;
  amount: number;
  currency: string;
  transactionNumber: string;
  closedDate: string;
  salePrice: number;
  level: number;
  finalRevShare: number;
}

interface PayNowTransaction {
  id: string;
  date: string;
  initialAmount: number;
  serviceFee: number;
  finalAmount: number;
  dealCount: number;
  deals?: PayNowDeal[];
}

interface MonthlyBatchRow {
  id: string;
  batchId: number;
  month: string;
  year: number;
  totalDeals: number;
  memberCount: number;
  initialRevenue: number;
  payNowDeduction: number;
  adjustmentAmount: number;
  finalPayout: number;
  payNowTransactions: PayNowTransaction[];
}

// ── Mock Transaction Data per Agent ──

const agentTransactionsMap: Record<string, AgentDetail> = {
  "Tatsiana Crawford": {
    agentName: "Tatsiana Crawford", agentId: "278153", totalRevShare: 2325.00, currency: "USD",
    email: "tatsiana.crawford@exprealty.com", phone: "(207) 555-4821",
    transactions: [
      { address: "4521 Maple Dr, Portland...", fullAddress: "4521 Maple Dr, Portland, ME 04101, US", closedDate: "01/15/2026", revShareAmount: 1425.00, currency: "USD", transactionNumber: "3648712.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 890000, revShareDollar: 2850.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 1425.00 },
      { address: "782 Oak Lane, Augusta...", fullAddress: "782 Oak Lane, Augusta, ME 04330, US", closedDate: "01/08/2026", revShareAmount: 900.00, currency: "USD", transactionNumber: "3648199.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 540000, revShareDollar: 1800.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 900.00 },
    ],
  },
  "Kendra Campbell Borja LLC": {
    agentName: "Kendra Campbell Borja LLC", agentId: "314209", totalRevShare: 1260.00, currency: "USD",
    email: "kendra.borja@exprealty.com", phone: "(305) 555-1937",
    transactions: [
      { address: "1842 Brickell Ave, Miami...", fullAddress: "1842 Brickell Ave, Miami, FL 33129, US", closedDate: "01/22/2026", revShareAmount: 760.00, currency: "USD", transactionNumber: "3649102.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 620000, revShareDollar: 1520.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 760.00 },
      { address: "309 Sunset Blvd, Fort L...", fullAddress: "309 Sunset Blvd, Fort Lauderdale, FL 33301, US", closedDate: "01/10/2026", revShareAmount: 500.00, currency: "USD", transactionNumber: "3648401.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 385000, revShareDollar: 1000.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 500.00 },
    ],
  },
  "Cindy A Ermeav-Williams": {
    agentName: "Cindy A Ermeav-Williams", agentId: "291847", totalRevShare: 1000.00, currency: "USD",
    email: "cindy.williams@exprealty.com", phone: "(941) 555-8104",
    transactions: [
      { address: "5610 Gulf Dr, Sarasota...", fullAddress: "5610 Gulf Dr, Sarasota, FL 34242, US", closedDate: "01/18/2026", revShareAmount: 1000.00, currency: "USD", transactionNumber: "3649055.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 750000, revShareDollar: 2000.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 1000.00 },
    ],
  },
  "Brittany A Garcia PLLC": {
    agentName: "Brittany A Garcia PLLC", agentId: "265413", totalRevShare: 937.50, currency: "USD",
    email: "brittany.garcia@exprealty.com", phone: "(480) 555-3562",
    transactions: [
      { address: "2241 E Camelback Rd, Sc...", fullAddress: "2241 E Camelback Rd, Scottsdale, AZ 85251, US", closedDate: "01/14/2026", revShareAmount: 562.50, currency: "USD", transactionNumber: "3648630.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 475000, revShareDollar: 1125.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 562.50 },
      { address: "8830 N 7th St, Phoenix...", fullAddress: "8830 N 7th St, Phoenix, AZ 85020, US", closedDate: "01/03/2026", revShareAmount: 375.00, currency: "USD", transactionNumber: "3647920.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 325000, revShareDollar: 750.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 375.00 },
    ],
  },
  "Autumn Ceniza": {
    agentName: "Autumn Ceniza", agentId: "198274", totalRevShare: 917.04, currency: "USD",
    email: "autumn.ceniza@exprealty.com", phone: "(619) 555-2718",
    transactions: [
      { address: "1450 Front St, San Dieg...", fullAddress: "1450 Front St, San Diego, CA 92101, US", closedDate: "01/21/2026", revShareAmount: 517.04, currency: "USD", transactionNumber: "3649140.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 685000, revShareDollar: 1034.08, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 517.04 },
      { address: "3927 Park Blvd, San Di...", fullAddress: "3927 Park Blvd, San Diego, CA 92103, US", closedDate: "01/06/2026", revShareAmount: 400.00, currency: "USD", transactionNumber: "3648050.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 510000, revShareDollar: 800.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 400.00 },
    ],
  },
  "Cara Darea Silverthorne": {
    agentName: "Cara Darea Silverthorne", agentId: "342106", totalRevShare: 898.47, currency: "USD",
    email: "cara.silverthorne@exprealty.com", phone: "(407) 555-5249",
    transactions: [
      { address: "712 Lake Eola Dr, Orlan...", fullAddress: "712 Lake Eola Dr, Orlando, FL 32801, US", closedDate: "01/19/2026", revShareAmount: 898.47, currency: "USD", transactionNumber: "3649080.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 590000, revShareDollar: 1796.94, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 898.47 },
    ],
  },
  "Sarah Brennan": {
    agentName: "Sarah Brennan", agentId: "305821", totalRevShare: 889.15, currency: "USD",
    email: "sarah.brennan@exprealty.com", phone: "(506) 555-8730",
    transactions: [
      { address: "45 King St, Fredericton...", fullAddress: "45 King St, Fredericton, NB E3B 1C6, CA", closedDate: "01/17/2026", revShareAmount: 524.15, currency: "USD", transactionNumber: "3648890.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 410000, revShareDollar: 1048.30, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 524.15 },
      { address: "220 Waterloo Row, Fred...", fullAddress: "220 Waterloo Row, Fredericton, NB E3B 1Z1, CA", closedDate: "01/09/2026", revShareAmount: 365.00, currency: "USD", transactionNumber: "3648310.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 295000, revShareDollar: 730.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 365.00 },
    ],
  },
  "Allison Mireau": {
    agentName: "Allison Mireau", agentId: "287634", totalRevShare: 852.19, currency: "USD",
    email: "allison.mireau@exprealty.com", phone: "(201) 555-3912",
    transactions: [
      { address: "88 River Rd, Edgewater...", fullAddress: "88 River Rd, Edgewater, NJ 07020, US", closedDate: "01/16/2026", revShareAmount: 852.19, currency: "USD", transactionNumber: "3648780.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 715000, revShareDollar: 1704.38, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 852.19 },
    ],
  },
  "Seth Steven Rhyne": {
    agentName: "Seth Steven Rhyne", agentId: "174903", totalRevShare: 790.80, currency: "USD",
    email: "seth.rhyne@exprealty.com", phone: "(843) 555-4017",
    transactions: [
      { address: "1204 King St, Charleston...", fullAddress: "1204 King St, Charleston, SC 29403, US", closedDate: "01/13/2026", revShareAmount: 490.80, currency: "USD", transactionNumber: "3648560.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 380000, revShareDollar: 981.60, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 490.80 },
      { address: "567 Coleman Blvd, Mt Pl...", fullAddress: "567 Coleman Blvd, Mt Pleasant, SC 29464, US", closedDate: "01/04/2026", revShareAmount: 300.00, currency: "USD", transactionNumber: "3647960.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 265000, revShareDollar: 600.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 300.00 },
    ],
  },
  "Susan A Thomas": {
    agentName: "Susan A Thomas", agentId: "356712", totalRevShare: 737.50, currency: "USD",
    email: "susan.thomas@exprealty.com", phone: "(813) 555-6053",
    transactions: [
      { address: "2903 Bayshore Blvd, Tam...", fullAddress: "2903 Bayshore Blvd, Tampa, FL 33629, US", closedDate: "01/20/2026", revShareAmount: 737.50, currency: "USD", transactionNumber: "3649120.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 560000, revShareDollar: 1475.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 737.50 },
    ],
  },
  "Salvador Fernando Rivas Hernandez": {
    agentName: "Salvador Fernando Rivas Hernandez", agentId: "371058", totalRevShare: 650.00, currency: "USD",
    email: "salvador.rivas@exprealty.com", phone: "(617) 555-9401",
    transactions: [
      { address: "114 Beacon St, Boston...", fullAddress: "114 Beacon St, Boston, MA 02116, US", closedDate: "01/11/2026", revShareAmount: 650.00, currency: "USD", transactionNumber: "3648440.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 495000, revShareDollar: 1300.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 650.00 },
    ],
  },
  "Marcus Bell": {
    agentName: "Marcus Bell", agentId: "329841", totalRevShare: 612.33, currency: "USD",
    email: "marcus.bell@exprealty.com", phone: "(214) 555-3186",
    transactions: [
      { address: "4400 Cedar Springs Rd, ...", fullAddress: "4400 Cedar Springs Rd, Dallas, TX 75219, US", closedDate: "01/23/2026", revShareAmount: 612.33, currency: "USD", transactionNumber: "3649201.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 445000, revShareDollar: 1224.66, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 612.33 },
    ],
  },
  "Abby Moorman Andes": {
    agentName: "Abby Moorman Andes", agentId: "318274", totalRevShare: 643.95, currency: "USD",
    email: "abby.andes@exprealty.com", phone: "(770) 555-2810",
    transactions: [
      { address: "3350 Peachtree Rd NE, A...", fullAddress: "3350 Peachtree Rd NE, Atlanta, GA 30326, US", closedDate: "01/12/2026", revShareAmount: 643.95, currency: "USD", transactionNumber: "3648490.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 520000, revShareDollar: 1287.90, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 643.95 },
    ],
  },
  "Ravi Ramachandran": {
    agentName: "Ravi Ramachandran", agentId: "278152", totalRevShare: 2556.64, currency: "USD",
    email: "ravi.ramachandran@exprealty.com", phone: "(425) 555-8274",
    transactions: [
      { address: "9625 164th Ave NE, Red...", fullAddress: "9625 164th Ave NE, Redmond, WA 98052, US", closedDate: "01/20/2026", revShareAmount: 1876.43, currency: "USD", transactionNumber: "3648503.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 1270000, revShareDollar: 3752.85, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 1876.43 },
      { address: "2525C 29th Ave S, Seatt...", fullAddress: "2525C 29th Ave S, Seattle, WA 98144, US", closedDate: "01/07/2026", revShareAmount: 680.21, currency: "USD", transactionNumber: "3647891.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 425000, revShareDollar: 1360.42, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 680.21 },
    ],
  },
  "Lindsey Ruth Sampier": {
    agentName: "Lindsey Ruth Sampier", agentId: "264518", totalRevShare: 1000.00, currency: "USD",
    email: "lindsey.sampier@exprealty.com", phone: "(720) 555-5928",
    transactions: [
      { address: "1890 Wynkoop St, Denver...", fullAddress: "1890 Wynkoop St, Denver, CO 80202, US", closedDate: "01/18/2026", revShareAmount: 600.00, currency: "USD", transactionNumber: "3649030.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 525000, revShareDollar: 1200.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 600.00 },
      { address: "4502 S Broadway, Engle...", fullAddress: "4502 S Broadway, Englewood, CO 80113, US", closedDate: "01/05/2026", revShareAmount: 400.00, currency: "USD", transactionNumber: "3647980.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 340000, revShareDollar: 800.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 400.00 },
    ],
  },
  "Jennifer Horst": {
    agentName: "Jennifer Horst", agentId: "241906", totalRevShare: 855.00, currency: "USD",
    email: "jennifer.horst@exprealty.com", phone: "(916) 555-8301",
    transactions: [
      { address: "2100 Capitol Ave, Sacra...", fullAddress: "2100 Capitol Ave, Sacramento, CA 95816, US", closedDate: "01/14/2026", revShareAmount: 855.00, currency: "USD", transactionNumber: "3648610.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 680000, revShareDollar: 1710.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 855.00 },
    ],
  },
  "Christian Smith": {
    agentName: "Christian Smith", agentId: "283451", totalRevShare: 834.50, currency: "USD",
    email: "christian.smith@exprealty.com", phone: "(404) 555-1475",
    transactions: [
      { address: "560 Dutch Valley Rd, At...", fullAddress: "560 Dutch Valley Rd, Atlanta, GA 30324, US", closedDate: "01/16/2026", revShareAmount: 834.50, currency: "USD", transactionNumber: "3648750.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 490000, revShareDollar: 1669.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 834.50 },
    ],
  },
  "Camille Anne Horvath": {
    agentName: "Camille Anne Horvath", agentId: "297163", totalRevShare: 815.63, currency: "USD",
    email: "camille.horvath@exprealty.com", phone: "(954) 555-7042",
    transactions: [
      { address: "3001 E Las Olas Blvd, F...", fullAddress: "3001 E Las Olas Blvd, Fort Lauderdale, FL 33316, US", closedDate: "01/22/2026", revShareAmount: 815.63, currency: "USD", transactionNumber: "3649170.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 710000, revShareDollar: 1631.26, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 815.63 },
    ],
  },
  "Sheri Morrison": {
    agentName: "Sheri Morrison", agentId: "253890", totalRevShare: 784.00, currency: "USD",
    email: "sheri.morrison@exprealty.com", phone: "(561) 555-4218",
    transactions: [
      { address: "800 S Dixie Hwy, West P...", fullAddress: "800 S Dixie Hwy, West Palm Beach, FL 33401, US", closedDate: "01/11/2026", revShareAmount: 784.00, currency: "USD", transactionNumber: "3648420.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 545000, revShareDollar: 1568.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 784.00 },
    ],
  },
  "Amanda Bowen": {
    agentName: "Amanda Bowen", agentId: "210347", totalRevShare: 782.34, currency: "USD",
    email: "amanda.bowen@exprealty.com", phone: "(253) 555-7630",
    transactions: [
      { address: "1702 Pacific Ave, Tacom...", fullAddress: "1702 Pacific Ave, Tacoma, WA 98402, US", closedDate: "01/19/2026", revShareAmount: 452.34, currency: "USD", transactionNumber: "3649070.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 390000, revShareDollar: 904.68, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 452.34 },
      { address: "3814 N 26th St, Tacoma...", fullAddress: "3814 N 26th St, Tacoma, WA 98407, US", closedDate: "01/08/2026", revShareAmount: 330.00, currency: "USD", transactionNumber: "3648250.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 285000, revShareDollar: 660.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 330.00 },
    ],
  },
};

// Fallback for any agent not in the map
function getAgentDetail(row: AgentRevShareRow): AgentDetail {
  if (agentTransactionsMap[row.agentName]) return agentTransactionsMap[row.agentName];
  return {
    agentName: row.agentName, agentId: "000000", totalRevShare: row.totalRevShare, currency: row.currency,
    email: "agent@exprealty.com", phone: "(000) 000-0000",
    transactions: [
      { address: "Property in " + row.state, fullAddress: row.state + ", " + row.country, closedDate: "01/10/2026", revShareAmount: row.totalRevShare, currency: row.currency, transactionNumber: "0000000.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: row.totalRevShare * 500, revShareDollar: row.totalRevShare * 2, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: row.totalRevShare },
    ],
  };
}

// ── Mock Data ──

const unpaidData: AgentRevShareRow[] = [
  { agentName: "Tatsiana Crawford", uuid: "a1214361-b902-11f0-bf04-6fa49648a531", level: 1, country: "US", state: "ME", totalRevShare: 2325.00, currency: "USD" },
  { agentName: "Kendra Campbell Borja LLC", uuid: "044bec73-bb01-11ee-853e-d51ab739de9d", level: 1, country: "US", state: "FL", totalRevShare: 1260.00, currency: "USD" },
  { agentName: "Cindy A Ermeav-Williams", uuid: "d699b01e-34d5-11f0-a0e0-bdd1e62643d3", level: 1, country: "US", state: "FL", totalRevShare: 1000.00, currency: "USD" },
  { agentName: "Brittany A Garcia PLLC", uuid: "b8fd09a0-2d39-11ed-8285-b75628342cbf", level: 2, country: "US", state: "AZ", totalRevShare: 937.50, currency: "USD" },
  { agentName: "Autumn Ceniza", uuid: "fa3f3b45-627b-11ec-842e-45a6f9a1dea2", level: 2, country: "US", state: "CA", totalRevShare: 917.04, currency: "USD" },
  { agentName: "Cara Darea Silverthorne", uuid: "fc9f014e-a2d4-11ef-8db9-dd0ff6fa6dfb", level: 3, country: "US", state: "FL", totalRevShare: 898.47, currency: "USD" },
  { agentName: "Sarah Brennan", uuid: "1ef799f5-c0cc-11f0-8c89-019f6c163964", level: 1, country: "CA", state: "NB", totalRevShare: 889.15, currency: "USD" },
  { agentName: "Allison Mireau", uuid: "03fb0af3-d911-11ef-8d6e-ddea294055e4", level: 2, country: "US", state: "NJ", totalRevShare: 852.19, currency: "USD" },
  { agentName: "Seth Steven Rhyne", uuid: "0686bdac-349f-11eb-a14f-8bf36dbde695", level: 2, country: "US", state: "SC", totalRevShare: 790.80, currency: "USD" },
  { agentName: "Susan A Thomas", uuid: "effe60b3-7b54-11f0-87f9-432a31a08428", level: 1, country: "US", state: "FL", totalRevShare: 737.50, currency: "USD" },
  { agentName: "Salvador Fernando Rivas Hernandez", uuid: "62f6f164-ba61-11f0-bf04-6fa49648a531", level: 1, country: "US", state: "MA", totalRevShare: 650.00, currency: "USD" },
  { agentName: "Marcus Bell", uuid: "9a12bc34-de56-78f0-ab12-cd34ef567890", level: 3, country: "US", state: "TX", totalRevShare: 612.33, currency: "USD" },
];

const expectedData: AgentRevShareRow[] = [
  { agentName: "Kendra Campbell Borja LLC", uuid: "", level: 1, country: "US", state: "FL", totalRevShare: 1260.00, currency: "USD" },
  { agentName: "Cindy A Ermeav-Williams", uuid: "", level: 1, country: "US", state: "FL", totalRevShare: 1000.00, currency: "USD" },
  { agentName: "Brittany A Garcia PLLC", uuid: "", level: 2, country: "US", state: "AZ", totalRevShare: 937.50, currency: "USD" },
  { agentName: "Autumn Ceniza", uuid: "", level: 2, country: "US", state: "CA", totalRevShare: 917.04, currency: "USD" },
  { agentName: "Cara Darea Silverthorne", uuid: "", level: 3, country: "US", state: "FL", totalRevShare: 898.47, currency: "USD" },
  { agentName: "Sarah Brennan", uuid: "", level: 1, country: "CA", state: "NB", totalRevShare: 889.15, currency: "USD" },
  { agentName: "Allison Mireau", uuid: "", level: 2, country: "US", state: "NJ", totalRevShare: 852.19, currency: "USD" },
  { agentName: "Seth Steven Rhyne", uuid: "", level: 2, country: "US", state: "SC", totalRevShare: 790.80, currency: "USD" },
  { agentName: "Susan A Thomas", uuid: "", level: 1, country: "US", state: "FL", totalRevShare: 737.50, currency: "USD" },
  { agentName: "Salvador Fernando Rivas Hernandez", uuid: "", level: 1, country: "US", state: "MA", totalRevShare: 650.00, currency: "USD" },
  { agentName: "Abby Moorman Andes", uuid: "", level: 3, country: "US", state: "GA", totalRevShare: 643.95, currency: "USD" },
];

const lastPaidData: AgentRevShareRow[] = [
  { agentName: "Ravi Ramachandran", uuid: "", level: 1, country: "US", state: "WA", totalRevShare: 2556.64, currency: "USD" },
  { agentName: "Lindsey Ruth Sampier", uuid: "", level: 3, country: "US", state: "CO", totalRevShare: 1000.00, currency: "USD" },
  { agentName: "Jennifer Horst", uuid: "", level: 2, country: "US", state: "CA", totalRevShare: 855.00, currency: "USD" },
  { agentName: "Christian Smith", uuid: "", level: 2, country: "US", state: "GA", totalRevShare: 834.50, currency: "USD" },
  { agentName: "Camille Anne Horvath", uuid: "", level: 3, country: "US", state: "FL", totalRevShare: 815.63, currency: "USD" },
  { agentName: "Sheri Morrison", uuid: "", level: 2, country: "US", state: "FL", totalRevShare: 784.00, currency: "USD" },
  { agentName: "Amanda Bowen", uuid: "", level: 7, country: "US", state: "WA", totalRevShare: 782.34, currency: "USD" },
  { agentName: "Sarah Brennan", uuid: "", level: 1, country: "CA", state: "NB", totalRevShare: 684.03, currency: "USD" },
];

const periodicData: PeriodicRow[] = [
  { date: "01/31/2026", initialRevShare: 34829.59, adjustment: 6687.39, finalRevShare: 41516.98, transactionCount6Mo: 310, memberCount: 207, monthly: "Yes", batchNumber: 1845, currency: "USD" },
  { date: "12/31/2025", initialRevShare: 38908.69, adjustment: 7027.19, finalRevShare: 45935.88, transactionCount6Mo: 425, memberCount: 241, monthly: "Yes", batchNumber: 1820, currency: "USD" },
  { date: "11/30/2025", initialRevShare: 37199.38, adjustment: 7414.32, finalRevShare: 44613.70, transactionCount6Mo: 339, memberCount: 232, monthly: "Yes", batchNumber: 1796, currency: "USD" },
  { date: "10/31/2025", initialRevShare: 39624.86, adjustment: 7979.28, finalRevShare: 47604.14, transactionCount6Mo: 378, memberCount: 230, monthly: "Yes", batchNumber: 1765, currency: "USD" },
  { date: "09/30/2025", initialRevShare: 37956.36, adjustment: 7574.30, finalRevShare: 45530.66, transactionCount6Mo: 385, memberCount: 250, monthly: "Yes", batchNumber: 1748, currency: "USD" },
  { date: "08/31/2025", initialRevShare: 47119.37, adjustment: 9530.45, finalRevShare: 56649.82, transactionCount6Mo: 451, memberCount: 280, monthly: "Yes", batchNumber: 1724, currency: "USD" },
  { date: "07/31/2025", initialRevShare: 58356.61, adjustment: 13808.35, finalRevShare: 72164.96, transactionCount6Mo: 509, memberCount: 299, monthly: "Yes", batchNumber: 1700, currency: "USD" },
  { date: "06/30/2025", initialRevShare: 53922.03, adjustment: 12164.04, finalRevShare: 66086.07, transactionCount6Mo: 525, memberCount: 303, monthly: "Yes", batchNumber: 1677, currency: "USD" },
  { date: "05/31/2025", initialRevShare: 63319.46, adjustment: 15272.33, finalRevShare: 78591.79, transactionCount6Mo: 580, memberCount: 317, monthly: "Yes", batchNumber: 1652, currency: "USD" },
  { date: "04/30/2025", initialRevShare: 55732.47, adjustment: 13213.15, finalRevShare: 68945.62, transactionCount6Mo: 524, memberCount: 306, monthly: "Yes", batchNumber: 1628, currency: "USD" },
  { date: "03/31/2025", initialRevShare: 44878.87, adjustment: 10562.97, finalRevShare: 55441.84, transactionCount6Mo: 399, memberCount: 246, monthly: "Yes", batchNumber: 1606, currency: "USD" },
];

const agentNames = [
  "Denise Ahee", "Sarah A Lund", "Michael Torres", "Jessica Chen", "Robert Williams",
  "Amanda Foster", "David Kim", "Lisa Martinez", "James Cooper", "Emily Watson",
];
const addresses = [
  "304 3rd Ave, Brooklyn, NY 11215, US",
  "2068, 2069, 2072, 2073 Imperial Ln, Green Bay, WI 54...",
  "1520 Oak Street, Sacramento, CA 95814, US",
  "892 Pine Road, Folsom, CA 95630, US",
  "4401 Maple Drive, Lincoln, CA 95648, US",
  "776 Elm Court, Roseville, CA 95678, US",
  "2310 Cedar Blvd, Citrus Heights, CA 95621, US",
  "511 Birch Lane, Elk Grove, CA 95624, US",
  "1893 Willow Way, Rocklin, CA 95765, US",
  "3045 Spruce Ave, Auburn, CA 95603, US",
];

function generateDeals(pnId: string, count: number, totalAmount: number): PayNowDeal[] {
  const deals: PayNowDeal[] = [];
  let remaining = totalAmount;
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const amt = isLast ? remaining : Math.round((totalAmount / count + (Math.random() - 0.5) * 100) * 100) / 100;
    remaining -= amt;
    deals.push({
      id: `${pnId}-deal-${i + 1}`,
      agentName: agentNames[i % agentNames.length],
      address: addresses[i % addresses.length],
      amount: Math.round(amt * 100) / 100,
      currency: "USD",
      transactionNumber: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      closedDate: "02/15/2026",
      salePrice: Math.floor(200000 + Math.random() * 600000),
      level: Math.random() > 0.5 ? 1 : 2,
      finalRevShare: Math.round(amt * 100) / 100,
    });
  }
  return deals;
}

// ── Monthly Batch Mock Data for Periodic Overview ──

const monthlyBatches: MonthlyBatchRow[] = [
  {
    id: "batch-2026-03", batchId: 1860, month: "March", year: 2026, totalDeals: 14, memberCount: 3,
    initialRevenue: 4358.36, payNowDeduction: 934.92, adjustmentAmount: 43.58, finalPayout: 3467.02,
    payNowTransactions: [
      { id: "pn-2026-03-1", date: "2026-03-05", initialAmount: 420.52, serviceFee: -12.62, finalAmount: 407.90, dealCount: 2 },
      { id: "pn-2026-03-2", date: "2026-03-20", initialAmount: 514.40, serviceFee: -15.43, finalAmount: 498.97, dealCount: 4 },
    ],
  },
  {
    id: "batch-2026-02", batchId: 1857, month: "February", year: 2026, totalDeals: 13, memberCount: 3,
    initialRevenue: 4439.01, payNowDeduction: 542.17, adjustmentAmount: 44.39, finalPayout: 3941.23,
    payNowTransactions: [
      { id: "pn-2026-02-1", date: "2026-02-10", initialAmount: 302.80, serviceFee: -9.08, finalAmount: 293.72, dealCount: 3 },
      { id: "pn-2026-02-2", date: "2026-02-25", initialAmount: 239.37, serviceFee: -7.18, finalAmount: 232.19, dealCount: 2 },
    ],
  },
  {
    id: "batch-2026-01", batchId: 1854, month: "January", year: 2026, totalDeals: 19, memberCount: 3,
    initialRevenue: 5433.46, payNowDeduction: 1496.26, adjustmentAmount: 54.33, finalPayout: 3991.53,
    payNowTransactions: [
      { id: "pn-2026-01-1", date: "2026-01-08", initialAmount: 612.30, serviceFee: -18.37, finalAmount: 593.93, dealCount: 5 },
      { id: "pn-2026-01-2", date: "2026-01-18", initialAmount: 483.96, serviceFee: -14.52, finalAmount: 469.44, dealCount: 3 },
      { id: "pn-2026-01-3", date: "2026-01-28", initialAmount: 400.00, serviceFee: -12.00, finalAmount: 388.00, dealCount: 2 },
    ],
  },
  {
    id: "batch-2025-12", batchId: 1851, month: "December", year: 2025, totalDeals: 11, memberCount: 3,
    initialRevenue: 3493.48, payNowDeduction: 873.72, adjustmentAmount: 34.93, finalPayout: 2654.69,
    payNowTransactions: [
      { id: "pn-2025-12-1", date: "2025-12-12", initialAmount: 530.20, serviceFee: -15.91, finalAmount: 514.29, dealCount: 3 },
      { id: "pn-2025-12-2", date: "2025-12-22", initialAmount: 343.52, serviceFee: -10.31, finalAmount: 333.21, dealCount: 2 },
    ],
  },
  {
    id: "batch-2025-11", batchId: 1848, month: "November", year: 2025, totalDeals: 9, memberCount: 3,
    initialRevenue: 2810.15, payNowDeduction: 562.03, adjustmentAmount: 28.10, finalPayout: 2276.22,
    payNowTransactions: [
      { id: "pn-2025-11-1", date: "2025-11-15", initialAmount: 362.03, serviceFee: -10.86, finalAmount: 351.17, dealCount: 2 },
      { id: "pn-2025-11-2", date: "2025-11-28", initialAmount: 200.00, serviceFee: -6.00, finalAmount: 194.00, dealCount: 1 },
    ],
  },
  {
    id: "batch-2025-10", batchId: 1845, month: "October", year: 2025, totalDeals: 16, memberCount: 3,
    initialRevenue: 5120.90, payNowDeduction: 1024.18, adjustmentAmount: 51.21, finalPayout: 4147.93,
    payNowTransactions: [
      { id: "pn-2025-10-1", date: "2025-10-07", initialAmount: 489.50, serviceFee: -14.69, finalAmount: 474.81, dealCount: 4 },
      { id: "pn-2025-10-2", date: "2025-10-21", initialAmount: 534.68, serviceFee: -16.04, finalAmount: 518.64, dealCount: 3 },
    ],
  },
  {
    id: "batch-2025-09", batchId: 1842, month: "September", year: 2025, totalDeals: 12, memberCount: 3,
    initialRevenue: 3890.20, payNowDeduction: 0, adjustmentAmount: 38.90, finalPayout: 3929.10,
    payNowTransactions: [],
  },
  {
    id: "batch-2025-08", batchId: 1839, month: "August", year: 2025, totalDeals: 15, memberCount: 3,
    initialRevenue: 4720.55, payNowDeduction: 944.11, adjustmentAmount: 47.21, finalPayout: 3823.65,
    payNowTransactions: [
      { id: "pn-2025-08-1", date: "2025-08-14", initialAmount: 450.30, serviceFee: -13.51, finalAmount: 436.79, dealCount: 3 },
      { id: "pn-2025-08-2", date: "2025-08-26", initialAmount: 493.81, serviceFee: -14.81, finalAmount: 479.00, dealCount: 2 },
    ],
  },
  {
    id: "batch-2025-07", batchId: 1836, month: "July", year: 2025, totalDeals: 18, memberCount: 3,
    initialRevenue: 5640.80, payNowDeduction: 1128.16, adjustmentAmount: 56.41, finalPayout: 4569.05,
    payNowTransactions: [
      { id: "pn-2025-07-1", date: "2025-07-10", initialAmount: 580.00, serviceFee: -17.40, finalAmount: 562.60, dealCount: 4 },
      { id: "pn-2025-07-2", date: "2025-07-25", initialAmount: 548.16, serviceFee: -16.44, finalAmount: 531.72, dealCount: 3 },
    ],
  },
  {
    id: "batch-2025-06", batchId: 1833, month: "June", year: 2025, totalDeals: 20, memberCount: 3,
    initialRevenue: 6210.40, payNowDeduction: 1242.08, adjustmentAmount: 62.10, finalPayout: 5030.42,
    payNowTransactions: [
      { id: "pn-2025-06-1", date: "2025-06-08", initialAmount: 620.00, serviceFee: -18.60, finalAmount: 601.40, dealCount: 5 },
      { id: "pn-2025-06-2", date: "2025-06-22", initialAmount: 622.08, serviceFee: -18.66, finalAmount: 603.42, dealCount: 3 },
    ],
  },
  {
    id: "batch-2025-05", batchId: 1830, month: "May", year: 2025, totalDeals: 17, memberCount: 3,
    initialRevenue: 5380.30, payNowDeduction: 0, adjustmentAmount: 53.80, finalPayout: 5434.10,
    payNowTransactions: [],
  },
  {
    id: "batch-2025-04", batchId: 1827, month: "April", year: 2025, totalDeals: 14, memberCount: 3,
    initialRevenue: 4150.75, payNowDeduction: 830.15, adjustmentAmount: 41.51, finalPayout: 3362.11,
    payNowTransactions: [
      { id: "pn-2025-04-1", date: "2025-04-18", initialAmount: 410.15, serviceFee: -12.30, finalAmount: 397.85, dealCount: 2 },
      { id: "pn-2025-04-2", date: "2025-04-28", initialAmount: 420.00, serviceFee: -12.60, finalAmount: 407.40, dealCount: 2 },
    ],
  },
  {
    id: "batch-2025-03", batchId: 1824, month: "March", year: 2025, totalDeals: 13, memberCount: 3,
    initialRevenue: 3920.60, payNowDeduction: 0, adjustmentAmount: 39.21, finalPayout: 3959.81,
    payNowTransactions: [],
  },
  {
    id: "batch-2025-02", batchId: 1821, month: "February", year: 2025, totalDeals: 10, memberCount: 3,
    initialRevenue: 3140.45, payNowDeduction: 628.09, adjustmentAmount: 31.40, finalPayout: 2543.76,
    payNowTransactions: [
      { id: "pn-2025-02-1", date: "2025-02-12", initialAmount: 328.09, serviceFee: -9.84, finalAmount: 318.25, dealCount: 2 },
      { id: "pn-2025-02-2", date: "2025-02-24", initialAmount: 300.00, serviceFee: -9.00, finalAmount: 291.00, dealCount: 1 },
    ],
  },
  {
    id: "batch-2025-01", batchId: 1818, month: "January", year: 2025, totalDeals: 11, memberCount: 3,
    initialRevenue: 3560.90, payNowDeduction: 0, adjustmentAmount: 35.61, finalPayout: 3596.51,
    payNowTransactions: [],
  },
];

const paymentDetails = {
  initialRevShare: 34829.59,
  adjustmentAmount: 6687.39,
  finalRevShare: 41516.98,
  batchId: 1845,
  initiatedDate: "02/17/2026",
};

// ── Component ──

export default function Financials() {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatters();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "unpaid";
  useDocumentTitle(t("fin.title"));

  // Drill-down state
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<AgentTransaction | null>(null);
  const [txnSheetOpen, setTxnSheetOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodicRow | null>(null);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);
  const [selectedPayNow, setSelectedPayNow] = useState<{ txn: PayNowTransaction; batchId: string } | null>(null);
  const [payNowSheetOpen, setPayNowSheetOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<PayNowDeal | null>(null);
  const [dealSheetOpen, setDealSheetOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<MonthlyBatchRow | null>(null);
  const [batchSheetOpen, setBatchSheetOpen] = useState(false);

  // Periodic date range filter
  const periodicPresets = [
    { labelKey: "filter.ytd", getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) as DateRange },
    { labelKey: "filter.lastYear", getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: new Date(subYears(new Date(), 1).getFullYear(), 11, 31) }) as DateRange },
    { labelKey: "filter.last6Months", getRange: () => ({ from: startOfMonth(subMonths(new Date(), 5)), to: endOfMonth(new Date()) }) as DateRange },
  ];
  const [periodicDateRange, setPeriodicDateRange] = useState<DateRange>({
    from: startOfYear(new Date()),
    to: new Date(),
  });

  // Helper to get a Date from batch month/year
  const getBatchDate = (batch: MonthlyBatchRow) => {
    const monthIndex = new Date(Date.parse(batch.month + " 1, " + batch.year)).getMonth();
    return new Date(batch.year, monthIndex, 1);
  };

  // Filtered batches based on date range
  const filteredBatches = useMemo(() => {
    if (!periodicDateRange.from && !periodicDateRange.to) return monthlyBatches;
    return monthlyBatches.filter((batch) => {
      const batchDate = getBatchDate(batch);
      if (periodicDateRange.from && batchDate < new Date(periodicDateRange.from.getFullYear(), periodicDateRange.from.getMonth(), 1)) return false;
      if (periodicDateRange.to && batchDate > periodicDateRange.to) return false;
      return true;
    });
  }, [periodicDateRange]);

  // Periodic summary stats (use filtered batches)
  const totalRevenueEarned = filteredBatches.reduce((sum, b) => sum + b.finalPayout + (b.adjustmentAmount || 0) + b.payNowDeduction, 0);
  const totalRevenue = filteredBatches.reduce((sum, b) => sum + b.finalPayout, 0);
  const totalTransactions = filteredBatches.reduce((sum, b) => sum + b.totalDeals, 0);
  const totalAdjustments = filteredBatches.reduce((sum, b) => sum + (b.adjustmentAmount || 0), 0);
  const totalPayNow = filteredBatches.reduce((sum, b) => sum + b.payNowDeduction, 0);

  const handleAgentClick = (row: AgentRevShareRow) => {
    setSelectedAgent(getAgentDetail(row));
  };

  const handleTxnClick = (txn: AgentTransaction) => {
    setSelectedTxn(txn);
    setTxnSheetOpen(true);
  };

  const handleBackFromAgent = () => {
    setSelectedAgent(null);
  };

  const handlePeriodClick = (row: PeriodicRow) => {
    setSelectedPeriod(row);
  };

  const handleBackFromPeriod = () => {
    setSelectedPeriod(null);
    setSelectedAgent(null);
  };

  // Columns for Unpaid tab (with UUID)
  const unpaidColumns: ColumnDef<AgentRevShareRow>[] = [
    { key: "agentName", header: t("fin.agentName"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "uuid", header: t("fin.uuid"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "level", header: t("fin.level"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "country", header: t("fin.country"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "state", header: t("fin.state"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "totalRevShare", header: t("fin.totalRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
  ];

  const agentColumns: ColumnDef<AgentRevShareRow>[] = [
    { key: "agentName", header: t("fin.agentName"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "level", header: t("fin.level"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "country", header: t("fin.country"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "state", header: t("fin.state"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "totalRevShare", header: t("fin.totalRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
  ];

  const periodicColumns: ColumnDef<PeriodicRow>[] = [
    { key: "date", header: t("fin.date"), type: "date", sortable: true, filterable: true, defaultVisible: true },
    { key: "initialRevShare", header: t("fin.initialRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "adjustment", header: t("fin.adjustment"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "finalRevShare", header: t("fin.finalRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "transactionCount6Mo", header: t("fin.transactionCount6Mo"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "memberCount", header: t("fin.memberCount"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "monthly", header: t("fin.monthly"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "batchNumber", header: t("fin.batchNumber"), type: "number", sortable: true, filterable: true, defaultVisible: true },
  ];

  const mobileCard = (row: AgentRevShareRow) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-sm text-foreground">{row.agentName}</p>
        <p className="text-xs text-muted-foreground">Level {row.level} · {row.country}, {row.state}</p>
      </div>
      <span className="font-semibold text-sm">{formatCurrency(row.totalRevShare)} {row.currency}</span>
    </div>
  );

  const periodicMobileCard = (row: PeriodicRow) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-sm text-foreground">{row.date}</p>
        <p className="text-xs text-muted-foreground">Batch #{row.batchNumber}</p>
      </div>
      <span className="font-semibold text-sm">{formatCurrency(row.finalRevShare)} {row.currency}</span>
    </div>
  );

  // If viewing a periodic period detail with an agent selected
  if (selectedPeriod && selectedAgent) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <AgentTransactionsView
            agent={selectedAgent}
            onBack={() => setSelectedAgent(null)}
            onTransactionClick={handleTxnClick}
          />
          <TransactionRevShareSheet
            txn={selectedTxn}
            open={txnSheetOpen}
            onOpenChange={setTxnSheetOpen}
          />
        </div>
      </DashboardLayout>
    );
  }

  // If viewing a periodic period detail (Payment Details + agent table)
  if (selectedPeriod) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
            onClick={handleBackFromPeriod}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("fin.back")}
          </Button>
          <div>
            <h1 className="text-page-title font-bold text-foreground">{selectedPeriod.date}</h1>
            <p className="text-sm text-muted-foreground">Batch #{selectedPeriod.batchNumber} · {selectedPeriod.transactionCount6Mo} {t("fin.transactions")} · {selectedPeriod.memberCount} {t("fin.members")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
            <Card className="p-5 h-fit">
              <h3 className="text-base font-semibold text-foreground mb-4">{t("fin.paymentDetails")}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">{t("fin.initialRevShare")}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">{formatCurrency(selectedPeriod.initialRevShare)} {selectedPeriod.currency}</span>
                    <p className="text-xs text-muted-foreground">Initiated {selectedPeriod.date}</p>
                  </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">{t("fin.adjustmentAmount")}</span>
                  <span className="text-sm font-medium text-exp-green">{formatCurrency(selectedPeriod.adjustment)} {selectedPeriod.currency}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-foreground">{t("fin.finalRevShare")}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(selectedPeriod.finalRevShare)} {selectedPeriod.currency}</span>
                    <p className="text-xs text-muted-foreground">Batch ID {selectedPeriod.batchNumber}</p>
                  </div>
                </div>
              </div>
            </Card>

            <DataTable
              data={lastPaidData}
              columns={agentColumns}
              csvFilename={`revshare-${selectedPeriod.date}`}
              mobileCardRender={mobileCard}
              defaultPageSize={25}
              onRowClick={handleAgentClick}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If an agent is selected (from unpaid/expected/lastPaid tabs), show drill-down
  if (selectedAgent) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <AgentTransactionsView
            agent={selectedAgent}
            onBack={handleBackFromAgent}
            onTransactionClick={handleTxnClick}
          />
          <TransactionRevShareSheet
            txn={selectedTxn}
            open={txnSheetOpen}
            onOpenChange={setTxnSheetOpen}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("fin.back")}
          </Button>
          <h1 className="text-page-title font-bold text-foreground">{t("fin.title")}</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList>
            <TabsTrigger value="unpaid" className="text-sm">
              {t("fin.unpaid")}
            </TabsTrigger>
            <TabsTrigger value="expected" className="text-sm">
              {t("fin.expected")}
            </TabsTrigger>
            <TabsTrigger value="lastPaid" className="text-sm">
              {t("fin.lastPaid")}
            </TabsTrigger>
            <TabsTrigger value="periodic" className="text-sm">
              {t("fin.periodicOverview")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unpaid" className="mt-4">
            <DataTable
              data={unpaidData}
              columns={unpaidColumns}
              csvFilename="unpaid-revshare"
              mobileCardRender={mobileCard}
              defaultPageSize={25}
              onRowClick={handleAgentClick}
            />
          </TabsContent>

          <TabsContent value="expected" className="mt-4">
            <DataTable
              data={expectedData}
              columns={agentColumns}
              csvFilename="expected-revshare"
              mobileCardRender={mobileCard}
              defaultPageSize={25}
              onRowClick={handleAgentClick}
            />
          </TabsContent>

          <TabsContent value="lastPaid" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
              <Card className="p-5 h-fit">
                <h3 className="text-base font-semibold text-foreground mb-4">{t("fin.paymentDetails")}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.initialRevShare")}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">{formatCurrency(paymentDetails.initialRevShare)} USD</span>
                      <p className="text-xs text-muted-foreground">Initiated {paymentDetails.initiatedDate}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.adjustmentAmount")}</span>
                    <span className="text-sm font-medium text-exp-green">{formatCurrency(paymentDetails.adjustmentAmount)} USD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.finalRevShare")}</span>
                    <span className="text-sm font-medium text-foreground">{formatCurrency(paymentDetails.finalRevShare)} USD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.batchId")}</span>
                    <span className="text-sm font-medium text-foreground">{paymentDetails.batchId}</span>
                  </div>
                </div>
              </Card>

              <DataTable
                data={lastPaidData}
                columns={agentColumns}
                csvFilename="last-paid-revshare"
                mobileCardRender={mobileCard}
                defaultPageSize={25}
                onRowClick={handleAgentClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="periodic" className="mt-4">
            {/* Date Range Filter & Download */}
            <div className="flex items-center justify-between mb-4">
              <div />
              <div className="flex items-center gap-2">
                <DateRangeFilter
                  value={periodicDateRange}
                  onChange={setPeriodicDateRange}
                  presets={periodicPresets}
                />
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t("fin.downloadReport")}
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{t("fin.totalRevenueEarned")}</p>
                <p className="text-2xl font-semibold text-primary font-secondary">
                  {formatCurrency(totalRevenueEarned)} <span className="text-xs text-muted-foreground">USD</span>
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{t("fin.totalTransactions")}</p>
                <p className="text-2xl font-semibold text-foreground font-secondary">{totalTransactions}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{t("fin.totalPayNowPaidEarly")}</p>
                <p className="text-2xl font-semibold text-exp-green font-secondary">
                  {formatCurrency(totalPayNow)} <span className="text-xs text-muted-foreground">USD</span>
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{t("fin.totalAdjustments")}</p>
                <p className="text-2xl font-semibold text-exp-green font-secondary">
                  {formatCurrency(totalAdjustments)} <span className="text-xs text-muted-foreground">USD</span>
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{t("fin.totalBatchPayout")}</p>
                <p className="text-2xl font-semibold text-primary font-secondary">
                  {formatCurrency(totalRevenue)} <span className="text-xs text-muted-foreground">USD</span>
                </p>
              </Card>
            </div>

            {/* Monthly Payment Batches heading */}
            <h2 className="text-lg font-semibold text-foreground mb-4">{t("fin.monthlyPaymentBatches")}</h2>

            <div className="space-y-3">
              {filteredBatches.map((batch) => {
                const isExpanded = expandedBatchId === batch.id;
                const hasPayNow = batch.payNowTransactions.length > 0;
                return (
                  <div key={batch.id} className="border border-border rounded-lg overflow-hidden">
                    {/* Batch header row */}
                    <div
                      className={cn(
                        "flex flex-wrap md:flex-nowrap items-center justify-between p-4 bg-muted/30 transition-colors cursor-pointer hover:bg-muted/50"
                      )}
                      onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                          : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        }
                        <div>
                          <h3 className="font-medium text-foreground">
                            {batch.month} {batch.year} Batch
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {batch.totalDeals} total deals · {batch.memberCount} members
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-3 md:mt-0 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{t("fin.initialRevenue")}</p>
                          <p className="text-sm font-medium font-secondary text-foreground">{formatCurrency(batch.finalPayout + batch.adjustmentAmount + batch.payNowDeduction)} USD</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{t("fin.payNowDeduction")}</p>
                          <p className={cn("text-sm font-secondary", batch.payNowDeduction > 0 ? "font-medium text-destructive" : "font-normal text-foreground")}>
                            {batch.payNowDeduction > 0 ? "- " : ""}{formatCurrency(batch.payNowDeduction)} USD
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{t("fin.adjustmentAmount")}</p>
                          <p className="text-sm font-medium font-secondary text-exp-green">{formatCurrency(batch.adjustmentAmount)} USD</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{t("fin.finalPayout")}</p>
                          <p className="text-sm font-semibold font-secondary text-primary">{formatCurrency(batch.finalPayout)} USD</p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        <div className="p-4">
                          {hasPayNow ? (
                            <>
                              <h4 className="font-medium text-sm text-exp-green mb-3">{t("fin.payNowEarlyPayouts")}</h4>

                          {/* Table header */}
                          <div className="hidden md:grid grid-cols-5 gap-4 px-3 py-2 bg-muted/50 rounded text-xs font-medium text-muted-foreground mb-1">
                            <div>{t("fin.date")}</div>
                            <div className="text-right">{t("fin.initialAmount")}</div>
                            <div className="text-right">{t("fin.serviceFee")}</div>
                            <div className="text-right">{t("fin.finalAmount")}</div>
                            <div className="text-right">{t("fin.dealCount")}</div>
                          </div>

                          {batch.payNowTransactions.map((pn) => (
                            <div
                              key={pn.id}
                              className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 px-3 py-3 border-b border-border/50 last:border-0 bg-accent/30 hover:bg-accent/50 transition-colors items-center cursor-pointer"
                              onClick={() => { setSelectedPayNow({ txn: pn, batchId: batch.id }); setPayNowSheetOpen(true); }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPayNow({ txn: pn, batchId: batch.id }); setPayNowSheetOpen(true); } }}
                            >
                              <div className="text-sm text-foreground">{formatDate(pn.date)}</div>
                              <div className="text-sm font-medium font-secondary text-foreground text-right">{formatCurrency(pn.initialAmount)}</div>
                              <div className="text-sm font-medium font-secondary text-destructive text-right">{formatCurrency(pn.serviceFee)}</div>
                              <div className="text-sm font-medium font-secondary text-foreground text-right">{formatCurrency(pn.finalAmount)}</div>
                              <div className="flex items-center justify-between md:justify-end gap-2">
                                <span className="text-sm text-foreground">{pn.dealCount} deals</span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground mb-3">No PayNow transactions this month.</p>
                          )}

                          {/* View Batch Details Button */}
                          <div className="mt-4 pt-3 border-t border-border">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={(e) => { e.stopPropagation(); setSelectedBatch(batch); setBatchSheetOpen(true); }}
                            >
                              <Info className="h-3.5 w-3.5" />
                              View Batch Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TransactionRevShareSheet
        txn={selectedTxn}
        open={txnSheetOpen}
        onOpenChange={setTxnSheetOpen}
      />

      {/* PayNow Payment Details Sheet */}
      <Sheet open={payNowSheetOpen} onOpenChange={setPayNowSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-section-title">{t("fin.paymentDetails")}</SheetTitle>
          </SheetHeader>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/10 p-3">
            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
            <p className="text-xs text-muted-foreground">This transaction was paid out early using PayNow with a service fee applied.</p>
          </div>
          {selectedPayNow && (() => {
            const deals = selectedPayNow.txn.deals ?? generateDeals(selectedPayNow.txn.id, selectedPayNow.txn.dealCount, selectedPayNow.txn.finalAmount);
            return (
              <div className="mt-6 space-y-5">
                {/* Payment Details Card */}
                <Card className="p-4 space-y-4">
                  {/* Initial Revenue Share */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t("fin.initialRevenue")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Initiated {formatDate(selectedPayNow.txn.date)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold font-secondary tabular-nums text-foreground">
                      {formatCurrency(selectedPayNow.txn.initialAmount)} USD
                    </p>
                  </div>

                  {/* Service Fee */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{t("fin.serviceFee")}</p>
                    <p className="text-sm font-semibold font-secondary tabular-nums text-destructive">
                      {formatCurrency(selectedPayNow.txn.serviceFee)} USD
                    </p>
                  </div>

                  <div className="border-t border-border" />

                  {/* Final Revenue Share */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t("fin.finalRevShare")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Batch ID {selectedPayNow.batchId}
                      </p>
                    </div>
                    <p className="text-sm font-bold font-secondary tabular-nums text-primary">
                      {formatCurrency(selectedPayNow.txn.finalAmount)} USD
                    </p>
                  </div>
                </Card>

                {/* Results count + Download */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{deals.length} Results</span>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>

                {/* Deal list */}
                <div className="divide-y divide-border">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between py-3 cursor-pointer hover:bg-accent/50 -mx-2 px-2 rounded-lg transition-colors"
                      onClick={() => { setSelectedDeal(deal); setDealSheetOpen(true); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDeal(deal); setDealSheetOpen(true); } }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{deal.agentName}</p>
                        <p className="text-xs text-muted-foreground truncate">{deal.address}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-sm font-medium font-secondary tabular-nums text-foreground">
                          {formatCurrency(deal.amount)} USD
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Deal Transaction Details Sheet */}
      <Sheet open={dealSheetOpen} onOpenChange={setDealSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-base sr-only">{t("fin.revShareDetails")}</SheetTitle>
          </SheetHeader>
          {selectedDeal && (
            <>
              <div className="flex items-center justify-between py-3 border-b border-border mb-4">
                <p className="text-sm font-medium text-foreground text-center flex-1">
                  {selectedDeal.agentName}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{t("fin.level")}</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedDeal.level}</span>
                </div>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{t("fin.transactionId")}</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedDeal.transactionNumber}</span>
                </div>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{t("fin.address")}</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedDeal.address}</span>
                </div>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{t("fin.closedDate")}</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedDeal.closedDate}</span>
                </div>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{t("fin.salePrice")}</span>
                  <span className="text-sm font-medium text-foreground text-right">{formatCurrency(selectedDeal.salePrice)} {selectedDeal.currency}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{t("fin.revShareLabel")}</span>
                  <span className="text-sm font-medium text-foreground text-right">{formatCurrency(selectedDeal.finalRevShare)} {selectedDeal.currency}</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Batch Payment Details Sheet */}
      <Sheet open={batchSheetOpen} onOpenChange={setBatchSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-section-title">{t("fin.paymentDetails")}</SheetTitle>
          </SheetHeader>
          {selectedBatch && (() => {
            const batchAdjustment = selectedBatch.adjustmentAmount;
            // Generate PayNow deals from payNowTransactions
            const payNowDealCount = selectedBatch.payNowTransactions.reduce((sum, pn) => sum + pn.dealCount, 0);
            const payNowTotalAmount = selectedBatch.payNowTransactions.reduce((sum, pn) => sum + pn.finalAmount, 0);
            const payNowDeals = generateDeals(`batch-pn-${selectedBatch.id}`, payNowDealCount, payNowTotalAmount).map(d => ({ ...d, paidVia: "paynow" as const }));
            // Remaining deals paid via batch
            const batchDealCount = selectedBatch.totalDeals - payNowDealCount;
            const batchOnlyDeals = generateDeals(`batch-${selectedBatch.id}`, Math.max(batchDealCount, 0), selectedBatch.finalPayout).map(d => ({ ...d, paidVia: "batch" as const }));
            const allDeals = [...payNowDeals, ...batchOnlyDeals];
            return (
              <div className="mt-6 space-y-5">
                <Card className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t("fin.initialRevenue")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedBatch.month} {selectedBatch.year}</p>
                    </div>
                    <p className="text-sm font-semibold font-secondary tabular-nums text-foreground">{formatCurrency(selectedBatch.initialRevenue)} USD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{t("fin.payNowDeduction")}</p>
                    <p className={cn("text-sm font-semibold font-secondary tabular-nums", selectedBatch.payNowDeduction > 0 ? "text-destructive" : "text-foreground")}>
                      {selectedBatch.payNowDeduction > 0 ? "-" : ""}{formatCurrency(selectedBatch.payNowDeduction)} USD
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{t("fin.adjustmentAmount")}</p>
                    <p className="text-sm font-semibold font-secondary tabular-nums text-exp-green">{formatCurrency(batchAdjustment)} USD</p>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{t("fin.batchId")}</p>
                    <p className="text-sm font-medium tabular-nums text-foreground">{selectedBatch.batchId}</p>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t("fin.finalPayout")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedBatch.totalDeals} deals · {selectedBatch.memberCount} members</p>
                    </div>
                    <p className="text-sm font-bold font-secondary tabular-nums text-primary">{formatCurrency(selectedBatch.finalPayout)} USD</p>
                  </div>
                </Card>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{allDeals.length} Results</span>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
                {/* Deal list */}
                <div className="divide-y divide-border">
                  {allDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between py-3 cursor-pointer hover:bg-accent/50 -mx-2 px-2 rounded-lg transition-colors"
                      onClick={() => { setSelectedDeal(deal); setDealSheetOpen(true); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDeal(deal); setDealSheetOpen(true); } }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{deal.agentName}</p>
                          {deal.paidVia === "paynow" ? (
                            <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/25">
                              PayNow
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-inset ring-primary/25">
                              Batch
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{deal.address}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-sm font-medium font-secondary tabular-nums text-foreground">
                          {formatCurrency(deal.amount)} USD
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
