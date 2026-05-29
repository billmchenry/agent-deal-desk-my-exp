import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  ChecklistItem,
  ContractExtraction,
  ContractMode,
  Listing,
  ListingExtraction,
  ListingMode,
} from "@/types/transactions";

interface TransactionsContextValue {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (listingId: string, updates: Partial<ListingExtraction>) => void;
  updateListingToContract: (
    listingId: string,
    contract: ContractExtraction,
    checklist: ChecklistItem[],
  ) => void;

  // Listing flow
  listingMode: ListingMode;
  setListingMode: (m: ListingMode) => void;
  pendingExtraction: ListingExtraction | null;
  setPendingExtraction: (e: ListingExtraction | null) => void;
  submittedListing: Listing | null;
  setSubmittedListing: (l: Listing | null) => void;
  startListingFlow: () => void;

  // Contract flow
  contractMode: ContractMode;
  setContractMode: (m: ContractMode) => void;
  pendingContract: ContractExtraction | null;
  setPendingContract: (c: ContractExtraction | null) => void;
  activeListingForContract: Listing | null;
  setActiveListingForContract: (l: Listing | null) => void;
  submittedContract: { listing: Listing; contract: ContractExtraction } | null;
  setSubmittedContract: (d: { listing: Listing; contract: ContractExtraction } | null) => void;
  startContractFlow: (listing: Listing) => void;
  startTransactionFlow: () => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

const seedListings: Listing[] = [
  {
    id: "listing-001",
    extraction: {
      id: "ext-001",
      propertyAddress: "1234 Oak Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      propertyType: "single_family",
      mlsNumber: "MLS-2024-001",
      yearBuilt: 1998,
      sellers: [
        { name: "John & Mary Smith", email: "jsmith@example.com", phone: "(555) 555-2222", role: "seller" },
      ],
      listingPrice: 485000,
      totalCommission: 6,
      buyerBrokerSplit: 3,
      checklistType: "residential",
      officeDivision: "Austin Main Office",
      occupancyStatus: "owner",
      personalInterestDisclosure: false,
      hoaStatus: "yes",
      keyboxAuthorized: true,
      listingStartDate: new Date("2024-01-15"),
      listingEndDate: new Date("2025-07-15"),
      protectionPeriodDays: 90,
      complianceStatus: "compliant",
      signaturesDetected: true,
      initialsDetected: true,
      confidence: {},
    },
    status: "active",
    createdAt: new Date("2024-01-15"),
    createdBy: "Charles Anderson",
    syncedToMLS: true,
  },
];

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [listingMode, setListingMode] = useState<ListingMode>("idle");
  const [pendingExtraction, setPendingExtraction] = useState<ListingExtraction | null>(null);
  const [submittedListing, setSubmittedListing] = useState<Listing | null>(null);
  const [contractMode, setContractMode] = useState<ContractMode>("idle");
  const [pendingContract, setPendingContract] = useState<ContractExtraction | null>(null);
  const [activeListingForContract, setActiveListingForContract] = useState<Listing | null>(null);
  const [submittedContract, setSubmittedContract] = useState<
    { listing: Listing; contract: ContractExtraction } | null
  >(null);

  const addListing = useCallback((listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
  }, []);

  const updateListing = useCallback((id: string, updates: Partial<ListingExtraction>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, extraction: { ...l.extraction, ...updates } } : l)),
    );
  }, []);

  const updateListingToContract = useCallback(
    (id: string, contract: ContractExtraction, checklist: ChecklistItem[]) => {
      setListings((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status: "pending",
                contractData: contract,
                checklist,
                checklistPhase: "transaction",
              }
            : l,
        ),
      );
    },
    [],
  );

  const startListingFlow = useCallback(() => {
    setPendingExtraction(null);
    setSubmittedListing(null);
    setListingMode("uploading");
  }, []);

  const startContractFlow = useCallback((listing: Listing) => {
    setActiveListingForContract(listing);
    setPendingContract(null);
    setContractMode("uploading");
  }, []);

  const startTransactionFlow = useCallback(() => {
    setActiveListingForContract(null);
    setPendingContract(null);
    setSubmittedContract(null);
    setContractMode("uploading");
  }, []);

  const value = useMemo<TransactionsContextValue>(
    () => ({
      listings,
      addListing,
      updateListing,
      updateListingToContract,
      listingMode,
      setListingMode,
      pendingExtraction,
      setPendingExtraction,
      submittedListing,
      setSubmittedListing,
      startListingFlow,
      contractMode,
      setContractMode,
      pendingContract,
      setPendingContract,
      activeListingForContract,
      setActiveListingForContract,
      submittedContract,
      setSubmittedContract,
      startContractFlow,
      startTransactionFlow,
    }),
    [
      listings,
      addListing,
      updateListing,
      updateListingToContract,
      listingMode,
      pendingExtraction,
      submittedListing,
      startListingFlow,
      contractMode,
      pendingContract,
      activeListingForContract,
      submittedContract,
      startContractFlow,
      startTransactionFlow,
    ],
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
