

## Orphaned & Unused Code Audit

### Unused Components (never imported anywhere)

| File | Description |
|------|-------------|
| `src/components/dashboard/ProgressReportCard.tsx` | Progress report card — defined but never imported |
| `src/components/dashboard/CompanyUplineCard.tsx` | Company upline card — defined but never imported |
| `src/components/dashboard/AppointmentsCard.tsx` | Appointments card — defined but never imported |
| `src/components/dashboard/PinnedWidgetsGrid.tsx` | Pinned widgets grid — defined but never imported |
| `src/components/dashboard/MiraSuggestionBar.tsx` | Mira suggestion bar — defined but never imported |
| `src/components/agent/AgentFilterBar.tsx` | Agent filter bar — replaced by UniversalFilterBar, never imported |
| `src/components/agent/VitalSignsRow.tsx` | Vital signs row — defined but never imported |
| `src/components/agent/IconStatusSummary.tsx` | Icon status summary — defined but never imported |
| `src/components/NavLink.tsx` | NavLink component — defined but never imported |
| `src/data/mockTemplates.ts` | Mock templates data — defined but never imported |

### Summary

- **10 orphaned files** that can be safely deleted
- **0 orphaned pages** — every page in `src/pages/` has a corresponding route in `App.tsx`
- **0 orphaned contexts/hooks** — all contexts and hooks are actively used

### Plan

Delete the 10 files listed above. No other changes needed — no imports reference them so there are zero downstream effects.

