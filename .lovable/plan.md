

## Update News & Training Tabbed Menu

Apply the pill-shaped frosted tab bar styling to the `NewsAndTrainingCard` component.

### Change in `src/components/dashboard/NewsAndTrainingCard.tsx`

**TabsList** (line ~25): Replace `className="w-full mb-4"` with:
```
w-full mb-4 bg-muted/60 backdrop-blur-sm border border-border/50 rounded-full h-10 p-1
```

**TabsTrigger** (lines ~26-27): Replace current className with:
```
flex-1 rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-bold
```

This overrides the default rectangular tab styling with the frosted pill design matching the user's spec.

