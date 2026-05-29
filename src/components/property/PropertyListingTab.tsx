import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Clock, Shield, Home, Pencil, X } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/mockDocumentExtraction';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

interface PropertyListingTabProps {
  listing: Listing;
  isTransaction?: boolean;
}

const statusDescriptions = {
  draft: 'This transaction is in draft mode and has not been submitted for review.',
  pending_review: 'Contract sent for compliance review. A coordinator will review your submission.',
  active: 'This transaction is active and visible on the MLS.',
  pending: 'This transaction is awaiting compliance review by a Transaction Coordinator.',
  sold: 'This transaction has been sold and closed.',
  withdrawn: 'This transaction has been withdrawn from the market.',
};

interface EditableFields {
  listingPrice: string;
  originalListPrice: string;
  totalCommission: string;
  mlsNumber: string;
  listingExpiration: string;
  dealType: string;
  representing: string;
}

export function PropertyListingTab({ listing, isTransaction = false }: PropertyListingTabProps) {
  const { extraction, status, contractData } = listing;
  const { updateListing } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const originalListPrice = extraction.listingPrice * 1.05;
  const listingExpirationDate = extraction.listingEndDate 
    ? format(new Date(extraction.listingEndDate), 'MM/dd/yyyy') 
    : '06/15/2025';

  const [editValues, setEditValues] = useState<EditableFields>({
    listingPrice: extraction.listingPrice.toString(),
    originalListPrice: originalListPrice.toString(),
    totalCommission: extraction.totalCommission.toString(),
    mlsNumber: extraction.mlsNumber || '1234567',
    listingExpiration: listingExpirationDate,
    dealType: 'Sale',
    representing: 'Listing Side Representation',
  });

  const grossCommission = useMemo(() => {
    const price = parseFloat(editValues.listingPrice) || 0;
    const pct = parseFloat(editValues.totalCommission) || 0;
    return price * (pct / 100);
  }, [editValues.listingPrice, editValues.totalCommission]);

  const handleEdit = () => {
    setEditValues({
      listingPrice: extraction.listingPrice.toString(),
      originalListPrice: originalListPrice.toString(),
      totalCommission: extraction.totalCommission.toString(),
      mlsNumber: extraction.mlsNumber || '1234567',
      listingExpiration: listingExpirationDate,
      dealType: 'Sale',
      representing: 'Listing Side Representation',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const price = parseFloat(editValues.listingPrice);
    const commission = parseFloat(editValues.totalCommission);

    if (isNaN(price) || price <= 0) {
      toast({ title: 'Invalid price', description: 'Please enter a valid list price.', variant: 'destructive' });
      return;
    }
    if (isNaN(commission) || commission <= 0 || commission > 100) {
      toast({ title: 'Invalid commission', description: 'Commission must be between 0 and 100.', variant: 'destructive' });
      return;
    }

    updateListing(listing.id, {
      listingPrice: price,
      totalCommission: commission,
      mlsNumber: editValues.mlsNumber || undefined,
    });

    setIsEditing(false);
    toast({ title: 'Listing updated', description: 'Your changes have been saved.' });
  };

  const updateField = (field: keyof EditableFields, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const formatPriceOnBlur = (field: 'listingPrice' | 'originalListPrice') => {
    const num = parseFloat(editValues[field]);
    if (!isNaN(num)) {
      updateField(field, num.toString());
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
      case 'sold':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  const getComplianceDisplay = () => {
    if (status === 'pending' || status === 'pending_review') {
      return { status: 'under_review', label: 'Under Review', icon: 'clock', description: 'A Transaction Coordinator is reviewing this transaction for compliance.' };
    }
    if (extraction.complianceStatus === 'compliant') {
      return { status: 'compliant', label: 'All Clear', icon: 'success', description: 'All required documents have been verified and meet compliance standards.' };
    }
    return { status: 'needs_review', label: 'Review Needed', icon: 'warning', description: extraction.complianceNotes || 'Some items require attention before activation.' };
  };

  const complianceDisplay = getComplianceDisplay();
  const listingAgent = { name: 'Charles Anderson' };
  const mlsNumber = contractData?.mlsNumber || extraction.mlsNumber || '1234567';
  const cumulativeDaysOnMarket = 45;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'TBD';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'MMM d, yyyy');
  };

  // Transaction view
  if (isTransaction && contractData) {
    const buyerNames = contractData.buyers?.map(b => b.name).join(' & ') || 'John & Jane Smith';
    const cooperatingAgent = contractData.buyingAgentName || 'Sarah Mitchell';
    const cooperatingBrokerage = contractData.buyingBrokerName || 'Compass Real Estate';

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Transaction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Final Sales Price" value={formatCurrency(contractData.salesPrice)} highlight />
              <InfoRow label="Original List Price" value={formatCurrency(extraction.listingPrice)} />
              <InfoRow label="Gross Commission" value={formatCurrency(contractData.salesPrice * (extraction.totalCommission / 100))} />
              <InfoRow label="Commission %" value={`${extraction.totalCommission.toFixed(2)}%`} />
              <InfoRow label="Buyer(s)" value={buyerNames} />
              <InfoRow label="Seller(s)" value={extraction.sellers.map(s => s.name).join(' & ')} />
              <InfoRow label="Cooperating Agent" value={cooperatingAgent} />
              <InfoRow label="Listing Agent" value={listingAgent.name} />
              <InfoRow label="Earnest Money" value={formatCurrency(contractData.earnestMoney)} />
              <InfoRow label="Earnest Money Holder" value={contractData.escrowAgent || contractData.titleCompany || 'Title Company'} />
              <InfoRow label="Target Closing Date" value={formatDate(contractData.closingDate)} highlight />
              <InfoRow label="Possession" value={
                contractData.possessionType === 'at_closing' ? 'At Closing' :
                contractData.possessionType === 'temporary_lease' ? 'Temporary Lease' : 'At Closing'
              } />
              <InfoRow label="MLS #" value={mlsNumber} />
              <InfoRow label="Cumulative DOM" value={`${cumulativeDaysOnMarket} days`} />
            </div>
          </CardContent>
        </Card>

        <StatusCard status={status} statusDescriptions={statusDescriptions} complianceDisplay={complianceDisplay} getStatusIcon={getStatusIcon} />
      </div>
    );
  }

  // Standard listing view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Listing Information</CardTitle>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={handleEdit} className="gap-1.5 text-muted-foreground hover:text-foreground">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1.5 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left Column */}
            <div className="pr-0 md:pr-6 pb-6 md:pb-0 space-y-4">
              {isEditing ? (
                <EditableInfoRow label="List Price" value={editValues.listingPrice} onChange={v => updateField('listingPrice', v)} onBlur={() => formatPriceOnBlur('listingPrice')} prefix="$" type="number" />
              ) : (
                <InfoRow label="List Price" value={formatCurrency(extraction.listingPrice)} />
              )}
              {isEditing ? (
                <EditableInfoRow label="Original List Price" value={editValues.originalListPrice} onChange={v => updateField('originalListPrice', v)} onBlur={() => formatPriceOnBlur('originalListPrice')} prefix="$" type="number" />
              ) : (
                <InfoRow label="Original List Price" value={formatCurrency(originalListPrice)} />
              )}
              <InfoRow label="Gross Commission" value={formatCurrency(isEditing ? grossCommission : extraction.listingPrice * (extraction.totalCommission / 100))} />
              {isEditing ? (
                <EditableInfoRow label="Commission %" value={editValues.totalCommission} onChange={v => updateField('totalCommission', v)} suffix="%" type="number" />
              ) : (
                <InfoRow label="Gross Commission %" value={`${extraction.totalCommission.toFixed(2)}%`} />
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-medium gap-1',
                    status === 'active' && 'bg-success/10 text-success border-success/20'
                  )}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Right Column */}
            <div className="pl-0 md:pl-6 pt-6 md:pt-0 space-y-4">
              {isEditing ? (
                <EditableInfoRow label="Deal Type" value={editValues.dealType} onChange={v => updateField('dealType', v)} />
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Deal Type</span>
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-muted-foreground" />
                    Sale
                  </span>
                </div>
              )}
              <InfoRow label="Listing Agent" value={listingAgent.name} rightAlign />
              {isEditing ? (
                <EditableInfoRow label="Representing" value={editValues.representing} onChange={v => updateField('representing', v)} />
              ) : (
                <InfoRow label="Representing" value="Listing Side Representation" rightAlign />
              )}
              {isEditing ? (
                <EditableInfoRow label="MLS #" value={editValues.mlsNumber} onChange={v => updateField('mlsNumber', v)} />
              ) : (
                <InfoRow label="MLS #" value={mlsNumber} rightAlign />
              )}
              {isEditing ? (
                <EditableInfoRow label="Listing Expiration" value={editValues.listingExpiration} onChange={v => updateField('listingExpiration', v)} />
              ) : (
                <InfoRow label="Listing Expiration" value={listingExpirationDate} rightAlign />
              )}
              <InfoRow label="Cumulative DOM" value={`${cumulativeDaysOnMarket} days`} rightAlign />
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="justify-end gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>

      <StatusCard status={status} statusDescriptions={statusDescriptions} complianceDisplay={complianceDisplay} getStatusIcon={getStatusIcon} />
    </div>
  );
}

