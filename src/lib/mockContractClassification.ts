// Contract document types supported by the system
export type ContractDocumentType = 
  | 'purchase_agreement'      // Primary - One to Four Family Residential Contract
  | 'third_party_financing'   // Third Party Financing Addendum
  | 'seller_financing'        // Seller Financing Addendum
  | 'loan_assumption'         // Loan Assumption Addendum  
  | 'buyers_expenses'         // Buyer's Expenses Addendum
  | 'short_sale'              // Short Sale Addendum
  | 'back_up_contract'        // Back-Up Contract Addendum
  | 'property_condition'      // Property Condition Addendum
  | 'new_construction'        // New Home Construction Addendum
  | 'addendum'                // Generic Addendum
  | 'amendment'               // Amendment to Contract
  | 'sellers_disclosure'      // Seller's Disclosure Notice
  | 'lead_paint'              // Lead-Based Paint Addendum
  | 'hoa_addendum'            // HOA/Condominium Addendum
  | 'temporary_lease'         // Seller's/Buyer's Temporary Lease
  | 'mls_info_sheet'          // MLS Info Sheet
  | 'earnest_money_receipt'   // Earnest Money Receipt
  | 'option_fee_receipt'      // Option Fee Receipt
  | 'unknown';

// Contract document tiers determine the editing experience
export type ContractDocumentTier = 'primary' | 'addenda' | 'disclosure' | 'receipt' | 'reference';

// Document tier configuration
export const contractDocumentTierConfig: Record<ContractDocumentType, ContractDocumentTier> = {
  purchase_agreement: 'primary',
  third_party_financing: 'addenda',
  seller_financing: 'addenda',
  loan_assumption: 'addenda',
  buyers_expenses: 'addenda',
  short_sale: 'addenda',
  back_up_contract: 'addenda',
  property_condition: 'addenda',
  new_construction: 'addenda',
  addendum: 'addenda',
  amendment: 'addenda',
  sellers_disclosure: 'disclosure',
  lead_paint: 'disclosure',
  hoa_addendum: 'addenda',
  temporary_lease: 'addenda',
  mls_info_sheet: 'reference',
  earnest_money_receipt: 'receipt',
  option_fee_receipt: 'receipt',
  unknown: 'reference',
};

// Display names for contract document types
export const contractDocumentDisplayNames: Record<ContractDocumentType, string> = {
  purchase_agreement: 'Executed One to Four Family Residential Contract (Resale)',
  third_party_financing: 'Third Party Financing Addendum',
  seller_financing: 'Seller Financing Addendum',
  loan_assumption: 'Loan Assumption Addendum',
  buyers_expenses: "Buyer's Expenses Addendum",
  short_sale: 'Short Sale Addendum',
  back_up_contract: 'Back-Up Contract Addendum',
  property_condition: 'Property Condition Addendum',
  new_construction: 'New Home Construction Addendum',
  addendum: 'Addendum',
  amendment: 'Amendment to Contract',
  sellers_disclosure: "Seller's Disclosure Notice",
  lead_paint: 'Lead-Based Paint Addendum',
  hoa_addendum: 'HOA/Condominium Addendum',
  temporary_lease: 'Temporary Lease',
  mls_info_sheet: 'MLS Info Sheet',
  earnest_money_receipt: 'Earnest Money Receipt',
  option_fee_receipt: 'Option Fee Receipt',
  unknown: 'Unknown Document',
};

// Classification result for contract documents
export interface ContractDocumentClassification {
  type: ContractDocumentType;
  tier: ContractDocumentTier;
  confidence: number;
  displayName: string;
  description: string;
}

// Classified contract document for batch processing
export interface ClassifiedContractDocument {
  id: string;
  file: File;
  classification: ContractDocumentClassification;
  status: 'queued' | 'processing' | 'complete' | 'error';
  extractedData?: Record<string, unknown>;
  errorMessage?: string;
}

