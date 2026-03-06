import { useState, useMemo } from "react";
import { FileText, Users, Eye, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/filters/SearchFilter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

/* ── Mock Data ── */

interface MyDocument {
  id: string;
  title: string;
  category: string;
  fileType: string;
  description: string;
  date: string;
}

interface TeamMemberDocs {
  id: string;
  name: string;
  documents: { name: string; category: string; dateAdded: string }[];
}

const myDocuments: MyDocument[] = [
  {
    id: "1",
    title: "Independent Contractor Agreement",
    category: "Contract",
    fileType: "APPLICATION/PDF",
    description: "Your signed independent contractor agreement with eXp Realty.",
    date: "2025-01-15",
  },
  {
    id: "2",
    title: "Commission Disbursement Authorization",
    category: "Finance",
    fileType: "APPLICATION/PDF",
    description: "Authorization form for commission disbursement preferences.",
    date: "2025-02-20",
  },
  {
    id: "3",
    title: "E&O Insurance Certificate",
    category: "Insurance",
    fileType: "APPLICATION/PDF",
    description: "Current errors and omissions insurance certificate of coverage.",
    date: "2025-03-01",
  },
];

const teamMemberDocs: TeamMemberDocs[] = [
  {
    id: "t1",
    name: "James Anderson",
    documents: [
      { name: "ICA_Anderson.pdf", category: "Contract", dateAdded: "2025-01-10" },
      { name: "W9_Anderson.pdf", category: "Tax", dateAdded: "2025-01-12" },
    ],
  },
  {
    id: "t2",
    name: "Maria Garcia",
    documents: [
      { name: "ICA_Garcia.pdf", category: "Contract", dateAdded: "2025-02-05" },
      { name: "EO_Garcia.pdf", category: "Insurance", dateAdded: "2025-02-08" },
      { name: "Commission_Auth_Garcia.pdf", category: "Finance", dateAdded: "2025-02-10" },
    ],
  },
  {
    id: "t3",
    name: "David Williams",
    documents: [
      { name: "ICA_Williams.pdf", category: "Contract", dateAdded: "2025-03-01" },
    ],
  },
  {
    id: "t4",
    name: "Sarah Johnson",
    documents: [
      { name: "ICA_Johnson.pdf", category: "Contract", dateAdded: "2024-12-15" },
      { name: "W9_Johnson.pdf", category: "Tax", dateAdded: "2024-12-15" },
      { name: "EO_Johnson.pdf", category: "Insurance", dateAdded: "2025-01-05" },
      { name: "License_Johnson.pdf", category: "License", dateAdded: "2025-01-20" },
    ],
  },
];

/* ── Component ── */

export default function DocumentsPortal() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const isMobile = useIsMobile();
  useDocumentTitle(t("documents.title"));

  const [search, setSearch] = useState("");

  const filteredDocs = useMemo(() => {
    if (!search) return myDocuments;
    const q = search.toLowerCase();
    return myDocuments.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("documents.title")}
        </h1>

        <Tabs defaultValue="my" className="w-full">
          <TabsList>
            <TabsTrigger value="my" className="min-h-[44px] gap-2">
              <FileText className="h-4 w-4" />
              {t("documents.myDocuments")}
            </TabsTrigger>
            <TabsTrigger value="team" className="min-h-[44px] gap-2">
              <Users className="h-4 w-4" />
              {t("documents.teamDocuments")}
            </TabsTrigger>
          </TabsList>

          {/* ── My Documents ── */}
          <TabsContent value="my" className="space-y-4 mt-4">
            <SearchFilter
              value={search}
              onChange={setSearch}
              placeholder={t("documents.searchPlaceholder")}
              className="max-w-sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base truncate">
                        {doc.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {doc.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>{doc.fileType}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {doc.description}
                    </p>
                    <p className="text-sm font-secondary text-muted-foreground mt-auto">
                      {t("documents.added")}: {formatDate(doc.date)}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-[44px] gap-2"
                        aria-label={`${t("documents.view")} ${doc.title}`}
                      >
                        <Eye className="h-4 w-4" />
                        {t("documents.view")}
                      </Button>
                      <Button
                        size="sm"
                        className="min-h-[44px] gap-2"
                        aria-label={`${t("documents.download")} ${doc.title}`}
                      >
                        <Download className="h-4 w-4" />
                        {t("documents.download")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Team Documents ── */}
          <TabsContent value="team" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Users className="h-5 w-5" />
              {t("documents.teamMemberDocuments")}
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {teamMemberDocs.map((member) => (
                <AccordionItem
                  key={member.id}
                  value={member.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline min-h-[44px]">
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-medium text-foreground">
                        {member.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {member.documents.length}{" "}
                        {t("documents.nDocuments")}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("documents.document")}</TableHead>
                          <TableHead>{t("documents.category")}</TableHead>
                          <TableHead>{t("documents.dateAdded")}</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.documents.map((doc, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {doc.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{doc.category}</Badge>
                            </TableCell>
                            <TableCell className="font-secondary">
                              {formatDate(doc.dateAdded)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="min-h-[44px] min-w-[44px]"
                                aria-label={`${t("documents.download")} ${doc.name}`}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
