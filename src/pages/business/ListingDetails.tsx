import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { toast } from "sonner";

type RowLite = {
  id: string;
  mlsNumber?: string;
  propertyAddress?: string;
  propertyCity?: string;
  listingAgent?: string;
  office?: string;
  expirationDate?: string;
  listingPrice?: number;
};

const CHECKLIST_TYPES = ["Commercial Lease", "Lease", "Lot", "Resale", "New"];
const REPRESENTATION_TYPES = ["Seller", "Buyer", "Both", "Landlord", "Tenant"];

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="bg-muted/60 px-4 py-2.5 border-b">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h2>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </Card>
  );
}

export default function ListingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const row = (location.state as { row?: RowLite } | null)?.row;

  const fullAddress = useMemo(() => {
    if (!row) return "Listing Details";
    return [row.propertyAddress, row.propertyCity].filter(Boolean).join(", ");
  }, [row]);

  const [tx, setTx] = useState({
    agent: row?.listingAgent ?? "",
    mls: row?.mlsNumber ?? "",
    salesPrice: row?.listingPrice ? String(row.listingPrice) : "",
    source: "",
    office: row?.office ?? "",
    checklistType: "",
    representation: "",
    yearBuilt: "",
    acceptanceDate: "",
    closingDate: "",
  });
  const [contacts, setContacts] = useState({
    sellerTab: "Seller",
    sellerFirstName: "",
    sellerLastName: "",
    sellerEmail: "",
    sellerPhone: "",
  });
  const [commission, setCommission] = useState({
    salePrice: row?.listingPrice ? String(row.listingPrice) : "",
    personalDeal: "No",
    listingCommission: "",
    listingCommissionType: "%",
  });

  const handleSave = () => {
    toast.success("Listing details saved");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <UniversalFilterBar
          title={fullAddress}
          subtitle={row?.mlsNumber ? `MLS ${row.mlsNumber}` : `Listing ${params.id ?? ""}`}
        >
          <Button
            variant="outline"
            className="rounded-[51px] gap-2 min-h-[44px]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            className="rounded-[51px] gap-2 min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </UniversalFilterBar>

        <Card className="rounded-2xl p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">
              {fullAddress}
            </h1>
            <p className="text-sm text-muted-foreground">
              {row?.listingAgent ? `Listing Agent: ${row.listingAgent}` : "Listing details"}
            </p>
          </div>
        </Card>

        <SectionCard title="Transaction">
          <Field label="Agent">
            <Input
              value={tx.agent}
              onChange={(e) => setTx({ ...tx, agent: e.target.value })}
              placeholder="Enter agent name"
            />
          </Field>
          <Field label="MLS">
            <Input
              value={tx.mls}
              onChange={(e) => setTx({ ...tx, mls: e.target.value })}
              placeholder="MLS #"
            />
          </Field>
          <Field label="Sales Price">
            <Input
              value={tx.salesPrice}
              onChange={(e) => setTx({ ...tx, salesPrice: e.target.value })}
              placeholder="$"
              className="tabular-nums"
            />
          </Field>
          <Field label="Source">
            <Input
              value={tx.source}
              onChange={(e) => setTx({ ...tx, source: e.target.value })}
              placeholder="Lead source"
            />
          </Field>
          <Field label="Office">
            <Input
              value={tx.office}
              onChange={(e) => setTx({ ...tx, office: e.target.value })}
              placeholder="Office"
            />
          </Field>
          <Field label="Checklist Type">
            <Select
              value={tx.checklistType}
              onValueChange={(v) => setTx({ ...tx, checklistType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select checklist type" />
              </SelectTrigger>
              <SelectContent>
                {CHECKLIST_TYPES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Type (Representation)">
            <Select
              value={tx.representation}
              onValueChange={(v) => setTx({ ...tx, representation: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select representation" />
              </SelectTrigger>
              <SelectContent>
                {REPRESENTATION_TYPES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Year Built">
            <Input
              value={tx.yearBuilt}
              onChange={(e) => setTx({ ...tx, yearBuilt: e.target.value })}
              placeholder="YYYY"
              className="tabular-nums"
            />
          </Field>
          <Field label="Acceptance Date">
            <Input
              type="date"
              value={tx.acceptanceDate}
              onChange={(e) => setTx({ ...tx, acceptanceDate: e.target.value })}
            />
          </Field>
          <Field label="Closing Date">
            <Input
              type="date"
              value={tx.closingDate}
              onChange={(e) => setTx({ ...tx, closingDate: e.target.value })}
            />
          </Field>
        </SectionCard>

        <SectionCard title="Contacts">
          <Field label="Seller/Landlord Tab">
            <Select
              value={contacts.sellerTab}
              onValueChange={(v) => setContacts({ ...contacts, sellerTab: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Seller">Seller</SelectItem>
                <SelectItem value="Landlord">Landlord</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Seller's First Name">
            <Input
              value={contacts.sellerFirstName}
              onChange={(e) =>
                setContacts({ ...contacts, sellerFirstName: e.target.value })
              }
              placeholder="First name"
            />
          </Field>
          <Field label="Seller's Last Name">
            <Input
              value={contacts.sellerLastName}
              onChange={(e) =>
                setContacts({ ...contacts, sellerLastName: e.target.value })
              }
              placeholder="Last name"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={contacts.sellerEmail}
              onChange={(e) =>
                setContacts({ ...contacts, sellerEmail: e.target.value })
              }
              placeholder="email@example.com"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={contacts.sellerPhone}
              onChange={(e) =>
                setContacts({ ...contacts, sellerPhone: e.target.value })
              }
              placeholder="(xxx) 555-xxxx"
            />
          </Field>
        </SectionCard>

        <SectionCard title="Commission">
          <Field label="Sale Price">
            <Input
              value={commission.salePrice}
              onChange={(e) =>
                setCommission({ ...commission, salePrice: e.target.value })
              }
              placeholder="$"
              className="tabular-nums"
            />
          </Field>
          <Field label="Personal Deal (Yes/No)">
            <Select
              value={commission.personalDeal}
              onValueChange={(v) =>
                setCommission({ ...commission, personalDeal: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Listing Commission (% or $)" className="sm:col-span-2">
            <div className="flex gap-2">
              <Input
                value={commission.listingCommission}
                onChange={(e) =>
                  setCommission({
                    ...commission,
                    listingCommission: e.target.value,
                  })
                }
                placeholder="0.00"
                className="tabular-nums flex-1"
              />
              <Select
                value={commission.listingCommissionType}
                onValueChange={(v) =>
                  setCommission({ ...commission, listingCommissionType: v })
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="%">%</SelectItem>
                  <SelectItem value="$">$</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Field>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
