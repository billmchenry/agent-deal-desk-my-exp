

## Change "State Mentors" to "Provincial Mentors" for CAN Mode

Currently `BrokerHub.tsx` uses `t("broker.stateMentors")` and `t("broker.stateMentorsDesc")` for both US and CAN modes.

### Changes

**1. Add new i18n keys** to all 7 language files:
- `broker.provincialMentors` — e.g. "Provincial Mentors" (en), "Mentors provinciaux" (fr-CA), etc.
- `broker.provincialMentorsDesc` — e.g. "Count of all Mentors in your province(s)." (en)

**2. `src/pages/agent/BrokerHub.tsx`** — Use conditional keys based on `config.brokerHubMode`:
```tsx
const mentorLabel = config.brokerHubMode === "us" ? t("broker.stateMentors") : t("broker.provincialMentors");
const mentorDesc = config.brokerHubMode === "us" ? t("broker.stateMentorsDesc") : t("broker.provincialMentorsDesc");
```
Replace the 4 usages of `t("broker.stateMentors")` and `t("broker.stateMentorsDesc")` with these variables.

### Files Modified (8)
1. `src/pages/agent/BrokerHub.tsx`
2. `src/i18n/en.ts`
3. `src/i18n/es.ts`
4. `src/i18n/fr-CA.ts`
5. `src/i18n/de.ts`
6. `src/i18n/ar.ts`
7. `src/i18n/zh.ts`
8. `src/i18n/ja.ts`

