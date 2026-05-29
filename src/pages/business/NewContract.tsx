import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { ContractVerificationView } from '@/components/contract/ContractVerificationView';
import { toast } from 'sonner';
import { transactionChecklistItems } from '@/lib/mockContractExtraction';

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
    setIsChatOpen,
  } = useApp();

  const listing = listings.find(l => l.id === listingId);

  // Redirect if no pending contract or listing not found
  useEffect(() => {
    if (!pendingContract || !listing) {
      navigate('/transactions');
    }
  }, [pendingContract, listing, navigate]);

  const handleUpdateField = useCallback((field: string, value: any) => {
    if (!pendingContract) return;
    
    setPendingContract({
      ...pendingContract,
      [field]: value,
      confidence: {
        ...pendingContract.confidence,
        [field]: 100, // User verified = 100% confidence
      },
    });
  }, [pendingContract, setPendingContract]);

  const handleApprove = useCallback(() => {
    if (!pendingContract || !listing) return;
    
    // Update listing to "Under Contract" status with contract data and new checklist
    updateListingToContract(listing.id, pendingContract, transactionChecklistItems);
    
    // Store the submitted contract data for the chat UI
    setSubmittedContract({ listing, contract: pendingContract });
    
    // Reset contract flow state and switch to submitted mode
    setPendingContract(null);
    setActiveListingForContract(null);
    setContractMode('submitted');
    
    // Open chat to show confirmation
    setIsChatOpen(true);
    
    // Navigate to transactions page
    navigate('/transactions');
  }, [pendingContract, listing, updateListingToContract, setPendingContract, setContractMode, setSubmittedContract, setActiveListingForContract, setIsChatOpen, navigate]);

  const handleSaveDraft = useCallback(() => {
    toast.success('Contract saved as draft');
    navigate('/transactions');
  }, [navigate]);

  const handleClose = useCallback(() => {
    setPendingContract(null);
    setContractMode('idle');
    navigate('/transactions');
  }, [setPendingContract, setContractMode, navigate]);

  if (!pendingContract || !listing) {
    return null;
  }

  return (
    <ContractVerificationView
      open={true}
      onClose={handleClose}
      listing={listing}
      extraction={pendingContract}
      onUpdate={handleUpdateField}
      onApprove={handleApprove}
      onSaveDraft={handleSaveDraft}
    />
  );
}
