

## Full Localization: Translate All Pages to All Languages

### Problem

Two gaps exist in the i18n coverage:

**Gap 1: Hardcoded English strings in components/pages (~100+ strings)**

Pages/components that either don't use `useTranslation` at all or still have many inline English strings:

| Area | Files with hardcoded strings |
|------|------------------------------|
| **RevShare Dashboard** | `revshare/Dashboard.tsx` — ~30 hardcoded strings (descriptions, labels, tooltips, button text) |
| **Mentor Program** | `MentorProgram.tsx`, `MentorRequests.tsx`, `MyMentees.tsx`, `MentorApply.tsx` — entire pages never use `t()` (~50 strings) |
| **Mentor Components** | `ChooseMentorSheet`, `MenteeContactSheet`, `MenteeTransactionSheet`, `MentorProfileSheet`, `MentorRequestDetailSheet`, `MyMentorProfileSheet`, step components — zero `useTranslation` (~40 strings) |
| **Chat Components** | `ChatMessage`, `ChatPanel`, `ConversationCard`, `VoiceMode`, `WidgetPreview` — zero `useTranslation` (~15 strings) |
| **Dashboard Widgets** | `AIInsightWidget`, `PipelineWidget`, `VelocityWidget`, `ForecastWidget` — partial or no `t()` (~20 strings) |
| **Profile Tabs** | Several profile tab components have hardcoded labels |
| **Other Pages** | `Pulse.tsx`, `OrganizationTree.tsx` ("View in Beta"), `Trends.tsx` ("United States", "Canada") |

**Gap 2: Missing keys in non-English language files**

| Language | Keys (approx) | vs en.ts (~588) | Missing |
|----------|---------------|-----------------|---------|
| fr-CA | ~480 | 590 | ~110 |
| es | ~428 | 590 | ~162 |
| de | ~459 | 590 | ~131 |
| zh | ~459 | 590 | ~131 |
| ja | ~409 | 590 | ~181 |
| ar | ~459 | 590 | ~131 |

### Scope & Approach

This is a large task (~150+ new translation keys, ~900+ translations across 6 languages, ~25+ component files to update). It should be done in batches:

**Batch 1: Extract hardcoded strings → add to en.ts + wire up `t()` calls**
- RevShare Dashboard (~30 new keys)
- Mentor pages & components (~50 new keys)
- Chat components (~15 new keys)
- Dashboard widgets (~20 new keys)
- Remaining profile/page strings (~15 new keys)

Files to change: ~25 component/page files + `en.ts`

**Batch 2: Sync all 6 non-English language files with en.ts**
- Add all missing keys to `fr-CA.ts`, `es.ts`, `de.ts`, `zh.ts`, `ja.ts`, `ar.ts`
- This includes both the ~110+ keys already missing AND the ~130 new keys from Batch 1

Files to change: 6 language files

### Key Decisions
- Country names ("United States", "Canada") and proper nouns ("FLA", "FLQA", "ICON") stay untranslated
- Mock notification descriptions with natural language stay as-is (they'd come from a backend in production)
- Chat AI responses are not translated (they're mock AI output)
- Column `header` strings in DataTable configs (like in `MyMentees.tsx`) will use `t()` calls

### Batch 1 Detail: New en.ts Keys (~130 keys)

Categories of new keys needed:
- `revshare.*` — "After Adj.", "Before Adj.", "Adjustment", "FLA · Front Line Agents", "View FLA List", "Calculated but not paid out", "Estimated next scheduled payout", "Most recent payout amount", "View Periodic Overview", "Pay Now requests may take up to 2 business days...", "Agent distribution across levels...", "Rev Share" tab label, "Revenue", "Actual", "Bonus", "Current", "Goal", "Swipe to scroll · Tap points for details"
- `mentor.*` — "For Mentors", "I Want to Be a Mentor", "Application Submitted", "Your mentor application has been submitted...", "Complete your Certification NOW!", "Start Training", "My Mentees", "My Mentor Requests", "My Mentor Profile", "View & edit", "First Name", "Last Name", "Request Sent", "Respond to Request", "Accept", "Decline", etc.
- `chat.*` — "Type a message...", "Send", "New Conversation", "Voice Mode", etc.
- `widget.*` — "AI Insight", "Pipeline", "Velocity", "Forecast", various labels
- `profile.*` — additional tab/field labels not yet keyed

### Batch 2 Detail: Language File Sync

For each of the 6 non-English files, add translations for every key present in `en.ts` but missing from that file. All translations will be contextually appropriate for a real estate agent dashboard.

### Files to Change

**Batch 1 (~26 files):**
- `src/i18n/en.ts` — add ~130 new keys
- ~25 component/page files — add `useTranslation` import + replace hardcoded strings with `t()` calls

**Batch 2 (6 files):**
- `src/i18n/fr-CA.ts`
- `src/i18n/es.ts`
- `src/i18n/de.ts`
- `src/i18n/zh.ts`
- `src/i18n/ja.ts`
- `src/i18n/ar.ts`

Given the size, I recommend implementing Batch 1 first (extract + en.ts), then Batch 2 (sync all languages). Shall I proceed with both batches?

