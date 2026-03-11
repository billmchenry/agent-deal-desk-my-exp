

# Organization Tree Page Update

## Changes Required (Current → Reference)

### 1. Add Hero Banner
The reference shows a dark navy banner at the top containing:
- Agent icon + name ("Michael Thompson")
- Subtitle: "Level 0 • 10 FLAs"
- Four stat tiles in a row: **TOTAL REV SHARE** (36,522.44), **DIRECT FLAS** (10), **TOTAL ORG** (20), **ICON AGENTS** (2, in green)

Currently the page just has plain text "Michael Thompson - Level 0 / 10 FLAs". This needs to become a styled banner similar to other hero banners in the app.

### 2. Simplify Agent Card Stats Layout
Current: "Contributed Rev Share" in a highlighted muted box, then "Individual Rev Share Contribution" and "Org Size" below.

Reference: Three columns in a horizontal row with uppercase labels:
- **REV SHARE** — value
- **CONTRIBUTION** — value  
- **ORG SIZE** — value

No highlighted box — just a clean horizontal stat row with small uppercase labels.

### 3. Update Level Badges
Current: "Level 1" spelled out in a badge.
Reference: Compact "L1" badge (small, colored). ICON badge remains green.

### 4. Change "View Org" to Link Style
Current: Full-width outline button "View Org (5)".
Reference: Text link style with users icon: "👥 View Org (5) >" — left-aligned, subtle.

### 5. Remove "Contributed Rev Share" Highlighted Section
Replace the muted background box with the flat 3-column stat row.

## Files to Modify
- `src/pages/revshare/OrganizationTree.tsx` — All changes are in this single file:
  - Add a hero banner component (dark navy card with stat tiles) replacing the plain text header
  - Update `AgentCard` component: replace highlighted rev share box with 3-column stat row, shorten badge text to "L1", change View Org to link style
  - Compute aggregate stats (total rev share, total org, icon agents count) for the banner

## Technical Approach
- Hero banner: Use a Card with `bg-[#1a2332]` dark background (matching the app's dark navy theme), with 4 bordered stat tiles inside
- Stats row in cards: Simple `grid grid-cols-3` with uppercase `text-[10px]` labels
- View Org: Use a ghost button or anchor-style link with `Users` icon and chevron right
- Badge: Change "Level 1" → "L1" using shorter format

