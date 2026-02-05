

## Mira AI Suggested Prompts on Dashboard

Adding suggested prompts directly on the dashboard will significantly increase Mira's visibility and encourage users to interact with the AI assistant without needing to click the floating button first.

### Recommended Approach

Create a new "Ask Mira" suggestion component that displays contextual prompt chips below the toolbar. When clicked, these chips will open the Mira chat and automatically send the selected query.

### Component Design

**Location:** Below the dashboard toolbar, above the widgets grid

**Layout:**
- Compact horizontal row with a subtle Sparkles icon
- 3-4 clickable suggestion chips
- Scrollable on mobile for responsiveness
- Dismissible (optional) with a close button that remembers preference

**Visual Style:**
```
[✨ Ask Mira] [Show my GCI trends] [Pipeline overview] [Listing velocity]
```

### Suggested Prompts (Contextual)

The prompts will be relevant to real estate agents:
- "Show my GCI trends"
- "How's my pipeline?"
- "Listing velocity insights"
- "Compare to last year"

### User Flow

1. User sees prompt chips on dashboard
2. Clicks a chip (e.g., "Show my GCI trends")
3. Mira chat opens
4. Query is automatically sent
5. Mira responds with relevant widget and insights

---

## Technical Implementation

### Files to Create

**`src/components/dashboard/MiraSuggestionBar.tsx`** (new)

A horizontal bar component that:
- Uses `useMiraChat` hook to access `openChat` and `setCurrentMessages`
- Displays 3-4 suggestion chips with the Sparkles icon
- Triggers the chat with a pre-filled query on click
- Horizontally scrollable on mobile
- Optional dismiss functionality using local storage

### Files to Modify

**`src/components/dashboard/CustomizableDashboard.tsx`**

- Import and render `MiraSuggestionBar` between toolbar and widgets grid
- Position it as the first element after the toolbar

**`src/contexts/MiraChatContext.tsx`**

- Add a new function `openChatWithQuery(query: string)` that:
  - Opens the chat
  - Immediately processes the query as if the user typed it

### Component Structure

```tsx
// MiraSuggestionBar.tsx
function MiraSuggestionBar() {
  const suggestions = [
    { label: "GCI trends", query: "Show me my GCI trends" },
    { label: "Pipeline overview", query: "What's in my pipeline?" },
    { label: "Listing velocity", query: "How fast are my listings selling?" },
    { label: "Compare to last year", query: "Compare my performance to last year" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <Sparkles className="text-primary" />
      <span className="text-sm text-muted-foreground">Ask Mira:</span>
      {suggestions.map(s => (
        <Button variant="outline" onClick={() => openChatWithQuery(s.query)}>
          {s.label}
        </Button>
      ))}
    </div>
  );
}
```

### Mobile Considerations

- Chips will be horizontally scrollable with `overflow-x-auto`
- Hide "Ask Mira:" label on very small screens
- Ensure minimum 44px touch targets

