

## Organization Tree — Match Reference Design

### What Changes

The current page has 10 top-level agents. The reference screenshot shows **1 direct FLA** ("Robert Alan Crawford") with an org size of 22, making the total org 23. The hero stats, mock data, and agent details need to align with this design.

### Changes Required

**1. Replace mock data** in `OrganizationTree.tsx`:
- Single top-level agent: **Robert Alan Crawford**, San Francisco, CA, Level 1, ICON, Rev Share 48,520.44, Contribution 0.00, Org Size 22
- Populate his `children` array with ~22 nested agents across multiple levels to support the drill-down
- Update the `makeContact` helper calls accordingly

**2. Hero banner stats alignment:**
- TOTAL REV SHARE: 48,520.44
- DIRECT FLAS: 1
- TOTAL ORG: 23
- ICON AGENTS: 1 (green)
- These should compute correctly from the new mock data

**3. Agent card styling:**
- Add a **gold/amber left border** to the agent card (visible in screenshot as a yellow-gold vertical accent on the left edge of Robert's card)

**4. No structural/layout changes needed** — the hero banner, filter bar, search, and card grid layout already match the reference.

### Technical Details

- File: `src/pages/revshare/OrganizationTree.tsx`
- Replace `orgTree` array with single-agent structure containing nested children
- Add `border-l-4 border-amber-400` (or similar) to the `AgentCard` `<Card>` component
- Ensure `sumRevShare`, `countAllAgents`, `countIconAgents` recursive helpers produce correct totals from new data

