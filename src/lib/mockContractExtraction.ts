import { ContractExtraction, Listing, ChecklistItem } from '@/types';

// Processing stages for contract extraction
export const contractProcessingStages = [
  { id: 'upload', label: 'Receiving document...', icon: '📄', progress: 15 },
  { id: 'ocr', label: 'Reading text...', icon: '🔍', progress: 35 },
  { id: 'extract', label: 'Extracting buyer info...', icon: '👥', progress: 55 },
  { id: 'financials', label: 'Parsing financials...', icon: '💰', progress: 75 },
  { id: 'dates', label: 'Identifying key dates...', icon: '📅', progress: 90 },
  { id: 'complete', label: 'Complete', icon: '✅', progress: 100 },
];

export const mockExtractContract = async (
  fileName: string, 
  listing: Listing
): Promise<ContractExtraction> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  // Calculate mock dates
  const effectiveDate = new Date();
  const closingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  // Negotiated price (slightly below listing price)
  const salesPrice = listing.extraction.listingPrice - 10000;
  const financing = salesPrice * 0.80; // 80% financed
  const cashPortion = salesPrice - financing; // 20% down
  
  return {
    id: `contract-${Date.now()}`,
    sourceListingId: listing.id,
    
    // Brokerage-specific fields - auto-populated from listing/external sources
    mlsNumber: listing.extraction.mlsNumber,  // Carried over from listing
    propertyType: listing.extraction.propertyType,
    yearBuilt: listing.extraction.yearBuilt,  // Carried over from public records/listing
    
    // 1. PARTIES & PROPERTY
    sellers: listing.extraction.sellers,
    buyers: [
      { 
        name: 'Michael & Emily Johnson', 
        role: 'buyer',
        email: 'mjohnson@email.com',
        phone: '(555) 867-5309'
      }
    ],
    propertyAddress: `${listing.extraction.propertyAddress}, ${listing.extraction.city}, ${listing.extraction.state} ${listing.extraction.zipCode}`,
    legalDescription: 'Lot 5, Block 3, Oakwood Estates Addition, Dallas County',
    exclusions: listing.extraction.exclusions || [],
    
    // 2. SALES PRICE
    cashPortion,
    financing,
    salesPrice,
    
    // 3. EARNEST MONEY & TERMINATION OPTION
    earnestMoney: 5000,
    escrowAgent: 'Republic Title of Texas',
    additionalEarnestMoney: 0,
    additionalEarnestMoneyDays: 0,
    optionFee: 500,
    optionPeriodDays: 10,
    
    // 4. TITLE & SURVEY
    titleCompany: 'Republic Title of Texas',
    titleExceptions: [],
    surveyType: 'existing',
    hoaMembership: listing.extraction.hoaStatus,
    
    // 5. PROPERTY CONDITION
    sellersDisclosureStatus: 'attached',
    leadBasedPaintDisclosure: false,
    lenderRequiredRepairs: '',
    
    // 6. BROKER'S FEES & CLOSING
    listingBrokerFee: listing.extraction.totalCommission / 2,
    buyingBrokerFee: listing.extraction.buyerBrokerSplit || listing.extraction.totalCommission / 2,
    closingDate,
    
    // 7. SPECIAL PROVISIONS & POSSESSION
    possessionType: 'at_closing',
    specialProvisions: '',
    
    // 8. SETTLEMENT
    sellerConcessions: 0,
    
    // 9. NOTICES
    buyerNoticeAddress: '',
    buyerNoticePhone: '(555) 867-5309',
    buyerNoticeEmail: 'mjohnson@email.com',
    sellerNoticeAddress: listing.extraction.propertyAddress,
    sellerNoticePhone: listing.extraction.sellers[0]?.phone || '',
    sellerNoticeEmail: listing.extraction.sellers[0]?.email || '',
    addendaList: ['Third Party Financing Addendum', 'Information About Brokerage Services'],
    
    // 10. SIGNATURES & EXECUTION
    effectiveDate,
    listingBrokerName: 'Keller Williams Realty',
    listingBrokerLicense: 'BR-123456',
    listingAgentName: 'Sarah Johnson',
    listingAgentLicense: 'AG-789012',
    buyingBrokerName: 'RE/MAX Premier',
    buyingBrokerLicense: 'BR-654321',
    buyingAgentName: 'Michael Torres',
    buyingAgentLicense: 'AG-210987',
    
    // Legacy fields
    buyingBrokerage: 'RE/MAX Premier',
    buyingAgent: 'Michael Torres',
    escrowOfficer: 'Amanda Chen',
    contractExclusions: listing.extraction.exclusions || [],
    
    // Escrow Officer Contact (partially extracted, agent completes)
    escrowOfficerName: 'Amanda Chen',  // Often extracted
    escrowOfficerEmail: undefined,     // Agent usually provides
    escrowOfficerPhone: undefined,     // Agent usually provides
    
    // Source of Business (agent to fill in)
    transactionLeadSource: undefined,  // Always manual
    
    // No referrals by default
    referrals: [],
    
    // Team splits - agent to fill in
    hasCoAgentSplit: false,
    coAgentSplits: [],
    
    // Confidence scores for extracted fields
    confidence: {
      sellers: 97,
      buyers: 95,
      propertyAddress: 99,
      legalDescription: 92,
      exclusions: 90,
      cashPortion: 94,
      financing: 92,
      salesPrice: 98,
      earnestMoney: 96,
      escrowAgent: 90,
      optionFee: 94,
      optionPeriodDays: 91,
      titleCompany: 88,
      surveyType: 88,
      hoaMembership: 90,
      sellersDisclosureStatus: 92,
      leadBasedPaintDisclosure: 95,
      listingBrokerFee: 90,
      buyingBrokerFee: 88,
      closingDate: 95,
      possessionType: 93,
      specialProvisions: 88,
      sellerConcessions: 90,
      effectiveDate: 97,
      listingBrokerName: 92,
      buyingBrokerName: 90,
      listingAgentName: 94,
      buyingAgentName: 92,
      // Auto-populated from external sources
      mlsNumber: 95,
      yearBuilt: 90,
      // Escrow officer fields
      escrowOfficerName: 75,
      escrowOfficerEmail: 0,
      escrowOfficerPhone: 0,
      // Manual entry fields
      transactionLeadSource: 0,
      hasCoAgentSplit: 0,
      coAgentSplits: 0,
    },
    
    documentName: fileName,
  };
};

