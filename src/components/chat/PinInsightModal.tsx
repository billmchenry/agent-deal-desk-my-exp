import { useState } from 'react';
import { Pin, Calendar, Clock, RefreshCw, Sparkles, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type RefreshInterval = 'daily' | 'weekly' | 'manual';

interface PinInsightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insightTitle: string;
  onConfirm: (interval: RefreshInterval, customName?: string) => void;
}

const intervals: { value: RefreshInterval; label: string; description: string; icon: React.ReactNode; recommended?: boolean }[] = [
  {
    value: 'daily',
    label: 'Daily',
    description: 'Updates every morning when you open the app',
    icon: <Clock className="w-5 h-5" />,
    recommended: true,
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Updates every Monday morning',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    value: 'manual',
    label: 'Keep as Snapshot',
    description: 'Only updates when you manually refresh',
    icon: <RefreshCw className="w-5 h-5" />,
  },
];

export function PinInsightModal({ open, onOpenChange, insightTitle, onConfirm }: PinInsightModalProps) {
  const [selected, setSelected] = useState<RefreshInterval>('daily');
  const [customName, setCustomName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleConfirm = () => {
    onConfirm(selected, customName.trim() || undefined);
    onOpenChange(false);
    setCustomName('');
    setShowNameInput(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Pin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>Pin to Pulse</DialogTitle>
              <DialogDescription className="text-sm">
                How often should this insight update?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-secondary/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-muted-foreground">Pinning:</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={() => setShowNameInput(!showNameInput)}
              >
                <Edit3 className="w-3 h-3" />
                Rename
              </Button>
            </div>
            {showNameInput ? (
              <div className="space-y-2">
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={insightTitle}
                  className="h-9"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use: "{insightTitle}"
                </p>
              </div>
            ) : (
              <p className="font-medium text-foreground">{customName || insightTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            {intervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => setSelected(interval.value)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                  selected === interval.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  selected === interval.value ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                )}>
                  {interval.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{interval.label}</p>
                    {interval.recommended && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{interval.description}</p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  selected === interval.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                )}>
                  {selected === interval.value && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="gradient-primary gap-2">
            <Sparkles className="w-4 h-4" />
            Pin to Pulse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
