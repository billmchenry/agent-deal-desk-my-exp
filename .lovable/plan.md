
# Inline History Drawer for Mira Chat

Replace the History button's navigation behavior with a mobile-friendly bottom sheet that shows conversation history without leaving the chat panel.

---

## Why Bottom Sheet is the Best Choice

| Approach | Mobile UX Score | Reasoning |
|----------|-----------------|-----------|
| Navigate to /mira/history | Poor | Breaks context, loses current conversation state |
| Dropdown menu | Okay | Limited space, small tap targets, awkward on mobile |
| Inline list (replace messages) | Okay | Mode switching can confuse users |
| **Bottom Sheet (Drawer)** | **Excellent** | Native mobile pattern, thumb-friendly, maintains context |

---

## Implementation Plan

### 1. Add History Drawer State to ChatPanel

Add a new state variable to control the drawer visibility:

```typescript
const [isHistoryOpen, setIsHistoryOpen] = useState(false);
```

### 2. Create Inline History List Component

Build a simplified conversation list optimized for the drawer context:
- Compact conversation items (not full cards)
- Shows title, timestamp, and message count
- Tap to load conversation and close drawer
- Swipe to delete (optional enhancement)

### 3. Wire History Button to Open Drawer

Change the History button's `onClick` from navigating to `/mira/history` to opening the drawer:

```typescript
onClick={() => setIsHistoryOpen(true)}
```

### 4. Implement the Drawer UI

Use the existing `vaul` Drawer component:

```text
+----------------------------------+
|           [Drag Handle]          |
|  Chat History              [X]   |
+----------------------------------+
|  [Search conversations...]       |
+----------------------------------+
|                                  |
|  "Show me my GCI trends"         |
|  2 minutes ago · 3 messages      |
|  --------------------------------|
|  "Listing velocity help"         |
|  Yesterday · 5 messages          |
|  --------------------------------|
|  "Pipeline overview"             |
|  2 days ago · 4 messages         |
|                                  |
+----------------------------------+
|  [View All History →]            |  <- Links to full /mira/history page
+----------------------------------+
```

---

## Technical Details

### File Changes

| File | Changes |
|------|---------|
| `ChatPanel.tsx` | Add drawer state, replace navigation with drawer open, add Drawer component with conversation list |

### Component Structure

```text
ChatPanel
├── SheetContent
│   ├── SheetHeader (with History button)
│   ├── ScrollArea (messages)
│   ├── Suggestion Chips
│   └── Input Area
└── Drawer (NEW - for history)
    ├── DrawerContent
    │   ├── DrawerHeader ("Chat History")
    │   ├── Search Input (optional)
    │   ├── Conversation List
    │   └── "View All" Link
    └── DrawerClose
```

### Conversation List Item (Simplified)

Each item in the drawer shows:
- Conversation title (truncated)
- Relative timestamp ("2 min ago", "Yesterday")
- Message count
- Tap action: load conversation + close drawer

### Mobile Responsiveness

- Drawer uses `snap-points` for predictable heights (50% or 85% of viewport)
- List items have minimum 44px touch targets (Apple HIG recommendation)
- Horizontal swipe gestures preserved for closing
- Search input uses `type="search"` for mobile keyboard optimization

---

## User Flow

1. User taps History icon in chat header
2. Drawer slides up from bottom (50% height default)
3. User sees recent conversations in a scrollable list
4. User taps a conversation → it loads into chat, drawer closes
5. Alternatively, user taps "View All History" → navigates to full history page
6. User can swipe down or tap outside to dismiss drawer

---

## Visual Comparison

**Current (navigates away):**
```text
[Tap History] → Navigate to /mira/history → Full page → Back button → Lost context
```

**Proposed (inline drawer):**
```text
[Tap History] → Drawer slides up → Tap conversation → Drawer closes → Chat updates
```

