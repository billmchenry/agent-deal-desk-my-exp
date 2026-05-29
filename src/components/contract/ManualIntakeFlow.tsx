import { useState, useCallback } from 'react';
import { ArrowRight, Check, DollarSign, Calendar, Users, Building2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Listing, ContractExtraction, ContractReferral } from '@/types';
import { cn } from '@/lib/utils';

interface ManualIntakeFlowProps {
  listing: Listing;
  onComplete: (data: Partial<ContractExtraction>) => void;
  onCancel: () => void;
}

const steps = [
  { id: 1, title: 'Sales Price', icon: DollarSign, question: 'What is the final Sales Price?' },
  { id: 2, title: 'Closing Date', icon: Calendar, question: 'What is the Closing Date?' },
  { id: 3, title: 'Buyer Info', icon: Users, question: 'Who is the Buyer and the Buying Agent?' },
  { id: 4, title: 'Title Company', icon: Building2, question: 'Which Title Company is handling the escrow?' },
  { id: 5, title: 'Referrals', icon: UserPlus, question: 'Are there any Referrals or commission splits to add?' },
];

export function ManualIntakeFlow({ listing, onComplete, onCancel }: ManualIntakeFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    salesPrice: listing.extraction.listingPrice,
    closingDate: '',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyingAgent: '',
    buyingBrokerage: '',
    titleCompany: '',
    escrowOfficer: '',
    hasReferral: false,
    referralAgentName: '',
    referralBrokerage: '',
    referralPercentage: 25,
  });

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the flow
      const referrals: ContractReferral[] = formData.hasReferral 
        ? [{
            agentName: formData.referralAgentName,
            brokerage: formData.referralBrokerage,
            percentage: formData.referralPercentage,
          }]
        : [];

      const contractData: Partial<ContractExtraction> = {
        salesPrice: formData.salesPrice,
        closingDate: formData.closingDate ? new Date(formData.closingDate) : new Date(),
        buyers: [{
          name: formData.buyerName,
          email: formData.buyerEmail,
          phone: formData.buyerPhone,
          role: 'buyer',
        }],
        buyingAgent: formData.buyingAgent,
        buyingBrokerage: formData.buyingBrokerage,
        titleCompany: formData.titleCompany,
        escrowOfficer: formData.escrowOfficer,
        referrals,
        effectiveDate: new Date(),
        earnestMoney: 5000,
        optionFee: 500,
        optionPeriodDays: 10,
        confidence: {
          salesPrice: 100,
          closingDate: 100,
          buyers: 100,
          buyingAgent: 100,
          titleCompany: 100,
        },
      };

      onComplete(contractData);
    }
  }, [currentStep, formData, onComplete]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              step.id < currentStep && "bg-success",
              step.id === currentStep && "bg-primary w-6",
              step.id > currentStep && "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Question */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <StepIcon className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">{currentStepData.question}</p>
      </div>

      {/* Step Content */}
      <div className="space-y-3">
        {currentStep === 1 && (
          <div className="space-y-2">
            <Label htmlFor="salesPrice">Sales Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="salesPrice"
                type="number"
                value={formData.salesPrice}
                onChange={(e) => updateField('salesPrice', Number(e.target.value))}
                className="pl-9"
                placeholder="425000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Listed at ${listing.extraction.listingPrice.toLocaleString()}
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-2">
            <Label htmlFor="closingDate">Closing Date</Label>
            <Input
              id="closingDate"
              type="date"
              value={formData.closingDate}
              onChange={(e) => updateField('closingDate', e.target.value)}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Buyer Name(s)</Label>
              <Input
                id="buyerName"
                value={formData.buyerName}
                onChange={(e) => updateField('buyerName', e.target.value)}
                placeholder="John & Mary Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Email</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={formData.buyerEmail}
                  onChange={(e) => updateField('buyerEmail', e.target.value)}
                  placeholder="buyer@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Phone</Label>
                <Input
                  id="buyerPhone"
                  type="tel"
                  value={formData.buyerPhone}
                  onChange={(e) => updateField('buyerPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="buyingAgent">Buying Agent</Label>
                <Input
                  id="buyingAgent"
                  value={formData.buyingAgent}
                  onChange={(e) => updateField('buyingAgent', e.target.value)}
                  placeholder="Agent Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyingBrokerage">Brokerage</Label>
                <Input
                  id="buyingBrokerage"
                  value={formData.buyingBrokerage}
                  onChange={(e) => updateField('buyingBrokerage', e.target.value)}
                  placeholder="RE/MAX, Keller Williams..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="titleCompany">Title Company</Label>
              <Input
                id="titleCompany"
                value={formData.titleCompany}
                onChange={(e) => updateField('titleCompany', e.target.value)}
                placeholder="Republic Title, Stewart Title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="escrowOfficer">Escrow Officer (optional)</Label>
              <Input
                id="escrowOfficer"
                value={formData.escrowOfficer}
                onChange={(e) => updateField('escrowOfficer', e.target.value)}
                placeholder="Officer Name"
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant={formData.hasReferral ? "default" : "outline"}
                size="sm"
                onClick={() => updateField('hasReferral', true)}
              >
                Yes, add referral
              </Button>
              <Button
                variant={!formData.hasReferral ? "default" : "outline"}
                size="sm"
                onClick={() => updateField('hasReferral', false)}
              >
                No referrals
              </Button>
            </div>
            
            {formData.hasReferral && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="referralAgentName">Referral Agent</Label>
                  <Input
                    id="referralAgentName"
                    value={formData.referralAgentName}
                    onChange={(e) => updateField('referralAgentName', e.target.value)}
                    placeholder="Agent Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="referralBrokerage">Brokerage</Label>
                    <Input
                      id="referralBrokerage"
                      value={formData.referralBrokerage}
                      onChange={(e) => updateField('referralBrokerage', e.target.value)}
                      placeholder="Brokerage Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralPercentage">Split %</Label>
                    <Input
                      id="referralPercentage"
                      type="number"
                      value={formData.referralPercentage}
                      onChange={(e) => updateField('referralPercentage', Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext} className="gap-2">
          {currentStep < 5 ? (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
