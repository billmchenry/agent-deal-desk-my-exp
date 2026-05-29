// Document types supported by the system
export type DocumentType = 
  | 'listing_agreement'
  | 'purchase_contract'
  | 'sellers_disclosure'
  | 'lead_paint'
  | 'agency_disclosure'
  | 'survey'
  | 'hoa_docs'
  | 'title_commitment'
  | 'inspection_report'
  | 'appraisal'
  | 'unknown';

// Document tiers determine the editing experience
export type DocumentTier = 'primary' | 'critical' | 'reference';

// Checklist items that documents can be matched to
export const checklistItemMatches: Record<DocumentType, string> = {
  listing_agreement: 'Listing Agreement',
  purchase_contract: 'Purchase Contract',
  sellers_disclosure: "Seller's Disclosure Notice",
  lead_paint: 'Lead-Based Paint Disclosure',
  agency_disclosure: 'Information About Brokerage Services',
  survey: 'Survey',
  hoa_docs: 'HOA Documents',
  title_commitment: 'Title Commitment',
  inspection_report: 'Property Inspection',
  appraisal: 'Appraisal',
  unknown: '',
};

// Document tier configuration
export const documentTierConfig: Record<DocumentType, DocumentTier> = {
  listing_agreement: 'primary',
  purchase_contract: 'primary',
  sellers_disclosure: 'critical',
  lead_paint: 'critical',
  agency_disclosure: 'critical',
  survey: 'reference',
  hoa_docs: 'reference',
  title_commitment: 'reference',
  inspection_report: 'reference',
  appraisal: 'reference',
  unknown: 'reference',
};

// Classification result
export interface DocumentClassification {
  type: DocumentType;
  tier: DocumentTier;
  confidence: number;
  checklistMatch: string;
  displayName: string;
}

// Display names for document types
export const documentDisplayNames: Record<DocumentType, string> = {
  listing_agreement: 'Listing Agreement',
  purchase_contract: 'Purchase Contract',
  sellers_disclosure: "Seller's Disclosure",
  lead_paint: 'Lead Paint Disclosure',
  agency_disclosure: 'Agency Disclosure',
  survey: 'Survey',
  hoa_docs: 'HOA Documents',
  title_commitment: 'Title Commitment',
  inspection_report: 'Inspection Report',
  appraisal: 'Appraisal',
  unknown: 'Unknown Document',
};

// Filename patterns for classification (mock implementation)
const classificationPatterns: { pattern: RegExp; type: DocumentType; confidence: number }[] = [
  { pattern: /listing.*agreement|residential.*listing|exclusive.*listing/i, type: 'listing_agreement', confidence: 95 },
  { pattern: /purchase.*contract|sales.*contract|1-4.*family|residential.*contract/i, type: 'purchase_contract', confidence: 95 },
  { pattern: /seller.*disclosure|property.*disclosure|disclosure.*notice/i, type: 'sellers_disclosure', confidence: 90 },
  { pattern: /lead.*paint|lead.*based|lead.*hazard/i, type: 'lead_paint', confidence: 92 },
  { pattern: /agency.*disclosure|brokerage.*services|iabs/i, type: 'agency_disclosure', confidence: 88 },
  { pattern: /survey|boundary|plat/i, type: 'survey', confidence: 85 },
  { pattern: /hoa|homeowner.*association|deed.*restriction/i, type: 'hoa_docs', confidence: 82 },
  { pattern: /title.*commitment|title.*insurance|title.*report/i, type: 'title_commitment', confidence: 88 },
  { pattern: /inspection|home.*inspect|property.*inspect/i, type: 'inspection_report', confidence: 85 },
  { pattern: /appraisal|property.*value|market.*value/i, type: 'appraisal', confidence: 87 },
];

/**
 * Classify a document based on its filename
 * In production, this would use AI/OCR to analyze the actual document content
 */
export function classifyDocument(fileName: string): DocumentClassification {
  const normalizedName = fileName.toLowerCase();
  
  for (const { pattern, type, confidence } of classificationPatterns) {
    if (pattern.test(normalizedName)) {
      return {
        type,
        tier: documentTierConfig[type],
        confidence,
        checklistMatch: checklistItemMatches[type],
        displayName: documentDisplayNames[type],
      };
    }
  }
  
  // Default to unknown with low confidence
  return {
    type: 'unknown',
    tier: 'reference',
    confidence: 30,
    checklistMatch: '',
    displayName: 'Unknown Document',
  };
}

/**
 * Classify multiple documents and identify the primary document
 */
export function classifyBatch(files: File[]): {
  classifications: Map<string, DocumentClassification>;
  primaryIndex: number;
  primaryType: DocumentType;
} {
  const classifications = new Map<string, DocumentClassification>();
  let primaryIndex = -1;
  let primaryType: DocumentType = 'unknown';
  let highestPrimaryConfidence = 0;
  
  files.forEach((file, index) => {
    const classification = classifyDocument(file.name);
    classifications.set(file.name, classification);
    
    // Find the primary document (highest confidence primary tier)
    if (classification.tier === 'primary' && classification.confidence > highestPrimaryConfidence) {
      primaryIndex = index;
      primaryType = classification.type;
      highestPrimaryConfidence = classification.confidence;
    }
  });
  
  // If no primary found, use the first file
  if (primaryIndex === -1 && files.length > 0) {
    primaryIndex = 0;
  }
  
  return { classifications, primaryIndex, primaryType };
}

/**
 * Get tier badge styling
 */
export function getTierBadgeStyle(tier: DocumentTier): {
  bg: string;
  text: string;
  label: string;
} {
  switch (tier) {
    case 'primary':
      return { bg: 'bg-primary/10', text: 'text-primary', label: 'Primary' };
    case 'critical':
      return { bg: 'bg-warning/10', text: 'text-warning', label: 'Critical' };
    case 'reference':
      return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Reference' };
  }
}
