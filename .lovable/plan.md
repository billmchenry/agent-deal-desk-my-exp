

## Accessibility Consistency Sweep

After auditing the full codebase against the project's WCAG 2.2 checklist, here are the remaining gaps organized into three categories.

---

### Issue 1: Hardcoded `useDocumentTitle` strings (12 pages)

These pages pass raw English strings instead of translation keys, breaking the page title for non-English users:

| Page | Current | Fix |
|------|---------|-----|
| `Index.tsx` | `"Home"` | `t("nav.home")` |
| `agent/Dashboard.tsx` | `"Agent Dashboard"` | `t("nav.agentDashboard")` |
| `agent/CustomServiceFees.tsx` | `"Custom Service Fees"` | `t("nav.customServiceFees")` |
| `team/Dashboard.tsx` | `"My Team"` | `t("nav.myTeam")` |
| `profile/PersonalDetails.tsx` | `"My Profile"` | `t("nav.myProfile")` |
| `mira/History.tsx` | `"Chat History"` | `t("nav.chatHistory")` |
| `revshare/Organization.tsx` | `"Organization Reporting"` | `t("nav.orgReporting")` |
| `revshare/OrganizationTree.tsx` | `"Organization Tree"` | `t("nav.orgTree")` |
| `revshare/Trends.tsx` | `"RevShare Trends"` | `t("nav.revShareTrends")` |
| `notifications/Notifications.tsx` | `"Notifications"` | `t("nav.notifications")` |
| `help/HelpCenter.tsx` | `"Help Center"` | `t("nav.helpCenter")` |
| `Pulse.tsx` | `"Pulse"` | `t("nav.pulse")` |

Add the missing keys to `en.ts` and all 6 language files.

---

### Issue 2: Icon-only buttons missing `aria-label` (~25 instances)

Per the checklist, every `size="icon"` button needs an `aria-label`. These are missing:

| File | Button | aria-label to add |
|------|--------|-------------------|
| **Pulse.tsx** (×3) | Refresh pinned insights, Refresh insight, Remove insight | `t("pulse.refresh")`, `t("pulse.refreshInsight")`, `t("pulse.removeInsight")` |
| **ChatPanel.tsx** (×8) | Back from history, Expand/collapse, History, Close, Stop listening, Attach files, Speech-to-text, Voice mode, Send | Replace `title` attrs with `aria-label` using translation keys |
| **VoiceMode.tsx** (×2) | Attach files, Toggle listening | `t("chat.attachFiles")`, `t("chat.toggleListening")` |
| **MiraChatbot.tsx** (×2) | Mic, Send | `t("chat.voiceInput")`, `t("chat.send")` |
| **ConversationCard.tsx** (×1) | Delete conversation | `t("chat.deleteConversation")` |
| **WidgetPreview.tsx** (×1) | Pin to dashboard — has `title` but needs `aria-label` |
| **DraggableWidget.tsx** (×1) | Remove widget | `t("dashboard.removeWidget")` |
| **NewsAndTrainingCard.tsx** (×1) | Play video | `t("dashboard.playVideo")` |
| **UplinePartnersCard.tsx** (×2) | Phone, Email | `t("common.call")`, `t("common.email")` |
| **Notifications.tsx** (×1) | Collapse trigger — needs `aria-label` |

---

### Issue 3: Remaining physical CSS `ml-auto` in content files (2 instances)

| File | Line | Fix |
|------|------|-----|
| `OrganizationTree.tsx` | `ml-auto` on ICON badge | `ms-auto` |
| `Notifications.tsx` | `ml-auto` on collapsible trigger | `ms-auto` |
| `DataTable.tsx` | `ml-auto` on results count | `ms-auto` |

(Skip `ml-auto` in `src/components/ui/*` — those are shadcn primitives.)

---

### Implementation Plan

**Batch 1 — aria-labels (~10 files)**
Add `aria-label` with translation keys to all icon-only buttons listed above. Where `title` is used instead, replace with `aria-label` (or add both).

**Batch 2 — Document titles (12 pages + 7 i18n files)**
Replace hardcoded strings with `t()` calls. Add ~12 new `nav.*` keys to all language files.

**Batch 3 — Physical CSS cleanup (3 files)**
`ml-auto` → `ms-auto` in `OrganizationTree.tsx`, `Notifications.tsx`, `DataTable.tsx`.

### Files to Change (~22 files)

- `src/pages/Index.tsx`, `agent/Dashboard.tsx`, `agent/CustomServiceFees.tsx`, `team/Dashboard.tsx`, `profile/PersonalDetails.tsx`, `mira/History.tsx`, `revshare/Organization.tsx`, `revshare/OrganizationTree.tsx`, `revshare/Trends.tsx`, `notifications/Notifications.tsx`, `help/HelpCenter.tsx`, `Pulse.tsx`
- `src/components/chat/ChatPanel.tsx`, `VoiceMode.tsx`, `ConversationCard.tsx`, `WidgetPreview.tsx`
- `src/components/layout/MiraChatbot.tsx`
- `src/components/dashboard/DraggableWidget.tsx`, `NewsAndTrainingCard.tsx`, `UplinePartnersCard.tsx`
- `src/components/shared/DataTable.tsx`
- `src/i18n/en.ts`, `ar.ts`, `es.ts`, `fr-CA.ts`, `de.ts`, `zh.ts`, `ja.ts`

