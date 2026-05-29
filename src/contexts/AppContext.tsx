import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, PinnedInsight, ChatMessage, MarketplaceReport, SharedReport, ReportInstallation, Listing, ListingExtraction, ContractExtraction, ChecklistItem, ClassifiedDocument, BatchUploadState } from '@/types';


export type ListingMode = 'idle' | 'uploading' | 'processing' | 'ready' | 'verifying' | 'submitted' | 'batch_processing' | 'batch_ready';
export type ContractMode = 'idle' | 'uploading' | 'processing' | 'selecting_listing' | 'ready' | 'manual_intake' | 'verifying' | 'submitted';

interface AppContextType {
  currentAgent: Agent;
  pinnedInsights: PinnedInsight[];
  addPinnedInsight: (insight: Omit<PinnedInsight, 'id' | 'createdAt' | 'updatedAt' | 'lastRefreshedAt'>) => void;
  removePinnedInsight: (id: string) => void;
  refreshInsight: (id: string) => Promise<void>;
  updateInsightSettings: (id: string, settings: { refreshInterval?: 'daily' | 'weekly' | 'manual'; priority?: number }) => void;
  reorderInsights: (newOrder: { id: string; priority: number }[]) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  askMira: (query: string) => void;
  clearChatHistory: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  teamAgents: Agent[];
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  // Marketplace
  marketplaceReports: MarketplaceReport[];
  sharedReports: SharedReport[];
  createdTemplates: MarketplaceReport[];
  installedReports: ReportInstallation[];
  createReportTemplate: (template: {
    title: string;
    description: string;
    category: 'production' | 'team' | 'growth' | 'custom';
    tags: string[];
    visibility: 'private' | 'team' | 'organization' | 'public';
    templateInsights: PinnedInsight[];
  }) => void;
  installReport: (report: MarketplaceReport) => void;
  installSharedReport: (shareId: string) => void;
  dismissSharedReport: (shareId: string) => void;
  shareReportWithTeam: (reportId: string) => void;
  shareReportWithOrganization: (reportId: string) => void;
  // Listings
  listings: Listing[];
  addListing: (listing: Listing) => void;
  listingMode: ListingMode;
  setListingMode: (mode: ListingMode) => void;
  pendingExtraction: ListingExtraction | null;
  setPendingExtraction: (extraction: ListingExtraction | null) => void;
  submittedListing: Listing | null;
  setSubmittedListing: (listing: Listing | null) => void;
  startListingFlow: () => void;
  openChecklistBulkUpload: () => void;
  // Contract/Transaction Flow
  contractMode: ContractMode;
  setContractMode: (mode: ContractMode) => void;
  pendingContract: ContractExtraction | null;
  setPendingContract: (contract: ContractExtraction | null) => void;
  activeListingForContract: Listing | null;
  setActiveListingForContract: (listing: Listing | null) => void;
  manualIntakeStep: number;
  setManualIntakeStep: (step: number) => void;
  startContractFlow: (listing: Listing) => void;
  startTransactionFlow: () => void;
  updateListingToContract: (listingId: string, contractData: ContractExtraction, transactionChecklist: ChecklistItem[]) => void;
  updateListingMetadata: (listingId: string, field: string, value: string) => void;
  updateListing: (listingId: string, updates: Partial<ListingExtraction>) => void;
  submittedContract: { listing: Listing; contract: ContractExtraction } | null;
  setSubmittedContract: (data: { listing: Listing; contract: ContractExtraction } | null) => void;
  // Batch upload
  batchUploadState: BatchUploadState | null;
  setBatchUploadState: (state: BatchUploadState | null) => void;
  startBatchFlow: (files: File[]) => void;
  updateBatchApproval: (docId: string, status: 'pending' | 'approved' | 'rejected') => void;
  updateBatchDocuments: (documents: ClassifiedDocument[]) => void;
  attachBatchToChecklist: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockAgent: Agent = {
  id: '1',
  name: 'Charles Anderson',
  avatar: undefined,
  role: 'team_leader',
  email: 'charles@exp.com',
  phone: '(555) 123-4567',
  location: 'Austin, TX',
  bio: 'Experienced real estate professional specializing in residential properties in the greater Austin area.',
  licenses: [
    {
      id: 'lic-1',
      number: 'TX-789456123',
      state: 'Texas',
      expirationDate: new Date('2025-12-31'),
      status: 'active',
    },
  ],
};

const mockTeamAgents: Agent[] = [
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'agent',
    email: 'sarah.johnson@exp.com',
    phone: '(555) 234-5678',
    location: 'Austin, TX',
    bio: 'Dedicated buyer specialist with a passion for first-time homebuyers.',
    teamLeaderId: '1',
    licenses: [
      {
        id: 'lic-2',
        number: 'TX-456789012',
        state: 'Texas',
        expirationDate: new Date('2025-08-15'),
        status: 'active',
      },
    ],
  },
  {
    id: '3',
    name: 'Mike Chen',
    role: 'agent',
    email: 'mike.chen@exp.com',
    phone: '(555) 345-6789',
    location: 'Dallas, TX',
    bio: 'Investment property specialist focused on multi-family units.',
    teamLeaderId: '1',
    licenses: [
      {
        id: 'lic-3',
        number: 'TX-567890123',
        state: 'Texas',
        expirationDate: new Date('2024-03-01'),
        status: 'expired',
      },
    ],
  },
  {
    id: '4',
    name: 'Lisa Park',
    role: 'agent',
    email: 'lisa.park@exp.com',
    phone: '(555) 456-7890',
    location: 'Houston, TX',
    bio: 'Luxury home specialist serving the greater Houston area.',
    teamLeaderId: '1',
    licenses: [
      {
        id: 'lic-4',
        number: 'TX-678901234',
        state: 'Texas',
        expirationDate: new Date('2025-11-20'),
        status: 'active',
      },
    ],
  },
  {
    id: '5',
    name: 'James Wilson',
    role: 'agent',
    email: 'james.wilson@exp.com',
    phone: '(555) 567-8901',
    location: 'San Antonio, TX',
    bio: 'Commercial real estate expert with 10+ years of experience.',
    teamLeaderId: '1',
    licenses: [
      {
        id: 'lic-5',
        number: 'TX-789012345',
        state: 'Texas',
        expirationDate: new Date('2025-06-30'),
        status: 'active',
      },
    ],
  },
  {
    id: '6',
    name: 'Emily Rodriguez',
    role: 'agent',
    email: 'emily.rodriguez@exp.com',
    location: 'Austin, TX',
    teamLeaderId: '1',
    licenses: [
      {
        id: 'lic-6',
        number: 'TX-890123456',
        state: 'Texas',
        expirationDate: new Date('2025-02-28'),
        status: 'pending',
      },
    ],
  },
];

