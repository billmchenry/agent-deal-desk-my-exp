## Goal

When Mira finishes extracting a contract, show a "sneak peek" card with the key transaction fields and a compliance banner — the same pattern listings already use — instead of jumping straight to a bare "View & Edit" button.

## Where it lives

In `src/components/chat/ChatPanel.tsx`, the contract flow's `contractMode === "ready"` block (around line 915) renders just a single `View & Edit` button. We'll swap that for a new summary card.

## New component

Create `src/components/transactions/ContractExtractionSummary.tsx`, modeled directly on `ExtractionSummary.tsx` so the visual treatment (icon tiles, compliance banner, full-width primary button, rounded card) matches one-for-one.

Rows displayed:

- **Property** (MapPin, primary tone) — `extraction.propertyAddress` plus the parent listing's city/state for context
- **Buyers** (Users, primary tone) — joined `extraction.buyers[].name`
- **Sales Price & Commission** (DollarSign, green tone) — `salesPrice` formatted as `### USD` plus combined `listingBrokerFee + buyingBrokerFee` shown as a percentage of sales price (fallback to "—" when fees missing)
- **Closing** (Calendar, blue tone) — `Closes {formatted closingDate}`

Compliance banner reuses the listing wording ("100% Compliant" / "All signatures and initials detected") since the contract flow's chat copy already promises the same outcome.

Primary CTA: `View & Edit`, wired to the existing `onViewFullExtraction` handler.

## Wiring

In `ChatPanel.tsx`:

- Import the new `ContractExtractionSummary`.
- Replace the line 915 button with:
  - `<ContractExtractionSummary extraction={pendingContract} listing={activeListingForContract} onViewFullExtraction={handleViewContractExtraction} />`
  - Followed by the existing Cancel ghost button (to match the listing flow which also exposes Cancel).
- Keep the rest of the flow (messages, processing, selecting_listing, submitted) unchanged.

## Out of scope

- No changes to the contract extraction data model, mock data, or the full `ContractVerificationView`.
- No changes to the listing sneak peek.
- No copy changes to Mira's chat bubbles.
