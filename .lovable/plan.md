

# Mira AI Chat UX Enhancements

This plan covers four UX improvements to the Mira AI chat assistant sidebar: persistent history access, interactive chart cards, the pin handshake, and quick suggestion chips.

---

## Current State Analysis

The existing implementation already has:
- **Chat panel** (`ChatPanel.tsx`) with a slide-out Sheet design
- **Conversation persistence** in memory via `MiraChatContext` 
- **Widget previews** (`WidgetPreview.tsx`) with charts for forecast, velocity, and pipeline
- **Pin functionality** that adds widgets to dashboard via `DashboardContext`
- **History page** at `/mira/history` with search and filtering

What needs to be enhanced:
- Add a dedicated History icon button in the header
- Ensure ScrollArea allows scrolling up through all messages
- Move the Pin button directly onto the chart card (not below it)
- Add horizontal suggestion chips at the bottom of the chat
- Update toast message wording to "Insight pinned to Home"

---

## Implementation Plan

### 1. Add History Icon Button to Header

**File: `src/components/chat/ChatPanel.tsx`**

Add a History icon button next to the existing "+" (New Chat) button in the header. This provides a clear visual cue for accessing past conversations.

```text
Current header layout:
[Avatar] [Title Dropdown ▼] ........................ [+]

Updated layout:
[Avatar] [Title Dropdown ▼] ................ [History] [+]
```

- Import the `History` icon (already imported)
- Add a new icon button before the "+" button
- On click, navigate to `/mira/history`

### 2. Verify Persistent History (Scrollable Messages)

**File: `src/components/chat/ChatPanel.tsx`**

The current `ScrollArea` component wraps the messages and should already allow scrolling. Verification needed:

- Ensure `ScrollArea` has proper `flex-1` to take available space
- Messages are rendered in order from oldest to newest
- Auto-scroll to bottom on new messages (already implemented)
- Users can scroll up manually to see older messages

This appears to be working correctly based on the current implementation.

### 3. Relocate Pin Button to Chart Card

**File: `src/components/chat/WidgetPreview.tsx`**

Move the Pin button from below the insights section to the top-right corner of the chart card itself. This creates a cleaner "pin handshake" interaction.

```text
Current structure:
+---------------------------+
| Chart Title               |
|                           |
|      [Chart]              |
+---------------------------+
• Insight 1
• Insight 2
[Follow-up 1] [Follow-up 2]
[Pin to Dashboard]          <-- Currently here

Updated structure:
+---------------------------+
| Chart Title          [Pin]|  <-- Move Pin here
|                           |
|      [Chart]              |
+---------------------------+
• Insight 1
• Insight 2
[Follow-up 1] [Follow-up 2]
```

- Add Pin icon button in `CardHeader` next to title
- Remove the standalone "Pin to Dashboard" button below
- Keep the same pin/unpin logic and state

### 4. Update Toast Message

**File: `src/components/chat/WidgetPreview.tsx`**

Change the toast notification from:
- `"Insight pinned to your dashboard!"` 

To:
- `"Insight pinned to Home"`

### 5. Add Suggestion Chips

**File: `src/components/chat/ChatPanel.tsx`**

Add a horizontal row of pill-shaped quick action buttons above the input field. These chips allow one-tap access to common queries.

```text
Current input area:
+-------------------------------+
| [Ask about your insights...]  |  [Send]
+-------------------------------+

Updated input area:
[GCI Trends] [Listing Velocity] [Active Pipeline]
+-------------------------------+
| [Ask about your insights...]  |  [Send]
+-------------------------------+
```

Implementation:
- Create a `SuggestionChips` component or inline it
- Three chips: "GCI Trends", "Listing Velocity", "Active Pipeline"
- Each chip triggers `processMessage()` with the corresponding query
- Style as rounded pills with outline variant
- Horizontal scroll on mobile if needed

---

## Technical Details

### File Changes Summary

| File | Changes |
|------|---------|
| `ChatPanel.tsx` | Add History button, add suggestion chips above input |
| `WidgetPreview.tsx` | Move Pin to card header, update toast message |

### New Components
No new files needed - all changes are modifications to existing components.

### Suggestion Chips Data
```typescript
const suggestionChips = [
  { label: "GCI Trends", query: "Show me my GCI trends" },
  { label: "Listing Velocity", query: "How fast are my listings selling?" },
  { label: "Active Pipeline", query: "What's in my active pipeline?" },
];
```

### Mobile Responsiveness (390px constraint)
- History button: Use `size="icon"` with compact sizing (`h-8 w-8`)
- Suggestion chips: Horizontal scroll container with `overflow-x-auto` and `flex-nowrap`
- Chip sizing: `h-7 sm:h-8` with `text-[11px] sm:text-xs` text
- Maintain existing responsive patterns for chart cards

---

## Visual Summary

```text
+----------------------------------------+
| [Mira Avatar]  Mira AI ▼   [History][+]|  <- Header with History icon
+----------------------------------------+
|                                        |
|  [Welcome message from Mira]           |
|                                        |
|  [User: "Show me GCI trends"]          |
|                                        |
|  [Mira response with chart]            |
|  +--------------------------------+    |
|  | Monthly GCI Trend         [Pin]|    |  <- Pin on chart card
|  |        [Area Chart]            |    |
|  +--------------------------------+    |
|  • 23% growth vs last year             |
|  • December was best month             |
|  [Compare to team?] [Next quarter?]    |
|                                        |
+----------------------------------------+
| [GCI Trends] [Velocity] [Pipeline]     |  <- Suggestion chips
+----------------------------------------+
| [Ask about your insights...]     [Send]|
+----------------------------------------+
```