// Contract batch upload state
export interface ContractBatchUploadState {
  documents: ClassifiedContractDocument[];
  currentIndex: number;
  primaryDocumentId: string | null;
  overallStatus: 'idle' | 'processing' | 'complete' | 'error';
}

// Filename patterns for contract classification (mock implementation)
const contractClassificationPatterns: { pattern: RegExp; type: ContractDocumentType; confidence: number; description: string }[] = [
  // Primary contract
  { 
    pattern: /1-4.*family|one.*to.*four|residential.*contract|purchase.*agreement|sales.*contract|trec.*20/i, 
    type: 'purchase_agreement', 
    confidence: 96,
    description: 'Primary purchase contract for the transaction'
  },
  
  // Financing addenda
  { 
    pattern: /third.*party.*financing|conventional.*financing|fha|va.*loan|trec.*40/i, 
    type: 'third_party_financing', 
    confidence: 94,
    description: 'Terms for buyer obtaining third-party financing'
  },
  { 
    pattern: /seller.*financing|owner.*financing|trec.*26/i, 
    type: 'seller_financing', 
    confidence: 93,
    description: 'Seller-financed terms and conditions'
  },
  { 
    pattern: /loan.*assumption|assume.*loan|trec.*41/i, 
    type: 'loan_assumption', 
    confidence: 92,
    description: 'Terms for buyer assuming existing loan'
  },
  
  // Transaction addenda
  { 
    pattern: /buyer.*expense|closing.*cost|trec.*44/i, 
    type: 'buyers_expenses', 
    confidence: 91,
    description: "Additional buyer's expenses and credits"
  },
  { 
    pattern: /short.*sale|trec.*45/i, 
    type: 'short_sale', 
    confidence: 95,
    description: 'Short sale terms and lender approval requirements'
  },
  { 
    pattern: /back.*up|backup.*contract|trec.*11/i, 
    type: 'back_up_contract', 
    confidence: 93,
    description: 'Back-up contract pending primary contract termination'
  },
  
  // Property addenda
  { 
    pattern: /property.*condition|as.*is|trec.*10/i, 
    type: 'property_condition', 
    confidence: 92,
    description: 'Property condition and inspection terms'
  },
  { 
    pattern: /new.*home|new.*construction|builder|trec.*42/i, 
    type: 'new_construction', 
    confidence: 94,
    description: 'New construction terms and builder warranties'
  },
  { 
    pattern: /hoa|homeowner.*association|condo.*addendum|trec.*36/i, 
    type: 'hoa_addendum', 
    confidence: 90,
    description: 'HOA/Condominium disclosure and requirements'
  },
  { 
    pattern: /temporary.*lease|seller.*lease|buyer.*lease|trec.*15|trec.*16/i, 
    type: 'temporary_lease', 
    confidence: 91,
    description: 'Temporary occupancy lease terms'
  },
  
  // Amendments
  { 
    pattern: /amendment|amend.*contract|trec.*39/i, 
    type: 'amendment', 
    confidence: 95,
    description: 'Modification to the original contract terms'
  },
  
  // Disclosures
  { 
    pattern: /seller.*disclosure|property.*disclosure|disclosure.*notice|trec.*spd/i, 
    type: 'sellers_disclosure', 
    confidence: 93,
    description: "Seller's disclosure of known property conditions"
  },
  { 
    pattern: /lead.*paint|lead.*based|lead.*hazard|trec.*lead/i, 
    type: 'lead_paint', 
    confidence: 95,
    description: 'Lead-based paint disclosure (pre-1978 homes)'
  },
  
  // Receipts
  { 
    pattern: /earnest.*money.*receipt|em.*receipt/i, 
    type: 'earnest_money_receipt', 
    confidence: 88,
    description: 'Receipt confirming earnest money deposit'
  },
  { 
    pattern: /option.*fee.*receipt|option.*receipt/i, 
    type: 'option_fee_receipt', 
    confidence: 88,
    description: 'Receipt confirming option fee payment'
  },
  
  // MLS/Reference
  { 
    pattern: /mls.*info|mls.*sheet|listing.*sheet/i, 
    type: 'mls_info_sheet', 
    confidence: 85,
    description: 'MLS listing information sheet'
  },
  
  // Generic addendum (lower priority)
  { 
    pattern: /addendum/i, 
    type: 'addendum', 
    confidence: 70,
    description: 'General addendum to the contract'
  },
];

