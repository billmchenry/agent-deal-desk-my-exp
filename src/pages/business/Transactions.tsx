import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ExternalLink, MoreVertical, Plus, FileText, ChevronDown, DollarSign, Users, Home, Clock, TrendingUp, Link2, Send, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/mockDocumentExtraction';
import { CircularProgress } from '@/components/ui/circular-progress';

// Action types and their severity
type ActionType = 'error' | 'warning' | null;

const getActionType = (action: string | null): ActionType => {
  if (!action) return null;
  const errorActions = ['Missing Documents', 'Broker Rejected', 'Compliance Issue'];
  return errorActions.includes(action) ? 'error' : 'warning';
};

// Legacy mock transactions - will be replaced with real listings that have been converted
const legacyTransactions = [
  {
    id: 'legacy-1',
    property: '456 Maple Avenue',
    address: 'Austin, TX 78702',
    status: 'pending',
    value: 375000,
    closingDate: new Date('2024-02-20'),
    commission: 11250,
    type: 'buyer',
    client: 'Sarah Mitchell',
    action: 'Missing Documents',
    office: 'Austin Central',
  },
  {
    id: 'legacy-2',
    property: '321 Cedar Court',
    address: 'Georgetown, TX 78628',
    status: 'incomplete',
    value: 299000,
    closingDate: new Date('2024-02-15'),
    commission: 8970,
    type: 'buyer',
    client: 'David Thompson',
    action: 'Missing Info',
    office: 'Georgetown Branch',
  },
  {
    id: 'legacy-3',
    property: '789 Sunset Blvd',
    address: 'Pflugerville, TX 78660',
    status: 'closed',
    value: 425000,
    closingDate: new Date('2024-01-15'),
    commission: 12750,
    type: 'seller',
    client: 'The Martinez Family',
    action: null,
    office: 'North Austin Division',
  },
  {
    id: 'legacy-4',
    property: '1520 Willow Creek',
    address: 'Round Rock, TX 78681',
    status: 'canceled_pend',
    value: 515000,
    closingDate: new Date('2024-03-01'),
    commission: 15450,
    type: 'seller',
    client: 'Jennifer Adams',
    action: null,
    office: 'Round Rock Branch',
  },
  {
    id: 'legacy-5',
    property: '432 Heritage Lane',
    address: 'Leander, TX 78641',
    status: 'archived',
    value: 350000,
    closingDate: new Date('2024-01-08'),
    commission: 10500,
    type: 'referral',
    client: 'Mark & Lisa Cooper',
    action: null,
    office: 'Leander Division',
  },
  {
    id: 'legacy-6',
    property: '890 Lakeview Dr',
    address: 'Lakeway, TX 78734',
    status: 'expired',
    value: 650000,
    closingDate: new Date('2024-01-01'),
    commission: 19500,
    type: 'seller',
    client: 'Robert Williams',
    action: null,
    office: 'Lakeway Branch',
  },
  {
    id: 'legacy-7',
    property: '2100 Highland Terrace',
    address: 'Cedar Park, TX 78613',
    status: 'canceled_app',
    value: 420000,
    closingDate: new Date('2024-02-10'),
    commission: 12600,
    type: 'buyer',
    client: 'Emily Chen',
    action: null,
    office: 'Cedar Park Division',
  },
  {
    id: 'legacy-8',
    property: '555 Oak Ridge Way',
    address: 'Bee Cave, TX 78738',
    status: 'pre_contract',
    value: 890000,
    closingDate: new Date('2024-04-15'),
    commission: 26700,
    type: 'seller',
    client: 'Michael & Susan Brown',
    action: null,
    office: 'West Austin Branch',
  },
];

