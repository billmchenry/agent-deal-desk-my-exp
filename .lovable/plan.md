

# Make Transaction Stats Card Mobile Responsive

## The Problem

On a 390px mobile viewport, the fourth stat card (Closed / Pending / Withdrawn) is getting cut off. The icon takes up space, leaving insufficient room for the three metric columns to display fully.

## The Fix

**File: `src/components/agent/AgentHeroBanner.tsx`**

1. **Hide the FileText icon on mobile** -- Add `hidden sm:flex` to the icon container so it only shows on screens >= 640px. This gives the three transaction metrics the full card width on mobile.

2. **Reduce gap between metrics on mobile** -- Change the metrics container from `gap-3` to `gap-2 sm:gap-3` so the numbers have more breathing room on small screens.

These are minimal changes that keep the desktop layout identical while fixing the mobile overflow.

