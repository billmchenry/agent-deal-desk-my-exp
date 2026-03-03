
# Internationalization (i18n) and Locale-Aware Formatting System

This plan adds a full internationalization system to the application, covering language translation, date/time formatting, number formatting, font size accessibility, and RTL layout support — all driven from the Settings tab.

---

## Architecture Overview

```text
+---------------------------+
|   LocaleContext (React)    |
|  Stored in localStorage    |
+---------------------------+
| language: en | fr-CA | es | zh | ja | de | ar
| dateFormat: MM/DD/YYYY | DD/MM/YYYY | YYYY/MM/DD | ...
| timeFormat: 12h | 24h
| numberFormat: en-US | de-DE | en-IN (lakhs)
| fontSize: normal | large | x-large
+---------------------------+
        |
        v
+---------------------------+
|  Formatting Utilities      |
|  formatNumber()            |
|  formatCurrency()          |
|  formatDate()              |
|  formatTime()              |
|  t() translation function  |
+---------------------------+
        |
        v
  Used by ALL components
```

---

## Phase 1: Locale Context and Settings UI

### 1.1 Create `src/contexts/LocaleContext.tsx`

A new React context that stores all locale preferences in localStorage via the existing `useLocalStorage` hook:

- `language` — `"en"` (default), `"fr-CA"`, `"es"`, `"zh"`, `"ja"`, `"de"`, `"ar"`
- `dateFormat` — `"MM/DD/YYYY"` (default), `"DD/MM/YYYY"`, `"YYYY/MM/DD"`, `"DD-MM-YYYY"`, `"MM-DD-YYYY"`, `"YYYY-MM-DD"`, `"DD Mon, YYYY"`
- `timeFormat` — `"12h"` (default) or `"24h"`
- `numberFormat` — `"en-US"` (1,000,000.50), `"de-DE"` (1.000.000,50), `"en-IN"` (10,00,000.50 lakhs)
- `fontSize` — `"normal"`, `"large"`, `"x-large"` (WCAG 2.2 font size preference)

The context will expose setter functions for each preference and be wrapped at the app root in `App.tsx`.

### 1.2 Rebuild `src/components/profile/SettingsTab.tsx`

Match the reference screenshot layout:
- **Locale card** — shows flag emoji + "USA" with "Change Locale" button (placeholder toast for now)
- **Preferences grid** (4 columns) — Language, Date Format, Time Format, Number Format. Each card's edit icon opens a **dialog** with radio-button options
- **Font Size card** (new) — "Normal", "Large", "Extra Large" radio options for WCAG compliance
- **Action cards** — Security and Login cards. Clicking either shows a toast: "This functionality is not yet available"
- Remove "eXtend a Hand" card (not in reference screenshot)
- **App Version** — update to `3.36.0` per screenshot

Each dialog will:
- Use `RadioGroup` from Radix for selection
- Save the selection to `LocaleContext`
- Show current value as the selected option

**Date Format dialog options** (from reference image):
- DD/MM/YYYY
- MM/DD/YYYY
- YYYY/MM/DD
- DD-MM-YYYY
- MM-DD-YYYY
- YYYY-MM-DD
- DD Mon, YYYY

---

## Phase 2: Formatting Utilities

### 2.1 Create `src/lib/formatters.ts`

Central formatting functions that read from locale context values:

**`formatNumber(value, numberFormat, options?)`**
- `"en-US"` — uses `Intl.NumberFormat('en-US')` producing `1,000,000.50`
- `"de-DE"` — uses `Intl.NumberFormat('de-DE')` producing `1.000.000,50`
- `"en-IN"` — uses `Intl.NumberFormat('en-IN')` producing `10,00,000.50`

**`formatCurrency(value, numberFormat, options?)`**
- Same locale mapping but with currency symbol prefix
- Supports compact notation (e.g., `$1.78M`, `$2.67K`)

