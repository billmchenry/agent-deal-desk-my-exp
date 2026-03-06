

## Fix RTL Layout on Mobile

### Problem

When Arabic (RTL) is selected, the mobile layout breaks badly:
1. **Content clipped/shifted left** — text and cards overflow or align to the wrong side
2. **Header icons reversed but layout not mirrored** — hamburger menu stays left, avatar stays right
3. **Hardcoded physical CSS properties** throughout the codebase (`left-0`, `right-6`, `ml-9`, `ml-64`, `pl-2`, `pr-1`, `text-left`) don't flip in RTL
4. **CSS overrides in `index.css`** are incomplete — only cover ~7 classes but there are 60+ physical-direction usages in layout files alone
5. **Mobile nav drawer** opens from `side="left"` regardless of RTL
6. **Cards and content areas** use physical margins/padding that don't flip

### Approach

Replace physical CSS properties with Tailwind's **logical property utilities** across layout-critical files. Tailwind v3+ supports these out of the box:

| Physical | Logical (auto-flips in RTL) |
|----------|----------------------------|
| `ml-*` | `ms-*` (margin-inline-start) |
| `mr-*` | `me-*` (margin-inline-end) |
| `pl-*` | `ps-*` (padding-inline-start) |
| `pr-*` | `pe-*` (padding-inline-end) |
| `left-*` | `start-*` (inset-inline-start) |
| `right-*` | `end-*` (inset-inline-end) |
| `text-left` | `text-start` |
| `text-right` | `text-end` |

Then remove the fragile `[dir="rtl"]` CSS overrides from `index.css`.

### Files to Change (~10 files)

1. **`src/components/layout/DashboardLayout.tsx`** — `lg:ml-16`/`lg:ml-64` → `lg:ms-16`/`lg:ms-64`; `right-6` → `end-6`; `left-2` → `start-2`
2. **`src/components/layout/Header.tsx`** — `left-0 right-0` → `inset-x-0`; `lg:left-16`/`lg:left-64` → `lg:start-16`/`lg:start-64`; `-right-1` → `-end-1`; `pl-2 pr-1` → `ps-2 pe-1`
3. **`src/components/layout/Sidebar.tsx`** — `fixed left-0` → `fixed start-0`; `ml-9` → `ms-9`
4. **`src/components/layout/MobileNavDrawer.tsx`** — Dynamic `side` based on locale (RTL → `"right"`, LTR → `"left"`); `ml-9` → `ms-9`; `text-left` → `text-start`
5. **`src/components/layout/AccountSheet.tsx`** — `mr-2` → `me-2`
6. **`src/components/layout/MiraChatbot.tsx`** — physical `left-` positioning → logical
7. **`src/components/chat/ChatPanel.tsx`** — `right-6` → `end-6`
8. **`src/index.css`** — Remove all `[dir="rtl"]` override rules (lines 220-258), no longer needed
9. **`src/components/layout/GlobalSearch.tsx`** — `left-0 right-0` → logical
10. **`src/components/layout/NotificationsSheet.tsx`** — `text-left` → `text-start`

### Additional spot-fixes across content pages (~5-8 files)

- `text-left` → `text-start` and `text-right` → `text-end` in key pages: `Notifications.tsx`, `MentorProgram.tsx`, `Financials.tsx`, `CustomServiceFees.tsx`
- `ml-*`/`mr-*` → `ms-*`/`me-*` in content components where directional margin is used

### What stays unchanged
- `gap-*`, `space-y-*`, `px-*` — already direction-agnostic
- `justify-between`, `items-center` — flexbox handles RTL automatically
- `text-right` on tabular number columns — these are numeric alignment, will convert to `text-end` which works correctly in both directions

