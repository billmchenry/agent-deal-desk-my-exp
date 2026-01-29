

# Plan: Revamp Dashboard Layout for Better Visual Impact

## Problem Analysis

The current dashboard feels flat because:
- Cards are uniform in size and visual weight
- No hero/banner element to draw attention
- Stats are just numbers without visual context (icons, color accents, progress bars)
- Missing data visualizations (charts, graphs)
- Right sidebar cards lack visual hierarchy

## Design Approach (Inspired by Reference)

Based on the reference design, we'll implement:

1. **Hero Banner** - A visually striking promotional card at the top
2. **Stat Cards Row** - Three metric cards with icons, colored accents, and mini progress indicators
3. **Performance Chart** - A line/area chart showing GCI or volume trends
4. **Enhanced Sidebar** - Appointments-style cards and progress tracking widgets

---

## Implementation Details

### 1. New Hero Banner Component

**File: `src/components/dashboard/HeroBannerCard.tsx`**

A full-width banner with:
- Gradient background (blue-to-navy or use a background image)
- Bold headline with colored accent (e.g., green dollar amount)
- Short description text
- CTA button
- Optional decorative image or icon on the right side
- Uses existing `exp-blue`, `exp-gold` colors for accents

```text
+------------------------------------------------------------------+
|  [Badge: CAPPING UPDATE]                                         |
|                                                                  |
|  Track your progress to                                          |
|  **$16,000** Cap!                     [Decorative Image/Chart]   |
|                                                                  |
|  You're $15,518 away from capping...                             |
|                                                                  |
|  [View Details Button]     Current: $2,548                       |
+------------------------------------------------------------------+
```

### 2. Stat Cards Row

**File: `src/components/dashboard/StatsRow.tsx`**

Replace the simple metrics in CappingYearCard with standalone stat cards:

- **Units Card**: Icon, big number, label, mini progress bar (colored)
- **GCI Card**: Dollar icon, formatted amount, comparison text, mini progress
- **Volume Card**: Building icon, formatted amount, trend indicator

Each card has:
- Colored icon circle (different color per card: blue, green, purple)
- Large bold number
- Small label text
- Mini horizontal progress indicator at bottom

```text
+------------------+  +------------------+  +------------------+
| [Icon]    5      |  | [$]   $2.67K     |  | [Building] $1.78M|
|          Units   |  |        GCI       |  |       Volume     |
| ████████░░░░░░░░ |  | ██████████░░░░░░ |  | ████░░░░░░░░░░░░ |
+------------------+  +------------------+  +------------------+
```

### 3. Performance Overview Chart

**File: `src/components/dashboard/PerformanceChart.tsx`**

A card with:
- Title "Performance Overview"
- Time period selector tabs (1M, 3M, 6M, YTD, ALL)
- Line or area chart using `recharts` (already installed)
- Shows GCI or volume trend over time
- Average indicator dot with label

This adds visual interest and data richness to the main content area.

### 4. Enhanced Sidebar Widgets

**Update: `src/components/dashboard/TrainingEducationCard.tsx`**

Add visual elements like:
- Image thumbnails for events (not just avatars)
- Time badges with colored backgrounds
- "Add" button for scheduling

**Update: `src/components/dashboard/ConnectUplineCard.tsx`**

- Add avatar overlap group (like in reference showing multiple faces)
- More visual distinction for the sponsor section

### 5. Updated Index Page Layout

**File: `src/pages/Index.tsx`**

New structure:

```text
+------------------------------------------------------------------+
| Welcome Header                           [Stats: Rating, Sales]  |
+------------------------------------------------------------------+
| HERO BANNER (Full Width or 2/3 width)          | Appointments    |
|                                                 | Card            |
+-------------------------------------------------+                 |
| [Stat] Units | [Stat] GCI | [Stat] Volume      |                 |
+-------------------------------------------------+-----------------+
| Performance Chart                               | Progress        |
|                                                 | Report Card     |
+-------------------------------------------------+                 |
| Action Center (Influencer/FLQA tabs)           |                 |
|                                                 | Quick Links     |
+-------------------------------------------------+-----------------+
```

---

## Files to Create

| File | Description |
|------|-------------|
| `src/components/dashboard/HeroBannerCard.tsx` | Eye-catching promo/status banner |
| `src/components/dashboard/StatsRow.tsx` | Three colorful stat cards |
| `src/components/dashboard/PerformanceChart.tsx` | Line chart with time selector |
| `src/components/dashboard/AppointmentsCard.tsx` | Visual appointments/events widget |
| `src/components/dashboard/ProgressReportCard.tsx` | Tasks/milestones with tags |

## Files to Update

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Restructure layout with new components |
| `src/components/dashboard/CappingYearCard.tsx` | May remove or simplify (stats moved to StatsRow) |
| `src/data/mockData.ts` | Add chart data, appointments, progress tasks |

---

## Technical Notes

- Uses `recharts` (already installed) for the performance chart
- Leverages existing color tokens: `exp-blue`, `exp-green`, `exp-gold`, `exp-purple`
- Follows existing Card component patterns
- Maintains responsive grid layout (stacks on mobile)
- Chart data will be mock data for now

## Visual Hierarchy Summary

1. **Hero Banner** - Largest, most colorful = highest attention
2. **Stats Row** - Colored icons and numbers = secondary attention
3. **Performance Chart** - Data visualization = engagement
4. **Sidebar widgets** - Supporting information with visual richness

This layout creates clear visual hierarchy with multiple attention points, varied card sizes, and rich color usage to make the dashboard feel dynamic and engaging.

