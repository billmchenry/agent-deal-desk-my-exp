import { useState, useEffect, useRef, useMemo } from 'react';
import { X, AlertTriangle, CheckCircle2, Pencil, Check, FileText, ClipboardList, Plus, Trash2, Info, DollarSign } from 'lucide-react';
import { ContractExtraction, Listing, ContractReferral, CommissionSplit, Agent } from '@/types';
import { getContractConfidenceLevel } from '@/lib/mockContractExtraction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { PDFViewer } from '@/components/listing/PDFViewer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';

interface ContractVerificationViewProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  extraction: ContractExtraction;
  onUpdate: (field: string, value: any) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
}

// Read-only field display component
function ReviewField({
  label,
  value,
  editing,
  type = 'text',
  options,
  onChange,
  confidence,
  placeholder = '—',
}: {
  label: string;
  value: string | number | undefined;
  editing: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'select' | 'percentage';
  options?: { value: string; label: string }[];
  onChange: (value: any) => void;
  confidence?: number;
  placeholder?: string;
}) {
  const confidenceLevel = confidence ? getContractConfidenceLevel(confidence) : 'high';
  const needsReview = confidenceLevel !== 'high';

  const formatDisplayValue = () => {
    if (value === undefined || value === null || value === '') return placeholder;
    
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    if (type === 'date' && value) {
      return new Date(value as string).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (type === 'select' && options) {
      const option = options.find(o => o.value === value);
      return option?.label || String(value);
    }
    return String(value);
  };

  if (!editing) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn(
          "text-sm font-medium text-foreground",
          needsReview && "text-warning"
        )}>
          {formatDisplayValue()}
        </p>
      </div>
    );
  }

  // Edit mode
  if (type === 'select' && options) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Select value={String(value || '')} onValueChange={onChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Input
        type={type === 'currency' || type === 'number' || type === 'percentage' ? 'number' : type}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(type === 'number' || type === 'currency' || type === 'percentage' ? Number(val) : val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-8 text-sm"
        step={type === 'percentage' ? '0.1' : undefined}
      />
    </div>
  );
}

