import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Search, MessageSquare, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationCard } from "@/components/chat/ConversationCard";
import { useMiraChat } from "@/contexts/MiraChatContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DateFilter = 'all' | 'today' | 'week' | 'month';

const dateFilterLabels: Record<DateFilter, string> = {
  all: 'All Time',
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

export default function History() {
  useDocumentTitle("Chat History");
  const { conversations, loadConversation, deleteConversation } = useMiraChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query) ||
        conv.messages.some(m => m.content.toLowerCase().includes(query))
      );
    }

    // Apply date filter
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(conv => conv.updatedAt >= startOfToday);
        break;
      case 'week':
        filtered = filtered.filter(conv => conv.updatedAt >= startOfWeek);
        break;
      case 'month':
        filtered = filtered.filter(conv => conv.updatedAt >= startOfMonth);
        break;
    }

    // Sort by most recent
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [conversations, searchQuery, dateFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Chat History</h1>
          <p className="text-muted-foreground">Browse and manage your past conversations with Mira</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                {dateFilterLabels[dateFilter]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              {Object.entries(dateFilterLabels).map(([key, label]) => (
                <DropdownMenuItem key={key} onClick={() => setDateFilter(key as DateFilter)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Conversations Grid */}
        {filteredConversations.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredConversations.map(conversation => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onOpen={loadConversation}
                onDelete={deleteConversation}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || dateFilter !== 'all' 
                ? "No conversations match your search criteria. Try adjusting your filters."
                : "Start chatting with Mira to see your conversation history here."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