// --- Sub-components ---

interface InfoRowProps {
  label: string;
  value: string;
  rightAlign?: boolean;
  highlight?: boolean;
}

function InfoRow({ label, value, rightAlign, highlight }: InfoRowProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 items-start">
      <span className="text-sm text-muted-foreground leading-snug">{label}</span>
      <span
        className={cn(
          "text-sm font-medium text-foreground text-right leading-snug break-words",
          rightAlign && "text-right",
          highlight && "text-primary font-semibold"
        )}
      >
        {value}
      </span>
    </div>
  );
}

interface EditableInfoRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  prefix?: string;
  suffix?: string;
  type?: string;
}

function EditableInfoRow({ label, value, onChange, onBlur, prefix, suffix, type }: EditableInfoRowProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 items-center">
      <span className="text-sm text-muted-foreground leading-snug">{label}</span>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          type={type}
          className={cn("h-8 text-sm text-right", prefix && "pl-6", suffix && "pr-6")}
        />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

interface StatusCardProps {
  status: string;
  statusDescriptions: Record<string, string>;
  complianceDisplay: { status: string; label: string; icon: string; description: string };
  getStatusIcon: () => React.ReactNode;
}

function StatusCard({ status, statusDescriptions, complianceDisplay, getStatusIcon }: StatusCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {getStatusIcon()}
          </div>
          Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className={cn(
                'font-medium',
                status === 'pending_review' && 'bg-warning/10 text-warning border-warning/20',
                status === 'active' && 'bg-success/10 text-success border-success/20',
                status === 'draft' && 'bg-muted text-muted-foreground border-border',
                status === 'pending' && 'bg-warning/10 text-warning border-warning/20',
                status === 'sold' && 'bg-primary/10 text-primary border-primary/20',
                status === 'withdrawn' && 'bg-muted text-muted-foreground border-border'
              )}
            >
              {status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {statusDescriptions[status]}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            {complianceDisplay.icon === 'clock' ? (
              <Clock className="w-4 h-4 text-warning" />
            ) : (
              <Shield className={cn('w-4 h-4', complianceDisplay.status === 'compliant' ? 'text-success' : 'text-warning')} />
            )}
            <span className="font-medium text-foreground">
              Compliance: {complianceDisplay.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {complianceDisplay.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
