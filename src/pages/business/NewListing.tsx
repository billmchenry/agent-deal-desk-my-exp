import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FullExtractionView } from "@/components/transactions/FullExtractionView";
import { useTransactions } from "@/contexts/TransactionsContext";
import type { Listing } from "@/types/transactions";
import { toast } from "sonner";

export default function NewListing() {
  const navigate = useNavigate();
  const {
    pendingExtraction,
    setPendingExtraction,
    setListingMode,
    addListing,
    setSubmittedListing,
  } = useTransactions();

  const handleUpdate = useCallback(
    (field: string, value: unknown) => {
      if (!pendingExtraction) return;
      setPendingExtraction({ ...pendingExtraction, [field]: value });
    },
    [pendingExtraction, setPendingExtraction],
  );

  const handleApprove = useCallback(() => {
    if (!pendingExtraction) return;
    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      extraction: pendingExtraction,
      status: "active",
      createdAt: new Date(),
      createdBy: "current-user",
      syncedToMLS: false,
    };
    addListing(newListing);
    setSubmittedListing(newListing);
    setPendingExtraction(null);
    setListingMode("submitted");
    
    navigate("/business/transactions");
  }, [pendingExtraction, addListing, setPendingExtraction, setListingMode, setSubmittedListing, navigate]);

  const handleSaveDraft = useCallback(() => {
    if (!pendingExtraction) return;
    const draft: Listing = {
      id: `listing-${Date.now()}`,
      extraction: pendingExtraction,
      status: "draft",
      createdAt: new Date(),
      createdBy: "current-user",
    };
    addListing(draft);
    toast.success("Draft saved");
    setPendingExtraction(null);
    setListingMode("idle");
    navigate("/business/transactions");
  }, [pendingExtraction, addListing, setPendingExtraction, setListingMode, navigate]);

  const handleClose = useCallback(() => {
    setPendingExtraction(null);
    setListingMode("idle");
    navigate("/business/transactions");
  }, [setPendingExtraction, setListingMode, navigate]);

  if (!pendingExtraction) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">No listing in progress</h2>
          <p className="text-muted-foreground">Start a new listing from the Transactions page.</p>
          <Button onClick={() => navigate("/business/transactions")} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Transactions
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <FullExtractionView
      open
      onClose={handleClose}
      extraction={pendingExtraction}
      onUpdate={handleUpdate}
      onApprove={handleApprove}
      onSaveDraft={handleSaveDraft}
    />
  );
}
