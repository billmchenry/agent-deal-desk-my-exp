import type { ListingExtraction } from "@/types/transactions";

export const mockExtractListing = async (fileName: string): Promise<ListingExtraction> => {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  return {
    id: `extraction-${Date.now()}`,
    propertyAddress: "123 Banana St",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    county: "Dallas County",
    legalDescription:
      "Lot 12, Block 3, Oak Valley Estates, an Addition to the City of Dallas, Dallas County, Texas",
    propertyType: "single_family",
    sellers: [
      {
        name: "Jenna Paetanini",
        email: "jenna.paetanini@example.com",
        phone: "(214) 555-0142",
        role: "seller",
      },
    ],
    listingPrice: 450000,
    listingStartDate: new Date("2025-01-08"),
    listingEndDate: new Date("2026-06-30"),
    totalCommission: 6,
    buyerBrokerSplit: 3,
    checklistType: "residential",
    officeDivision: "Dallas Main Office",
    occupancyStatus: "owner",
    personalInterestDisclosure: false,
    hoaStatus: "no",
    keyboxAuthorized: true,
    exclusions: ["Chandelier in dining room", "Ring doorbell camera"],
    protectionPeriodDays: 60,
    complianceStatus: "compliant",
    complianceNotes: "All signatures and initials detected. Document verified.",
    signaturesDetected: true,
    initialsDetected: true,
    confidence: {
      propertyAddress: 98, city: 99, state: 99, zipCode: 95, county: 92,
      legalDescription: 88, propertyType: 92, sellerName: 97, sellerEmail: 85,
      sellerPhone: 88, listingPrice: 99, listingStartDate: 96, listingEndDate: 97,
      totalCommission: 97, buyerBrokerSplit: 96, checklistType: 95,
      officeDivision: 90, occupancyStatus: 85, personalInterestDisclosure: 98,
      hoaStatus: 94, keyboxAuthorized: 91, exclusions: 94, protectionPeriodDays: 89,
    },
    documentName: fileName,
  };
};

export const getConfidenceLevel = (confidence: number): "high" | "medium" | "low" => {
  if (confidence >= 85) return "high";
  if (confidence >= 70) return "medium";
  return "low";
};