**`formatDate(date, dateFormat)`**
- Converts a Date or string to the user's chosen format using `date-fns` `format()` with the correct pattern

**`formatTime(date, timeFormat)`**
- 12h: `2:30 PM`
- 24h: `14:30`

### 2.2 Create `src/hooks/useFormatters.ts`

A convenience hook that reads from `LocaleContext` and returns bound formatting functions so components don't need to pass format strings manually:

```tsx
const { formatNumber, formatCurrency, formatDate, formatTime } = useFormatters();
// Then: formatCurrency(1780000) => "$1,780,000.00" or "$17,80,000.00" etc.
```

---

## Phase 3: Translation System

### 3.1 Create translation files

Directory: `src/i18n/`

- `src/i18n/en.ts` — English (base, all keys)
- `src/i18n/fr-CA.ts` — French Canadian
- `src/i18n/es.ts` — Spanish
- `src/i18n/zh.ts` — Chinese (Mandarin, Simplified)
- `src/i18n/ja.ts` — Japanese
- `src/i18n/de.ts` — German
- `src/i18n/ar.ts` — Arabic
- `src/i18n/index.ts` — exports a lookup map

Each file exports a flat object with ~200-300 keys covering all UI strings:
- Navigation labels (Home, Agent, Team, RevShare Earnings, etc.)
- Page titles and headings
- Button labels (Edit, Save, Cancel, Change Locale, etc.)
- Settings labels (Language, Date Format, Time Format, etc.)
- Dashboard card titles and labels
- Profile field labels
- Common words (Units, Volume, Commission, Status, etc.)

### 3.2 Create `src/hooks/useTranslation.ts`

Returns a `t(key)` function that looks up the current language from `LocaleContext` and returns the translated string, falling back to English if a key is missing.

---

## Phase 4: RTL Support for Arabic

### 4.1 Update `index.html` and root layout

- The `LocaleContext` will set `document.documentElement.dir = "rtl"` when Arabic is selected, and `"ltr"` otherwise
- Also update `document.documentElement.lang` to match the selected language

### 4.2 CSS adjustments in `src/index.css`

Add RTL-aware utilities:
- Sidebar should flip to the right side
- Text alignment and flex direction should reverse
- Use Tailwind's `rtl:` variant prefix where needed (e.g., `rtl:flex-row-reverse`, `rtl:text-right`)
- Ensure `tailwind.config.ts` has RTL plugin or manual classes

### 4.3 Component updates for RTL

Key components that need RTL-aware styling:
- `Sidebar.tsx` — flip position
- `Header.tsx` — reverse flex order
- `DashboardLayout.tsx` — reverse sidebar/main layout
- All icon + text pairs — ensure spacing works in both directions using `gap` instead of `ml-`/`mr-` where possible, or add `rtl:` variants

---

## Phase 5: Apply Formatting System-Wide

### 5.1 Files that need `formatCurrency` / `formatNumber` replacement

Every hardcoded `toLocaleString("en-US")`, `toFixed()`, and `Intl.NumberFormat('en-US')` call needs to use the new `useFormatters()` hook instead. Key files:

| File | Current pattern | Change to |
|------|----------------|-----------|
| `StatsRow.tsx` | `(value / 1000000).toFixed(2)` | `formatCurrency(value)` |
| `CappingSection.tsx` | `toLocaleString("en-US")` | `formatCurrency(value)` |
| `VitalSignsRow.tsx` | `toLocaleString("en-US")` | `formatNumber(value)` |
| `MasterTransactionTable.tsx` | `toLocaleString("en-US")` | `formatCurrency(value)` |
| `TransactionDetailsSheet.tsx` | `toLocaleString("en-US")` | `formatCurrency(value)` |
| `AchievementsCard.tsx` | `toLocaleString()` | `formatCurrency(value)` |
| `ActionCenterCard.tsx` | `toLocaleString()` | `formatCurrency(value)` |
| `PipelineWidget.tsx` | `Intl.NumberFormat('en-US')` | `formatCurrency(value)` |
| `YearOverYearChart.tsx` | `toFixed()` with `$` prefix | `formatCurrency(value)` |
| `IconStatusSummary.tsx` | `toLocaleString("en-US")` | `formatCurrency(value)` |
| `revshare/Dashboard.tsx` | Hardcoded `$` signs | `formatCurrency(value)` |
| `revshare/Organization.tsx` | `toLocaleString()` + `toFixed()` | `formatCurrency(value)` |
| `team/Dashboard.tsx` | Inline number formatting | `formatNumber / formatCurrency` |

