export interface License {
  id: string;
  number: string;
  state: string;
  expirationDate: Date;
  status: 'active' | 'pending' | 'expired';
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  role: 'agent' | 'team_leader' | 'influencer';
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  licenses?: License[];
  teamLeaderId?: string;
}

export interface VitalCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  type: 'currency' | 'percentage' | 'number' | 'progress';
  progress?: number;
  sparklineData?: number[];
}

export interface QueryParameters {
  originalQuery: string;
  queryType: string;
  filters?: Record<string, any>;
  dateRange?: { start: Date; end: Date };
  entityTypes?: string[];
  statusFlags?: string[];
}

export interface PinnedInsight {
  id: string;
  query: string;
  title: string;
  customName?: string;
  content: string;
  type: 'chart' | 'list' | 'metric' | 'table';
  data?: any;
  queryParameters?: QueryParameters;
  conversationId?: string;
  createdAt: Date;
  updatedAt: Date;
  refreshInterval: 'daily' | 'weekly' | 'manual';
  lastRefreshedAt: Date;
  isRefreshing?: boolean;
  priority?: number;
}

export interface KeyPoint {
  icon: 'increase' | 'decrease' | 'warning' | 'success' | 'insight' | 'default';
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualizations?: Visualization[];
  sources?: string[];
  isPinnable?: boolean;
  // Visual Intelligence enhancements
  summary?: string;
  keyPoints?: KeyPoint[];
  relatedQueries?: string[];
  expandedContent?: string;
  visualizationLayout?: 'single' | 'grid' | 'tabs' | 'comparison';
}

export interface VisualizationColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'percentage' | 'status' | 'date';
  sortable?: boolean;
}

export interface Visualization {
  type: 'line' | 'bar' | 'pie' | 'area' | 'table' | 'list' | 'metric';
  title: string;
  data: any;
  columns?: VisualizationColumn[];
}

export interface Transaction {
  id: string;
  property: string;
  address: string;
  status: 'pending' | 'closed' | 'cancelled';
  value: number;
  closingDate?: Date;
  commission: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  gci: number;
  transactions: number;
  trend: 'up' | 'down' | 'stable';
  status: 'active' | 'at_risk' | 'inactive';
}

export interface MarketplaceReport {
  id: string;
  title: string;
  description: string;
  category: 'production' | 'team' | 'growth' | 'custom';
  creator: {
    id: string;
    name: string;
    role: 'agent' | 'team_leader' | 'influencer';
    badge?: 'top_producer' | 'mentor' | 'verified';
  };
  templateInsights: Omit<PinnedInsight, 'id' | 'createdAt' | 'updatedAt' | 'lastRefreshedAt'>[];
  visibility: 'private' | 'team' | 'organization' | 'public';
  usageCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  preview?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedReport {
  id: string;
  reportId: string;
  report: MarketplaceReport;
  sharedBy: {
    id: string;
    name: string;
    role: 'team_leader' | 'influencer';
  };
  sharedWith: 'team' | 'organization';
  sharedAt: Date;
  status: 'pending' | 'installed' | 'dismissed';
}

export interface ReportInstallation {
  id: string;
  reportId: string;
  reportTitle: string;
  installedAt: Date;
  insightIds: string[];
}

// Listing Flow Types
export interface ListingParty {
  name: string;
  email?: string;
  phone?: string;
  role: 'seller' | 'buyer' | 'agent';
}

export interface ChecklistItem {
  id: string;
  documentName: string;
  formCode?: string;
  status: 'required' | 'in_review' | 'approved' | 'if_applicable' | 'not_required';
  isAttached: boolean;
  attachedAt?: Date;
  verifiedByMira?: boolean;
  comments?: string;
  // Category for grouping documents
  category?: string;
  // Section for transaction checklist grouping (e.g., "Listing Documents", "Transaction Documents")
  section?: 'listing' | 'transaction';
  // Additional note/description for the document
  note?: string;
  // Metadata task support (for non-document items like "Enter GF Number")
  isMetadataTask?: boolean;
  metadataField?: string; // Field name to update on ContractExtraction
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
  status: 'awaiting_signature' | 'verified' | 'under_review' | 'rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface ListingExtraction {
  id: string;
  // Property Core (Required)
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  legalDescription?: string;
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';
  
  // Parties
  sellers: ListingParty[];
  
  // Listing Terms (Required)
  listingPrice: number;
  listingStartDate: Date;
  listingEndDate: Date;
  
  // Financials (Required)
  totalCommission: number;
  buyerBrokerSplit?: number;
  
  // Business Logic (Required)
  checklistType: 'residential' | 'lease' | 'land';
  officeDivision?: string;
  
  // Compliance/Status (Required)
  occupancyStatus: 'owner' | 'tenant' | 'vacant';
  personalInterestDisclosure: boolean;
  hoaStatus: 'yes' | 'no' | 'unknown';
  keyboxAuthorized: boolean;
  exclusions?: string[];
  
  // Optional/Metadata
  mlsNumber?: string;
  yearBuilt?: number;
  leadSource?: string;
  protectionPeriodDays?: number;
  
  // Legacy Compliance (for extraction verification)
  complianceStatus: 'compliant' | 'issues_found' | 'pending';
  complianceNotes?: string;
  signaturesDetected: boolean;
  initialsDetected: boolean;
  
