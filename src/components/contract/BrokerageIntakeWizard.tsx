import { useState, useCallback } from 'react';
import { X, User, Users, DollarSign, Handshake, Plus, Trash2, ChevronRight, Check } from 'lucide-react';
import { ContractExtraction, ContractReferral, CommissionSplit, Agent } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';

interface BrokerageIntakeWizardProps {
  open: boolean;
  onClose: () => void;
  extraction: ContractExtraction;
  onUpdate: (field: string, value: any) => void;
  onComplete: () => void;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i < currentStep ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

// Step 1: Buyer Contact
function BuyerContactStep({
  extraction,
  onUpdate,
}: {
  extraction: ContractExtraction;
  onUpdate: (field: string, value: any) => void;
}) {
  const buyerPhone = extraction.buyers?.[0]?.phone || '';
  const buyerEmail = extraction.buyers?.[0]?.email || '';

  const updateBuyer = (field: 'phone' | 'email', value: string) => {
    const buyers = [...(extraction.buyers || [])];
    if (buyers.length === 0) {
      buyers.push({ name: 'Buyer', role: 'buyer' });
    }
    buyers[0] = { ...buyers[0], [field]: value };
    onUpdate('buyers', buyers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Buyer Contact</h3>
          <p className="text-sm text-muted-foreground">
            {extraction.buyers?.[0]?.name || 'Primary buyer'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="buyerPhone">Phone Number</Label>
          <Input
            id="buyerPhone"
            type="tel"
            placeholder="(555) 123-4567"
            value={buyerPhone}
            onChange={(e) => updateBuyer('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buyerEmail">Email Address</Label>
          <Input
            id="buyerEmail"
            type="email"
            placeholder="buyer@email.com"
            value={buyerEmail}
            onChange={(e) => updateBuyer('email', e.target.value)}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        At least one contact method is required
      </p>
    </div>
  );
}

// Step 2: Representation Type
function RepresentationStep({
  extraction,
  onUpdate,
}: {
  extraction: ContractExtraction;
  onUpdate: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Handshake className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Representation</h3>
          <p className="text-sm text-muted-foreground">
            How are you representing this transaction?
          </p>
        </div>
      </div>

      <RadioGroup
        value={extraction.representationType || ''}
        onValueChange={(value) => onUpdate('representationType', value)}
        className="space-y-3"
      >
        <label
          htmlFor="seller_agency"
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
            extraction.representationType === 'seller_agency'
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <RadioGroupItem value="seller_agency" id="seller_agency" className="mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Seller Agency Only</p>
            <p className="text-sm text-muted-foreground">
              You represent the seller; buyer has separate representation
            </p>
          </div>
        </label>

        <label
          htmlFor="dual_intermediary"
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
            extraction.representationType === 'dual_intermediary'
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <RadioGroupItem value="dual_intermediary" id="dual_intermediary" className="mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Dual Representation / Intermediary</p>
            <p className="text-sm text-muted-foreground">
              You represent both parties in this transaction
            </p>
          </div>
        </label>
      </RadioGroup>
    </div>
  );
}

// Step 3: Referrals
function ReferralsStep({
  extraction,
  onUpdate,
}: {
  extraction: ContractExtraction;
  onUpdate: (field: string, value: any) => void;
}) {
  const referrals = extraction.referrals || [];
  const hasReferrals = referrals.length > 0;

  const addReferral = () => {
    onUpdate('referrals', [...referrals, { agentName: '', brokerage: '', percentage: 25 }]);
  };

  const removeReferral = (index: number) => {
    onUpdate('referrals', referrals.filter((_, i) => i !== index));
  };

  const updateReferral = (index: number, field: keyof ContractReferral, value: any) => {
    const updated = [...referrals];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate('referrals', updated);
  };

  const leadSourceOptions = [
    { value: 'opcity', label: 'OpCity' },
    { value: 'zillow', label: 'Zillow Flex' },
    { value: 'realtor', label: 'Realtor.com' },
    { value: 'agent', label: 'Agent Referral' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Referral Fees</h3>
          <p className="text-sm text-muted-foreground">
            Do you owe a referral fee on this transaction?
          </p>
        </div>
      </div>

      {/* Yes/No Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={hasReferrals ? "default" : "outline"}
          onClick={addReferral}
          className="flex-1"
          disabled={hasReferrals}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant={!hasReferrals ? "default" : "outline"}
          onClick={() => onUpdate('referrals', [])}
          className="flex-1"
        >
          No
        </Button>
      </div>

      {/* Referral Entries */}
      {hasReferrals && (
        <div className="space-y-3 pt-2">
          {referrals.map((referral, index) => (
            <div key={index} className="p-3 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Referral {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReferral(index)}
                  className="h-7 px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Agent name"
                  value={referral.agentName}
                  onChange={(e) => updateReferral(index, 'agentName', e.target.value)}
                />
                <Input
                  placeholder="Brokerage"
                  value={referral.brokerage}
                  onChange={(e) => updateReferral(index, 'brokerage', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="25"
                    value={referral.percentage || ''}
                    onChange={(e) => updateReferral(index, 'percentage', Number(e.target.value))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
                <Select
                  value={referral.leadSource || ''}
                  onValueChange={(value) => updateReferral(index, 'leadSource', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSourceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addReferral}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Referral
          </Button>
        </div>
      )}
    </div>
  );
}

// Step 4: Commission Splits
function CommissionSplitsStep({
  extraction,
  onUpdate,
  teamAgents,
}: {
  extraction: ContractExtraction;
  onUpdate: (field: string, value: any) => void;
  teamAgents: Agent[];
}) {
  const splits = extraction.coAgentSplits || [];
  const hasSplits = extraction.hasCoAgentSplit || splits.length > 0;

  const addSplit = () => {
    const newSplits = [...splits, { agentName: '', splitPercentage: 50, splitType: 'equal' as const }];
    onUpdate('coAgentSplits', newSplits);
    onUpdate('hasCoAgentSplit', true);
  };

  const removeSplit = (index: number) => {
    const newSplits = splits.filter((_, i) => i !== index);
    onUpdate('coAgentSplits', newSplits);
    if (newSplits.length === 0) {
      onUpdate('hasCoAgentSplit', false);
    }
  };

  const updateSplit = (index: number, field: keyof CommissionSplit, value: any) => {
    const updated = [...splits];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate('coAgentSplits', updated);
  };

  const setNoSplits = () => {
    onUpdate('coAgentSplits', []);
    onUpdate('hasCoAgentSplit', false);
  };

  const splitTypeOptions = [
    { value: 'equal', label: '50/50 Split' },
    { value: 'lead_support', label: 'Lead/Support' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Commission Splits</h3>
          <p className="text-sm text-muted-foreground">
            Are you splitting with a team member?
          </p>
        </div>
      </div>

      {/* Yes/No Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={hasSplits ? "default" : "outline"}
          onClick={addSplit}
          className="flex-1"
          disabled={hasSplits}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant={!hasSplits ? "default" : "outline"}
          onClick={setNoSplits}
          className="flex-1"
        >
          No
        </Button>
      </div>

      {/* Split Entries */}
      {hasSplits && (
        <div className="space-y-3 pt-2">
          {splits.map((split, index) => (
            <div key={index} className="p-3 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Split {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSplit(index)}
                  className="h-7 px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Team Member</Label>
                {teamAgents.length > 0 ? (
                  <Select
                    value={split.agentId || ''}
                    onValueChange={(value) => {
                      const agent = teamAgents.find(a => a.id === value);
                      updateSplit(index, 'agentId', value);
                      updateSplit(index, 'agentName', agent?.name || '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Agent name"
                    value={split.agentName}
                    onChange={(e) => updateSplit(index, 'agentName', e.target.value)}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs">Their Split</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="50"
                      value={split.splitPercentage || ''}
                      onChange={(e) => updateSplit(index, 'splitPercentage', Number(e.target.value))}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Split Type</Label>
                  <Select
                    value={split.splitType || 'equal'}
                    onValueChange={(value) => updateSplit(index, 'splitType', value as CommissionSplit['splitType'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {splitTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSplit}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Split
          </Button>
        </div>
      )}
    </div>
  );
}

export function BrokerageIntakeWizard({
  open,
  onClose,
  extraction,
  onUpdate,
  onComplete,
}: BrokerageIntakeWizardProps) {
  const isMobile = useIsMobile();
  const { teamAgents } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        // At least one contact method required
        const buyer = extraction.buyers?.[0];
        return !!(buyer?.phone || buyer?.email);
      case 2:
        // Representation type required
        return !!extraction.representationType;
      case 3:
      case 4:
        // Optional steps
        return true;
      default:
        return true;
    }
  }, [currentStep, extraction]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BuyerContactStep extraction={extraction} onUpdate={onUpdate} />;
      case 2:
        return <RepresentationStep extraction={extraction} onUpdate={onUpdate} />;
      case 3:
        return <ReferralsStep extraction={extraction} onUpdate={onUpdate} />;
      case 4:
        return <CommissionSplitsStep extraction={extraction} onUpdate={onUpdate} teamAgents={teamAgents} />;
      default:
        return null;
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="flex-1 overflow-auto">
        {renderStep()}
      </div>

      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 gradient-primary"
        >
          {currentStep === totalSteps ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Finish
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0 pt-4 pb-2">
            <DrawerTitle className="flex items-center justify-between">
              <span>Complete Your File</span>
              <span className="text-sm font-normal text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complete Your File</span>
            <span className="text-sm font-normal text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
