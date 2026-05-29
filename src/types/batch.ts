import { DocumentType, DocumentTier, DocumentClassification } from '@/lib/mockDocumentClassification';
import { ListingExtraction } from './index';

// Classified document for batch processing
export interface ClassifiedDocument {
  id: string;
  file: File;
  classification: DocumentClassification;
  status: 'queued' | 'processing' | 'complete' | 'error';
  extraction?: ListingExtraction | SupportingDocumentExtraction;
  errorMessage?: string;
}

// Extraction data for supporting documents (critical tier)
export interface SupportingDocumentExtraction {
  id: string;
  documentType: DocumentType;
  documentName: string;
  
  // Common fields for critical documents
  signaturesDetected: boolean;
  signaturesRequired: number;
  signaturesFound: number;
  
  datesDetected: boolean;
  effectiveDate?: Date;
  
  // For disclosure documents
  acknowledgmentsRequired?: number;
  acknowledgmentsFound?: number;
  
  // Lead paint specific
  leadPaintPresent?: 'yes' | 'no' | 'unknown';
  leadPaintDisclosureComplete?: boolean;
  
  // Confidence scores
  confidence: Record<string, number>;
  
  // Overall status
  isComplete: boolean;
  issuesFound: string[];
}

// Batch upload state
export interface BatchUploadState {
  documents: ClassifiedDocument[];
  currentIndex: number;
  primaryDocumentId: string | null;
  overallStatus: 'idle' | 'processing' | 'complete' | 'error';
  approvalState: Record<string, 'pending' | 'approved' | 'rejected'>;
}

// Batch processing progress
export interface BatchProgress {
  total: number;
  completed: number;
  current: string | null;
  errors: number;
}
