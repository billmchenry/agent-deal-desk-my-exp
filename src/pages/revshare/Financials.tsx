import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AgentTransactionsView, type AgentDetail, type AgentTransaction } from "@/components/revshare/AgentTransactionsView";
import { TransactionRevShareSheet } from "@/components/revshare/TransactionRevShareSheet";

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
    email: "marcus.bell@exprealty.com", phone: "(214) 750-3186",
    transactions: [
      { address: "4400 Cedar Springs Rd, ...", fullAddress: "4400 Cedar Springs Rd, Dallas, TX 75219, US", closedDate: "01/23/2026", revShareAmount: 612.33, currency: "USD", transactionNumber: "3649201.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 445000, revShareDollar: 1224.66, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 612.33 },
    ],
  },
  "Abby Moorman Andes": {
    agentName: "Abby Moorman Andes", agentId: "318274", totalRevShare: 643.95, currency: "USD",
    email: "abby.andes@exprealty.com", phone: "(770) 394-2810",
    transactions: [
      { address: "3350 Peachtree Rd NE, A...", fullAddress: "3350 Peachtree Rd NE, Atlanta, GA 30326, US", closedDate: "01/12/2026", revShareAmount: 643.95, currency: "USD", transactionNumber: "3648490.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 520000, revShareDollar: 1287.90, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 643.95 },
    ],
  },
  "Ravi Ramachandran": {
    agentName: "Ravi Ramachandran", agentId: "278152", totalRevShare: 2556.64, currency: "USD",
    email: "ravi.ramachandran@exprealty.com", phone: "(425) 610-8274",
    transactions: [
      { address: "9625 164th Ave NE, Red...", fullAddress: "9625 164th Ave NE, Redmond, WA 98052, US", closedDate: "01/20/2026", revShareAmount: 1876.43, currency: "USD", transactionNumber: "3648503.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 1270000, revShareDollar: 3752.85, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 1876.43 },
      { address: "2525C 29th Ave S, Seatt...", fullAddress: "2525C 29th Ave S, Seattle, WA 98144, US", closedDate: "01/07/2026", revShareAmount: 680.21, currency: "USD", transactionNumber: "3647891.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 425000, revShareDollar: 1360.42, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 680.21 },
    ],
  },
  "Lindsey Ruth Sampier": {
    agentName: "Lindsey Ruth Sampier", agentId: "264518", totalRevShare: 1000.00, currency: "USD",
    email: "lindsey.sampier@exprealty.com", phone: "(720) 341-5928",
    transactions: [
      { address: "1890 Wynkoop St, Denver...", fullAddress: "1890 Wynkoop St, Denver, CO 80202, US", closedDate: "01/18/2026", revShareAmount: 600.00, currency: "USD", transactionNumber: "3649030.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 525000, revShareDollar: 1200.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 600.00 },
      { address: "4502 S Broadway, Engle...", fullAddress: "4502 S Broadway, Englewood, CO 80113, US", closedDate: "01/05/2026", revShareAmount: 400.00, currency: "USD", transactionNumber: "3647980.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 340000, revShareDollar: 800.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 400.00 },
    ],
  },
  "Jennifer Horst": {
    agentName: "Jennifer Horst", agentId: "241906", totalRevShare: 855.00, currency: "USD",
    email: "jennifer.horst@exprealty.com", phone: "(916) 472-8301",
    transactions: [
      { address: "2100 Capitol Ave, Sacra...", fullAddress: "2100 Capitol Ave, Sacramento, CA 95816, US", closedDate: "01/14/2026", revShareAmount: 855.00, currency: "USD", transactionNumber: "3648610.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 680000, revShareDollar: 1710.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 855.00 },
    ],
  },
  "Christian Smith": {
    agentName: "Christian Smith", agentId: "283451", totalRevShare: 834.50, currency: "USD",
    email: "christian.smith@exprealty.com", phone: "(404) 629-1475",
    transactions: [
      { address: "560 Dutch Valley Rd, At...", fullAddress: "560 Dutch Valley Rd, Atlanta, GA 30324, US", closedDate: "01/16/2026", revShareAmount: 834.50, currency: "USD", transactionNumber: "3648750.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 490000, revShareDollar: 1669.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 834.50 },
    ],
  },
  "Camille Anne Horvath": {
    agentName: "Camille Anne Horvath", agentId: "297163", totalRevShare: 815.63, currency: "USD",
    email: "camille.horvath@exprealty.com", phone: "(954) 318-7042",
    transactions: [
      { address: "3001 E Las Olas Blvd, F...", fullAddress: "3001 E Las Olas Blvd, Fort Lauderdale, FL 33316, US", closedDate: "01/22/2026", revShareAmount: 815.63, currency: "USD", transactionNumber: "3649170.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 710000, revShareDollar: 1631.26, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 815.63 },
    ],
  },
  "Sheri Morrison": {
    agentName: "Sheri Morrison", agentId: "253890", totalRevShare: 784.00, currency: "USD",
    email: "sheri.morrison@exprealty.com", phone: "(561) 903-4218",
    transactions: [
      { address: "800 S Dixie Hwy, West P...", fullAddress: "800 S Dixie Hwy, West Palm Beach, FL 33401, US", closedDate: "01/11/2026", revShareAmount: 784.00, currency: "USD", transactionNumber: "3648420.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 545000, revShareDollar: 1568.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 784.00 },
    ],
  },
  "Amanda Bowen": {
    agentName: "Amanda Bowen", agentId: "210347", totalRevShare: 782.34, currency: "USD",
    email: "amanda.bowen@exprealty.com", phone: "(253) 481-7630",
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
  const { formatCurrency } = useFormatters();
  const navigate = useNavigate();
  useDocumentTitle(t("fin.title"));

  // Drill-down state
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<AgentTransaction | null>(null);
  const [txnSheetOpen, setTxnSheetOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodicRow | null>(null);

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
        <Tabs defaultValue="unpaid" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
            <TabsTrigger value="unpaid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.unpaid")}
            </TabsTrigger>
            <TabsTrigger value="expected" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.expected")}
            </TabsTrigger>
            <TabsTrigger value="lastPaid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.lastPaid")}
            </TabsTrigger>
            <TabsTrigger value="periodic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
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
            <DataTable
              data={periodicData}
              columns={periodicColumns}
              csvFilename="periodic-revshare"
              mobileCardRender={periodicMobileCard}
              defaultPageSize={25}
              onRowClick={handlePeriodClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TransactionRevShareSheet
        txn={selectedTxn}
        open={txnSheetOpen}
        onOpenChange={setTxnSheetOpen}
      />
    </DashboardLayout>
  );
}
