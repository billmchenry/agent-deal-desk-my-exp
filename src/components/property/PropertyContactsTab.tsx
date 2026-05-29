import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, User, Users, ExternalLink } from 'lucide-react';
import { Listing } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

interface PropertyContactsTabProps {
  listing: Listing;
}

interface ContactCardProps {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  avatar?: string;
  badge?: string;
}

function ContactCard({ name, role, email, phone, avatar, badge }: ContactCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {badge && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{role}</p>
            
            <div className="space-y-2">
              {email && (
                <a 
                  href={`mailto:${email}`} 
                  className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="truncate">{email}</span>
                </a>
              )}
              {phone && (
                <a 
                  href={`tel:${phone}`} 
                  className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    </div>
  );
}

export function PropertyContactsTab({ listing }: PropertyContactsTabProps) {
  const { currentAgent } = useApp();
  const { extraction, contractData } = listing;
  
  // Determine if this is a transaction
  const isTransaction = listing.checklistPhase === 'transaction' || listing.status === 'pending' || listing.status === 'sold';

  return (
    <div className="space-y-8">
      {/* Buyers & Buyer's Agent Section - Only for transactions */}
      {isTransaction && contractData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buyers */}
          <div>
            <SectionHeader icon={Users} title="Buyers" />
            <div className="grid grid-cols-1 gap-4">
              {contractData.buyers && contractData.buyers.length > 0 ? (
                contractData.buyers.map((buyer, index) => (
                  <ContactCard
                    key={index}
                    name={buyer.name}
                    role="Buyer"
                    email={contractData.buyerNoticeEmail}
                    phone={contractData.buyerNoticePhone}
                  />
                ))
              ) : (
                <ContactCard
                  name="Michael & Emily Johnson"
                  role="Buyers"
                  email="mjohnson@email.com"
                  phone="(555) 867-5309"
                />
              )}
            </div>
          </div>

          {/* Buyer's Agent */}
          <div>
            <SectionHeader icon={User} title="Buyer's Agent" />
            <div className="grid grid-cols-1 gap-4">
              <ContactCard
                name={contractData.buyingAgentName || 'Sarah Mitchell'}
                role={`Buyer's Agent · ${contractData.buyingBrokerName || 'Compass Real Estate'}`}
                email="sarah.mitchell@compass.com"
                phone="(555) 234-5678"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sellers & Listing Agent Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sellers */}
        <div>
          <SectionHeader icon={Users} title="Sellers" />
          <div className="grid grid-cols-1 gap-4">
            {extraction.sellers.map((seller, index) => (
              <ContactCard
                key={index}
                name={seller.name}
                role="Seller"
                email={seller.email}
                phone={seller.phone}
              />
            ))}
          </div>
        </div>

        {/* Listing Agent */}
        <div>
          <SectionHeader icon={User} title="Listing Agent" />
          <div className="grid grid-cols-1 gap-4">
            <ContactCard
              name={currentAgent.name}
              role="Listing Agent"
              email={currentAgent.email}
              phone={currentAgent.phone}
              avatar={currentAgent.avatar}
              badge={currentAgent.role === 'team_leader' ? 'Team Leader' : undefined}
            />
          </div>
        </div>
      </div>

      {/* Transaction Coordinator Section */}
      {listing.reviewerName && (
        <div>
          <SectionHeader icon={User} title="Transaction Coordinator" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ContactCard
              name={listing.reviewerName}
              role="Transaction Coordinator"
              email="tc@brokerage.com"
              phone="(555) 987-6543"
            />
          </div>
        </div>
      )}
    </div>
  );
}