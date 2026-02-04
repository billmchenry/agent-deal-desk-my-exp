

## Silent Pre-built Widget Addition

Making pre-built widgets add silently with just a toast notification, keeping the Mira chat for conversational AI insights only.

---

### What Will Change

When you select a pre-built widget (Revenue Forecast, Listing Velocity, etc.) from the "Create Widgets" dropdown:
- **Current**: Widget is added AND Mira sidebar opens with a contextual message
- **After**: Widget is added with a simple toast confirmation, Mira stays closed

The "Ask Mira for Insights" option will continue to open the Mira chat as expected.

---

### Technical Details

**File: `src/components/dashboard/DashboardToolbar.tsx`**

1. Remove the `WIDGET_MIRA_CONFIG` object (lines 24-58) - no longer needed since we won't be sending contextual messages

2. Remove `openChatWithMessage` from the `useMiraChat` destructure (line 89) - only `openChat` is needed for "Ask Mira"

3. Simplify the pre-built widget click handler (lines 195-209) to just:
   ```typescript
   onClick={() => {
     addWidget(type as WidgetType);
     toast.success(`${config.title} added`);
   }}
   ```

This removes approximately 40 lines of code and creates a cleaner separation between:
- **Pre-built shortcuts**: Quick add with toast feedback
- **Ask Mira**: Conversational AI experience

