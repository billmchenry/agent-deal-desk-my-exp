

# Global Search Bar for MY | eXp Plus

## Overview
Add a command palette-style global search bar (Cmd+K / Ctrl+K) to the header so agents can quickly find pages, features, actions, and resources across the entire platform.

## How It Works
- A search icon and input field will be added to the header bar
- Clicking it (or pressing Cmd+K / Ctrl+K) opens a centered command dialog overlay
- Agents type to search across: **Pages/Navigation**, **Actions** (e.g. "Ask Mira"), **Profile sections**, and **Quick links**
- Selecting a result navigates to that page or triggers the action
- Results are grouped by category (Navigation, Actions, Resources)

## What the Agent Sees
- A subtle search bar in the header between the left spacer/hamburger and the right-side icons
- On desktop: an input-style trigger showing "Search..." with a Cmd+K shortcut hint
- On mobile: a compact search icon button
- The overlay uses the existing `cmdk` Command component for fast, fuzzy filtering

## Technical Details

### 1. New Component: `GlobalSearch.tsx`
- Uses the existing `cmdk`-based `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, and `CommandEmpty` from `src/components/ui/command.tsx`
- Builds a searchable index from `sidebarNavigation` data (all pages and subpages) plus hardcoded actions (Ask Mira, Profile, Settings, etc.)
- Keyboard shortcut listener (Cmd+K / Ctrl+K) to open/close
- On item select: uses `react-router-dom` `useNavigate` to go to the page, or triggers the relevant action

### 2. Modify: `Header.tsx`
- Import and render `GlobalSearch` in the center/left area of the header
- On desktop: replaces the empty spacer div with the search trigger
- On mobile: adds a Search icon button to the right-side actions

### 3. Search Data
- Dynamically flattens `sidebarNavigation` into searchable items with title, url, icon, and category
- Adds action items: "Ask Mira", "View Profile", "Settings", "Notifications"
- Each item includes keywords for better matching (e.g. "GCI" maps to Agent Dashboard)

### Files Changed
| File | Change |
|------|--------|
| `src/components/layout/GlobalSearch.tsx` | New -- command palette component |
| `src/components/layout/Header.tsx` | Add search trigger to header |

No new dependencies needed -- `cmdk` and the Command UI components are already installed.
