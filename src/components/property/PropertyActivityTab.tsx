import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle2, Upload, Send, Clock, AlertCircle, Activity, Sparkles } from 'lucide-react';
import { Listing, ActivityLogItem } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface PropertyActivityTabProps {
  listing: Listing;
}

// Default activity items if none exist on the listing
const defaultActivityItems: ActivityLogItem[] = [
  { 
    id: '1', 
    action: 'In Compliance Review', 
    timestamp: new Date(),
    performedBy: 'System' 
  },
  { 
    id: '2', 
    action: 'Draft agreement approved by agent', 
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    performedBy: 'Charles Anderson' 
  },
  { 
    id: '3', 
    action: 'All extraction fields verified', 
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    performedBy: 'Mira AI' 
  },
  { 
    id: '4', 
    action: 'Document extraction completed', 
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    performedBy: 'Mira AI' 
  },
  { 
    id: '5', 
    action: 'Listing file created', 
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    performedBy: 'Charles Anderson' 
  },
  { 
    id: '6', 
    action: 'Submitted for compliance review', 
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    performedBy: 'Charles Anderson' 
  },
];

const getActivityIcon = (action: string) => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('sent') || lowerAction.includes('signature')) {
    return Send;
  }
  if (lowerAction.includes('approved') || lowerAction.includes('verified') || lowerAction.includes('completed')) {
    return CheckCircle2;
  }
  if (lowerAction.includes('upload') || lowerAction.includes('created')) {
    return Upload;
  }
  if (lowerAction.includes('review') || lowerAction.includes('submitted')) {
    return Clock;
  }
  if (lowerAction.includes('rejected') || lowerAction.includes('issue')) {
    return AlertCircle;
  }
  return FileText;
};

const getActivityColor = (action: string, performedBy?: string) => {
  const lowerAction = action.toLowerCase();
  if (performedBy?.toLowerCase().includes('mira')) {
    return 'primary';
  }
  if (lowerAction.includes('approved') || lowerAction.includes('verified') || lowerAction.includes('completed')) {
    return 'success';
  }
  if (lowerAction.includes('rejected') || lowerAction.includes('issue')) {
    return 'destructive';
  }
  if (lowerAction.includes('review') || lowerAction.includes('sent')) {
    return 'warning';
  }
  return 'muted';
};

export function PropertyActivityTab({ listing }: PropertyActivityTabProps) {
  const activityItems = listing.activityLog?.length ? listing.activityLog : defaultActivityItems;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent" />

          {/* Activity items */}
          <div className="space-y-1">
            {activityItems.map((item, index) => {
              const Icon = getActivityIcon(item.action);
              const isFirst = index === 0;
              const isMira = item.performedBy?.toLowerCase().includes('mira');
              const color = getActivityColor(item.action, item.performedBy);

              return (
                <div 
                  key={item.id} 
                  className="relative flex items-start gap-4 pl-1 py-3 hover:bg-secondary/30 rounded-lg transition-colors -ml-2 px-2"
                >
                  {/* Timeline dot */}
                  <div className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                    ${isFirst 
                      ? 'gradient-primary shadow-lg shadow-primary/25' 
                      : isMira 
                        ? 'bg-primary/10 border-2 border-primary/30'
                        : 'bg-secondary border-2 border-border'
                    }
                  `}>
                    {isMira ? (
                      <Sparkles className={`w-3.5 h-3.5 ${isFirst ? 'text-primary-foreground' : 'text-primary'}`} />
                    ) : (
                      <Icon className={`w-3.5 h-3.5 ${isFirst ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className={`font-medium leading-tight ${isFirst ? 'text-foreground' : 'text-foreground/80'}`}>
                      {item.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </span>
                      {item.performedBy && (
                        <>
                          <span className="text-xs text-muted-foreground/50">•</span>
                          <span className={`text-xs font-medium ${isMira ? 'text-primary' : 'text-muted-foreground'}`}>
                            {item.performedBy}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}