export const getContractConfidenceLevel = (confidence: number): 'high' | 'medium' | 'low' => {
  if (confidence >= 85) return 'high';
  if (confidence >= 70) return 'medium';
  return 'low';
};

// Transaction checklist items (activated when listing goes under contract)
// Includes all listing documents (carried forward) plus transaction-specific documents
export const transactionChecklistItems: ChecklistItem[] = [
  // === SECTION: LISTING DOCUMENTS (carried forward from listing phase) ===
  { id: 'lc-1', documentName: 'Information About Brokerage Services (IABS)', formCode: 'TREC IABS 1-1', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-2', documentName: 'Residential Real Estate Listing Agreement', formCode: 'TXR-1101', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-3', documentName: "Seller's Disclosure Notice", formCode: 'TREC OP-H', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-4', documentName: 'General Information and Notice to Buyers and Sellers', formCode: 'TXR-1506', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-5', documentName: 'MLS Profile Sheet', formCode: 'MLS', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-6', documentName: 'Keybox/Lockbox Authorization', formCode: 'LOCKBOX', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-7', documentName: 'Property Photos', formCode: 'PHOTOS', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required' },
  { id: 'lc-8', documentName: 'Unrepresented Customer Showing Form', formCode: 'TXR-1508', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required', note: 'Required before showing to unrepresented buyers' },
  { id: 'lc-9', documentName: 'Updated IABS (1-1)', formCode: 'TREC IABS 1-1', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required', note: '2026 non-representation version' },
  { id: 'lc-10', documentName: 'Affidavit of Title', formCode: 'TITLE-AFF', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required', note: 'Notarized ownership verification' },
  { id: 'lc-11', documentName: 'Mortgage Payoff Information', formCode: 'PAYOFF', status: 'approved' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'Required', note: 'For accurate Seller Net Sheet' },
  { id: 'lc-12', documentName: 'Lead-Based Paint Addendum', formCode: 'TXR-1906', status: 'in_review' as const, isAttached: true, verifiedByMira: true, section: 'listing' as const, category: 'If Applicable', note: 'Required if home built before 1978' },
  { id: 'lc-13', documentName: 'Condominium Addendum to Listing', formCode: 'TXR-1401', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'Required if property is a condo' },
  { id: 'lc-14', documentName: 'Addendum for Property Subject to Mandatory Membership in HOA', formCode: 'TREC', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'Required if property is in an HOA' },
  { id: 'lc-15', documentName: 'Information About On-Site Sewer Facility', formCode: 'TXR-1407', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'Required if property uses septic system' },
  { id: 'lc-16', documentName: 'MUD / Water District Notice', formCode: 'MUD', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'Required if in Municipal Utility District' },
  { id: 'lc-17', documentName: 'T-47 Residential Real Property Affidavit', formCode: 'T-47', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'Required if using existing survey' },
  { id: 'lc-18', documentName: 'T-47.1 Declaration', formCode: 'T-47.1', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: '2026 option for verifying property with older survey' },
  { id: 'lc-19', documentName: 'Utility History & Average Bills', formCode: 'UTILITY', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: '12 months of utility averages' },
  { id: 'lc-20', documentName: 'Notice of Information from Other Sources', formCode: 'TXR-2502', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'If reporting data different from official records' },
  { id: 'lc-21', documentName: 'List of Improvements & Repairs', formCode: 'IMPROVEMENTS', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: 'Last 5 years with receipts/warranties' },
  { id: 'lc-22', documentName: 'Residential Contract Critical Date List', formCode: 'TXR-1958', status: 'if_applicable' as const, isAttached: false, section: 'listing' as const, category: 'If Applicable', note: '2026 deadline tracking form' },

  // === SECTION: TRANSACTION DOCUMENTS (new for contract phase) ===
  
  // --- REQUIRED DOCUMENTS ---
  { id: 'tc-1', documentName: 'Executed One to Four Family Residential Contract (Resale)', formCode: 'TREC 20-17', status: 'in_review' as const, isAttached: true, verifiedByMira: true, section: 'transaction' as const, category: 'Required', note: 'Contains negotiated price, closing date, and contingencies' },
  { id: 'tc-2', documentName: 'Residential Contract Critical Date List', formCode: 'TXR-1958', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: '2026 mandatory deadline tracker for Option Period, Financing, Appraisal' },
  { id: 'tc-3', documentName: 'Receipted Earnest Money and Option Fee', formCode: 'CONTRACT', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: 'Final page of contract signed by escrow agent verifying funds deposited' },
  { id: 'tc-4', documentName: 'Third-Party Financing Addendum', formCode: 'TXR-1901', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: 'Required if buyer is getting a mortgage; details loan terms and approval timeframes' },
  { id: 'tc-5', documentName: 'Title Commitment', formCode: 'TITLE', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: 'Report showing property ownership history and liens to be cleared' },
  { id: 'tc-6', documentName: 'Closing Disclosure (CD) / Settlement Statement', formCode: 'CD', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: 'Final itemized list of all costs and credits for buyer and seller' },
  { id: 'tc-7', documentName: 'Signed Deed', formCode: 'DEED', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: 'Legal document that officially transfers ownership from seller to buyer' },
  { id: 'tc-8', documentName: 'Commission Disbursement Authorization (CDA)', formCode: 'CDA', status: 'required' as const, isAttached: false, section: 'transaction' as const, category: 'Required', note: 'Broker-signed instruction to title company on agent payment' },
  
  // --- IF APPLICABLE DOCUMENTS ---
  { id: 'tc-9', documentName: 'Addendum for Property Subject to Mandatory Membership in an HOA', formCode: 'TREC 36-10', status: 'if_applicable' as const, isAttached: false, section: 'transaction' as const, category: 'If Applicable', note: 'Mandatory if property has a Homeowners Association' },
  { id: 'tc-10', documentName: 'Amendment to Contract', formCode: 'TXR-1903', status: 'if_applicable' as const, isAttached: false, section: 'transaction' as const, category: 'If Applicable', note: 'For changes after original contract (negotiated repairs, price adjustments)' },
  { id: 'tc-11', documentName: 'T-47 Residential Real Property Affidavit', formCode: 'T-47', status: 'if_applicable' as const, isAttached: false, section: 'transaction' as const, category: 'If Applicable', note: 'Notarized confirmation of no property changes if using existing survey' },
  { id: 'tc-12', documentName: 'Unrepresented Customer Disclosure', formCode: 'TXR-1417', status: 'if_applicable' as const, isAttached: false, section: 'transaction' as const, category: 'If Applicable', note: 'Required if listing agent and buyer has no agent (proves no intermediary)' },
  { id: 'tc-13', documentName: 'Repair Receipts', formCode: 'REPAIRS', status: 'if_applicable' as const, isAttached: false, section: 'transaction' as const, category: 'If Applicable', note: 'Copies of paid invoices and warranties from contractors for required repairs' },
  { id: 'tc-14', documentName: 'Home Warranty (Residential Service Contract)', formCode: 'WARRANTY', status: 'if_applicable' as const, isAttached: false, section: 'transaction' as const, category: 'If Applicable', note: 'Policy selection and proof of payment if seller is paying for buyer warranty' },
];
