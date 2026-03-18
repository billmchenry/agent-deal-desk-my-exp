

## Plan: Add View Details Icon to Mobile Transaction Cards

### Change: `src/pages/agent/Transactions.tsx`

Update the `mobileCardRender` function to include a chevron-right icon (`ChevronRight` from lucide-react) on the right side of each card, serving as a visual "view details" tap target. The icon will be placed in the top row alongside the status badge and transaction ID, using `flex items-center` layout. Tapping the card already triggers `handleRowClick` via `onRowClick`, so no new click handler is needed -- the icon is purely a visual affordance.

```tsx
// Import ChevronRight from lucide-react

// In mobileCardRender, wrap content in a flex row with the icon:
<div className="flex items-start gap-2">
  <div className="flex-1 space-y-1.5">
    {/* existing card content */}
  </div>
  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
</div>
```

This is a single-file, minimal change.

