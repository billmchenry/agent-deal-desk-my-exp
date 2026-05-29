// Domain types ported from Mirapro ACR remix, scoped to the Transactions module.
// Kept intentionally faithful to the source so mock data and view code map 1:1.

export interface ListingParty {
  name: string;
  email?: string;
  phone?: string;
  role: "seller" | "buyer" | "agent";
}

export interface ChecklistItem {
  id: string;
  documentName: string;
  formCode?: string;
  status: "required" | "in_review" | "approved" | "if_applicable" | "not_required";
  isAttached: boolean;
  attachedAt?: Date;
  verifiedByMira?: boolean;
  comments?: string;
  category?: string;
  section?: "listing" | "transaction";
  note?: string;
  isMetadataTask?: boolean;
  metadataField?: string;
  metadataValue?: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  timestamp: Date;
  performedBy?: string;
}

export interface ListingDocument {
  id: string;
  name: string;
  type: string;
  status: "awaiting_signature" | "verified" | "under_review" | "rejected";
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface ListingExtraction {
  id: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  legalDescription?: string;
  propertyType: "single_family" | "condo" | "townhouse" | "multi_family" | "land" | "commercial";
  sellers: ListingParty[];
  listingPrice: number;
  listingStartDate: Date;
  listingEndDate: Date;
  totalCommission: number;
  buyerBrokerSplit?: number;
  checklistType: "residential" | "lease" | "land";
  officeDivision?: string;
  occupancyStatus: "owner" | "tenant" | "vacant";
  personalInterestDisclosure: boolean;
  hoaStatus: "yes" | "no" | "unknown";
  keyboxAuthorized: boolean;
  exclusions?: string[];
  mlsNumber?: string;
  yearBuilt?: number;
  leadSource?: string;
  protectionPeriodDays?: number;
  complianceStatus: "compliant" | "issues_found" | "pending";
  complianceNotes?: string;
  signaturesDetected: boolean;
  initialsDetected: boolean;
  confidence: Record<string, number>;
  documentUrl?: string;
  documentName?: string;
}

export interface ContractReferral {
  agentName: string;
  brokerage: string;
  percentage: number;
  leadSource?: string;
}

export interface CommissionSplit {
  agentId?: string;
  agentName: string;
  splitPercentage: number;
  splitType: "equal" | "lead_support" | "custom";
}

export interface ContractExtraction {
  id: string;
  sourceListingId: string;
  sellers: ListingParty[];
  buyers: ListingParty[];
  legalDescription?: string;
  propertyAddress: string;
  exclusions?: string[];
  cashPortion: number;
  financing: number;
  salesPrice: number;
  earnestMoney: number;
  escrowAgent?: string;
  additionalEarnestMoney?: number;
  additionalEarnestMoneyDays?: number;
  optionFee: number;
  optionPeriodDays: number;
  titleCompany?: string;
  titleExceptions?: string[];
  surveyType?: "existing" | "new" | "waived";
  hoaMembership?: "yes" | "no" | "unknown";
  sellersDisclosureStatus?: "attached" | "to_be_delivered" | "waived";
  leadBasedPaintDisclosure?: boolean;
  lenderRequiredRepairs?: string;
  listingBrokerFee?: number;
  buyingBrokerFee?: number;
  closingDate: Date;
  possessionType?: "at_closing" | "temporary_lease";
  specialProvisions?: string;
  sellerConcessions?: number;
  buyerNoticeAddress?: string;
  buyerNoticePhone?: string;
  buyerNoticeEmail?: string;
  sellerNoticeAddress?: string;
  sellerNoticePhone?: string;
  sellerNoticeEmail?: string;
  addendaList?: string[];
  effectiveDate: Date;
  listingBrokerName?: string;
  listingBrokerLicense?: string;
  listingAgentName?: string;
  listingAgentLicense?: string;
  buyingBrokerName?: string;
  buyingBrokerLicense?: string;
  buyingAgentName?: string;
  buyingAgentLicense?: string;
  buyingBrokerage?: string;
  buyingAgent?: string;
  escrowOfficer?: string;
  contractExclusions?: string[];
  referrals?: ContractReferral[];
  mlsNumber?: string;
  propertyType?: ListingExtraction["propertyType"];
  yearBuilt?: number;
  transactionLeadSource?: string;
  gfEscrowNumber?: string;
  representationType?: "seller_agency" | "dual_intermediary";
  escrowOfficerName?: string;
  escrowOfficerEmail?: string;
  escrowOfficerPhone?: string;
  hasCoAgentSplit?: boolean;
  coAgentSplits?: CommissionSplit[];
  confidence: Record<string, number>;
  documentName?: string;
}

export interface Listing {
  id: string;
  extraction: ListingExtraction;
  status: "draft" | "pending_review" | "active" | "pending" | "sold" | "withdrawn";
  createdAt: Date;
  createdBy: string;
  approvedAt?: Date;
  syncedToMLS?: boolean;
  reviewerName?: string;
  officeName?: string;
  checklist?: ChecklistItem[];
  checklistPhase?: "listing" | "transaction";
  activityLog?: ActivityLogItem[];
  documents?: ListingDocument[];
  contractData?: ContractExtraction;
}

export type ListingMode =
  | "idle"
  | "uploading"
  | "processing"
  | "ready"
  | "verifying"
  | "submitted";

export type ContractMode =
  | "idle"
  | "uploading"
  | "processing"
  | "selecting_listing"
  | "ready"
  | "manual_intake"
  | "verifying"
  | "submitted";