// Transaction-specific status configuration
const transactionStatusConfig = {
  incomplete: { label: 'Incomplete', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  pending: { label: 'Pending', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  canceled_pend: { label: 'Canceled/Pend', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  canceled_app: { label: 'Canceled/App', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  expired: { label: 'Expired', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
  closed: { label: 'Closed', className: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  archived: { label: 'Archived', className: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  pre_contract: { label: 'Pre-Contract', className: 'bg-pink-500/10 text-pink-600 border-pink-500/20' },
};

// Listing-specific status configuration (matching transaction status UI format)
const listingStatusConfig = {
  incomplete: { label: 'Incomplete', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  active: { label: 'Active', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  canceled_pend: { label: 'Canceled/Pend', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  canceled_app: { label: 'Canceled/App', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  expired: { label: 'Expired', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

// Mock listings to demonstrate all status types
const mockListingsData = [
  {
    id: 'mock-1',
    mlsNumber: 'MLS-001',
    propertyAddress: '1234 Oak Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    status: 'active' as keyof typeof listingStatusConfig,
    listingAgent: 'John Smith',
    office: 'Main Office',
    expirationDate: new Date('2025-06-30'),
    listingPrice: 485000,
    stage: 'Active',
    action: null,
  },
  {
    id: 'mock-2',
    mlsNumber: 'MLS-002',
    propertyAddress: '567 Riverside Dr',
    city: 'Round Rock',
    state: 'TX',
    zipCode: '78664',
    status: 'incomplete' as keyof typeof listingStatusConfig,
    listingAgent: 'Sarah Johnson',
    office: 'North Office',
    expirationDate: new Date('2025-05-15'),
    listingPrice: 325000,
    stage: 'Pending Review',
    action: 'Missing Documents',
  },
  {
    id: 'mock-3',
    mlsNumber: 'MLS-003',
    propertyAddress: '890 Summit View',
    city: 'Cedar Park',
    state: 'TX',
    zipCode: '78613',
    status: 'canceled_pend' as keyof typeof listingStatusConfig,
    listingAgent: 'Michael Brown',
    office: 'Main Office',
    expirationDate: new Date('2025-04-20'),
    listingPrice: 575000,
    stage: 'Awaiting Approval',
    action: null,
  },
  {
    id: 'mock-4',
    mlsNumber: 'MLS-004',
    propertyAddress: '2100 Lakefront Blvd',
    city: 'Lakeway',
    state: 'TX',
    zipCode: '78734',
    status: 'canceled_app' as keyof typeof listingStatusConfig,
    listingAgent: 'Emily Davis',
    office: 'West Office',
    expirationDate: new Date('2025-03-10'),
    listingPrice: 1250000,
    stage: 'Closed',
    action: null,
  },
  {
    id: 'mock-5',
    mlsNumber: 'MLS-005',
    propertyAddress: '432 Heritage Lane',
    city: 'Leander',
    state: 'TX',
    zipCode: '78641',
    status: 'expired' as keyof typeof listingStatusConfig,
    listingAgent: 'Robert Wilson',
    office: 'North Office',
    expirationDate: new Date('2024-12-15'),
    listingPrice: 399000,
    stage: 'Expired',
    action: null,
  },
];

export default function Transactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { askMira, listings, startListingFlow, startTransactionFlow } = useApp();

  // Convert listings that are "pending" or "sold" into transaction-like objects
  const transactionsFromListings = listings
    .filter(l => l.status === 'pending' || l.status === 'sold')
    .map(listing => ({
      id: listing.id,
      property: listing.extraction.propertyAddress,
      address: `${listing.extraction.city}, ${listing.extraction.state} ${listing.extraction.zipCode}`,
      status: listing.status === 'pending' ? 'pending' : 'closed',
      value: listing.contractData?.salesPrice || listing.extraction.listingPrice,
      closingDate: listing.contractData?.closingDate,
      commission: listing.contractData?.listingBrokerFee || 0,
      type: 'seller', // Default to seller since this was a listing
      client: listing.extraction.sellers.map(s => s.name).join(', ') || 'Unknown',
      action: null as string | null,
      office: 'Austin Central',
      isFromListing: true,
    }));

  // Combine with legacy transactions
  const allTransactions = [...transactionsFromListings, ...legacyTransactions];

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = t.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingValue = allTransactions
    .filter((t) => t.status === 'pending')
    .reduce((acc, t) => acc + t.value, 0);

  const pendingCommission = allTransactions
    .filter((t) => t.status === 'pending')
    .reduce((acc, t) => acc + t.commission, 0);

  const pendingCount = allTransactions.filter(t => t.status === 'pending').length;

  // Count only active listings (not pending/sold which are transactions)
  const activeListingsCount = listings.filter(l => l.status !== 'pending' && l.status !== 'sold').length;

  // Pipeline metrics
  const [pipelineRange, setPipelineRange] = useState('quarter');
  const [activeTab, setActiveTab] = useState('listings');
  
  const closedThisMonth = allTransactions.filter(t => 
    t.status === 'closed' && 
    t.closingDate && 
    t.closingDate.getMonth() === new Date().getMonth() &&
    t.closingDate.getFullYear() === new Date().getFullYear()
  ).length;
  
  const totalVolume = allTransactions
    .filter(t => t.status === 'pending' || t.status === 'closed')
    .reduce((acc, t) => acc + t.value, 0);

  // Pipeline status counts
  const inProgressCount = allTransactions.filter(t => t.status === 'pending').length;
  const closedCount = allTransactions.filter(t => t.status === 'closed').length;
  const paidCount = allTransactions.filter(t => t.status === 'closed').length; // Mock: treat closed as paid for now
  const canceledCount = 0; // Mock value
  const totalDeals = allTransactions.length;

  // DA (Disbursement Authorization) metrics - mock data
  const readyToSend = 3;
  const daIssued = 2;

  // Settlement metrics - mock data
  const totalPotentialPayout = 110000;
  const pendingPayout = 67000;
  const payoutProgress = 25;
  const needDocsCount = 2;
  const processingCount = 1;

  const handleAskMira = () => {
    askMira('Tell me about my pending transactions');
  };

  // Sample actions for listings
  const listingActions: Record<string, string | null> = {
    'listing-001': null,
    'listing-002': 'Pending Review',
    'listing-003': 'Missing Signatures',
    'listing-004': null,
  };

  // Helper function to determine listing display status
  const getListingStatus = (listing: typeof listings[0]): keyof typeof listingStatusConfig => {
    const now = new Date();
    const expirationDate = new Date(listing.extraction.listingEndDate);
    
    // Check if expired (past expiration date)
    if (expirationDate < now) return 'expired';
    
    // Check for incomplete (draft or missing critical info)
    if (listing.status === 'draft' || !listing.extraction.propertyAddress || !listing.extraction.listingPrice) {
      return 'incomplete';
    }
    
    // Check for withdrawn status -> maps to canceled/pend (needs auditor approval)
    if (listing.status === 'withdrawn') return 'canceled_pend';
    
    // Check for pending_review -> could be canceled/app if already approved, otherwise active
    if (listing.status === 'pending_review') return 'incomplete';
    
    // Default to active for all other statuses
    return 'active';
  };

  // Listings data - combine real listings with mock data to show all statuses
  const realListingsData = listings
    .filter(l => l.status !== 'pending' && l.status !== 'sold')
    .map(listing => ({
      id: listing.id,
      mlsNumber: listing.extraction.mlsNumber || 'N/A',
      propertyAddress: listing.extraction.propertyAddress,
      city: listing.extraction.city,
      state: listing.extraction.state,
      zipCode: listing.extraction.zipCode,
      status: getListingStatus(listing),
      listingAgent: listing.extraction.sellers[0]?.name || 'Unknown Agent',
      office: 'Main Office',
      expirationDate: listing.extraction.listingEndDate,
      listingPrice: listing.extraction.listingPrice,
      stage: listing.status === 'active' ? 'Active' : 'Pending Review',
      action: listingActions[listing.id] || null,
    }));

  // Combine real listings with mock data
  const listingsData = [...realListingsData, ...mockListingsData]
    .filter(item => {
      const matchesSearch = item.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${item.city}, ${item.state}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Transactions data (pending/closed transactions)
  const transactionsData = allTransactions
    .map(t => ({
      id: t.id,
      fileName: t.property,
      address: t.address,
      status: t.status as keyof typeof transactionStatusConfig,
      agent: t.client || 'Agent Name',
      office: t.office || 'Austin Central',
      incompleteItems: t.action ? 1 : 0,
      closingDate: t.closingDate,
      stage: getStageFromStatus(t.status),
      action: t.action || null,
    }))
    .filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Helper to get stage text from status
  function getStageFromStatus(status: string): string {
    switch (status) {
      case 'pre_contract': return 'Pre-Contract';
      case 'pending': return 'In Progress';
      case 'incomplete': return 'Needs Attention';
      case 'closed': return 'Completed';
      case 'archived': return 'Archived';
      case 'expired': return 'Expired';
      case 'canceled_pend': return 'Pending Approval';
      case 'canceled_app': return 'Canceled';
      default: return 'In Progress';
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Manage and track your real estate transactions</p>
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="https://skyslope.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>SkySlope</span>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gradient-primary gap-2">
                <Plus className="w-4 h-4" />
                Create
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={startListingFlow}>
                <FileText className="w-4 h-4 mr-2" />
                Create Listing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={startTransactionFlow}>
                <DollarSign className="w-4 h-4 mr-2" />
                Create Transaction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => askMira("Help me create a new referral")}>
                <Users className="w-4 h-4 mr-2" />
                Create Referral
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* AI Summary Card */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-medium">Quick Summary:</span> You have{' '}
                <span className="font-semibold text-primary">
                  {pendingCount} pending transaction{pendingCount !== 1 ? 's' : ''}
                </span>{' '}
                worth <span className="font-semibold">${pendingValue.toLocaleString()}</span> with potential commission of{' '}
                <span className="font-semibold text-success">${pendingCommission.toLocaleString()}</span>.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleAskMira}>
              <Sparkles className="w-3 h-3 mr-1.5" />
              Ask more
            </Button>
          </div>
        </CardContent>
      </Card>


      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Pipeline Card */}
          <Card className="bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Pipeline</span>
                <Tabs value={pipelineRange} onValueChange={setPipelineRange}>
                  <TabsList className="h-7">
                    <TabsTrigger value="month" className="text-xs px-2 h-5">Monthly</TabsTrigger>
                    <TabsTrigger value="quarter" className="text-xs px-2 h-5">Quarterly</TabsTrigger>
                    <TabsTrigger value="year" className="text-xs px-2 h-5">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="mb-4">
                <p className="text-4xl font-bold text-foreground">{totalDeals}</p>
                <p className="text-sm text-muted-foreground">Total Deals</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-warning">{inProgressCount}</span>
                  <span className="text-muted-foreground uppercase">In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">{closedCount}</span>
                  <span className="text-muted-foreground uppercase">Closed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-success">{paidCount}</span>
                  <span className="text-muted-foreground uppercase">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-muted-foreground">{canceledCount}</span>
                  <span className="text-muted-foreground uppercase">Canceled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send DA Card */}
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Send DA</span>
                    <Badge className="bg-warning text-warning-foreground text-xs">{readyToSend} Ready</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Disbursement Authorization</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{readyToSend}</p>
                  <p className="text-xs text-muted-foreground">Ready to Send</p>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{daIssued}</p>
                  <p className="text-xs text-muted-foreground">DA Issued</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 text-white hover:opacity-90"
                  style={{ backgroundColor: 'hsl(var(--warning))' }}
                >
                  <Send className="w-3 h-3 mr-1.5" />
                  Send All DAs
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Go to DAs
                  <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settlement Card */}
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Settlement</span>
                    <Badge className="bg-success text-success-foreground text-xs">${(totalPotentialPayout / 1000).toFixed(0)}K</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Get Paid</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pending Payout</p>
                  <p className="text-2xl font-bold text-foreground">${(pendingPayout / 1000).toFixed(0)}K</p>
                </div>
                <CircularProgress value={payoutProgress} size={56} strokeWidth={5} />
              </div>
              <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">{needDocsCount} Need Docs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{processingCount} Processing</span>
                </div>
              </div>
              <Button size="sm" className="w-full bg-success text-success-foreground hover:bg-success/90">
                Go to Settlement
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'closed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('closed')}
          >
            Closed
          </Button>
        </div>
      </div>

      {/* Tabbed Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="listings" className="gap-2">
            <Home className="w-4 h-4" />
            Listings
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {listingsData.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Transactions
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {transactionsData.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MLS#</TableHead>
                    <TableHead>Property Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listing Agent</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead>Listing Price</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listingsData.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/transactions/${item.id}`)}
                    >
                      <TableCell className="font-medium">{item.mlsNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.propertyAddress}</p>
                          <p className="text-sm text-muted-foreground">{item.city}, {item.state} {item.zipCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={listingStatusConfig[item.status]?.className || 'bg-muted text-muted-foreground'}
                        >
                          {listingStatusConfig[item.status]?.label || item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.listingAgent}</TableCell>
                      <TableCell>{item.office}</TableCell>
                      <TableCell>{formatDate(item.expirationDate)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.listingPrice)}
                      </TableCell>
                      <TableCell>
                        {item.action ? (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "gap-1",
                              getActionType(item.action) === 'error' 
                                ? "bg-destructive/10 text-destructive border-destructive/20" 
                                : "bg-warning/10 text-warning border-warning/20"
                            )}
                          >
                            <span>⊘</span>
                            {item.action}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">{item.stage}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/transactions/${item.id}`);
                            }}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              askMira(`Tell me about the property at ${item.propertyAddress}`);
                            }}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Ask Mira
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {listingsData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Home className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No listings found</p>
                          <Button onClick={startListingFlow} size="sm" className="gradient-primary mt-2">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Listing
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>Incomplete Items</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="w-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/transactions/${item.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.fileName}</p>
                          <p className="text-sm text-muted-foreground">{item.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={transactionStatusConfig[item.status]?.className || 'bg-muted text-muted-foreground'}
                        >
                          {transactionStatusConfig[item.status]?.label || item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.agent}</TableCell>
                      <TableCell>{item.office}</TableCell>
                      <TableCell>
                        {item.incompleteItems > 0 ? item.incompleteItems : '—'}
                      </TableCell>
                      <TableCell>
                        {item.closingDate ? formatDate(item.closingDate) : '—'}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          item.stage === 'Closed' ? 'text-success' : 'text-muted-foreground'
                        )}>
                          {item.stage}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/transactions/${item.id}`);
                            }}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              askMira(`Tell me about the property at ${item.fileName}`);
                            }}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Ask Mira
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {transactionsData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <DollarSign className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No transactions found</p>
                          <Button onClick={startTransactionFlow} size="sm" className="gradient-primary mt-2">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Transaction
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
