

# Plan: Canadian Demo Mode for Agent & Team Dashboards

## Overview

Add a new "Country Mode" toggle to the Demo Config system with two options: **US** (default) and **Canada**. When Canada is selected, the affected screens will show:

1. A **4th transaction status ("Firm")** in agent hero banner and team dashboard
2. **Fractional units** (e.g., 5.05) instead of whole numbers
3. A **disclaimer banner** at the top of agent dashboard, team dashboard, agent transactions, and team reconciliation pages (in English and French Canadian)

## Files to Change

### 1. `src/contexts/DemoConfigContext.tsx`
- Add `CountryMode = "us" | "canada"` type
- Add `countryMode` to `DemoConfig` interface (default: `"us"`)
- Add `setCountryMode` setter and expose it

### 2. `src/components/layout/DemoConfigSheet.tsx`
- Add a new "Country" radio group section (with Globe icon) with two options:
  - **United States** — Default US experience
  - **Canada** — Shows Firm status, fractional units, disclaimer banner

### 3. `src/i18n/en.ts` and `src/i18n/fr-CA.ts`
- Add new keys:
  - `txn.firm`: "Firm" / "Ferme"
  - `disclaimer.canadianAgentTitle`: "Notice for Canadian agents"
  - `disclaimer.canadianTeamLeadTitle`: "Notice for Canadian team leaders"  
  - `disclaimer.canadianMessage`: The full disclaimer text (with `{email}` placeholder and real line breaks)
  - French translations for all of the above

### 4. `src/components/shared/CanadianDisclaimer.tsx` (new)
- A reusable alert/banner component that:
  - Accepts `variant: "agent" | "teamLead"` and `email: string`
  - Shows the appropriate title based on variant
  - Renders the disclaimer message with `{email}` replaced and `\n` as actual line breaks
  - Uses an `Alert` or info-styled card with an `Info` icon
  - Only renders when `countryMode === "canada"` (reads from `useDemoConfig`)

### 5. `src/components/agent/AgentHeroBanner.tsx`
- Add optional `transactionsFirm` prop
- When provided (Canada mode), render a 4th button in the transaction status group for "Firm"
- Adjust grid to accommodate 4 statuses (the transaction mini-stats area already uses a flex layout, so it will naturally accommodate)

### 6. `src/pages/agent/Dashboard.tsx`
- Import `useDemoConfig` and `CanadianDisclaimer`
- When `countryMode === "canada"`:
  - Pass fractional units (e.g., `5.05`) and `transactionsFirm={3}` to `AgentHeroBanner`
  - Render `<CanadianDisclaimer variant="agent" email="agentsupport@example.com" />` above the hero banner

### 7. `src/pages/team/Dashboard.tsx`
- Import `useDemoConfig` and `CanadianDisclaimer`
- When `countryMode === "canada"`:
  - Render `<CanadianDisclaimer variant="teamLead" email="teamsupport@example.com" />` at top of overview
  - Show fractional units in overview stats (the formatter already handles decimals)

### 8. `src/pages/agent/Transactions.tsx`
- Add "Firm" status badge case in `getStatusBadge` (blue-ish styling)
- Add "Firm" to the status filter dropdown when Canada mode
- Render `CanadianDisclaimer` at top when Canada mode

### 9. `src/pages/team/Reconciliation.tsx`
- Add "Firm" status badge case
- Add "Firm" to the status filter dropdown when Canada mode
- Render `CanadianDisclaimer` at top when Canada mode

## Technical Notes

- The disclaimer email is a variable passed as a prop — in a real app this would come from config/API. For demo purposes, a hardcoded placeholder email will be used.
- Units display: when Canada mode is active, the agent dashboard passes `5.05` instead of `5`; team dashboard shows fractional values. The existing `formatNumber` already handles decimals.
- The `CanadianDisclaimer` component internally checks `useDemoConfig().config.countryMode` so consuming pages just need to include it — it self-hides when not in Canada mode.

