import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContractVerificationView } from "@/components/transactions/ContractVerificationView";
import { useTransactions } from "@/contexts/TransactionsContext";
import { transactionChecklistItems } from "@/data/mockContractExtraction";
import { toast } from "sonner";

export default function NewContract() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const {
    listings,
    pendingContract,
    setPendingContract,
    setContractMode,
    updateListingToContract,
    setSubmittedContract,
    setActiveListingForContract,
  } = useTransactions();

  const listing = listings.find((l) => l.id === listingId) || null;

  useEffect(() => {
    if (!pendingContract || !listing) {
      navigate("/business/transactions");
    }
  }, [pendingContract, listing, navigate]);

  const handleUpdate = useCallback(
    (field: string, value: unknown) => {
      if (!pendingContract) return;
      setPendingContract({
        ...pendingContract,
        [field]: value,
        confidence: { ...pendingContract.confidence, [field]: 100 },
      });
    },
    [pendingContract, setPendingContract],
  );

  const handleApprove = useCallback(() => {
    if (!pendingContract || !listing) return;
    updateListingToContract(listing.id, pendingContract, transactionChecklistItems);
    setSubmittedContract({ listing, contract: pendingContract });
    setPendingContract(null);
    setActiveListingForContract(null);
    setContractMode("submitted");
    toast.success("Transaction created", { description: listing.extraction.propertyAddress });
    navigate("/business/transactions");
  }, [
    pendingContract,
    listing,
    updateListingToContract,
    setPendingContract,
    setActiveListingForContract,
    setContractMode,
    setSubmittedContract,
    navigate,
  ]);

  const handleSaveDraft = useCallback(() => {
    toast.success("Contract saved as draft");
    navigate("/business/transactions");
  }, [navigate]);

  const handleClose = useCallback(() => {
    setPendingContract(null);
    setActiveListingForContract(null);
    setContractMode("idle");
    navigate("/business/transactions");
  }, [setPendingContract, setActiveListingForContract, setContractMode, navigate]);

  if (!pendingContract || !listing) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">No contract in progress</h2>
          <Button onClick={() => navigate("/business/transactions")} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Transactions
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ContractVerificationView
      open
      onClose={handleClose}
      listing={listing}
      extraction={pendingContract}
      onUpdate={handleUpdate}
      onApprove={handleApprove}
      onSaveDraft={handleSaveDraft}
    />
  );
}
