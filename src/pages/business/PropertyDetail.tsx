import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Home, User, DollarSign, Users, Building2, MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import propertyImage from '@/assets/property-1234-oak.jpg';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/mockDocumentExtraction';
import { PropertyListingTab } from '@/components/property/PropertyListingTab';
import { PropertyContactsTab } from '@/components/property/PropertyContactsTab';
import { PropertyChecklistTab } from '@/components/property/PropertyChecklistTab';
import { PropertyDocumentsTab } from '@/components/property/PropertyDocumentsTab';
import { PropertyActivityTab } from '@/components/property/PropertyActivityTab';
import { PropertyCommentsTab } from '@/components/property/PropertyCommentsTab';

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
  pending_review: { label: 'Pending Review', className: 'bg-warning/10 text-warning border-warning/20' },
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  sold: { label: 'Sold', className: 'bg-primary/10 text-primary border-primary/20' },
  withdrawn: { label: 'Withdrawn', className: 'bg-muted text-muted-foreground border-border' },
};

export default function PropertyDetail() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { listings, currentAgent, startContractFlow } = useApp();
  const [activeTab, setActiveTab] = useState('listing');

  const listing = listings.find(l => l.id === listingId);

  const handleMarkAsInContract = () => {
    if (listing) {
      startContractFlow(listing);
    }
  };

  if (!listing) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
          <div className="text-center py-16">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />
              <div className="relative w-full h-full rounded-full bg-secondary/50 flex items-center justify-center border border-border">
                <Home className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Listing not found</h2>
            <p className="text-muted-foreground mb-6">The listing you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/transactions')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { extraction } = listing;
  
  // Determine if this is a transaction (under contract or sold)
  const isTransaction = listing.checklistPhase === 'transaction' || listing.status === 'pending' || listing.status === 'sold';
  const contractData = listing.contractData;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/transactions')}
                className="h-10 w-10 flex-shrink-0 mt-0.5"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-lg flex-shrink-0",
                  isTransaction ? "ring-2 ring-success" : "ring-2 ring-primary/50"
                )}>
                  <img 
                    src={propertyImage} 
                    alt={extraction.propertyAddress}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {isTransaction ? 'Transaction' : 'Listing'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                      {extraction.propertyAddress}
                    </h1>
                    <Badge 
                      variant="outline" 
                      className={cn(statusConfig[listing.status].className, 'font-medium')}
                    >
                      {statusConfig[listing.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {extraction.city}, {extraction.state} {extraction.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 flex-shrink-0 gradient-primary shadow-lg shadow-primary/25 px-6 h-11 text-base font-medium">
                  Actions
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isTransaction ? (
                  <>
                    <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Closed</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Cancel Transaction</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMarkAsInContract}>
                      Accept Contract
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Withdraw Listing</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel Listing</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Info Bar - Different content for Listing vs Transaction */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-card rounded-xl border border-border shadow-sm">
          {isTransaction && contractData ? (
            <>
              <QuickInfoItem 
                icon={DollarSign} 
                label="Sales Price" 
                value={formatCurrency(contractData.salesPrice)} 
                highlight
              />
              <QuickInfoItem 
                icon={Users} 
                label="Buyer" 
                value={contractData.buyers?.[0]?.name || 'Unknown'} 
              />
              <QuickInfoItem 
                icon={Users} 
                label="Seller" 
                value={extraction.sellers.map(s => s.name).join(', ')} 
              />
              <QuickInfoItem 
                icon={Calendar} 
                label="Target Closing Date" 
                value={contractData.closingDate ? formatDate(contractData.closingDate) : 'TBD'} 
              />
              <QuickInfoItem 
                icon={User} 
                label="Agent" 
                value={currentAgent.name} 
              />
              <QuickInfoItem 
                icon={Building2} 
                label="Title Company" 
                value={contractData.titleCompany || 'Not specified'} 
              />
            </>
          ) : (
            <>
              <QuickInfoItem 
                icon={Home} 
                label="Address" 
                value={extraction.propertyAddress} 
              />
              <QuickInfoItem 
                icon={User} 
                label="Agent" 
                value={currentAgent.name} 
              />
              <QuickInfoItem 
                icon={DollarSign} 
                label="List Price" 
                value={formatCurrency(extraction.listingPrice)} 
                highlight
              />
              <QuickInfoItem 
                icon={Users} 
                label="Seller" 
                value={extraction.sellers.map(s => s.name).join(', ')} 
              />
              <QuickInfoItem 
                icon={Calendar} 
                label="Expiration" 
                value="06/15/2025" 
              />
              <QuickInfoItem 
                icon={Clock} 
                label="DOM" 
                value="45 days" 
              />
            </>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50 p-1 h-auto gap-1">
            <TabsTrigger 
              value="listing" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              Sale
            </TabsTrigger>
            <TabsTrigger 
              value="contacts"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              Contacts
            </TabsTrigger>
            <TabsTrigger 
              value="checklist"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              Checklist
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="comments"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listing" className="mt-6">
            <PropertyListingTab listing={listing} isTransaction={true} />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <PropertyContactsTab listing={listing} />
          </TabsContent>

          <TabsContent value="checklist" className="mt-6">
            <PropertyChecklistTab listing={listing} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <PropertyDocumentsTab listing={listing} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <PropertyActivityTab listing={listing} />
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <PropertyCommentsTab listing={listing} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface QuickInfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}

function QuickInfoItem({ icon: Icon, label, value, highlight }: QuickInfoItemProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        highlight ? "bg-primary/10" : "bg-secondary"
      )}>
        <Icon className={cn("w-4 h-4", highlight ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className={cn(
          "text-sm font-medium",
          highlight ? "text-primary" : "text-foreground"
        )}>{value}</p>
      </div>
    </div>
  );
}