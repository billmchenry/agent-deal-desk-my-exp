import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  FileText,
  Users,
  DollarSign,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useFormatters } from "@/hooks/useFormatters";

type RowLite = {
  id: string;
  mlsNumber?: string;
  propertyAddress?: string;
  propertyCity?: string;
  listingAgent?: string;
  office?: string;
  expirationDate?: string;
  listingPrice?: number;
  status?: string;
};

const CHECKLIST_TYPES = ["Commercial Lease", "Lease", "Lot", "Resale", "New"];
const REPRESENTATION_TYPES = ["Seller", "Buyer", "Both", "Landlord", "Tenant"];

const inputCls =
  "w-full h-9 px-3.5 text-[10px] rounded-[51px] bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary";

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
      <Label className="text-[11px] font-semibold text-muted-foreground ms-1">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  iconBg,
  iconColor,
  right,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl overflow-hidden border-border shadow-sm">
      <div className="p-5 border-b border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

export default function ListingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { formatNumber } = useFormatters();
  const row = (location.state as { row?: RowLite } | null)?.row;

  const fullAddress = useMemo(() => {
    if (!row) return "Listing Details";
    return [row.propertyAddress, row.propertyCity].filter(Boolean).join(", ");
  }, [row]);

  const status = row?.status ?? "Active";

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
  const [contactTab, setContactTab] = useState<"Seller" | "Buyer">("Seller");
  const [contacts, setContacts] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [commission, setCommission] = useState({
    salePrice: row?.listingPrice ? String(row.listingPrice) : "",
    rate: "3",
    personalDeal: false,
  });

  const completeness = useMemo(() => {
    const fields = [
      tx.agent,
      tx.mls,
      tx.salesPrice,
      tx.source,
      tx.office,
      tx.checklistType,
      tx.representation,
      tx.yearBuilt,
      tx.acceptanceDate,
      tx.closingDate,
      contacts.firstName,
      contacts.lastName,
      contacts.email,
      contacts.phone,
      commission.salePrice,
      commission.rate,
    ];
    const filled = fields.filter((f) => String(f ?? "").trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [tx, contacts, commission]);

  const totalCommission = useMemo(() => {
    const p = parseFloat(commission.salePrice) || 0;
    const r = parseFloat(commission.rate) || 0;
    return (p * r) / 100;
  }, [commission.salePrice, commission.rate]);

  const handleSave = () => toast.success("Listing details saved");

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge className="px-2.5 py-0.5 bg-primary/10 text-primary hover:bg-primary/10 border-0 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {status} Listing
              </Badge>
              {row?.mlsNumber && (
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-tight">
                  MLS #{row.mlsNumber}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-foreground truncate">
              {fullAddress}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              className="rounded-[51px] gap-2 h-11 px-5 text-sm min-h-[44px]"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              className="rounded-[51px] gap-2 h-11 px-6 text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction */}

            <SectionCard
              title="Transaction Details"
              icon={FileText}
              iconBg="bg-primary/10"
              iconColor="text-primary"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field label="Agent">
                  <Input
                    value={tx.agent}
                    onChange={(e) => setTx({ ...tx, agent: e.target.value })}
                    className={inputCls}
                    placeholder="Enter agent name"
                  />
                </Field>
                <Field label="MLS ID">
                  <Input
                    value={tx.mls}
                    onChange={(e) => setTx({ ...tx, mls: e.target.value })}
                    className={inputCls}
                    placeholder="MLS #"
                  />
                </Field>
                <Field label="Sales Price">
                  <Input
                    value={tx.salesPrice}
                    onChange={(e) => setTx({ ...tx, salesPrice: e.target.value })}
                    className={`${inputCls} tabular-nums`}
                    placeholder="0"
                  />
                </Field>
                <Field label="Lead Source">
                  <Input
                    value={tx.source}
                    onChange={(e) => setTx({ ...tx, source: e.target.value })}
                    className={inputCls}
                    placeholder="Enter lead source"
                  />
                </Field>
                <Field label="Office">
                  <Input
                    value={tx.office}
                    onChange={(e) => setTx({ ...tx, office: e.target.value })}
                    className={inputCls}
                    placeholder="Office"
                  />
                </Field>
                <Field label="Checklist Type">
                  <Select
                    value={tx.checklistType}
                    onValueChange={(v) => setTx({ ...tx, checklistType: v })}
                  >
                    <SelectTrigger className={inputCls}>
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
                    <SelectTrigger className={inputCls}>
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
                    className={`${inputCls} tabular-nums`}
                    placeholder="YYYY"
                  />
                </Field>
                <Field label="Acceptance Date">
                  <Input
                    type="date"
                    value={tx.acceptanceDate}
                    onChange={(e) =>
                      setTx({ ...tx, acceptanceDate: e.target.value })
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Closing Date">
                  <Input
                    type="date"
                    value={tx.closingDate}
                    onChange={(e) =>
                      setTx({ ...tx, closingDate: e.target.value })
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* Contacts */}
            <SectionCard
              title="Contacts"
              icon={Users}
              iconBg="bg-accent"
              iconColor="text-accent-foreground"
              right={
                <nav
                  className="flex gap-1 bg-muted p-1 rounded-[51px]"
                  role="tablist"
                  aria-label="Contact type"
                >
                  {(["Seller", "Buyer"] as const).map((tab) => {
                    const active = contactTab === tab;
                    return (
                      <button
                        key={tab}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setContactTab(tab)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-[51px] transition-colors min-h-[28px] ${
                          active
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </nav>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label={`${contactTab}'s First Name`}>
                  <Input
                    value={contacts.firstName}
                    onChange={(e) =>
                      setContacts({ ...contacts, firstName: e.target.value })
                    }
                    className={inputCls}
                    placeholder="First name"
                  />
                </Field>
                <Field label={`${contactTab}'s Last Name`}>
                  <Input
                    value={contacts.lastName}
                    onChange={(e) =>
                      setContacts({ ...contacts, lastName: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Last name"
                  />
                </Field>
                <Field label="Email Address" className="md:col-span-2">
                  <Input
                    type="email"
                    value={contacts.email}
                    onChange={(e) =>
                      setContacts({ ...contacts, email: e.target.value })
                    }
                    className={inputCls}
                    placeholder="name@example.com"
                  />
                </Field>
                <Field label="Phone Number" className="md:col-span-2">
                  <Input
                    value={contacts.phone}
                    onChange={(e) =>
                      setContacts({ ...contacts, phone: e.target.value })
                    }
                    className={inputCls}
                    placeholder="(xxx) 555-xxxx"
                  />
                </Field>
              </div>
            </SectionCard>
          </div>

          {/* Right rail */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Commission (dark, editable) */}
            <Card className="rounded-2xl overflow-hidden border-0 shadow-xl bg-[#121E31] text-white">
              <div className="p-5 border-b border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-300">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold">Commission</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                    Sale Price
                  </Label>
                  <Input
                    value={commission.salePrice}
                    onChange={(e) =>
                      setCommission({ ...commission, salePrice: e.target.value })
                    }
                    className="h-11 px-4 rounded-[51px] bg-white/10 border-white/10 text-white placeholder:text-white/40 text-base font-extrabold tabular-nums focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:border-white/30"
                    placeholder="0"
                    inputMode="decimal"
                  />
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                      Commission Rate
                    </Label>
                    <div className="relative">
                      <Input
                        value={commission.rate}
                        onChange={(e) =>
                          setCommission({ ...commission, rate: e.target.value })
                        }
                        className="h-11 ps-4 pe-10 text-sm rounded-[51px] bg-white/10 border-white/10 text-white placeholder:text-white/40 tabular-nums focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:border-white/30"
                        placeholder="0"
                        inputMode="decimal"
                      />
                      <span className="absolute end-4 top-1/2 -translate-y-1/2 text-white/60 text-sm font-bold pointer-events-none">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-300 text-xs">Total Commission</span>
                    <span className="text-sm font-extrabold text-emerald-400 tabular-nums">
                      {formatNumber(totalCommission, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USD
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Label
                    htmlFor="personal-deal"
                    className="text-xs font-medium text-white cursor-pointer"
                  >
                    Personal Deal
                  </Label>
                  <Switch
                    id="personal-deal"
                    checked={commission.personalDeal}
                    onCheckedChange={(v) =>
                      setCommission({ ...commission, personalDeal: v })
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Property Meta */}
            <Card className="rounded-2xl p-5 border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Property Meta
                </h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Year Built</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {tx.yearBuilt || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Office</span>
                  <span className="font-semibold text-foreground">
                    {tx.office || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Expiration</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {row?.expirationDate || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Listing ID</span>
                  <span className="font-semibold text-foreground">
                    {params.id ?? "—"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
