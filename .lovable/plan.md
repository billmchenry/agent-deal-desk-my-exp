

## Relocate Mira Suggested Prompts Below Stats Row

Moving the suggestion bar to appear directly after the stats row will create a more contextual experience — users see their key metrics and then are prompted with relevant questions about that data.

### Design Changes

**Current Position:**
```
[Toolbar]
[Ask Mira: Suggestion Chips]  ← Currently here
[Hero Banner]
[Stats Row]
[Action Center]
```

**New Position (matching reference):**
```
[Toolbar]
[Hero Banner]
[Stats Row]
[Ask Mira: Suggestion Chips]  ← Move here, directly below stats
[Action Center]
```

### Visual Updates (per reference)

The suggestion chips will be updated to match the reference design:
- Each chip will have its own Sparkles icon inside it
- Remove the separate "Ask Mira:" label
- Chips will be larger with more padding
- Center-aligned on desktop, scrollable on mobile
- No dismiss button (cleaner look)

### Updated Prompts

More contextual prompts that relate to the stats shown above:
- "Why was March my best month?"
- "What's my YoY growth rate?"
- "Predict my Q1 performance"

---

## Technical Implementation

### Files to Modify

**`src/components/dashboard/MiraSuggestionBar.tsx`**

Update the component design:
- Add Sparkles icon inside each chip button
- Remove the leading "Ask Mira:" label
- Remove the dismiss button for a cleaner look
- Update chip styling for larger touch targets
- Update prompts to be more contextual to stats data

**`src/components/dashboard/StatsRow.tsx`**

Integrate the suggestion bar directly into the StatsRow component:
- Import and render MiraSuggestionBar at the bottom of StatsRow
- This ensures suggestions always appear immediately after the stats

**`src/components/dashboard/CustomizableDashboard.tsx`**

- Remove the standalone MiraSuggestionBar import and render (since it's now part of StatsRow)

### Updated Component Design

```tsx
// MiraSuggestionBar.tsx - Updated structure
const SUGGESTIONS = [
  { label: "Why was March my best month?", query: "Why was March my best month?" },
  { label: "What's my YoY growth rate?", query: "What's my year-over-year growth rate?" },
  { label: "Predict my Q1 performance", query: "Predict my Q1 performance" },
];

return (
  <div className="flex flex-wrap justify-center gap-3 mt-6">
    {SUGGESTIONS.map((s) => (
      <Button variant="outline" className="gap-2 px-4 py-2 rounded-lg">
        <Sparkles className="h-4 w-4" />
        {s.label}
      </Button>
    ))}
  </div>
);
```

### Mobile Considerations

- Chips will wrap to multiple lines if needed, or scroll horizontally
- Maintain 44px minimum touch targets
- Keep the responsive 390px viewport constraint

