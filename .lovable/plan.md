

## Broker Hub Page

A new page under Agent at `/agent/broker-hub` that provides a broker's view of state mentors. The flow is: tile → mentor list → mentor profile → mentee profile, matching the screenshots provided.

### Pages & Components

**1. `src/pages/agent/BrokerHub.tsx`** — Main page
- Header "Broker Hub"
- Single tile card: "State Mentors" with description "Count of all Mentors in your state(s)." and count (e.g. 754)
- Dark blue/primary background on the tile, matching the screenshot
- Clicking the tile navigates to the mentor list view (in-page state, not a new route)

**2. State Mentors List View** (within BrokerHub or as a sub-view)
- Back button + "State Mentors" heading
- "Download" button + result count
- DataTable with columns: Name, Total Active Mentees, Primary Email, Phone, Secondary Email, City, State, Postal Code
- Column filtering (the "Contains" inputs shown in the screenshot)
- Clicking a row opens the **Mentor Profile Sheet**

**3. Mentor Profile Sheet** (reuse/extend `MentorProfileSheet.tsx`)
- Shows mentor profile info (avatar, name, ID, languages, MLS, specializations, certifications, contact, social links)
- Below profile: "Active Mentees" section with count and list of mentee cards
- Each mentee card shows: name, remaining transactions, join date, chevron arrow
- Clicking a mentee opens the **Mentee Contact Sheet** (already exists)

**4. Mentee Contact Sheet** — Already built at `src/components/mentor/MenteeContactSheet.tsx`, reuse as-is

### Mock Data
- Add `mockStateMentors[]` to `mentorMockData.ts` — ~10 entries with: name, totalActiveMentees, primaryEmail, phone, secondaryEmail, city, state, postalCode, plus profile fields (bio, languages, mls, specializations, certifications, licenses, social links)
- Each state mentor references a subset of existing `mockMentees` for their active mentees list

### Navigation
- Add "Broker Hub" to the Agent submenu in `sidebarNavigation` in `mockData.ts`
- Add route `/agent/broker-hub` in `App.tsx`
- Add `"Broker Hub"` to the sidebar `NAV_KEYS` map

### Files

| File | Action |
|------|--------|
| `src/pages/agent/BrokerHub.tsx` | New — main page with tile + list sub-view |
| `src/components/agent/StateMentorProfileSheet.tsx` | New — mentor profile with active mentees list, clicking mentee opens MenteeContactSheet |
| `src/data/mentorMockData.ts` | Add `StateMentor` interface + `mockStateMentors` array |
| `src/data/mockData.ts` | Add "Broker Hub" to Agent submenu |
| `src/App.tsx` | Add route for `/agent/broker-hub` |
| `src/components/layout/Sidebar.tsx` | Add "Broker Hub" to NAV_KEYS |

