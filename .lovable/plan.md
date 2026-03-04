

# Documents Portal Page

## Summary

Create a Documents Portal page matching the reference screenshots. The page has two tabs: **My Documents** (card grid with document cards showing title, category badge, file type, description, date, View/Download buttons) and **Team Documents** (collapsible accordion per team member, each expanding to show a table with Document, Category, Date Added, and download icon).

## Sidebar Update

The current sidebar submenu has "All Documents" and "Templates". Based on the screenshots, the sidebar should instead have: **Year-End**, **Downloads**, and **Documents Portal**. Update `mockData.ts` accordingly, update `NAV_KEYS` in Sidebar and MobileNavDrawer, and add i18n keys to all 7 language files.

## New Files

### 1. `src/pages/documents/DocumentsPortal.tsx`

- Uses `DashboardLayout`, `useDocumentTitle`, `useTranslation`, `useFormatters`
- Page title: "Documents Portal"
- Two tabs via `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`: "My Documents" (icon: FileText) and "Team Documents" (icon: Users)
- **My Documents tab**:
  - `SearchFilter` at top for filtering documents by name
  - Responsive card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
  - Each card: title (truncated), category `Badge`, file type line (APPLICATION/PDF with FileText icon), description, "Added: YYYY/MM/DD" date (formatted via `useFormatters`), View button (ghost, Eye icon) and Download button (default, Download icon)
  - `min-h-[44px]` on buttons for a11y touch targets
  - `font-secondary` on dates
- **Team Documents tab**:
  - "Team Member Documents" subheader with Users icon
  - Collapsible `Accordion` per team member: name on left, "N documents ▾" on right
  - Expanded view: simple table with columns: Document (filename), Category (badge text), Date Added, download icon button
  - `font-secondary` on dates
- Mock data: 3 "my" documents and 4 team members with varying document counts, matching the screenshot content
- All text uses CSS variable tokens for dark mode, all interactive elements have aria-labels

### 2. `src/pages/documents/YearEnd.tsx` and `src/pages/documents/Downloads.tsx`

Placeholder pages with `DashboardLayout` and a simple "Coming Soon" message, so the sidebar links don't 404.

## Modified Files

### `src/data/mockData.ts`
Update Documents submenu: Year-End (`/documents/year-end`), Downloads (`/documents/downloads`), Documents Portal (`/documents/portal`). Update both `sidebarNavigation` and `navItems`.

### `src/App.tsx`
Add routes: `/documents/portal`, `/documents/year-end`, `/documents/downloads`

### `src/components/layout/Sidebar.tsx` + `MobileNavDrawer.tsx`
Add NAV_KEYS: `"Year-End"`, `"Downloads"`, `"Documents Portal"`. Remove old `"All Documents"`, `"Templates"`.

### `src/i18n/*.ts` (all 7 files)
Add keys: `nav.yearEnd`, `nav.downloads`, `nav.documentsPortal`, `documents.title`, `documents.myDocuments`, `documents.teamDocuments`, `documents.searchPlaceholder`, `documents.view`, `documents.download`, `documents.added`, `documents.document`, `documents.category`, `documents.dateAdded`, `documents.teamMemberDocuments`, `documents.nDocuments`

## Implementation Order

1. Create mock data and `DocumentsPortal.tsx` with both tabs
2. Create placeholder `YearEnd.tsx` and `Downloads.tsx`
3. Update sidebar navigation in mockData
4. Add routes in App.tsx
5. Update Sidebar/MobileNavDrawer NAV_KEYS
6. Add i18n keys to all 7 language files

