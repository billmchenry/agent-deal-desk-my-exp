

## Inline Top Agents Expansion

### What changes

Instead of clicking "View All" and navigating to a completely separate page, the Top Agents card will **expand in-place** to show the full DataTable directly within the dashboard.

### Visual behavior

**Collapsed (default — what you see now):**
- Top Agents card with tabs (Units / Volume / Commission)
- Shows top 2 agents per tab
- "View All" link at the bottom

**Expanded (after clicking "View All"):**
- Same card grows taller
- The 2-agent preview is replaced by the full DataTable (sortable columns, filters, CSV export, pagination)
- "View All" becomes **"Show Less"** to collapse back
- Everything else on the dashboard stays visible — no page navigation

### Technical changes

**File: `src/pages/team/Dashboard.tsx`**
1. Remove `"topAgents"` from the `View` type (becomes `"overview" | "agentDetails"`)
2. Delete the entire `if (view === "topAgents")` block (lines 111-146)
3. Add a `showAllTopAgents` boolean state
4. In the Top Agents card: when `showAllTopAgents` is true, render the `<DataTable>` inline instead of the 2-agent preview list
5. Change "View All" button to toggle `showAllTopAgents` and show "Show Less" when expanded

