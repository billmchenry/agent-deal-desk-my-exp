import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MentorRequestDetailSheet } from "@/components/mentor/MentorRequestDetailSheet";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { mockMentorRequests, type MentorRequestDetail } from "@/data/mentorMockData";
import { toast } from "sonner";

export default function MentorRequests() {
  useDocumentTitle("Mentor Requests");
  const navigate = useNavigate();
  const [requests, setRequests] = useState(mockMentorRequests);
  const [selectedRequest, setSelectedRequest] = useState<MentorRequestDetail | null>(null);

  const handleAccept = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Mentor request accepted.");
  };

  const handleDecline = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info("Mentor request declined.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => navigate("/mentor")}
        >
          <ChevronLeft className="h-4 w-4" />
          Pending Mentor Requests
        </Button>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pending mentor requests at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Request Sent</TableHead>
                      <TableHead className="text-right">Respond to Request</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedRequest(req)}
                            aria-label={`View details for ${req.firstName} ${req.lastName}`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{req.firstName}</TableCell>
                        <TableCell className="text-foreground">{req.lastName}</TableCell>
                        <TableCell className="text-muted-foreground">{req.requestSentDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAccept(req.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecline(req.id)}
                            >
                              Decline
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <MentorRequestDetailSheet
          open={!!selectedRequest}
          onOpenChange={(o) => { if (!o) setSelectedRequest(null); }}
          request={selectedRequest}
        />
      </div>
    </DashboardLayout>
  );
}