  // Confidence scores for each field (0-100)
  confidence: Record<string, number>;
  
  // Source document
  documentUrl?: string;
  documentName?: string;
}

export interface Listing {
  id: string;
  extraction: ListingExtraction;
  status: 'draft' | 'pending_review' | 'active' | 'pending' | 'sold' | 'withdrawn';
  createdAt: Date;
  createdBy: string;
  approvedAt?: Date;
  syncedToMLS?: boolean;
  // Property Detail additions
  reviewerName?: string;
  officeName?: string;
  checklist?: ChecklistItem[];
  checklistPhase?: 'listing' | 'transaction';
  activityLog?: ActivityLogItem[];
  documents?: ListingDocument[];
  // Contract/Transaction data (populated when status changes to 'pending')
  contractData?: ContractExtraction;
}

// Contract extraction from Texas 1-4 Family Residential Contract
export interface ContractExtraction {
  id: string;
  // Reference to source listing
  sourceListingId: string;
  
  // 1. PARTIES & PROPERTY (Paragraphs 1 & 2)
  sellers: ListingParty[];
  buyers: ListingParty[];
  legalDescription?: string;  // Lot, Block, Addition, City, County
  propertyAddress: string;
  exclusions?: string[];  // Specific improvements retained by Seller
  
  // 2. SALES PRICE (Paragraph 3)
  cashPortion: number;  // Down payment
  financing: number;    // Sum of all financing
  salesPrice: number;   // Total (cash + financing)
  
  // 3. EARNEST MONEY & TERMINATION OPTION (Paragraph 5)
  earnestMoney: number;
  escrowAgent?: string;
  additionalEarnestMoney?: number;
  additionalEarnestMoneyDays?: number;
  optionFee: number;
  optionPeriodDays: number;
  
  // 4. TITLE & SURVEY (Paragraph 6)
  titleCompany?: string;
  titleExceptions?: string[];
  surveyType?: 'existing' | 'new' | 'waived';
  hoaMembership?: 'yes' | 'no' | 'unknown';
  
  // 5. PROPERTY CONDITION (Paragraph 7)
  sellersDisclosureStatus?: 'attached' | 'to_be_delivered' | 'waived';
  leadBasedPaintDisclosure?: boolean;  // Required for pre-1978 homes
  lenderRequiredRepairs?: string;
  
  // 6. BROKER'S FEES & CLOSING (Paragraphs 8 & 9)
  listingBrokerFee?: number;  // Percentage or amount
  buyingBrokerFee?: number;   // Percentage or amount
  closingDate: Date;
  
  // 7. SPECIAL PROVISIONS & POSSESSION (Paragraphs 10 & 11)
  possessionType?: 'at_closing' | 'temporary_lease';
  specialProvisions?: string;
  
  // 8. SETTLEMENT & OTHER EXPENSES (Paragraph 12)
  sellerConcessions?: number;
  
  // 9. NOTICES & ADDENDA (Paragraphs 21 & 22)
  buyerNoticeAddress?: string;
  buyerNoticePhone?: string;
  buyerNoticeEmail?: string;
  sellerNoticeAddress?: string;
  sellerNoticePhone?: string;
  sellerNoticeEmail?: string;
  addendaList?: string[];
  
  // 10. SIGNATURES & EXECUTION
  effectiveDate: Date;  // Acceptance date
  listingBrokerName?: string;
  listingBrokerLicense?: string;
  listingAgentName?: string;
  listingAgentLicense?: string;
  buyingBrokerName?: string;
  buyingBrokerLicense?: string;
  buyingAgentName?: string;
  buyingAgentLicense?: string;
  
  // Legacy fields for backwards compatibility
  buyingBrokerage?: string;
  buyingAgent?: string;
  escrowOfficer?: string;
  contractExclusions?: string[];
  
  // Referrals/Splits
  referrals?: ContractReferral[];
  
  // BROKERAGE-SPECIFIC FIELDS (Manual Input - not extracted from contract)
  
  // Carried over from listing
  mlsNumber?: string;
  propertyType?: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';
  yearBuilt?: number;
  
  // Transaction-specific metadata
  transactionLeadSource?: string;
  gfEscrowNumber?: string; // Filled in later via checklist
  
  // Representation Choice (required for dual agency disclosure)
  representationType?: 'seller_agency' | 'dual_intermediary';
  
  // Title Officer Contact (supplements titleCompany)
  escrowOfficerName?: string;
  escrowOfficerEmail?: string;
  escrowOfficerPhone?: string;
  
  // Commission Splits (if sharing with team member)
  hasCoAgentSplit?: boolean;
  coAgentSplits?: CommissionSplit[];
  
  // Confidence scores
  confidence: Record<string, number>;
  
  // Document source
  documentName?: string;
}

export interface ContractReferral {
  agentName: string;
  brokerage: string;
  percentage: number;
  leadSource?: string; // "OpCity", "Zillow Flex", "Agent Referral", etc.
}

export interface CommissionSplit {
  agentId?: string;
  agentName: string;
  splitPercentage: number;
  splitType: 'equal' | 'lead_support' | 'custom';
}

// Re-export batch types for convenience
export * from './batch';
