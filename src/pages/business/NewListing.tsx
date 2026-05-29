import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { FullExtractionView } from '@/components/listing/FullExtractionView';
import { Listing } from '@/types';
import { toast } from 'sonner';

export default function NewListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingExtraction, setPendingExtraction, setListingMode, addListing, setSubmittedListing, setIsChatOpen } = useApp();
  const navigationExtraction = (location.state as any)?.extraction ?? null;
  const extraction = pendingExtraction ?? navigationExtraction;

  const handleUpdateField = useCallback((field: string, value: any) => {
    if (!extraction) return;
    setPendingExtraction({ ...extraction, [field]: value });
  }, [extraction, setPendingExtraction]);

  const handleApprove = useCallback(() => {
    if (!extraction) return;

    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      extraction,
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'current-user',
      syncedToMLS: false,
    };

    addListing(newListing);
    
    // Store the submitted listing for the chat confirmation UI
    setSubmittedListing(newListing);
    
    // Clear pending state and switch to submitted mode
    setPendingExtraction(null);
    setListingMode('submitted');
    
    // Open chat to show confirmation
    setIsChatOpen(true);
    
    // Navigate to transactions page (confirmation will be shown in chat)
    navigate('/transactions');
  }, [extraction, addListing, setPendingExtraction, setListingMode, setSubmittedListing, setIsChatOpen, navigate]);

  const handleSaveDraft = useCallback(() => {
    if (!extraction) return;

    const draftListing: Listing = {
      id: `listing-${Date.now()}`,
      extraction,
      status: 'draft',
      createdAt: new Date(),
      createdBy: 'current-user',
    };

    addListing(draftListing);
    
    toast.success('Draft saved', {
      description: 'Your listing has been saved as a draft.',
    });
    
    setPendingExtraction(null);
    setListingMode('idle');
    navigate('/transactions');
  }, [extraction, addListing, setPendingExtraction, setListingMode, navigate]);

  const handleClose = useCallback(() => {
    setPendingExtraction(null);
    setListingMode('idle');
    navigate('/transactions');
  }, [setPendingExtraction, setListingMode, navigate]);

  // If no pending extraction, redirect back
  if (!extraction) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">No listing in progress</h2>
          <p className="text-muted-foreground mb-4">Start a new listing from the Transactions page.</p>
          <Button onClick={() => navigate('/transactions')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FullExtractionView
      open={true}
      onClose={handleClose}
      extraction={extraction}
      onUpdate={handleUpdateField}
      onApprove={handleApprove}
      onSaveDraft={handleSaveDraft}
    />
  );
}