import { ListingExtraction } from '@/types';

export const mockExtractDocument = async (fileName: string): Promise<ListingExtraction> => {
  // Simulate processing time with stages
  await new Promise((resolve) => setTimeout(resolve, 3500));

  // Return mock extracted data
  return {
    id: `extraction-${Date.now()}`,
    // Property Core
    propertyAddress: '123 Banana St',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    county: 'Dallas County',
    legalDescription: 'Lot 12, Block 3, Oak Valley Estates, an Addition to the City of Dallas, Dallas County, Texas',
    propertyType: 'single_family',
    
    // Parties
    sellers: [
      {
        name: 'Jenna Paetanini',
        email: 'jenna.paetanini@email.com',
        phone: '(214) 555-0142',
        role: 'seller',
      },
    ],
    
    // Listing Terms
    listingPrice: 450000,
    listingStartDate: new Date('2025-01-08'),
    listingEndDate: new Date('2026-06-30'),
    
    // Financials
    totalCommission: 6,
    buyerBrokerSplit: 3,
    
    // Business Logic
    checklistType: 'residential',
    officeDivision: 'Dallas Main Office',
    
    // Compliance/Status
    occupancyStatus: 'owner',
    personalInterestDisclosure: false,
    hoaStatus: 'no',
    keyboxAuthorized: true,
    exclusions: ['Chandelier in dining room', 'Ring doorbell camera'],
    
    // Optional/Metadata
    mlsNumber: undefined,
    yearBuilt: undefined,
    leadSource: undefined,
    protectionPeriodDays: 60,
    
    // Legacy Compliance
    complianceStatus: 'compliant',
    complianceNotes: 'All signatures and initials detected. Document verified.',
    signaturesDetected: true,
    initialsDetected: true,
    
    // Confidence scores
    confidence: {
      propertyAddress: 98,
      city: 99,
      state: 99,
      zipCode: 95,
      county: 92,
      legalDescription: 88,
      propertyType: 92,
      sellerName: 97,
      sellerEmail: 85,
      sellerPhone: 88,
      listingPrice: 99,
      listingStartDate: 96,
      listingEndDate: 97,
      totalCommission: 97,
      buyerBrokerSplit: 96,
      checklistType: 95,
      officeDivision: 90,
      occupancyStatus: 85,
      personalInterestDisclosure: 98,
      hoaStatus: 94,
      keyboxAuthorized: 91,
      exclusions: 94,
      protectionPeriodDays: 89,
    },
    documentUrl: undefined,
    documentName: fileName,
  };
};

export const getConfidenceLevel = (confidence: number): 'high' | 'medium' | 'low' => {
  if (confidence >= 85) return 'high';
  if (confidence >= 70) return 'medium';
  return 'low';
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};
