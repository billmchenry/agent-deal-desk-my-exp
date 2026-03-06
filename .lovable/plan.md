

## Mentor Search: Homepage Widget + Choose Mentor Flow

The mentee's "find a mentor" experience doesn't live on `/mentor` -- it appears as a **dashboard widget on the homepage**. This changes the architecture significantly.

### Current State
- The demo scenario switcher lives on `/mentor` page
- Mentee scenarios (mentee, not_applied, etc.) render on `/mentor`

### What Needs to Change

**1. Move demo switcher to the homepage** (or make it global)
- Add a new `mentorStatus` state to `sessionStorage` that the homepage reads
- The demo switcher should appear on the homepage (or in a global toolbar) so it can control which mentor widget appears there
- Keep the `/mentor` page for mentor-specific flows (active_mentor dashboard, not_applied/pending/certification for mentors wanting to BE mentors)

**2. New Homepage Widget: `MentorProgramWidget`**
A card rendered at the top of the homepage dashboard when the user is a new mentee needing a mentor. Three states:

| State | UI |
|-------|-----|
| `needs_mentor` | Blue gradient banner with illustration, countdown timer (Days/Hours/Minutes), "Choose a Mentor" and "Get Help" buttons |
| `pairing_underway` | Simple card with gears illustration, "Pairing Underway" text, "Get Help" button |
| `has_mentor` | (existing mentee view on `/mentor` -- no homepage widget needed, they go to `/mentor`) |

**3. Choose Mentor Sheet** (`src/components/mentor/ChooseMentorSheet.tsx`)
- Side panel opened by "Choose a Mentor" button
- Header: "Choose Mentor" with close X
- "Select One from Below" subtitle
- List of mentor cards, each with: avatar, name, location, badges (Team Lead, ICON, On a Team), "View Profile" and "Choose Mentor" buttons
- "View More" link at bottom
- "Choose for Me" section: description + filled button
- "Need Help?" section: description + outlined button

**4. Mentor Profile Sheet** (`src/components/mentor/MentorProfileSheet.tsx`)
- Opened by "View Profile" on a mentor card
- Avatar, name, location, badges
- Bio text with "View Less" toggle
- Grid: Locations Serviced, Licenses, Languages, MLS, Specializations, Certifications/Designations
- Contact: phone button, email button, Facebook/LinkedIn/Website links
- Footer: "Back" and "Choose Mentor" buttons

**5. Mock Data**
- Add `mockAvailableMentors[]` to `mentorMockData.ts` with ~4 entries containing name, location, badges, bio, locations serviced, licenses, languages, MLS, contact info, social links

**6. Flow**
1. Homepage shows `MentorProgramWidget` with countdown → user clicks "Choose a Mentor"
2. `ChooseMentorSheet` opens → user browses mentors
3. "View Profile" opens `MentorProfileSheet` (replaces or layers over choose sheet)
4. "Choose Mentor" triggers confirmation → sets state to `pairing_underway`
5. Homepage widget now shows "Pairing Underway" with "Get Help" button

### Files

| File | Action |
|------|--------|
| `src/components/dashboard/MentorProgramWidget.tsx` | New -- homepage widget with countdown + pairing states |
| `src/components/mentor/ChooseMentorSheet.tsx` | New -- side panel with mentor list |
| `src/components/mentor/MentorProfileSheet.tsx` | New -- mentor detail side panel |
| `src/data/mentorMockData.ts` | Add `mockAvailableMentors` array |
| `src/pages/Index.tsx` | Conditionally render `MentorProgramWidget` above dashboard |
| `src/pages/mentor/MentorProgram.tsx` | Remove `mentee` from the demo switcher on `/mentor` (mentee flow is now on homepage); keep mentor-side scenarios |

