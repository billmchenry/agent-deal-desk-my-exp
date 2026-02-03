

# Chat History Feature: Header Dropdown + Full History Page

This plan combines two approaches to give users quick access to recent conversations from the chat panel, plus a dedicated page for searching and managing their complete chat history.

---

## Overview

Users will be able to:
1. **Quick access**: See their 5 most recent conversations in a dropdown within the Mira chat header
2. **Full history**: Navigate to a dedicated `/mira/history` page to search, filter, and manage all conversations
3. **Seamless switching**: Load any past conversation back into the chat panel

---

## User Flow

```text
+----------------------------------+
|  Mira Chat Panel (Sheet)         |
|  +----------------------------+  |
|  | [Sparkles] Mira AI   [v] [+]  |  <-- Dropdown trigger + New Chat
|  +----------------------------+  |
|         |                        |
|         v (click dropdown)       |
|  +----------------------------+  |
|  | Recent Conversations       |  |
|  | - "GCI Trends" - 2h ago    |  |
|  | - "Pipeline Review" - 1d   |  |
|  | - "Velocity Check" - 3d    |  |
|  |----------------------------|  |
|  | [View All History]         |  |  <-- Links to /mira/history
|  +----------------------------+  |
+----------------------------------+

          ||
          || (click "View All History")
          \/

+------------------------------------------+
|  /mira/history Page                      |
|  +------------------------------------+  |
|  | [Search conversations...]   [Filter]  |
|  +------------------------------------+  |
|  |                                    |  |
|  | Conversation Cards:                |  |
|  | +--------------------------------+ |  |
|  | | "GCI Trends Analysis"          | |  |
|  | | Jan 29, 2026 - 4 messages      | |  |
|  | | Preview: "Your GCI is..."      | |  |
|  | | [Open] [Delete]                | |  |
|  | +--------------------------------+ |  |
|  |                                    |  |
|  +------------------------------------+  |
+------------------------------------------+
```

---

## What Will Be Built

### 1. Data Types & Storage

**New file: `src/types/chat.ts`**
- `Conversation` type with id, title, messages, timestamps, preview text
- `ChatHistoryState` type for managing conversation list

**Updated: `src/contexts/MiraChatContext.tsx`**
- Store conversations array (initially in memory, can later persist to localStorage or database)
- Track current active conversation ID
- Provide methods: `loadConversation()`, `saveConversation()`, `deleteConversation()`, `getRecentConversations()`

### 2. Chat Panel Header Enhancement

**Updated: `src/components/chat/ChatPanel.tsx`**
- Replace "New Chat" button with a split control:
  - **Dropdown trigger**: Shows conversation title with chevron
  - **New Chat button**: Sparkles icon to start fresh
- Add dropdown menu showing:
  - 5 most recent conversations with title + relative time
  - "View All History" link at bottom
- Auto-generate conversation titles from first user message

### 3. Dedicated History Page

**New file: `src/pages/mira/History.tsx`**
- Full-page layout using `DashboardLayout`
- Search input to filter conversations by content
- Date filter (Today, This Week, This Month, All Time)
- Conversation cards showing:
  - Title (auto-generated or editable)
  - Date and message count
  - Preview of first AI response
  - Actions: Open (loads into chat panel), Delete
- Empty state for no conversations

### 4. Conversation Card Component

**New file: `src/components/chat/ConversationCard.tsx`**
- Reusable card for displaying conversation previews
- Click to open conversation in chat panel
- Delete button with confirmation

### 5. Routing

**Updated: `src/App.tsx`**
- Add route: `/mira/history` -> `History` page

---

## Technical Details

### Conversation Type Structure
```typescript
interface Conversation {
  id: string;
  title: string;
  messages: ChatMessageData[];
  createdAt: Date;
  updatedAt: Date;
  preview: string; // First 100 chars of first AI response
}
```

### Context Updates
The `MiraChatContext` will be extended to manage:
- `conversations: Conversation[]` - All saved conversations
- `activeConversationId: string | null` - Currently loaded conversation
- `loadConversation(id: string)` - Load a conversation into chat panel
- `saveCurrentConversation()` - Save current chat as a conversation
- `deleteConversation(id: string)` - Remove a conversation
- `getRecentConversations(limit: number)` - Get N most recent conversations

### Auto-Save Behavior
- Conversations auto-save when the chat panel closes (if there are user messages)
- Title is auto-generated from the first user message (truncated to 40 chars)

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/types/chat.ts` | Create | Conversation type definitions |
| `src/contexts/MiraChatContext.tsx` | Modify | Add conversation management |
| `src/components/chat/ChatPanel.tsx` | Modify | Add header dropdown |
| `src/components/chat/ConversationCard.tsx` | Create | Reusable conversation preview card |
| `src/pages/mira/History.tsx` | Create | Full history page |
| `src/App.tsx` | Modify | Add /mira/history route |

---

## Future Enhancements (Not in this implementation)
- Persist conversations to localStorage for cross-session access
- Connect to Supabase for cloud storage and sync
- Edit conversation titles
- Export conversation as text/PDF
- Pin favorite conversations