const initialPinnedInsights: PinnedInsight[] = [
  {
    id: '1',
    query: 'Who are my agents at risk of leaving?',
    title: 'Agents at Risk',
    customName: 'At-Risk Agents',
    content: '3 agents showing signs of disengagement',
    type: 'list',
    data: [
      { name: 'Sarah Johnson', risk: 'high', lastActive: '2 weeks ago' },
      { name: 'Mike Chen', risk: 'medium', lastActive: '10 days ago' },
      { name: 'Lisa Park', risk: 'medium', lastActive: '8 days ago' },
    ],
    queryParameters: {
      originalQuery: 'Who are my agents at risk of leaving?',
      queryType: 'list',
      statusFlags: ['inactive', 'low_activity'],
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(),
    refreshInterval: 'daily',
    lastRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: 1,
  },
  {
    id: '2',
    query: 'Show my 6-month GCI trend',
    title: '6-Month GCI Trend',
    content: 'Your GCI has grown 23% over the last 6 months',
    type: 'chart',
    data: [
      { month: 'Jul', value: 42000 },
      { month: 'Aug', value: 45000 },
      { month: 'Sep', value: 38000 },
      { month: 'Oct', value: 52000 },
      { month: 'Nov', value: 48000 },
      { month: 'Dec', value: 54000 },
    ],
    queryParameters: {
      originalQuery: 'Show my 6-month GCI trend',
      queryType: 'chart',
      dateRange: { start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), end: new Date() },
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updatedAt: new Date(),
    refreshInterval: 'weekly',
    lastRefreshedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    priority: 2,
  },
];

// Mock Marketplace Data
const mockMarketplaceReports: MarketplaceReport[] = [
  {
    id: 'mp-1',
    title: 'Team Production Dashboard',
    description: 'Track team performance with GCI trends, transaction counts, and at-risk agent monitoring. Perfect for team leaders who want full visibility.',
    category: 'team',
    creator: {
      id: 'creator-1',
      name: 'Jennifer Martinez',
      role: 'team_leader',
      badge: 'top_producer',
    },
    templateInsights: [
      {
        query: 'Show team GCI trend',
        title: 'Team GCI Trend',
        content: 'Team performance over 6 months',
        type: 'chart',
        refreshInterval: 'weekly',
      },
      {
        query: 'Who are agents at risk?',
        title: 'At-Risk Agents',
        content: 'Agents showing disengagement',
        type: 'list',
        refreshInterval: 'daily',
      },
    ],
    visibility: 'public',
    usageCount: 234,
    rating: 4.8,
    reviewCount: 42,
    tags: ['team', 'production', 'leadership'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'mp-2',
    title: 'Growth Tracker Pro',
    description: 'Monitor your personal growth metrics including YoY comparisons, pipeline health, and goal progress tracking.',
    category: 'growth',
    creator: {
      id: 'creator-2',
      name: 'Michael Chen',
      role: 'influencer',
      badge: 'mentor',
    },
    templateInsights: [
      {
        query: 'Show my year over year growth',
        title: 'YoY Growth',
        content: 'Personal growth comparison',
        type: 'metric',
        refreshInterval: 'weekly',
      },
    ],
    visibility: 'public',
    usageCount: 187,
    rating: 4.6,
    reviewCount: 28,
    tags: ['growth', 'personal', 'goals'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'mp-3',
    title: 'Production Pulse',
    description: 'Essential production metrics for tracking closings, pending transactions, and commission projections.',
    category: 'production',
    creator: {
      id: 'creator-3',
      name: 'Sarah Williams',
      role: 'agent',
      badge: 'verified',
    },
    templateInsights: [
      {
        query: 'Show my pending transactions',
        title: 'Pending Deals',
        content: 'Current pipeline',
        type: 'table',
        refreshInterval: 'daily',
      },
    ],
    visibility: 'public',
    usageCount: 156,
    rating: 4.5,
    reviewCount: 19,
    tags: ['production', 'transactions', 'pipeline'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

const mockSharedReports: SharedReport[] = [
  {
    id: 'share-1',
    reportId: 'mp-1',
    report: mockMarketplaceReports[0],
    sharedBy: {
      id: '1',
      name: 'Charles Anderson',
      role: 'team_leader',
    },
    sharedWith: 'team',
    sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
];

// Mock Listings Data
const mockListings: Listing[] = [
  {
    id: 'listing-001',
    extraction: {
      id: 'ext-001',
      propertyAddress: '1234 Oak Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      propertyType: 'single_family',
      mlsNumber: 'MLS-2024-001',
      yearBuilt: 1998,
      sellers: [{ name: 'John & Mary Smith', email: 'jsmith@email.com', phone: '(555) 111-2222', role: 'seller' }],
      listingPrice: 485000,
      totalCommission: 6,
      buyerBrokerSplit: 3,
      checklistType: 'residential',
      officeDivision: 'Austin Main Office',
      occupancyStatus: 'owner',
      personalInterestDisclosure: false,
      hoaStatus: 'yes',
      keyboxAuthorized: true,
      listingStartDate: new Date('2024-01-15'),
      listingEndDate: new Date('2024-07-15'),
      protectionPeriodDays: 90,
      complianceStatus: 'compliant',
      signaturesDetected: true,
      initialsDetected: true,
      confidence: {},
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    createdBy: 'Charles Anderson',
    syncedToMLS: true,
  },
  {
    id: 'listing-002',
    extraction: {
      id: 'ext-002',
      propertyAddress: '567 Riverside Dr',
      city: 'Round Rock',
      state: 'TX',
      zipCode: '78664',
      propertyType: 'townhouse',
      mlsNumber: 'MLS-2024-002',
      yearBuilt: 2015,
      sellers: [{ name: 'Robert Davis', email: 'rdavis@email.com', phone: '(555) 333-4444', role: 'seller' }],
      listingPrice: 325000,
      totalCommission: 5.5,
      buyerBrokerSplit: 2.75,
      checklistType: 'residential',
      officeDivision: 'Round Rock Office',
      occupancyStatus: 'owner',
      personalInterestDisclosure: false,
      hoaStatus: 'yes',
      keyboxAuthorized: true,
      listingStartDate: new Date('2024-02-01'),
      listingEndDate: new Date('2024-08-01'),
      protectionPeriodDays: 60,
      complianceStatus: 'compliant',
      signaturesDetected: true,
      initialsDetected: true,
      confidence: {},
    },
    status: 'active',
    createdAt: new Date('2024-02-01'),
    createdBy: 'Charles Anderson',
    syncedToMLS: true,
  },
  {
    id: 'listing-003',
    extraction: {
      id: 'ext-003',
      propertyAddress: '890 Summit View',
      city: 'Cedar Park',
      state: 'TX',
      zipCode: '78613',
      propertyType: 'single_family',
      yearBuilt: 2008,
      sellers: [{ name: 'Amanda Wilson', email: 'awilson@email.com', role: 'seller' }],
      listingPrice: 575000,
      totalCommission: 6,
      buyerBrokerSplit: 3,
      checklistType: 'residential',
      officeDivision: 'Cedar Park Office',
      occupancyStatus: 'vacant',
      personalInterestDisclosure: false,
      hoaStatus: 'no',
      keyboxAuthorized: false,
      listingStartDate: new Date('2024-02-10'),
      listingEndDate: new Date('2024-08-10'),
      complianceStatus: 'pending',
      signaturesDetected: true,
      initialsDetected: false,
      confidence: {},
    },
    status: 'pending_review',
    createdAt: new Date('2024-02-10'),
    createdBy: 'Charles Anderson',
    syncedToMLS: false,
  },
  {
    id: 'listing-004',
    extraction: {
      id: 'ext-004',
      propertyAddress: '2100 Lakefront Blvd',
      city: 'Lakeway',
      state: 'TX',
      zipCode: '78734',
      propertyType: 'single_family',
      mlsNumber: 'MLS-2024-004',
      yearBuilt: 2020,
      sellers: [{ name: 'Michael & Jennifer Brown', email: 'mbrown@email.com', phone: '(555) 777-8888', role: 'seller' }],
      listingPrice: 1250000,
      totalCommission: 5,
      buyerBrokerSplit: 2.5,
      checklistType: 'residential',
      officeDivision: 'Lakeway Office',
      occupancyStatus: 'owner',
      personalInterestDisclosure: false,
      hoaStatus: 'yes',
      keyboxAuthorized: true,
      listingStartDate: new Date('2024-01-20'),
      listingEndDate: new Date('2024-07-20'),
      protectionPeriodDays: 120,
      complianceStatus: 'compliant',
      signaturesDetected: true,
      initialsDetected: true,
      confidence: {},
    },
    status: 'active',
    createdAt: new Date('2024-01-20'),
    createdBy: 'Charles Anderson',
    syncedToMLS: true,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentAgent, setCurrentAgent] = useState<Agent>(mockAgent);
  const [teamAgents, setTeamAgents] = useState<Agent[]>(mockTeamAgents);
  const [pinnedInsights, setPinnedInsights] = useState<PinnedInsight[]>(initialPinnedInsights);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('pulse');
  const [marketplaceReports, setMarketplaceReports] = useState<MarketplaceReport[]>(mockMarketplaceReports);
  const [sharedReports, setSharedReports] = useState<SharedReport[]>(mockSharedReports);
  const [createdTemplates, setCreatedTemplates] = useState<MarketplaceReport[]>([]);
  const [installedReports, setInstalledReports] = useState<ReportInstallation[]>([]);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [listingMode, setListingMode] = useState<ListingMode>('idle');
  const [pendingExtraction, setPendingExtraction] = useState<ListingExtraction | null>(null);
  const [submittedListing, setSubmittedListing] = useState<Listing | null>(null);
  
  // Contract flow state
  const [contractMode, setContractMode] = useState<ContractMode>('idle');
  const [pendingContract, setPendingContract] = useState<ContractExtraction | null>(null);
  const [activeListingForContract, setActiveListingForContract] = useState<Listing | null>(null);
  const [manualIntakeStep, setManualIntakeStep] = useState(1);
  const [submittedContract, setSubmittedContract] = useState<{ listing: Listing; contract: ContractExtraction } | null>(null);
  
  // Batch upload state
  const [batchUploadState, setBatchUploadState] = useState<BatchUploadState | null>(null);

  const addListing = (listing: Listing) => {
    setListings(prev => [...prev, listing]);
  };

  const startListingFlow = () => {
    setListingMode('uploading');
    setIsChatOpen(true);
  };

  const openChecklistBulkUpload = () => {
    // Open chat with Mira explaining bulk upload
    setIsChatOpen(true);
    setListingMode('uploading');
    
    // Add a Mira message explaining the bulk upload capability
    const miraMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Ready to upload documents! You can drop **one or multiple PDFs** here and I'll automatically classify each one and match them to your checklist. Just drag and drop your files below, or click to browse.",
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, miraMessage]);
  };

  const startContractFlow = (listing: Listing) => {
    setActiveListingForContract(listing);
    setContractMode('uploading');
    setManualIntakeStep(1);
    setIsChatOpen(true);
  };

  const startTransactionFlow = () => {
    // Opens chat to select a listing for transaction
    setContractMode('uploading');
    setActiveListingForContract(null);
    setManualIntakeStep(1);
    setIsChatOpen(true);
  };

  const updateListingToContract = (
    listingId: string, 
    contractData: ContractExtraction, 
    transactionChecklist: ChecklistItem[]
  ) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== listingId) return listing;
      
      return {
        ...listing,
        status: 'pending' as const, // "Under Contract"
        contractData,
        checklistPhase: 'transaction' as const,
        checklist: transactionChecklist,
        activityLog: [
          ...(listing.activityLog || []),
          {
            id: `activity-${Date.now()}`,
            action: 'Contract executed - Listing moved to Under Contract',
            timestamp: new Date(),
            performedBy: 'System',
          },
        ],
      };
    }));
  };

  const updateListingMetadata = (listingId: string, field: string, value: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== listingId) return listing;
      
      // Update the contractData with the new field value
      return {
        ...listing,
        contractData: listing.contractData ? {
          ...listing.contractData,
          [field]: value,
        } : undefined,
      };
    }));
  };

  const updateListing = (listingId: string, updates: Partial<ListingExtraction>) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== listingId) return listing;
      return {
        ...listing,
        extraction: {
          ...listing.extraction,
          ...updates,
        },
        activityLog: [
          ...(listing.activityLog || []),
          {
            id: `activity-${Date.now()}`,
            action: 'Listing information updated',
            timestamp: new Date(),
            performedBy: currentAgent.name,
          },
        ],
      };
    }));
  };

  const startBatchFlow = (files: File[]) => {
    // Import classification dynamically to avoid circular dependency
    import('@/lib/mockDocumentClassification').then(({ classifyDocument }) => {
      let documents: ClassifiedDocument[] = files.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        file,
        classification: classifyDocument(file.name),
        status: 'queued' as const,
      }));

      // Ensure we always pick a "primary" doc (even if classification is unknown)
      const detectedPrimary = documents.find((d) => d.classification.tier === 'primary');
      if (!detectedPrimary && documents.length > 0) {
        documents = documents.map((doc, idx) =>
          idx === 0
            ? {
                ...doc,
                classification: {
                  ...doc.classification,
                  tier: 'primary',
                },
              }
            : doc
        );
      }

      const primaryDoc = documents.find((d) => d.classification.tier === 'primary') ?? documents[0];

      setBatchUploadState({
        documents,
        currentIndex: 0,
        primaryDocumentId: primaryDoc?.id || null,
        overallStatus: 'idle',
        approvalState: documents.reduce((acc, doc) => {
          acc[doc.id] = 'pending';
          return acc;
        }, {} as Record<string, 'pending' | 'approved' | 'rejected'>),
      });

      setListingMode('batch_processing');
      setIsChatOpen(true);
    });
  };

  const updateBatchApproval = (docId: string, status: 'pending' | 'approved' | 'rejected') => {
    setBatchUploadState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        approvalState: {
          ...prev.approvalState,
          [docId]: status,
        },
      };
    });
  };

  const updateBatchDocuments = (documents: ClassifiedDocument[]) => {
    setBatchUploadState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        documents,
        currentIndex: documents.findIndex(d => d.status === 'processing'),
      };
    });
  };

  const attachBatchToChecklist = () => {
    // In a real app, this would attach documents to the listing checklist
    setBatchUploadState(null);
    setListingMode('idle');
  };

  const addPinnedInsight = (insight: Omit<PinnedInsight, 'id' | 'createdAt' | 'updatedAt' | 'lastRefreshedAt'>) => {
    const newInsight: PinnedInsight = {
      ...insight,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastRefreshedAt: new Date(),
    };
    setPinnedInsights((prev) => [...prev, newInsight]);
  };

  const removePinnedInsight = (id: string) => {
    setPinnedInsights((prev) => prev.filter((insight) => insight.id !== id));
  };

  const refreshInsight = async (id: string) => {
    // Set refreshing state
    setPinnedInsights((prev) =>
      prev.map((insight) =>
        insight.id === id ? { ...insight, isRefreshing: true } : insight
      )
    );

    // Simulate AI re-fetching data (in real app, this would call the AI)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update with "fresh" data and timestamp
    setPinnedInsights((prev) =>
      prev.map((insight) => {
        if (insight.id !== id) return insight;
        
        // Simulate slightly varied data for demo
        let newData = insight.data;
        if (insight.type === 'list' && Array.isArray(insight.data)) {
          newData = insight.data.map((item: any) => ({
            ...item,
            lastActive: Math.random() > 0.5 ? item.lastActive : 'Just now',
          }));
        } else if (insight.type === 'chart' && Array.isArray(insight.data)) {
          newData = insight.data.map((item: any) => ({
            ...item,
            value: item.value + Math.floor((Math.random() - 0.5) * 2000),
          }));
        }

        return {
          ...insight,
          data: newData,
          updatedAt: new Date(),
          lastRefreshedAt: new Date(),
          isRefreshing: false,
        };
      })
    );
  };

  const updateInsightSettings = (
    id: string,
    settings: { refreshInterval?: 'daily' | 'weekly' | 'manual'; priority?: number }
  ) => {
    setPinnedInsights((prev) =>
      prev.map((insight) =>
        insight.id === id ? { ...insight, ...settings, updatedAt: new Date() } : insight
      )
    );
  };

  const reorderInsights = (newOrder: { id: string; priority: number }[]) => {
    setPinnedInsights((prev) => {
      const updated = prev.map((insight) => {
        const orderItem = newOrder.find((o) => o.id === insight.id);
        if (orderItem) {
          return { ...insight, priority: orderItem.priority, updatedAt: new Date() };
        }
        return insight;
      });
      return updated;
    });
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
  };

  const askMira = (query: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsChatOpen(true);

    // Generate mock AI response after a delay
    setTimeout(() => {
      const response = generateMockResponse(query);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        isPinnable: response.isPinnable,
        visualizations: response.visualizations,
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    }, 1500);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  // Mock response generator
  const generateMockResponse = (query: string): Omit<ChatMessage, 'id' | 'timestamp'> => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('pending') && lowerQuery.includes('transaction')) {
      return {
        role: 'assistant',
        content: "You have **2 pending transactions** worth a combined **$975,000** with an expected commission of **$29,250**.\n\n**Key Details:**\n• 123 Oak Street - $425,000 (Closing Jan 15)\n• 789 Pine Lane - $550,000 (Closing Jan 28)\n\nBoth are buyer-side deals. Would you like me to analyze the timeline or potential risks?",
        isPinnable: true,
      };
    }
    
    if (lowerQuery.includes('gci') || lowerQuery.includes('revenue')) {
      return {
        role: 'assistant',
        content: "Your GCI is currently **$279,000** for the year, which is **23% above target**. Here's the breakdown:\n\n• Closed deals: $49,470\n• Pending: $29,250\n\nYou're on track for a strong quarter!",
        isPinnable: true,
      };
    }
    
    return {
      role: 'assistant',
      content: "I'd be happy to help you with that! Based on your current data, here are some insights I can share. Would you like me to dive deeper into any specific area?",
      isPinnable: false,
    };
  };

  const updateAgent = (agentId: string, updates: Partial<Agent>) => {
    if (agentId === currentAgent.id) {
      setCurrentAgent((prev) => ({ ...prev, ...updates }));
    } else {
      setTeamAgents((prev) =>
        prev.map((agent) =>
          agent.id === agentId ? { ...agent, ...updates } : agent
        )
      );
    }
  };

  // Marketplace functions
  const createReportTemplate = (template: {
    title: string;
    description: string;
    category: 'production' | 'team' | 'growth' | 'custom';
    tags: string[];
    visibility: 'private' | 'team' | 'organization' | 'public';
    templateInsights: PinnedInsight[];
  }) => {
    const newReport: MarketplaceReport = {
      id: `template-${Date.now()}`,
      title: template.title,
      description: template.description,
      category: template.category,
      creator: {
        id: currentAgent.id,
        name: currentAgent.name,
        role: currentAgent.role,
      },
      templateInsights: template.templateInsights.map(i => ({
        query: i.query,
        title: i.title,
        content: i.content,
        type: i.type,
        refreshInterval: i.refreshInterval,
      })),
      visibility: template.visibility,
      usageCount: 0,
      rating: 0,
      reviewCount: 0,
      tags: template.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCreatedTemplates(prev => [...prev, newReport]);
    
    if (template.visibility === 'public') {
      setMarketplaceReports(prev => [...prev, newReport]);
    }
  };

  const installReport = (report: MarketplaceReport) => {
    // Add insights from template to pinned insights
    report.templateInsights.forEach((templateInsight) => {
      addPinnedInsight({
        ...templateInsight,
        customName: templateInsight.title,
        queryParameters: {
          originalQuery: templateInsight.query,
          queryType: templateInsight.type,
        },
      });
    });

    // Track installation
    const installation: ReportInstallation = {
      id: `install-${Date.now()}`,
      reportId: report.id,
      reportTitle: report.title,
      installedAt: new Date(),
      insightIds: [],
    };
    setInstalledReports(prev => [...prev, installation]);

    // Update usage count
    setMarketplaceReports(prev =>
      prev.map(r =>
        r.id === report.id ? { ...r, usageCount: r.usageCount + 1 } : r
      )
    );
  };

  const installSharedReport = (shareId: string) => {
    const share = sharedReports.find(s => s.id === shareId);
    if (share) {
      installReport(share.report);
      setSharedReports(prev =>
        prev.map(s =>
          s.id === shareId ? { ...s, status: 'installed' as const } : s
        )
      );
    }
  };

  const dismissSharedReport = (shareId: string) => {
    setSharedReports(prev =>
      prev.map(s =>
        s.id === shareId ? { ...s, status: 'dismissed' as const } : s
      )
    );
  };

  const shareReportWithTeam = (reportId: string) => {
    const report = createdTemplates.find(r => r.id === reportId);
    if (report) {
      const newShare: SharedReport = {
        id: `share-${Date.now()}`,
        reportId: report.id,
        report,
        sharedBy: {
          id: currentAgent.id,
          name: currentAgent.name,
          role: currentAgent.role as 'team_leader' | 'influencer',
        },
        sharedWith: 'team',
        sharedAt: new Date(),
        status: 'pending',
      };
      setSharedReports(prev => [...prev, newShare]);
    }
  };

  const shareReportWithOrganization = (reportId: string) => {
    const report = createdTemplates.find(r => r.id === reportId);
    if (report) {
      const newShare: SharedReport = {
        id: `share-${Date.now()}`,
        reportId: report.id,
        report,
        sharedBy: {
          id: currentAgent.id,
          name: currentAgent.name,
          role: currentAgent.role as 'team_leader' | 'influencer',
        },
        sharedWith: 'organization',
        sharedAt: new Date(),
        status: 'pending',
      };
      setSharedReports(prev => [...prev, newShare]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentAgent,
        pinnedInsights,
        addPinnedInsight,
        removePinnedInsight,
        refreshInsight,
        updateInsightSettings,
        reorderInsights,
        chatHistory,
        addChatMessage,
        askMira,
        clearChatHistory,
        isChatOpen,
        setIsChatOpen,
        currentPage,
        setCurrentPage,
        teamAgents,
        updateAgent,
        marketplaceReports,
        sharedReports,
        createdTemplates,
        installedReports,
        createReportTemplate,
        installReport,
        installSharedReport,
        dismissSharedReport,
        shareReportWithTeam,
        shareReportWithOrganization,
        listings,
        addListing,
        listingMode,
        setListingMode,
        pendingExtraction,
        setPendingExtraction,
        submittedListing,
        setSubmittedListing,
        startListingFlow,
        openChecklistBulkUpload,
        // Contract flow
        contractMode,
        setContractMode,
        pendingContract,
        setPendingContract,
        activeListingForContract,
        setActiveListingForContract,
        manualIntakeStep,
        setManualIntakeStep,
        startContractFlow,
        startTransactionFlow,
        updateListingToContract,
        updateListingMetadata,
        updateListing,
        submittedContract,
        setSubmittedContract,
        // Batch upload
        batchUploadState,
        setBatchUploadState,
        startBatchFlow,
        updateBatchApproval,
        updateBatchDocuments,
        attachBatchToChecklist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
