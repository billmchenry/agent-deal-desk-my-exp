

## Mentor Program -- "Active Agent Wants to Be a Mentor" Flow

Based on the screenshots, there are three distinct states for this scenario, plus a 6-step application wizard:

### States

1. **Landing page** (not yet applied) -- Branded header, "For Mentors" title, description text, "I Want to Be a Mentor" CTA button, and a note about already-submitted applications.

2. **Pending state** (application submitted) -- Same branded header, success message indicating application is pending broker approval.

3. **Approved/Certification state** (application approved) -- Branded header, "For Mentors" title, congratulations text, and a "Complete your Certification NOW!" card with "Start Training" button.

### 6-Step Mentor Application Wizard

A full-page wizard at `/mentor/apply` with a numbered step indicator (reusing the circle-step pattern from the screenshots):

| Step | Title | Fields |
|------|-------|--------|
| 1 | Your Information | Read-only: Full Name, Primary Email, Phone, eXp Join Date, Team, MLS Name, Primary Licensed State. Tables: All Licenses, Active Markets. |
| 2 | Real Estate Experience | Dropdowns (good standing, documents/fees, disciplinary actions, ICON, team leader, part/full time, specialization, languages). Inputs (years selling). Checkboxes (proficiency areas). Inputs (transactions closed). |
| 3 | Mentorship/Coaching Experience | Dropdowns (mentoring exp, coaching exp, communication method, frequency). Textareas with char counters (interest, why mentor, teaching style, program/plan). Checkboxes (tools/strategies, availability). |
| 4 | Goals/Intentions | Checkboxes (goals, shadowing opportunities). Textarea (mentee goals). |
| 5 | Skills Assessment | 11 dropdown selects (1-10 scale) for various competencies. |
| 6 | About the Mentor | 3 textareas with char counters (500 max). Acknowledgment checkbox. Submit button replaces Next. |

### Implementation Plan

1. **Create mentor scenario state management** -- Add a `mentorScenario` type and mock state in the MentorProgram page to switch between: `not_applied`, `pending`, `approved_certification`, and the existing `mentee` view. Use a simple state variable for now.

2. **Build the "For Mentors" landing page view** -- New component rendering the branded header, description, "I Want to Be a Mentor" button (navigates to `/mentor/apply`), and the disclaimer text.

3. **Build the 6-step application wizard page** -- New page at `/mentor/apply` with:
   - Numbered circle step indicator (similar to WizardProgress but with numbered circles and labels)
   - 6 step components, each rendering the form fields from the screenshots
   - Cancel, Previous, Save My Progress, Next/Submit buttons in the footer
   - On final submit, show success toast and navigate back to `/mentor` in `pending` state

4. **Build the pending and certification views** -- Pending: simple message card. Certification: "Complete your Certification NOW!" card with "Start Training" button (toast placeholder).

5. **Add route** -- Register `/mentor/apply` in App.tsx.

6. **Add i18n keys** -- All new strings added to en.ts.

### Technical Notes
- The wizard will be a standalone page (not a sheet) matching the screenshots' full-page layout
- Form state managed with React useState (no backend persistence)
- Step indicator component will be a new shared component with numbered circles connected by lines
- Character counters on textareas will show current/max (e.g., "4/500")

