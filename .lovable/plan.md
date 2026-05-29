## Goal

Replicate the entire Transactions module from the Mirapro ACR remix into `src/pages/business/Transactions.tsx` and supporting files, including the Create Listing and Create Transaction (contract) flows with the side-by-side PDF viewer. All visuals will use this project's design system (51px button/input/tab radii, 16px card radii, Manrope/Roboto fonts, semantic tokens like `exp-gold`/`exp-green`/`exp-red`, `useFormatters`, logical `ms-*`/`ps-*`), and existing primitives (`DashboardLayout`, `UniversalFilterBar`, `DataTable`, shadcn `Dialog`/`Sheet`/`Button`).

## What gets ported

### Domain & state
- `src/types/transactions.ts` — `Listing`, `ListingExtraction`, `ContractExtraction`, `ChecklistItem`, `ClassifiedDocument`, `BatchUploadState`, etc. (transactions-scoped slice of Mirapro's `types/index.ts` + `types/batch.ts`).
- `src/contexts/TransactionsContext.tsx` — focused context with `listings`, `listingMode`, `pendingExtraction`, `submittedListing`, `contractMode`, `pendingContract`, `activeListingForContract`, `submittedContract`, `batchUploadState`, plus `startListingFlow`, `startContractFlow`, `startTransactionFlow`, `addListing`, `updateListingToContract`, `updateListing`, batch helpers. Mounted high in `App.tsx` (or only around transactions routes).
- `src/data/mockListingExtraction.ts`, `src/data/mockContractExtraction.ts`, `src/data/mockDocumentClassification.ts`, `src/data/mockContractClassification.ts` — ports of the four Mirapro `lib/mock*.ts` files (mock OCR/classification + the `transactionChecklistItems`/`listingChecklistItems` seed data).

### Pages & routes (added to `src/App.tsx`)
- `src/pages/business/Transactions.tsx` — replaces current file. Mirapro layout: header (SkySlope link + Create dropdown with Listing/Transaction/Referral), AI Summary card, 3-up Pipeline / Send DA / Settlement cards, Listings/Transactions tabs, search + status pills, `DataTable` for each tab. Restyled with our tokens (most pieces already exist in the current file — we keep them and re-wire the data source to context).
- `src/pages/business/NewListing.tsx` — `/business/new-listing`; renders `FullExtractionView` for `pendingExtraction`.
- `src/pages/business/NewContract.tsx` — `/business/new-contract/:listingId`; renders `ContractVerificationView` for `pendingContract`.
- Existing `ListingDetails.tsx` route stays; we add a "Convert to Transaction" CTA that calls `startContractFlow(listing)`.

### Components (`src/components/transactions/`)
- `DocumentDropzone.tsx` — drag/drop area with file list (used in upload stage).
- `ProcessingStatus.tsx` + `BatchProcessingStatus.tsx` — Mira-branded loaders.
- `ExtractionSummary.tsx` + `BatchExtractionSummary.tsx` — review-results panels.
- `ExtractionTable.tsx` — inline edit table for extracted fields with confidence chips.
- `PDFViewer.tsx` — left-pane PDF preview with zoom in/out, page nav, fit-to-width (uses `react-pdf` if available — otherwise an `<iframe>` fallback so we don't add a heavy dep without asking).
- `FullExtractionView.tsx` — full-screen Dialog: left = `PDFViewer`, right = scrollable extraction cards (Office, Property Core, Listing Terms, Seller, Property Details) with per-card Edit toggle. Approve / Save Draft / Close.
- `ContractVerificationView.tsx` — analogous full-screen Dialog for contract verification (buyer info, sales price, closing dates, fees, contingencies).
- `SupportingDocumentView.tsx` — secondary doc review used in batch flow.
- `BrokerageIntakeWizard.tsx` + `ManualIntakeFlow.tsx` — multi-step "Create Transaction" wizard when no PDF is available.

### Wiring
- `src/App.tsx` — wrap routes with `TransactionsProvider`; add routes for `/business/new-listing` and `/business/new-contract/:listingId`.
- `i18n/en.ts` (+ other locales mirrored as English fallbacks) — add `transactions.*` keys used by the new screens (titles, buttons, field labels, statuses). Other locales get fallbacks so we don't ship missing strings.

## Design system rules applied during port

- All buttons / inputs / tabs → `rounded-[51px]`; cards → `rounded-2xl` (16px); textareas → `rounded-[26px]`.
- Fonts via existing classes (`font-secondary` + `tabular-nums` for numbers); never raw Tailwind text sizes for typography — use `.text-body` / `.text-caption` semantic classes that exist.
- Colors: Mirapro `text-success` → `text-exp-green`; `text-warning` → `text-exp-gold`; `text-destructive` stays; gradients via `from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue`.
- Currency via `useFormatters().formatNumber` with " USD" suffix (no $ symbol), per project convention.
- Tables use the project `DataTable` (with sticky right "Actions" col), not raw `<Table>`.
- Sheets / Dialogs use existing shadcn wrappers; PDF viewer dialog is full-width per the detail-sheet pattern.
- Toasts via `sonner` (already used).

## What I will NOT change

- Other pages, navigation, auth, theming, mock data outside the transactions slice.
- No backend / Lovable Cloud — all data stays mock + in-memory context (matches Mirapro).
- No new heavy deps unless required. If real PDF preview is required, I'll ask before adding `react-pdf`/`pdfjs-dist`; otherwise the viewer renders an iframe over the uploaded file (or a styled placeholder when no file is present).

## Open question (one)

Mirapro uses `react-pdf`/`pdfjs-dist` for the PDF preview. Adding that is ~3 MB of deps. **Default plan**: render PDFs via an `<iframe src={URL.createObjectURL(file)}>` and keep zoom controls visual-only. Tell me if you want the full `react-pdf` integration instead — I'll add the deps.

## Implementation order

1. Types + mock data + context.
2. PDFViewer + FullExtractionView + NewListing route → wire Create Listing flow end-to-end.
3. ContractVerificationView + NewContract route → wire Create Transaction flow end-to-end.
4. Batch + Manual intake + Brokerage intake wizards.
5. Replace the Transactions page data source with context (keep existing visuals where they already match Mirapro 1:1).
6. i18n keys + smoke-check each route.

Estimated ~15 new files, ~3,500 LOC. After approval I'll execute straight through.
