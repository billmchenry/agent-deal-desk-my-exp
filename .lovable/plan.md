

## Codebase-Wide Typography Audit

### Current State

The semantic typography classes were added to `index.css` and applied to ~16 files, but **many files still use raw Tailwind text classes**. Here are the remaining violations:

### Files Still Using Raw Classes for Values/Headings

| File | Current Class | Should Be | Element |
|------|--------------|-----------|---------|
| `StatsRow.tsx` | `text-2xl` | `text-stat-value` | Stat values |
| `CappingYearCard.tsx` | `text-2xl` (x3) | `text-stat-value` | Units, GCI, Volume |
| `AchievementsCard.tsx` | `text-2xl` | `text-stat-value` | FLQA amount |
| `HeroBannerCard.tsx` | `text-3xl` | `text-stat-value` | Cap target value |
| `HeroBannerCard.tsx` | `text-lg` | `text-section-title` | Heading |
| `HeroBannerCard.tsx` | `text-xl sm:text-2xl` | `text-stat-value` | Progress % |
| `PipelineWidget.tsx` | `text-2xl` / `text-lg sm:text-xl` | `text-stat-value` | Pipeline value |
| `VelocityWidget.tsx` | `text-2xl sm:text-3xl` / `text-4xl` | `text-stat-value` | Days on market |
| `MentorProgramWidget.tsx` | `text-3xl md:text-4xl` | `text-stat-value` | Countdown numbers |
| `MentorProgramWidget.tsx` | `text-xl md:text-2xl` | `text-page-title` | "Find Your Mentor" |
| `Index.tsx` | `text-2xl` | `text-page-title` | Welcome heading |
| `OrganizationTree.tsx` | `text-2xl` | `text-page-title` | Page heading |
| `YearEnd.tsx` | `text-2xl` | `text-page-title` | Page heading |
| `InfluencerStatusCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `NewsAndTrainingCard.tsx` | `text-lg` (x3) | `text-section-title` | Card title, brand text |
| `CappingYearCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `AchievementsCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `UplinePartnersCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `DiscAssessmentCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `NpsSurveyCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `ProgressReportCard.tsx` | `text-lg` | `text-section-title` | Card title |
| `ProfileSidebarCard.tsx` | `text-xl` | `text-section-title` | User name |
| `ConnectUplineCard.tsx` | various | semantic equivalents | Titles/values |
| `AppointmentsCard.tsx` | various | semantic equivalents | Titles/values |
| `ActionCenterCard.tsx` | various | semantic equivalents | Titles/values |
| `MentorProfileSheet.tsx` | `text-lg` | `text-section-title` | Sheet title |
| `MentorRequestDetailSheet.tsx` | `text-lg` | `text-section-title` | Sheet title |
| `ChooseMentorSheet.tsx` | `text-lg` | `text-section-title` | Title |

### Also missing: `text-caption` class definition

The `text-caption` class is referenced in the scale documentation but **never defined** in `index.css`. Need to add it.

### Plan

1. **Add missing `text-caption` utility** to `index.css` (0.75rem / 1rem line-height)
2. **Update ~20 component files** — mechanical replacement of raw Tailwind text classes with semantic equivalents per the mapping above
3. **Leave alone**: `text-xs`/`text-sm` on labels, descriptions, and muted secondary text — these are fine as-is since they map closely to `text-caption`/`text-body` and changing all 3000+ instances would be excessive. Focus on **headings, stat values, and card titles** where inconsistency is most visible.