### 5.2 Files that need `formatDate` replacement

| File | Current pattern | Change to |
|------|----------------|-----------|
| `AgentFilterBar.tsx` | `format(date, "MM/dd/yyyy")` | `formatDate(date)` |
| `EditProfileSheet.tsx` | `format(date, "MMM d")` | `formatDate(date)` |
| `MasterTransactionTable.tsx` | Raw date strings | Display through `formatDate()` |
| `mockData.ts` | Hardcoded date strings | Keep as-is (raw data), format at display |

### 5.3 Apply `t()` translations to all UI strings

All static strings in components need to be wrapped with `t("key")`. Major areas:
- Sidebar navigation labels
- Header buttons and labels
- Page titles and headings
- Card titles, labels, and descriptions
- Button text
- Tab labels
- Table headers
- Filter labels and options
- Toast messages

---

## Phase 6: Font Size (WCAG 2.2 Accessibility)

### 6.1 Add font size setting to LocaleContext

Three levels:
- **Normal** — default (16px base)
- **Large** — 18px base
- **Extra Large** — 20px base

### 6.2 Apply via CSS variable or `<html>` font-size

When the user changes font size, set `document.documentElement.style.fontSize` to the chosen value. Since Tailwind uses `rem` units, this scales everything proportionally.

### 6.3 Add Font Size card to SettingsTab

A new card in the preferences grid with a radio dialog for the three options.

---

## Phase 7: Wire Up at App Root

### 7.1 Update `App.tsx`

Wrap with `LocaleProvider`:
```text
QueryClientProvider > ThemeProvider > LocaleProvider > MiraChatProvider > ...
```

### 7.2 Update `DashboardLayout.tsx`

Apply `dir` attribute and `lang` attribute reactively based on locale context.

---

## Summary of New Files

| File | Purpose |
|------|---------|
| `src/contexts/LocaleContext.tsx` | Locale preferences context + provider |
| `src/lib/formatters.ts` | formatNumber, formatCurrency, formatDate, formatTime |
| `src/hooks/useFormatters.ts` | Hook binding formatters to current locale |
| `src/hooks/useTranslation.ts` | t() function hook |
| `src/i18n/en.ts` | English translations |
| `src/i18n/fr-CA.ts` | French Canadian translations |
| `src/i18n/es.ts` | Spanish translations |
| `src/i18n/zh.ts` | Chinese Mandarin translations |
| `src/i18n/ja.ts` | Japanese translations |
| `src/i18n/de.ts` | German translations |
| `src/i18n/ar.ts` | Arabic translations |
| `src/i18n/index.ts` | Translation registry |

## Files Modified

All ~20+ component files with hardcoded formatting, plus `App.tsx`, `DashboardLayout.tsx`, `Header.tsx`, `Sidebar.tsx`, `SettingsTab.tsx`, `index.css`, and `tailwind.config.ts`.

---

## Implementation Order

1. LocaleContext + localStorage persistence
2. Formatting utilities + useFormatters hook
3. Rebuild SettingsTab UI with dialogs
4. Translation system + all 7 language files
5. Replace all hardcoded formatting calls across components
6. RTL support for Arabic
7. Font size WCAG feature
8. Wire everything up at App root
