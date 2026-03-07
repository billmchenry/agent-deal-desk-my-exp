import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConversationCard } from "@/components/chat/ConversationCard";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { UniversalFilterBar } from "@/components/filters";
import { useTranslation } from "@/hooks/useTranslation";

type DateFilter = 'all' | 'today' | 'week' | 'month';

export default function History() {
  useDocumentTitle(t("nav.chatHistory"));
  const { t } = useTranslation();
  const { conversations, loadConversation, deleteConversation } = useMiraChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const dateFilterOptions = [
    { value: 'all', label: t("filter.allTime") },
    { value: 'today', label: t("filter.today") },
    { value: 'week', label: t("filter.thisWeek") },
    { value: 'month', label: t("filter.thisMonth") },
  ];

  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query) ||
        conv.messages.some(m => m.content.toLowerCase().includes(query))
      );
    }

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

    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [conversations, searchQuery, dateFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <UniversalFilterBar title={t("nav.home")} subtitle="Browse and manage your past conversations with Mira">
          <UniversalFilterBar.Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t("filter.search") + "..."}
            className="flex-1 min-w-[200px]"
          />
          <UniversalFilterBar.Dropdown
            label={t("filter.allTime")}
            options={dateFilterOptions}
            value={dateFilter}
            onChange={(v) => setDateFilter(v as DateFilter)}
          />
        </UniversalFilterBar>

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
