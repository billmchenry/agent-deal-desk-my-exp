import type { ChecklistItem, ContractExtraction, Listing } from "@/types/transactions";

export const contractProcessingStages = [
  { id: "upload", label: "Receiving document...", progress: 15 },
  { id: "ocr", label: "Reading text...", progress: 35 },
  { id: "extract", label: "Extracting buyer info...", progress: 55 },
  { id: "financials", label: "Parsing financials...", progress: 75 },
  { id: "dates", label: "Identifying key dates...", progress: 90 },
  { id: "complete", label: "Complete", progress: 100 },
];

export const mockExtractContract = async (
  fileName: string,
  listing: Listing,
): Promise<ContractExtraction> => {
  await new Promise((resolve) => setTimeout(resolve, 3500));

  const effectiveDate = new Date();
  const closingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const salesPrice = Math.max(listing.extraction.listingPrice - 10000, 0);
  const financing = Math.round(salesPrice * 0.8);
  const cashPortion = salesPrice - financing;

  return {
    id: `contract-${Date.now()}`,
    sourceListingId: listing.id,
    mlsNumber: listing.extraction.mlsNumber,
    propertyType: listing.extraction.propertyType,
    yearBuilt: listing.extraction.yearBuilt,
    sellers: listing.extraction.sellers,
    buyers: [
      {
        name: "Michael & Emily Johnson",
        role: "buyer",
        email: "mjohnson@example.com",
        phone: "(555) 555-5309",
      },
    ],
    propertyAddress: `${listing.extraction.propertyAddress}, ${listing.extraction.city}, ${listing.extraction.state} ${listing.extraction.zipCode}`,
    legalDescription: "Lot 5, Block 3, Oakwood Estates Addition, Dallas County",
    exclusions: listing.extraction.exclusions || [],
    cashPortion,
    financing,
    salesPrice,
    earnestMoney: 5000,
    escrowAgent: "Republic Title of Texas",
    additionalEarnestMoney: 0,
    additionalEarnestMoneyDays: 0,
    optionFee: 500,
    optionPeriodDays: 10,
    titleCompany: "Republic Title of Texas",
    titleExceptions: [],
    surveyType: "existing",
    hoaMembership: listing.extraction.hoaStatus,
    sellersDisclosureStatus: "attached",
    leadBasedPaintDisclosure: false,
    lenderRequiredRepairs: "",
    listingBrokerFee: listing.extraction.totalCommission / 2,
    buyingBrokerFee:
      listing.extraction.buyerBrokerSplit || listing.extraction.totalCommission / 2,
    closingDate,
    possessionType: "at_closing",
    specialProvisions: "",
    sellerConcessions: 0,
    buyerNoticeAddress: "",
    buyerNoticePhone: "(555) 555-5309",
    buyerNoticeEmail: "mjohnson@example.com",
    sellerNoticeAddress: listing.extraction.propertyAddress,
    sellerNoticePhone: listing.extraction.sellers[0]?.phone || "",
    sellerNoticeEmail: listing.extraction.sellers[0]?.email || "",
    addendaList: ["Third Party Financing Addendum", "Information About Brokerage Services"],
    effectiveDate,
    listingBrokerName: "eXp Realty",
    listingBrokerLicense: "BR-123456",
    listingAgentName: "Sarah Johnson",
    listingAgentLicense: "AG-789012",
    buyingBrokerName: "Partner Brokerage",
    buyingBrokerLicense: "BR-654321",
    buyingAgentName: "Michael Torres",
    buyingAgentLicense: "AG-210987",
    buyingBrokerage: "Partner Brokerage",
    buyingAgent: "Michael Torres",
    escrowOfficer: "Amanda Chen",
    contractExclusions: listing.extraction.exclusions || [],
    referrals: [],
    escrowOfficerName: "Amanda Chen",
    hasCoAgentSplit: false,
    coAgentSplits: [],
    confidence: {
      sellers: 97, buyers: 95, propertyAddress: 99, legalDescription: 92, exclusions: 90,
      cashPortion: 94, financing: 92, salesPrice: 98, earnestMoney: 96, escrowAgent: 90,
      optionFee: 94, optionPeriodDays: 91, titleCompany: 88, surveyType: 88, hoaMembership: 90,
      sellersDisclosureStatus: 92, leadBasedPaintDisclosure: 95, listingBrokerFee: 90,
      buyingBrokerFee: 88, closingDate: 95, possessionType: 93, specialProvisions: 88,
      sellerConcessions: 90, effectiveDate: 97, listingBrokerName: 92, buyingBrokerName: 90,
      listingAgentName: 94, buyingAgentName: 92, mlsNumber: 95, yearBuilt: 90,
      escrowOfficerName: 75, escrowOfficerEmail: 0, escrowOfficerPhone: 0,
      transactionLeadSource: 0, hasCoAgentSplit: 0, coAgentSplits: 0,
    },
    documentName: fileName,
  };
};

export const getContractConfidenceLevel = (c: number): "high" | "medium" | "low" => {
  if (c >= 85) return "high";
  if (c >= 70) return "medium";
  return "low";
};

// Abbreviated checklist seed — full list mirrors Mirapro and can be expanded later.
export const transactionChecklistItems: ChecklistItem[] = [
  { id: "tc-1", documentName: "Executed One to Four Family Residential Contract", formCode: "TREC 20-17", status: "in_review", isAttached: true, verifiedByMira: true, section: "transaction", category: "Required" },
  { id: "tc-2", documentName: "Residential Contract Critical Date List", formCode: "TXR-1958", status: "required", isAttached: false, section: "transaction", category: "Required" },
  { id: "tc-3", documentName: "Receipted Earnest Money and Option Fee", formCode: "CONTRACT", status: "required", isAttached: false, section: "transaction", category: "Required" },
  { id: "tc-4", documentName: "Third-Party Financing Addendum", formCode: "TXR-1901", status: "required", isAttached: false, section: "transaction", category: "Required" },
  { id: "tc-5", documentName: "Title Commitment", formCode: "TITLE", status: "required", isAttached: false, section: "transaction", category: "Required" },
  { id: "tc-6", documentName: "Closing Disclosure (CD)", formCode: "CD", status: "required", isAttached: false, section: "transaction", category: "Required" },
  { id: "tc-7", documentName: "Signed Deed", formCode: "DEED", status: "required", isAttached: false, section: "transaction", category: "Required" },
  { id: "tc-8", documentName: "Commission Disbursement Authorization", formCode: "CDA", status: "required", isAttached: false, section: "transaction", category: "Required" },
];
