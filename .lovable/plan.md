

## Active Mentor Dashboard -- Implementation Plan

Build the 5th mentor scenario: **active_mentor** -- a certified mentor who can view mentees, manage requests, and review their profile.

### New Scenario: `active_mentor`

Add to the existing `MentorScenario` type and demo switcher. The view shows:
- Branded header with "For Mentors" / "Congratulations! You have completed your Mentor Certification course, and are now a Certified Mentor!"
- Three clickable cards: **My Mentees** (count: 39), **My Mentor Requests** (count: 0, red when > 0), **My Mentor Profile**

### New Pages & Components

**1. My Mentees page** (`/mentor/mentees`)
- Uses `DashboardLayout` with back nav "< My Mentees"
- Download button + result count
- DataTable with columns: Agent, Status (badge), ID, Join Date, Transactions Remaining, Paid Mentor Fees, Mentor Fee, Email, Phone, City, State, Postal, Country, Secondary Email, Sponsor Name, Sponsor Email, Sponsor Phone
- Default visible: Agent, Status, Join Date, Transactions Remaining, Paid Mentor Fees, Mentor Fee
- Clicking a row opens a **MenteeContactSheet** (side panel)

**2. MenteeContactSheet** (`src/components/mentor/MenteeContactSheet.tsx`)
- Side panel similar to AgentContactSheet but tailored to mentee data per the Mercy Le Fevre screenshot:
  - Avatar, name, ID, join date, green status dot
  - Contact section: phone and email as full-width blue buttons
  - About section: City, State, Country, Postal Code grid
  - Metrics section: Transactions Remaining, Mentor Fee %, Paid Mentor Fees
  - Sponsor section: avatar + name with phone/email icons
  - Transaction Information: list of transactions (address, date entered, source) -- clicking opens TransactionDetailSheet

**3. MenteeTransactionSheet** (`src/components/mentor/MenteeTransactionSheet.tsx`)
- Small sheet/dialog showing transaction details per the screenshot:
  - Address header, Transaction Number, Status, Type of Property, Type of Sale, Actual Close Date
  - Highlighted section: Mentor Fee, Sale Price, GCI, Company Commission

**4. Mentor Requests page** (`/mentor/requests`)
- DashboardLayout with "< Pending Mentor Requests" back nav
- Simple table: expand chevron, First Name, Last Name, Request Sent date, Respond to Request (Accept/Decline buttons)
- Clicking expand/chevron opens a side panel with the request details (per RegAutoDD screenshot): avatar, status badge, name fields, emails, phone, city/state, sponsor, region/team, MLS table, Active Markets table

**5. MentorRequestDetailSheet** (`src/components/mentor/MentorRequestDetailSheet.tsx`)
- Side panel with applicant details: name, Active badge, first/last name, emails, phone, city/state, sponsor, region/team, MLS list, Active Markets table

**6. My Mentor Profile** card click
- Opens the existing profile side panel (reuse EditProfileSheet or show a read-only mentor profile sheet). For now, trigger a toast "Profile view coming soon" or navigate to the personal details page.

### Mock Data

Add to `mockData.ts`:
- `mockMentees[]` -- ~12 entries with agent info, status, join date, transactions remaining, paid mentor fees, mentor fee %, contact info, sponsor info, and nested transactions array
- `mockMentorRequests[]` -- 2 entries with first/last name, request date, and detail fields

### Routes

- `/mentor/mentees` -> MyMentees page
- `/mentor/requests` -> MentorRequests page

### File Summary

| File | Action |
|------|--------|
| `src/pages/mentor/MentorProgram.tsx` | Add `active_mentor` scenario + ActiveMentorView component |
| `src/pages/mentor/MyMentees.tsx` | New -- DataTable page |
| `src/pages/mentor/MentorRequests.tsx` | New -- requests table page |
| `src/components/mentor/MenteeContactSheet.tsx` | New -- mentee detail side panel |
| `src/components/mentor/MenteeTransactionSheet.tsx` | New -- transaction detail sheet |
| `src/components/mentor/MentorRequestDetailSheet.tsx` | New -- request detail side panel |
| `src/data/mockData.ts` | Add mock mentee and request data |
| `src/App.tsx` | Add 2 new routes |

