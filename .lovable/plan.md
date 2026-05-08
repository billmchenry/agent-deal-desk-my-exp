Replace the three-dot dropdown with a row → side-drawer detail pattern, matching the project's existing Detail Sheet Pattern.

## UX

- **Row click** anywhere on a listing opens a right-side `Sheet` drawer (~480px wide on desktop, full-width on mobile, per the Detail Sheet memory).
- **Actions column** shrinks to a single icon-only `ExternalLink` button → opens SkySlope in a new tab. Tooltip: "Open in SkySlope". `stopPropagation` so it doesn't also open the drawer.
- **Drawer contents** (`ListingDetailSheet`):
  - Sticky header: address (h2) + city + status badge, close button.
  - Property block: MLS#, Listing Price, Expiration Date, Stage badge.
  - People block: Listing Agent, Office.
  - Footer (sticky): primary `Edit Listing` button + secondary `Open in SkySlope ↗` button. Both 51px pill, min-h 44px.
- Hover state on rows (`hover:bg-muted/50 cursor-pointer`) to signal interactivity.
- Keyboard: rows get `role="button"` + Enter/Space handler; drawer traps focus (Sheet handles this).

## Files

- **New:** `src/pages/business/components/ListingDetailSheet.tsx` — controlled `Sheet` with the listing prop and the layout above.
- **Edit:** `src/pages/business/Transactions.tsx`
  - Add `selectedListing` state + open handler.
  - Pass `onRowClick={(row) => setSelectedListing(row)}` to `DataTable`.
  - Replace the `actions` column render with a single icon button (`ExternalLink`).
  - Mount `<ListingDetailSheet listing={selectedListing} onClose={() => setSelectedListing(null)} />`.
  - Drop the now-unused `DropdownMenu*` imports and `MoreVertical`.
- **Edit:** all 7 i18n files (`en, es, fr-CA, de, ja, zh, ar`) — add `transactions.openInSkySlopeAria` and `transactions.detailsTitle` / drawer field labels. Remove or repurpose `viewDetails` (no longer needed).

## Out of scope

- No data changes, no DataTable refactor (it already supports `onRowClick`), no business-logic changes.