/**
 * Classify a contract document based on its filename
 * In production, this would use AI/OCR to analyze the actual document content
 */
export function classifyContractDocument(fileName: string): ContractDocumentClassification {
  const normalizedName = fileName.toLowerCase();
  
  for (const { pattern, type, confidence, description } of contractClassificationPatterns) {
    if (pattern.test(normalizedName)) {
      return {
        type,
        tier: contractDocumentTierConfig[type],
        confidence,
        displayName: contractDocumentDisplayNames[type],
        description,
      };
    }
  }
  
  // Default to unknown with low confidence
  return {
    type: 'unknown',
    tier: 'reference',
    confidence: 30,
    displayName: 'Unknown Document',
    description: 'Document type could not be determined',
  };
}

/**
 * Classify multiple contract documents and identify the primary purchase agreement
 */
export function classifyContractBatch(files: File[]): {
  documents: ClassifiedContractDocument[];
  primaryIndex: number;
  hasPurchaseAgreement: boolean;
} {
  let primaryIndex = -1;
  let highestPrimaryConfidence = 0;
  
  const documents: ClassifiedContractDocument[] = files.map((file, index) => {
    const classification = classifyContractDocument(file.name);
    
    // Find the primary document (purchase agreement with highest confidence)
    if (classification.type === 'purchase_agreement' && classification.confidence > highestPrimaryConfidence) {
      primaryIndex = index;
      highestPrimaryConfidence = classification.confidence;
    }
    
    return {
      id: `contract-doc-${Date.now()}-${index}`,
      file,
      classification,
      status: 'queued' as const,
    };
  });
  
  // If no purchase agreement found, use the first file as primary
  if (primaryIndex === -1 && files.length > 0) {
    primaryIndex = 0;
  }
  
  return { 
    documents, 
    primaryIndex,
    hasPurchaseAgreement: highestPrimaryConfidence > 0,
  };
}

/**
 * Get tier badge styling for contract documents
 */
export function getContractTierBadgeStyle(tier: ContractDocumentTier): {
  bg: string;
  text: string;
  label: string;
} {
  switch (tier) {
    case 'primary':
      return { bg: 'bg-primary/10', text: 'text-primary', label: 'Primary' };
    case 'addenda':
      return { bg: 'bg-info/10', text: 'text-info', label: 'Addendum' };
    case 'disclosure':
      return { bg: 'bg-warning/10', text: 'text-warning', label: 'Disclosure' };
    case 'receipt':
      return { bg: 'bg-success/10', text: 'text-success', label: 'Receipt' };
    case 'reference':
      return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Reference' };
  }
}

/**
 * Get summary statistics for a batch of classified contract documents
 */
export function getContractBatchSummary(documents: ClassifiedContractDocument[]): {
  total: number;
  byTier: Record<ContractDocumentTier, number>;
  hasPurchaseAgreement: boolean;
  addendaCount: number;
  disclosureCount: number;
} {
  const byTier: Record<ContractDocumentTier, number> = {
    primary: 0,
    addenda: 0,
    disclosure: 0,
    receipt: 0,
    reference: 0,
  };
  
  let hasPurchaseAgreement = false;
  
  documents.forEach(doc => {
    byTier[doc.classification.tier]++;
    if (doc.classification.type === 'purchase_agreement') {
      hasPurchaseAgreement = true;
    }
  });
  
  return {
    total: documents.length,
    byTier,
    hasPurchaseAgreement,
    addendaCount: byTier.addenda,
    disclosureCount: byTier.disclosure,
  };
}
