import { useState } from 'react';
import { AlertTriangle, Check, Users, DollarSign, Building2, Calendar } from 'lucide-react';
import { ListingExtraction } from '@/types';
import { formatCurrency, formatDate, getConfidenceLevel } from '@/lib/mockDocumentExtraction';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ExtractionTableProps {
  extraction: ListingExtraction;
  onUpdate: (field: string, value: any) => void;
}

export function ExtractionTable({ extraction, onUpdate }: ExtractionTableProps) {
  const [activeSection, setActiveSection] = useState<string>('parties');

  const getConfidenceStyles = (field: string) => {
    const conf = extraction.confidence[field];
    if (!conf) return '';
    const level = getConfidenceLevel(conf);
    if (level === 'low') return 'border-destructive/50 bg-destructive/5';
    if (level === 'medium') return 'border-warning/50 bg-warning/5';
    return '';
  };

  const sections = [
    { id: 'parties', label: 'Parties', icon: Users },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'logistics', label: 'Logistics', icon: Building2 },
    { id: 'dates', label: 'Dates', icon: Calendar },
  ];

  return (
    <div className="space-y-4">
      {/* Property Reference */}
      <div className="p-3 bg-secondary/50 rounded-lg">
        <p className="text-xs text-muted-foreground">Property</p>
        <p className="font-medium text-foreground">{extraction.propertyAddress}</p>
        <p className="text-sm text-muted-foreground">
          {extraction.city}, {extraction.state} {extraction.zipCode}
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Parties Section */}
      {activeSection === 'parties' && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Seller Information
          </h3>
          
          {extraction.sellers.map((seller, index) => (
            <div key={index} className="space-y-3">
              <div className={cn("space-y-2", getConfidenceStyles('sellerName'))}>
                <Label>Seller Name</Label>
                <Input
                  value={seller.name}
                  onChange={(e) => {
                    const updatedSellers = [...extraction.sellers];
                    updatedSellers[index] = { ...seller, name: e.target.value };
                    onUpdate('sellers', updatedSellers);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className={cn("space-y-2", getConfidenceStyles('sellerEmail'))}>
                  <Label>Email</Label>
                  <Input
                    value={seller.email || ''}
                    onChange={(e) => {
                      const updatedSellers = [...extraction.sellers];
                      updatedSellers[index] = { ...seller, email: e.target.value };
                      onUpdate('sellers', updatedSellers);
                    }}
                  />
                </div>
                <div className={cn("space-y-2", getConfidenceStyles('sellerPhone'))}>
                  <Label>Phone</Label>
                  <Input
                    value={seller.phone || ''}
                    onChange={(e) => {
                      const updatedSellers = [...extraction.sellers];
                      updatedSellers[index] = { ...seller, phone: e.target.value };
                      onUpdate('sellers', updatedSellers);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financials Section */}
      {activeSection === 'financials' && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Financial Terms
          </h3>
          
          <div className="space-y-3">
            <div className={cn("space-y-2", getConfidenceStyles('listingPrice'))}>
              <Label>Listing Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={extraction.listingPrice}
                  onChange={(e) => onUpdate('listingPrice', Number(e.target.value))}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={cn("space-y-2", getConfidenceStyles('totalCommission'))}>
                <Label>Total Commission (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={extraction.totalCommission}
                  onChange={(e) => onUpdate('totalCommission', Number(e.target.value))}
                />
              </div>
              {extraction.buyerBrokerSplit !== undefined && (
                <div className={cn("space-y-2", getConfidenceStyles('buyerBrokerSplit'))}>
                  <Label>Buyer Broker Split (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={extraction.buyerBrokerSplit}
                    onChange={(e) => onUpdate('buyerBrokerSplit', Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logistics Section */}
      {activeSection === 'logistics' && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Property Details
          </h3>
          
          <div className="space-y-3">
            <div className={cn("space-y-2", getConfidenceStyles('hoaStatus'))}>
              <Label>HOA Status</Label>
              <Input
                value={extraction.hoaStatus === 'yes' ? 'Yes' : extraction.hoaStatus === 'no' ? 'No' : 'Unknown'}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  onUpdate('hoaStatus', val === 'yes' ? 'yes' : val === 'no' ? 'no' : 'unknown');
                }}
              />
            </div>

            <div className={cn("space-y-2", getConfidenceStyles('keyboxAuthorized'))}>
              <Label>Keybox Authorized</Label>
              <Input
                value={extraction.keyboxAuthorized ? 'Yes' : 'No'}
                onChange={(e) => onUpdate('keyboxAuthorized', e.target.value.toLowerCase() === 'yes')}
              />
            </div>

            {extraction.exclusions && extraction.exclusions.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Exclusions
                </h4>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <ul className="text-sm space-y-1">
                    {extraction.exclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dates Section */}
      {activeSection === 'dates' && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Key Dates
          </h3>
          
          <div className="space-y-3">
            <div className={cn("space-y-2", getConfidenceStyles('listingStartDate'))}>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={new Date(extraction.listingStartDate).toISOString().split('T')[0]}
                onChange={(e) => onUpdate('listingStartDate', new Date(e.target.value))}
              />
            </div>

            <div className={cn("space-y-2", getConfidenceStyles('listingEndDate'))}>
              <Label>End Date</Label>
              <Input
                type="date"
                value={new Date(extraction.listingEndDate).toISOString().split('T')[0]}
                onChange={(e) => onUpdate('listingEndDate', new Date(e.target.value))}
              />
            </div>

            {extraction.protectionPeriodDays !== undefined && (
              <div className={cn("space-y-2", getConfidenceStyles('protectionPeriodDays'))}>
                <Label>Protection Period (days)</Label>
                <Input
                  type="number"
                  value={extraction.protectionPeriodDays}
                  onChange={(e) => onUpdate('protectionPeriodDays', Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