// Section card component - Desktop version with timeline
function SectionCard({
  number,
  title,
  badge,
  badgeVariant = 'default',
  editing,
  onEdit,
  onSave,
  isActive,
  children,
  isMobile = false,
}: {
  number: number;
  title: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary';
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isActive: boolean;
  children: React.ReactNode;
  isMobile?: boolean;
}) {
  const badgeClasses = badgeVariant === 'secondary' 
    ? 'bg-muted text-muted-foreground' 
    : 'bg-primary/10 text-primary';
  if (isMobile) {
    return (
      <div className="border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              {badge && (
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", badgeClasses)}>
                  {badge}
                </span>
              )}
            </div>
            {editing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-8 px-3 text-xs text-primary hover:text-primary"
              >
                <Check className="w-3 h-3 mr-1" />
                Done
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 px-3 text-xs text-primary hover:text-primary"
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="pb-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {badge && (
              <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", badgeClasses)}>
                {badge}
              </span>
            )}
          </div>
          {editing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="h-7 px-2 text-xs text-primary hover:text-primary"
            >
              <Check className="w-3 h-3 mr-1" />
              Done
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-7 px-2 text-xs text-primary hover:text-primary"
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// Mobile section navigation pills
function MobileSectionNav({
  activeSection,
  onSelect,
}: {
  activeSection: number;
  onSelect: (section: number) => void;
}) {
  const sections = [
    { num: 1, label: 'Property' },
    { num: 2, label: 'Transaction' },
    { num: 3, label: 'Parties' },
    { num: 4, label: 'Agent' },
    { num: 5, label: 'Commissions' },
    { num: 6, label: 'Details' },
  ];

  return (
    <div className="flex justify-start gap-2 p-3 border-b border-border bg-background sticky top-0 z-10 overflow-x-auto">
      {sections.map(({ num, label }) => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            activeSection === num 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function ContractVerificationView({
  open,
  onClose,
  listing,
  extraction,
  onUpdate,
  onApprove,
  onSaveDraft,
}: ContractVerificationViewProps) {
  const isMobile = useIsMobile();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [showPdfOnMobile, setShowPdfOnMobile] = useState(false);
  const { currentAgent } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Count fields that need review (confidence < 85)
  const fieldsNeedingReview = Object.values(extraction.confidence).filter(
    (conf) => getContractConfidenceLevel(conf) !== 'high'
  ).length;

  const allFieldsVerified = fieldsNeedingReview === 0;

  // Commission calculations
  const commissionCalcs = useMemo(() => {
    const salesPrice = extraction.salesPrice || 0;
    const listingBrokerFee = extraction.listingBrokerFee || 0;
    const buyingBrokerFee = extraction.buyingBrokerFee || 0;
    
    // Calculate gross commission (agent's side only - listing side for now)
    const grossCommission = (salesPrice * listingBrokerFee) / 100;
    
    // Calculate referral deductions
    const referralTotal = (extraction.referrals || []).reduce((sum, r) => {
      return sum + (grossCommission * (r.percentage || 0)) / 100;
    }, 0);
    
    // Calculate team split deductions
    const teamSplitTotal = (extraction.coAgentSplits || []).reduce((sum, s) => {
      return sum + (grossCommission * (s.splitPercentage || 0)) / 100;
    }, 0);
    
    const netToAgent = grossCommission - referralTotal - teamSplitTotal;
    
    return {
      salesPrice,
      listingBrokerFee,
      buyingBrokerFee,
      grossCommission,
      referralTotal,
      teamSplitTotal,
      netToAgent,
    };
  }, [extraction.salesPrice, extraction.listingBrokerFee, extraction.buyingBrokerFee, extraction.referrals, extraction.coAgentSplits]);

  // Intersection Observer to track active section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const sectionNum = Number(entry.target.getAttribute('data-section'));
            if (sectionNum) setActiveSection(sectionNum);
          }
        });
      },
      {
        root: container,
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0.3],
      }
    );

    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [open, showPdfOnMobile]);

  const setSectionRef = (num: number) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(num, el);
    }
  };

  const scrollToSection = (sectionNum: number) => {
    const element = sectionRefs.current.get(sectionNum);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Shared section content renderer
  const renderSectionContent = () => (
    <>
      {/* Section 1: Property */}
      <div ref={setSectionRef(1)} data-section="1">
        <SectionCard
          number={1}
          title="Property"
          badge="Required"
          editing={editingSection === 'property'}
          onEdit={() => setEditingSection('property')}
          onSave={() => setEditingSection(null)}
          isActive={activeSection === 1}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Address"
              value={extraction.propertyAddress}
              editing={editingSection === 'property'}
              onChange={(v) => onUpdate('propertyAddress', v)}
              confidence={extraction.confidence.propertyAddress}
            />
            <ReviewField
              label="Legal Description"
              value={extraction.legalDescription}
              editing={editingSection === 'property'}
              onChange={(v) => onUpdate('legalDescription', v)}
              confidence={extraction.confidence.legalDescription}
            />
            <ReviewField
              label="Title Company"
              value={extraction.titleCompany}
              editing={editingSection === 'property'}
              onChange={(v) => onUpdate('titleCompany', v)}
              confidence={extraction.confidence.titleCompany}
            />
            <ReviewField
              label="Escrow Agent"
              value={extraction.escrowAgent}
              editing={editingSection === 'property'}
              onChange={(v) => onUpdate('escrowAgent', v)}
              confidence={extraction.confidence.escrowAgent}
            />
          </div>
          
          {/* MLS Number - Auto-filled from listing */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className={cn(
              "rounded-lg border-2 p-3",
              extraction.mlsNumber
                ? "border-green-100 bg-green-50/30 dark:border-green-900/50 dark:bg-green-950/20"
                : editingSection === 'property'
                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {extraction.mlsNumber ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">MLS Number (from listing)</p>
                  </>
                ) : (
                  <>
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">MLS Number</p>
                  </>
                )}
              </div>
              {editingSection === 'property' ? (
                <Input
                  placeholder="Enter MLS #"
                  value={extraction.mlsNumber || ''}
                  onChange={(e) => onUpdate('mlsNumber', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="h-8 text-sm bg-white dark:bg-background"
                />
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {extraction.mlsNumber || <span className="text-muted-foreground italic">Not provided</span>}
                </p>
              )}
            </div>
          </div>

          {/* Year Built - Auto-filled from public records */}
          <div className="mt-3">
            <div className={cn(
              "rounded-lg border-2 p-3",
              extraction.yearBuilt
                ? "border-green-100 bg-green-50/30 dark:border-green-900/50 dark:bg-green-950/20"
                : editingSection === 'property'
                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {extraction.yearBuilt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">Year Built (from public records)</p>
                  </>
                ) : (
                  <>
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Year Built</p>
                  </>
                )}
              </div>
              {editingSection === 'property' ? (
                <Input
                  placeholder="Enter year built"
                  type="number"
                  value={extraction.yearBuilt || ''}
                  onChange={(e) => onUpdate('yearBuilt', Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="h-8 text-sm bg-white dark:bg-background"
                />
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {extraction.yearBuilt || <span className="text-muted-foreground italic">Not available</span>}
                </p>
              )}
            </div>
          </div>

          {/* Escrow Officer Contact */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Escrow Officer Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ReviewField
                label="Name"
                value={extraction.escrowOfficerName}
                editing={editingSection === 'property'}
                onChange={(v) => onUpdate('escrowOfficerName', v)}
                confidence={extraction.confidence.escrowOfficerName}
              />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                {editingSection === 'property' ? (
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={extraction.escrowOfficerEmail || ''}
                    onChange={(e) => onUpdate('escrowOfficerEmail', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {extraction.escrowOfficerEmail || <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">Required</span>}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                {editingSection === 'property' ? (
                  <Input
                    type="tel"
                    placeholder="Enter phone"
                    value={extraction.escrowOfficerPhone || ''}
                    onChange={(e) => onUpdate('escrowOfficerPhone', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {extraction.escrowOfficerPhone || <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Optional</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {extraction.exclusions && extraction.exclusions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Exclusions</p>
              <p className="text-sm text-foreground">{extraction.exclusions.join(', ')}</p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Section 2: Transaction */}
      <div ref={setSectionRef(2)} data-section="2">
        <SectionCard
          number={2}
          title="Transaction"
          badge="Required"
          editing={editingSection === 'transaction'}
          onEdit={() => setEditingSection('transaction')}
          onSave={() => setEditingSection(null)}
          isActive={activeSection === 2}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Sale Price"
              value={extraction.salesPrice}
              editing={editingSection === 'transaction'}
              type="currency"
              onChange={(v) => onUpdate('salesPrice', v)}
              confidence={extraction.confidence.salesPrice}
            />
            <ReviewField
              label="Earnest Money"
              value={extraction.earnestMoney}
              editing={editingSection === 'transaction'}
              type="currency"
              onChange={(v) => onUpdate('earnestMoney', v)}
              confidence={extraction.confidence.earnestMoney}
            />
            <ReviewField
              label="Option Fee"
              value={extraction.optionFee}
              editing={editingSection === 'transaction'}
              type="currency"
              onChange={(v) => onUpdate('optionFee', v)}
              confidence={extraction.confidence.optionFee}
            />
            <ReviewField
              label="Option Period"
              value={extraction.optionPeriodDays ? `${extraction.optionPeriodDays} days` : undefined}
              editing={editingSection === 'transaction'}
              type="number"
              onChange={(v) => onUpdate('optionPeriodDays', v)}
              confidence={extraction.confidence.optionPeriodDays}
            />
            <ReviewField
              label="Acceptance Date"
              value={extraction.effectiveDate ? new Date(extraction.effectiveDate).toISOString().split('T')[0] : undefined}
              editing={editingSection === 'transaction'}
              type="date"
              onChange={(v) => onUpdate('effectiveDate', new Date(v))}
              confidence={extraction.confidence.effectiveDate}
            />
            <ReviewField
              label="Closing Date"
              value={extraction.closingDate ? new Date(extraction.closingDate).toISOString().split('T')[0] : undefined}
              editing={editingSection === 'transaction'}
              type="date"
              onChange={(v) => onUpdate('closingDate', new Date(v))}
              confidence={extraction.confidence.closingDate}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Cash Portion"
              value={extraction.cashPortion}
              editing={editingSection === 'transaction'}
              type="currency"
              onChange={(v) => onUpdate('cashPortion', v)}
              confidence={extraction.confidence.cashPortion}
            />
            <ReviewField
              label="Financing"
              value={extraction.financing}
              editing={editingSection === 'transaction'}
              type="currency"
              onChange={(v) => onUpdate('financing', v)}
              confidence={extraction.confidence.financing}
            />
            <ReviewField
              label="Seller Concessions"
              value={extraction.sellerConcessions}
              editing={editingSection === 'transaction'}
              type="currency"
              onChange={(v) => onUpdate('sellerConcessions', v)}
              confidence={extraction.confidence.sellerConcessions}
            />
            <ReviewField
              label="Possession"
              value={extraction.possessionType}
              editing={editingSection === 'transaction'}
              type="select"
              options={[
                { value: 'at_closing', label: 'Upon closing and funding' },
                { value: 'temporary_lease', label: 'Temporary residential lease' },
              ]}
              onChange={(v) => onUpdate('possessionType', v)}
              confidence={extraction.confidence.possessionType}
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 3: Parties */}
      <div ref={setSectionRef(3)} data-section="3">
        <SectionCard
          number={3}
          title="Parties"
          badge="Required"
          editing={editingSection === 'parties'}
          onEdit={() => setEditingSection('parties')}
          onSave={() => setEditingSection(null)}
          isActive={activeSection === 3}
          isMobile={isMobile}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Seller(s)</p>
              {editingSection === 'parties' ? (
                <Input
                  value={extraction.sellers?.map(s => s.name).join(', ') || ''}
                  onChange={(e) => onUpdate('sellers', [{ name: e.target.value, role: 'seller' }])}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {extraction.sellers?.map(s => s.name).join(', ') || '—'}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Buyer(s)</p>
              {editingSection === 'parties' ? (
                <div className="space-y-2">
                  <Input
                    value={extraction.buyers?.map(b => b.name).join(', ') || ''}
                    onChange={(e) => onUpdate('buyers', [{ name: e.target.value, role: 'buyer' }])}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="h-8 text-sm"
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={extraction.buyers?.[0]?.email || ''}
                      onChange={(e) => onUpdate('buyers', [{ ...extraction.buyers?.[0], email: e.target.value }])}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="h-8 text-sm"
                      placeholder="Email"
                    />
                    <Input
                      value={extraction.buyers?.[0]?.phone || ''}
                      onChange={(e) => onUpdate('buyers', [{ ...extraction.buyers?.[0], phone: e.target.value }])}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="h-8 text-sm"
                      placeholder="Phone"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {extraction.buyers?.map(b => b.name).join(', ') || '—'}
                  </p>
                  {extraction.buyers?.[0]?.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {extraction.buyers[0].email} · {extraction.buyers[0].phone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Section 4: Agent & Brokerage */}
      <div ref={setSectionRef(4)} data-section="4">
        <SectionCard
          number={4}
          title="Agent & Brokerage"
          badge="Required"
          editing={editingSection === 'agent'}
          onEdit={() => setEditingSection('agent')}
          onSave={() => setEditingSection(null)}
          isActive={activeSection === 4}
          isMobile={isMobile}
        >
          <div className="space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Listing Side</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <ReviewField
                label="Broker"
                value={extraction.listingBrokerName}
                editing={editingSection === 'agent'}
                onChange={(v) => onUpdate('listingBrokerName', v)}
                confidence={extraction.confidence.listingBrokerName}
              />
              <ReviewField
                label="Agent"
                value={extraction.listingAgentName}
                editing={editingSection === 'agent'}
                onChange={(v) => onUpdate('listingAgentName', v)}
                confidence={extraction.confidence.listingAgentName}
              />
              <ReviewField
                label="Broker License"
                value={extraction.listingBrokerLicense}
                editing={editingSection === 'agent'}
                onChange={(v) => onUpdate('listingBrokerLicense', v)}
              />
              <ReviewField
                label="Commission"
                value={extraction.listingBrokerFee}
                editing={editingSection === 'agent'}
                type="percentage"
                onChange={(v) => onUpdate('listingBrokerFee', v)}
                confidence={extraction.confidence.listingBrokerFee}
              />
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Buying Side</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ReviewField
                  label="Broker"
                  value={extraction.buyingBrokerName}
                  editing={editingSection === 'agent'}
                  onChange={(v) => onUpdate('buyingBrokerName', v)}
                  confidence={extraction.confidence.buyingBrokerName}
                />
                <ReviewField
                  label="Agent"
                  value={extraction.buyingAgentName}
                  editing={editingSection === 'agent'}
                  onChange={(v) => onUpdate('buyingAgentName', v)}
                  confidence={extraction.confidence.buyingAgentName}
                />
                <ReviewField
                  label="Broker License"
                  value={extraction.buyingBrokerLicense}
                  editing={editingSection === 'agent'}
                  onChange={(v) => onUpdate('buyingBrokerLicense', v)}
                />
                <ReviewField
                  label="Commission"
                  value={extraction.buyingBrokerFee}
                  editing={editingSection === 'agent'}
                  type="percentage"
                  onChange={(v) => onUpdate('buyingBrokerFee', v)}
                  confidence={extraction.confidence.buyingBrokerFee}
                />
              </div>
            </div>

            {/* Representation Type - Optional Blue Highlighted */}
            <div className="border-t border-border pt-4">
              <div className={cn(
                "rounded-lg border-2 p-3",
                editingSection === 'agent'
                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Representation Type</p>
                </div>
                {editingSection === 'agent' ? (
                  <RadioGroup
                    value={extraction.representationType || ''}
                    onValueChange={(value) => onUpdate('representationType', value)}
                    className="flex gap-2"
                  >
                    <label
                      htmlFor="seller_agency_inline"
                      className={cn(
                        "flex-1 flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors bg-white dark:bg-background text-sm",
                        extraction.representationType === 'seller_agency'
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value="seller_agency" id="seller_agency_inline" />
                      <span>Seller Only</span>
                    </label>
                    <label
                      htmlFor="dual_intermediary_inline"
                      className={cn(
                        "flex-1 flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors bg-white dark:bg-background text-sm",
                        extraction.representationType === 'dual_intermediary'
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value="dual_intermediary" id="dual_intermediary_inline" />
                      <span>Dual / Intermediary</span>
                    </label>
                  </RadioGroup>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {extraction.representationType === 'seller_agency' 
                      ? 'Seller Only' 
                      : extraction.representationType === 'dual_intermediary' 
                        ? 'Dual / Intermediary' 
                        : <span className="text-muted-foreground italic">Not specified</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Source of Business - Agent Input Required */}
            <div className="border-t border-border pt-4 mt-4">
              <div className={cn(
                "rounded-lg border-2 p-3",
                editingSection === 'agent'
                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Source of Business</p>
                </div>
                {editingSection === 'agent' ? (
                  <Select 
                    value={extraction.transactionLeadSource || ''} 
                    onValueChange={(value) => onUpdate('transactionLeadSource', value)}
                  >
                    <SelectTrigger className="h-8 text-sm bg-white dark:bg-background">
                      <SelectValue placeholder="Select source..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sphere">Sphere of Influence</SelectItem>
                      <SelectItem value="past_client">Past Client</SelectItem>
                      <SelectItem value="sign_call">Sign Call</SelectItem>
                      <SelectItem value="open_house">Open House</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="opcity">OpCity</SelectItem>
                      <SelectItem value="zillow">Zillow Flex</SelectItem>
                      <SelectItem value="realtor">Realtor.com</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {extraction.transactionLeadSource ? (
                      {
                        'sphere': 'Sphere of Influence',
                        'past_client': 'Past Client',
                        'sign_call': 'Sign Call',
                        'open_house': 'Open House',
                        'referral': 'Referral',
                        'opcity': 'OpCity',
                        'zillow': 'Zillow Flex',
                        'realtor': 'Realtor.com',
                        'social_media': 'Social Media',
                        'other': 'Other',
                      }[extraction.transactionLeadSource] || extraction.transactionLeadSource
                    ) : (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Section 5: Commissions */}
      <div ref={setSectionRef(5)} data-section="5">
        <SectionCard
          number={5}
          title="Commissions"
          badge="Required"
          editing={editingSection === 'commissions'}
          onEdit={() => setEditingSection('commissions')}
          onSave={() => setEditingSection(null)}
          isActive={activeSection === 5}
          isMobile={isMobile}
        >
          <div className="space-y-4">
            {/* Base Commission Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <ReviewField
                label="Listing Broker Fee"
                value={extraction.listingBrokerFee}
                editing={editingSection === 'commissions'}
                type="percentage"
                onChange={(v) => onUpdate('listingBrokerFee', v)}
                confidence={extraction.confidence.listingBrokerFee}
              />
              <ReviewField
                label="Buying Broker Fee"
                value={extraction.buyingBrokerFee}
                editing={editingSection === 'commissions'}
                type="percentage"
                onChange={(v) => onUpdate('buyingBrokerFee', v)}
                confidence={extraction.confidence.buyingBrokerFee}
              />
            </div>

            {/* Referral Fees - Optional Blue Highlighted */}
            <div className="border-t border-border pt-4">
              <div className={cn(
                "rounded-lg border-2 p-3",
                editingSection === 'commissions'
                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Referral Fee?</p>
                  </div>
                  {editingSection === 'commissions' && (
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant={(extraction.referrals && extraction.referrals.length > 0) ? "default" : "outline"}
                        onClick={() => {
                          if (!extraction.referrals || extraction.referrals.length === 0) {
                            onUpdate('referrals', [{ agentName: '', brokerage: '', percentage: 25 }]);
                          }
                        }}
                        className="h-6 px-2 text-xs"
                        size="sm"
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={(!extraction.referrals || extraction.referrals.length === 0) ? "default" : "outline"}
                        onClick={() => onUpdate('referrals', [])}
                        className="h-6 px-2 text-xs"
                        size="sm"
                      >
                        No
                      </Button>
                    </div>
                  )}
                </div>

                {editingSection === 'commissions' ? (
                  extraction.referrals && extraction.referrals.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {extraction.referrals.map((referral, index) => (
                        <div key={index} className="p-2 rounded border border-border bg-white dark:bg-background space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Referral {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = extraction.referrals?.filter((_, i) => i !== index) || [];
                                onUpdate('referrals', updated);
                              }}
                              className="h-5 px-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              placeholder="Agent"
                              value={referral.agentName}
                              onChange={(e) => {
                                const updated = [...(extraction.referrals || [])];
                                updated[index] = { ...updated[index], agentName: e.target.value };
                                onUpdate('referrals', updated);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="h-7 text-xs"
                            />
                            <Input
                              placeholder="Brokerage"
                              value={referral.brokerage}
                              onChange={(e) => {
                                const updated = [...(extraction.referrals || [])];
                                updated[index] = { ...updated[index], brokerage: e.target.value };
                                onUpdate('referrals', updated);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="h-7 text-xs"
                            />
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="25"
                                value={referral.percentage || ''}
                                onChange={(e) => {
                                  const updated = [...(extraction.referrals || [])];
                                  updated[index] = { ...updated[index], percentage: Number(e.target.value) };
                                  onUpdate('referrals', updated);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                className="h-7 text-xs pr-6"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...(extraction.referrals || []), { agentName: '', brokerage: '', percentage: 25 }];
                          onUpdate('referrals', updated);
                        }}
                        className="w-full h-6 text-xs text-blue-600"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Referral
                      </Button>
                    </div>
                  )
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {extraction.referrals && extraction.referrals.length > 0 
                      ? extraction.referrals.map(r => `${r.agentName || 'Agent'} (${r.percentage}%)`).join(', ')
                      : <span className="text-muted-foreground italic">No referrals</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Team Splits - Optional Blue Highlighted */}
            <div className="border-t border-border pt-4">
              <div className={cn(
                "rounded-lg border-2 p-3",
                editingSection === 'commissions'
                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-blue-100 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Team Split?</p>
                  </div>
                  {editingSection === 'commissions' && (
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant={extraction.hasCoAgentSplit ? "default" : "outline"}
                        onClick={() => {
                          if (!extraction.hasCoAgentSplit) {
                            onUpdate('hasCoAgentSplit', true);
                            onUpdate('coAgentSplits', [{ agentName: '', splitPercentage: 50, splitType: 'equal' as const }]);
                          }
                        }}
                        className="h-6 px-2 text-xs"
                        size="sm"
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={!extraction.hasCoAgentSplit ? "default" : "outline"}
                        onClick={() => {
                          onUpdate('hasCoAgentSplit', false);
                          onUpdate('coAgentSplits', []);
                        }}
                        className="h-6 px-2 text-xs"
                        size="sm"
                      >
                        No
                      </Button>
                    </div>
                  )}
                </div>

                {editingSection === 'commissions' ? (
                  extraction.hasCoAgentSplit && extraction.coAgentSplits && extraction.coAgentSplits.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {extraction.coAgentSplits.map((split, index) => (
                        <div key={index} className="p-2 rounded border border-border bg-white dark:bg-background space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Split {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = extraction.coAgentSplits?.filter((_, i) => i !== index) || [];
                                onUpdate('coAgentSplits', updated);
                                if (updated.length === 0) {
                                  onUpdate('hasCoAgentSplit', false);
                                }
                              }}
                              className="h-5 px-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              placeholder="Team member"
                              value={split.agentName}
                              onChange={(e) => {
                                const updated = [...(extraction.coAgentSplits || [])];
                                updated[index] = { ...updated[index], agentName: e.target.value };
                                onUpdate('coAgentSplits', updated);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="h-7 text-xs"
                            />
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="50"
                                value={split.splitPercentage || ''}
                                onChange={(e) => {
                                  const updated = [...(extraction.coAgentSplits || [])];
                                  updated[index] = { ...updated[index], splitPercentage: Number(e.target.value) };
                                  onUpdate('coAgentSplits', updated);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                className="h-7 text-xs pr-6"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                            </div>
                            <Select
                              value={split.splitType || 'equal'}
                              onValueChange={(value) => {
                                const updated = [...(extraction.coAgentSplits || [])];
                                updated[index] = { ...updated[index], splitType: value as CommissionSplit['splitType'] };
                                onUpdate('coAgentSplits', updated);
                              }}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equal">50/50</SelectItem>
                                <SelectItem value="lead_support">Lead/Support</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...(extraction.coAgentSplits || []), { agentName: '', splitPercentage: 50, splitType: 'equal' as const }];
                          onUpdate('coAgentSplits', updated);
                        }}
                        className="w-full h-6 text-xs text-blue-600"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Split
                      </Button>
                    </div>
                  )
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {extraction.hasCoAgentSplit && extraction.coAgentSplits && extraction.coAgentSplits.length > 0
                      ? extraction.coAgentSplits.map(s => `${s.agentName || 'Team member'} (${s.splitPercentage}%)`).join(', ')
                      : <span className="text-muted-foreground italic">No team splits</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Commission Summary */}
            <div className="border-t border-border pt-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Commission Summary</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Gross Commission ({commissionCalcs.listingBrokerFee}% of {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(commissionCalcs.salesPrice)})
                    </span>
                    <span className="font-medium text-foreground">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(commissionCalcs.grossCommission)}
                    </span>
                  </div>
                  
                  {commissionCalcs.referralTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Less Referral{(extraction.referrals?.length || 0) > 1 ? 's' : ''} ({extraction.referrals?.map(r => `${r.agentName || 'Agent'} ${r.percentage}%`).join(', ')})
                      </span>
                      <span className="font-medium text-destructive">
                        -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(commissionCalcs.referralTotal)}
                      </span>
                    </div>
                  )}
                  
                  {commissionCalcs.teamSplitTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Less Team Split{(extraction.coAgentSplits?.length || 0) > 1 ? 's' : ''} ({extraction.coAgentSplits?.map(s => `${s.agentName || 'Team'} ${s.splitPercentage}%`).join(', ')})
                      </span>
                      <span className="font-medium text-destructive">
                        -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(commissionCalcs.teamSplitTotal)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">Net to You</span>
                      <span className="font-bold text-lg text-primary">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(commissionCalcs.netToAgent)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Section 6: Additional Details */}
      <div ref={setSectionRef(6)} data-section="6">
        <SectionCard
          number={6}
          title="Additional Details"
          badge="Optional"
          badgeVariant="secondary"
          editing={editingSection === 'additional'}
          onEdit={() => setEditingSection('additional')}
          onSave={() => setEditingSection(null)}
          isActive={activeSection === 6}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Survey"
              value={extraction.surveyType}
              editing={editingSection === 'additional'}
              type="select"
              options={[
                { value: 'existing', label: 'Existing survey' },
                { value: 'new', label: 'New survey required' },
                { value: 'waived', label: 'Survey waived' },
              ]}
              onChange={(v) => onUpdate('surveyType', v)}
              confidence={extraction.confidence.surveyType}
            />
            <ReviewField
              label="HOA"
              value={extraction.hoaMembership}
              editing={editingSection === 'additional'}
              type="select"
              options={[
                { value: 'yes', label: 'Yes - Mandatory' },
                { value: 'no', label: 'No' },
                { value: 'unknown', label: 'Unknown' },
              ]}
              onChange={(v) => onUpdate('hoaMembership', v)}
              confidence={extraction.confidence.hoaMembership}
            />
            <ReviewField
              label="Seller Disclosure"
              value={extraction.sellersDisclosureStatus}
              editing={editingSection === 'additional'}
              type="select"
              options={[
                { value: 'attached', label: 'Attached' },
                { value: 'to_be_delivered', label: 'To be delivered' },
                { value: 'waived', label: 'Waived' },
              ]}
              onChange={(v) => onUpdate('sellersDisclosureStatus', v)}
              confidence={extraction.confidence.sellersDisclosureStatus}
            />
            <ReviewField
              label="Lead Paint Disclosure"
              value={extraction.leadBasedPaintDisclosure ? 'Yes' : 'No'}
              editing={editingSection === 'additional'}
              type="select"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
              onChange={(v) => onUpdate('leadBasedPaintDisclosure', v === 'true')}
            />
          </div>
          
          {(extraction.specialProvisions || editingSection === 'additional') && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Special Provisions</p>
              {editingSection === 'additional' ? (
                <textarea
                  value={extraction.specialProvisions || ''}
                  onChange={(e) => onUpdate('specialProvisions', e.target.value)}
                  className="w-full h-20 text-sm border border-border rounded-md p-2 bg-background text-foreground resize-none"
                />
              ) : (
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {extraction.specialProvisions || '—'}
                </p>
              )}
            </div>
          )}

        </SectionCard>
      </div>
    </>
  );

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[95vw] lg:max-w-[85vw] p-0 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">Contract Verification</h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {extraction.propertyAddress || listing.extraction.propertyAddress}
            </p>
          </div>
          {/* Mobile PDF toggle button */}
          {isMobile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPdfOnMobile(!showPdfOnMobile)}
              className="h-8 px-3 text-xs"
            >
              {showPdfOnMobile ? (
                <>
                  <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                  Form
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  PDF
                </>
              )}
            </Button>
          )}
        </div>

        {/* Main Content - Mobile vs Desktop */}
        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            // Mobile Layout
            <div className="flex flex-col h-full">
              {showPdfOnMobile ? (
                // Full-screen PDF on mobile
                <div className="flex-1 p-4">
                  <PDFViewer fileName={extraction.documentName || 'Contract.pdf'} documentType="contract" />
                </div>
              ) : (
                // Form view on mobile
                <>
                  <MobileSectionNav 
                    activeSection={activeSection} 
                    onSelect={scrollToSection} 
                  />
                  <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-auto"
                  >
                    {renderSectionContent()}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Desktop Layout with ResizablePanelGroup
            <ResizablePanelGroup direction="horizontal">
              {/* Left Pane - PDF Viewer */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4">
                  <PDFViewer fileName={extraction.documentName || 'Contract.pdf'} documentType="contract" />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Right Pane - Review Cards */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div 
                  ref={scrollContainerRef}
                  className="h-full overflow-auto p-6"
                >
                  {renderSectionContent()}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            {allFieldsVerified ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">
                  All fields verified
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-warning">
                  {fieldsNeedingReview} field{fieldsNeedingReview !== 1 ? 's' : ''} need{fieldsNeedingReview === 1 ? 's' : ''} review
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onSaveDraft} className="flex-1 sm:flex-none h-10">
              Save as Draft
            </Button>
            <Button onClick={onApprove} className="gradient-primary flex-1 sm:flex-none h-10">
              Create Transaction
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
