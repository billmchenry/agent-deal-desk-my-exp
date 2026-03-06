

## Sanitize Dummy Data: Names, Phones & Emails

### Problem

Two issues identified:

**1. Potentially real personal information** in these locations:
- `MyMentorProfileSheet.tsx` — "Alejandra J Pino Torrealba", phone `(754) 209-3117`, email `alejandra.pino-torrealba@exprealty.com` — looks like it could be a real person
- `StepYourInfo.tsx` — "Clifford Malone", `clifford.malone@exprealty.com` — possibly real
- `mockData.ts` onboarding — "Valerio Nieto" with `(619) 737-6503` and `vnieto21@gmail.com` — looks real (non-555 phone, personal Gmail)
- `MentorProgram.tsx` — "Robert Conat" with `(555) 482-9173` and `robert.conat@exprealty.com` — name may be real
- `Notifications.tsx` — "Gertrudis Jimenez" with `(347) 285-0638` — non-555 phone, possibly real name

**2. Phone numbers not following `(xxx) 555-xxxx` pattern** — found in:
- `mockData.ts` line 158: `(619) 737-6503` (onboarding agent)
- `Notifications.tsx` line 62: `(347) 285-0638`
- `MyMentorProfileSheet.tsx` line 24: `(754) 209-3117`

Most other phones already use `(555)` as the area code, but the requested format is `(xxx) 555-xxxx` — meaning 555 should be in the **middle** (exchange), not the area code. Currently all mentor/mock data uses `(555) xxx-xxxx`. These all need to be reformatted.

### Plan

**1. Replace all potentially real names with clearly fictional ones** (~4 files)
- `MyMentorProfileSheet.tsx` — rename "Alejandra J Pino Torrealba" → fictional name, update bio, locations, email
- `StepYourInfo.tsx` — rename "Clifford Malone" → use `currentUser` name or a different fictional name
- `mockData.ts` — rename "Valerio Nieto" and "Tazio Galardi" → fictional names, fix emails
- `Notifications.tsx` — rename "Gertrudis Jimenez" → fictional name
- `MentorProgram.tsx` — "Robert Conat" → fictional name (also used in mentorMockData sponsors)

**2. Reformat ALL phone numbers to `(xxx) 555-xxxx`** (~4 files)
- `mockData.ts` — all phones (currentUser, uplinePartners, onboardingAgents, userProfile contact/emergency)
- `mentorMockData.ts` — all mentee phones, sponsor phones, mentor request phones, state mentor phones, available mentor phones
- `Notifications.tsx` — all agentPhone values
- `MyMentorProfileSheet.tsx` — mentor phone
- `MentorProgram.tsx` — menteeData mentor phone

This means changing from `(555) 301-4892` → `(916) 555-4892` style (keep area code contextual to city, put 555 in middle).

### Files to Change (~5 files)

1. `src/data/mockData.ts` — rename onboarding names, reformat all phones to `(xxx) 555-xxxx`
2. `src/data/mentorMockData.ts` — reformat all ~40+ phones to `(xxx) 555-xxxx`
3. `src/pages/notifications/Notifications.tsx` — rename Gertrudis Jimenez, reformat phones
4. `src/components/mentor/MyMentorProfileSheet.tsx` — replace profile with fictional data, reformat phone
5. `src/components/mentor/steps/StepYourInfo.tsx` — replace name/email with fictional
6. `src/pages/mentor/MentorProgram.tsx` — rename Robert Conat, reformat phone

