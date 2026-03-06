

## Problem Analysis

The bottom card on the Profile page has **8 tabs**, which is excessive:
- **3 trivial tabs**: Partner Agent (1 checkbox), Transaction Preferences (1 checkbox), Mentor (1 radio group) — these don't deserve their own tabs
- **5 table tabs**: Office Locations, Active Markets, Organizations, Teams, Licenses — tables are unreadable on mobile

## Proposed Solution: Accordion sections with mobile card views

Replace the 8-tab card with a single **accordion layout**. Each section is a collapsible row. This eliminates tab navigation entirely and lets users scan everything at a glance.

### Layout

```text
┌─────────────────────────────────┐
│ ▸ Office Locations         (2)  │
│ ▸ Active Markets           (1)  │
│ ▸ Organizations            (3)  │
│ ▸ Teams                    (1)  │
│ ▸ Licenses                 (2)  │
│ ▾ Preferences & Other           │
│   ☐ Split Check Preference      │
│   ☐ Partner Agent               │
│   Mentor: ● Mentor ○ Mentee     │
└─────────────────────────────────┘
```

### Key decisions

1. **Merge trivial tabs** — Partner Agent, Transaction Prefs, and Mentor become a single "Preferences & Other" accordion section with inline controls
2. **Card view for tables on mobile** — Office Locations, Active Markets, Organizations, Teams, and Licenses render as stacked cards on mobile (`< md`) and tables on desktop (`>= md`)
3. **Item counts in headers** — Each accordion trigger shows the count badge so users know what's inside without expanding
4. **First section open by default** — Office Locations starts expanded

### Files to modify

- **`src/pages/profile/PersonalDetails.tsx`** — Replace bottom `<Tabs>` with `<Accordion>`, merge trivial sections
- **`src/components/profile/OfficeLocationsTab.tsx`** — Add mobile card render alongside table
- **`src/components/profile/ActiveMarketsTab.tsx`** — Add mobile card render
- **`src/components/profile/OrganizationsTab.tsx`** — Add mobile card render
- **`src/components/profile/TeamsTab.tsx`** — Add mobile card render
- **`src/components/profile/LicensesTab.tsx`** — Add mobile card render
- **Delete or deprecate**: `PartnerAgentTab.tsx`, `TransactionPrefsTab.tsx`, `MentorTab.tsx` — their content moves inline into a "Preferences" accordion section

