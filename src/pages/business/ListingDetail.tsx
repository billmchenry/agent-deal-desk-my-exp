import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Home, User, DollarSign, Users, MapPin, Clock, Calendar, Edit, FileCheck, XCircle, Ban } from 'lucide-react';
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/mockDocumentExtraction';
import { PropertyListingTab } from '@/components/property/PropertyListingTab';
import { PropertyContactsTab } from '@/components/property/PropertyContactsTab';
import { PropertyChecklistTab } from '@/components/property/PropertyChecklistTab';
import { PropertyDocumentsTab } from '@/components/property/PropertyDocumentsTab';
import { PropertyActivityTab } from '@/components/property/PropertyActivityTab';
import { PropertyCommentsTab } from '@/components/property/PropertyCommentsTab';
import { Listing } from '@/types';

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
  pending_review: { label: 'Pending Review', className: 'bg-warning/10 text-warning border-warning/20' },
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  sold: { label: 'Sold', className: 'bg-primary/10 text-primary border-primary/20' },
  withdrawn: { label: 'Withdrawn', className: 'bg-muted text-muted-foreground border-border' },
};

interface ListingDetailProps {
  listing: Listing;
}

export function ListingDetailContent({ listing }: ListingDetailProps) {
  const navigate = useNavigate();
  const { currentAgent, startContractFlow } = useApp();
  const [activeTab, setActiveTab] = useState('listing');

  const { extraction, status } = listing;

  const handleMarkAsInContract = () => {
    startContractFlow(listing);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/transactions')}
                className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0 ring-2 ring-primary/50">
                <img 
                  src={propertyImage} 
                  alt={extraction.propertyAddress}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Listing
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg md:text-2xl font-bold text-foreground">
                    {extraction.propertyAddress}
                  </h1>
                  <Badge 
                    variant="outline" 
                    className={cn(statusConfig[status].className, 'font-medium text-xs')}
                  >
                    {statusConfig[status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {extraction.city}, {extraction.state} {extraction.zipCode}
                  </p>
                </div>
              </div>
            </div>
            {/* Desktop Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="hidden sm:flex gap-2 flex-shrink-0 gradient-primary shadow-lg shadow-primary/25 px-6 h-11 text-base font-medium">
                  Actions
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                <DropdownMenuItem className="py-3 text-sm cursor-pointer gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Listing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAsInContract} className="py-3 text-sm cursor-pointer gap-2">
                  <FileCheck className="w-4 h-4" />
                  Accept Contract
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-3 text-sm cursor-pointer gap-2">
                  <XCircle className="w-4 h-4" />
                  Withdraw Listing
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive py-3 text-sm cursor-pointer gap-2">
                  <Ban className="w-4 h-4" />
                  Cancel Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="sm:hidden flex-shrink-0 gradient-primary shadow-lg shadow-primary/25 px-4 h-9 text-sm font-medium">
                  •••
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Listing Actions</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-24 space-y-2">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base">
                      <Edit className="w-5 h-5" />
                      Edit Listing
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3 h-12 text-base"
                      onClick={handleMarkAsInContract}
                    >
                      <FileCheck className="w-5 h-5" />
                      Accept Contract
                    </Button>
                  </DrawerClose>
                  <div className="border-t border-border my-3" />
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base">
                      <XCircle className="w-5 h-5" />
                      Withdraw Listing
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base text-destructive hover:text-destructive">
                      <Ban className="w-5 h-5" />
                      Cancel Listing
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Quick Info Bar - Listing specific */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-card rounded-xl border border-border shadow-sm">
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
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="bg-secondary/50 p-1 h-auto gap-1 inline-flex min-w-max md:min-w-0 md:w-auto">
              <TabsTrigger 
                value="listing" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2 text-sm whitespace-nowrap"
              >
                Listing
              </TabsTrigger>
              <TabsTrigger 
                value="contacts"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2 text-sm whitespace-nowrap"
              >
                Contacts
              </TabsTrigger>
              <TabsTrigger 
                value="checklist"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2 text-sm whitespace-nowrap"
              >
                Checklist
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2 text-sm whitespace-nowrap"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2 text-sm whitespace-nowrap"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="comments"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2 text-sm whitespace-nowrap"
              >
                Comments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="listing" className="mt-6">
            <PropertyListingTab listing={listing} />
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

// Wrapper page component that loads the listing and shows not found if needed
export default function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { listings } = useApp();

  const listing = listings.find(l => l.id === listingId);

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

  return <ListingDetailContent listing={listing} />;
}

interface QuickInfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}

function QuickInfoItem({ icon: Icon, label, value, highlight }: QuickInfoItemProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        highlight ? "bg-primary/10" : "bg-secondary"
      )}>
        <Icon className={cn("w-4 h-4", highlight ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className={cn(
          "text-sm font-medium leading-tight whitespace-normal break-words",
          highlight ? "text-primary" : "text-foreground"
        )}>{value}</p>
      </div>
    </div>
  );
}
