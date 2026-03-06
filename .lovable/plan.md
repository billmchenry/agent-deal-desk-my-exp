

## New "Financials" Page under RevShare Earnings

Based on the reference screenshots, this is a "My Revenue Share" page with four tabs: **Unpaid**, **Expected**, **Last Paid**, and **Periodic Overview**. Each tab contains a DataTable with agent-level revenue share data, plus a Download button and result count.

### What will be built

**1. New page: `src/pages/revshare/Financials.tsx`**

A tabbed page using the existing `Tabs` component with four tabs:

- **Unpaid** — DataTable with columns: Agent Name, UUID, Level, Country, State, Total Revenue Share. Column filters per the reference.
- **Expected** — Same table structure as Unpaid (no UUID column based on image 14).
- **Last Paid** — Left sidebar card showing "Payment Details" (Initial Revenue Share, Adjustment Amount in green, Final Revenue Share, Batch ID). Right side: DataTable with Agent Name, Level, Country, State, Total Revenue Share.
- **Periodic Overview** — DataTable with columns: Date, Initial Revenue Share, Adjustment, Final Revenue Share, Transaction Count (6 Mo), Member Count, Monthly (Yes/No), Batch Number.

Each tab shows a Download button and "{N} Results" count. All tables use the existing `DataTable` component with sorting and column filters. Mock data (~12-15 rows per tab) with realistic agent names and dollar amounts.

**2. Routing & Navigation**

- Add route `/revshare/financials` in `App.tsx`
- Add "Financials" to the RevShare Earnings submenu in `sidebarNavigation` and `navItems` in `mockData.ts`
- Add nav translation key in `Sidebar.tsx`

**3. i18n**

- Add translation keys for tab names, column headers, and payment details labels across all locale files.

**4. Page title**

- "My Revenue Share" as the page heading, using `useDocumentTitle`.

### Technical approach

- Reuse `DashboardLayout`, `DataTable`, `Tabs`, `Card`, `Button` components
- Use `useFormatters` for currency formatting with USD suffix
- Back button navigation pattern (matching RevShareGroup page)
- Responsive: on mobile, Last Paid tab stacks the payment card above the table

