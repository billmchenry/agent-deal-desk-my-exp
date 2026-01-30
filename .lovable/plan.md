
# Consolidate Sidebar Widgets + Cleanup

## Overview

Merge `ImportantUpdateCard` and `TrainingEducationCard` into a single tabbed **"News & Training"** card, then delete the unused widget files to clean up the codebase.

---

## Current vs After

```text
CURRENT SIDEBAR (3 cards)       AFTER SIDEBAR (2 cards)
┌─────────────────────┐         ┌─────────────────────┐
│  Important Update   │         │  News & Training    │
│  (video + NEW badge)│         │  [Updates][Training]│
└─────────────────────┘         │                     │
┌─────────────────────┐         │  (Tab content)      │
│  Connect Upline     │         └─────────────────────┘
└─────────────────────┘         ┌─────────────────────┐
┌─────────────────────┐         │  Connect Upline     │
│ Training & Education│         └─────────────────────┘
└─────────────────────┘

+ 3 unused files in codebase    (Unused files deleted)
```

---

## New Component Design

### `NewsAndTrainingCard.tsx`

A tabbed card with two sections:

**Tab 1: "Updates"**
- Video thumbnail with play overlay
- "NEW" badge for fresh announcements
- Description text
- (Content from ImportantUpdateCard)

**Tab 2: "Training"**
- List of upcoming training events
- Avatar, title, subtitle, date badge
- Hover states for interaction
- (Content from TrainingEducationCard)

---

## Technical Implementation

### Step 1: Create New Component

**New file: `src/components/dashboard/NewsAndTrainingCard.tsx`**

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ... other imports

export function NewsAndTrainingCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">News & Training</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="updates">
          <TabsList className="w-full">
            <TabsTrigger value="updates" className="flex-1">Updates</TabsTrigger>
            <TabsTrigger value="training" className="flex-1">Training</TabsTrigger>
          </TabsList>
          <TabsContent value="updates">
            {/* Video thumbnail + announcement content */}
          </TabsContent>
          <TabsContent value="training">
            {/* Training events list */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

### Step 2: Update Index.tsx

- Remove imports for `ImportantUpdateCard` and `TrainingEducationCard`
- Add import for `NewsAndTrainingCard`
- Replace two component usages with one

```tsx
// Before
<ImportantUpdateCard />
<ConnectUplineCard />
<TrainingEducationCard />

// After
<NewsAndTrainingCard />
<ConnectUplineCard />
```

### Step 3: Delete Unused Files

| File | Reason |
|------|--------|
| `ImportantUpdateCard.tsx` | Merged into NewsAndTrainingCard |
| `TrainingEducationCard.tsx` | Merged into NewsAndTrainingCard |
| `PromoBanners.tsx` | Never used in Index.tsx |
| `QuickLinksCard.tsx` | Never used in Index.tsx |
| `UniversityCard.tsx` | Never used in Index.tsx |

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `src/components/dashboard/NewsAndTrainingCard.tsx` |
| Modify | `src/pages/Index.tsx` |
| Delete | `src/components/dashboard/ImportantUpdateCard.tsx` |
| Delete | `src/components/dashboard/TrainingEducationCard.tsx` |
| Delete | `src/components/dashboard/PromoBanners.tsx` |
| Delete | `src/components/dashboard/QuickLinksCard.tsx` |
| Delete | `src/components/dashboard/UniversityCard.tsx` |

---

## Benefits

- **Reduced sidebar height** - 3 cards becomes 2 cards
- **Better mobile experience** - Less vertical scrolling
- **Cleaner codebase** - 5 files removed, 1 added (net -4 files)
- **Logical grouping** - News and training are related content types
- **User control** - Tabs let users focus on what interests them
