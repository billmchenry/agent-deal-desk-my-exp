import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import ListingDetail from './ListingDetail';
import PropertyDetail from './PropertyDetail';

/**
 * Router component that determines whether to show the Listing Overview
 * or the Transaction Overview based on the listing's status.
 * 
 * Listings (not under contract): ListingDetail
 * Transactions (under contract/sold): PropertyDetail
 */
export default function PropertyDetailRouter() {
  const { listingId } = useParams<{ listingId: string }>();
  const { listings } = useApp();

  const listing = listings.find(l => l.id === listingId);

  if (!listing) {
    // ListingDetail will handle the "not found" case
    return <ListingDetail />;
  }

  // Determine if this is a transaction (sold only - pending stays on listing view)
  const isTransaction = listing.checklistPhase === 'transaction' || 
                        listing.status === 'sold';

  if (isTransaction) {
    // Show Transaction Property Overview
    return <PropertyDetail />;
  }

  // Show Listing Property Overview
  return <ListingDetail />;
}
