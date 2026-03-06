

## Complete RTL & Translation Coverage Sweep

### Remaining Gaps

After auditing the codebase, there are two categories of remaining issues:

**A. Pages/components with NO `useTranslation` — still fully hardcoded English (~4 files, ~80 strings)**

| File | Hardcoded strings |
|------|-------------------|
| `src/pages/agent/IconProgram.tsx` | ~40 strings ("ICON PROGRAM", "33% of pillars complete", "ICON Production Overview", "Capping Year", all pillar names, status labels, etc.) |
| `src/components/agent/IconStatusBanner.tsx` | ~10 strings (tab labels, status text) |
| `src/components/agent/CappingSection.tsx` | ~10 strings |
| `src/components/agent/CappingHistorySection.tsx` | ~10 strings |
| `src/components/agent/AgentHeroBanner.tsx` | ~10 strings (stat labels) |

**B. Remaining physical CSS properties that don't flip in RTL (~40 instances across ~15 files)**

Most are in:
- **Decorative elements** (`right-0`, `right-8`, `right-20` on hero banner circles) — these are cosmetic and acceptable as-is
- **UI primitives** (`src/components/ui/*`) — shadcn components, generally shouldn't be modified
- **Content pages** with `mr-1`, `ml-0.5`, `text-right`, `pl-9` scattered in:
  - `revshare/Dashboard.tsx` — `mr-1`, `lg:border-l lg:pl-4`
  - `MentorRequests.tsx` — `text-right`, `ml-0.5`
  - `team/Dashboard.tsx` — `-ml-2`
  - `IconProgram.tsx` — `mr-1`
  - `ChatPanel.tsx` — `pr-8`
  - `Header.tsx` — `pl-2 pr-1` (mobile avatar button)
  - `SearchFilter.tsx` — `pl-9` (search icon padding)
  - `OrganizationTree.tsx` — `pl-9`
  - `StepMentorship.tsx` — `text-right` (character count)

### Plan

**Batch 1: Add translation keys for remaining untranslated pages (~5 files)**
- Add ~60 new keys to `en.ts` under `icon.*`, `agent.*` namespaces
- Wire up `useTranslation` in `IconProgram.tsx`, `IconStatusBanner.tsx`, `CappingSection.tsx`, `CappingHistorySection.tsx`, `AgentHeroBanner.tsx`

**Batch 2: Convert remaining physical CSS → logical in content files (~10 files)**
- `mr-1` → `me-1`, `ml-0.5` → `ms-0.5`, `-ml-2` → `-ms-2`
- `text-right` → `text-end`
- `pl-9` → `ps-9`, `pr-8` → `pe-8`
- `lg:border-l lg:pl-4` → `lg:border-s lg:ps-4`
- `pl-2 pr-1` → `ps-2 pe-1` (Header mobile button)
- Skip decorative `right-0/right-8/right-20` on hero banners (purely visual circles, direction-agnostic)
- Skip `src/components/ui/*` (shadcn primitives)

**Batch 3: Add new keys to all 6 non-English language files**
- ~60 new keys × 6 languages

### Files to Change (~18 files)

Batch 1 (translation): `en.ts`, `IconProgram.tsx`, `IconStatusBanner.tsx`, `CappingSection.tsx`, `CappingHistorySection.tsx`, `AgentHeroBanner.tsx`

Batch 2 (RTL CSS): `revshare/Dashboard.tsx`, `MentorRequests.tsx`, `team/Dashboard.tsx`, `ChatPanel.tsx`, `Header.tsx`, `SearchFilter.tsx`, `OrganizationTree.tsx`, `StepMentorship.tsx`

Batch 3 (language sync): `fr-CA.ts`, `es.ts`, `de.ts`, `zh.ts`, `ja.ts`, `ar.ts`

