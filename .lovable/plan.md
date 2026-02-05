

# Dashboard Template System - Complete Implementation

## Overview

This plan implements both features:
1. **Create Template Wizard** - 4-step flow to save current dashboard widgets as a template
2. **Report Marketplace** - Unified page to browse your templates and community templates

---

## Part 1: Create Template Wizard (4 Steps)

Based on the earlier screenshots, users access this from the Dashboard Toolbar.

### Step 1: Select Insights
```text
+----------------------------------------+
| Create a Template                      |
| ■ ■ □ □  Step 1 of 4                   |
+----------------------------------------+
| Select Insights                        |
| Choose the insights for your template  |
+----------------------------------------+
| ○ Key Stats                     List   |
|   Daily Refresh                        |
+----------------------------------------+
| ○ Action Center                 List   |
|   Weekly Refresh                       |
+----------------------------------------+
| ○ Capping Progress             Chart   |
|   Daily Refresh                        |
+----------------------------------------+
|              [Cancel]  [Next Step →]   |
+----------------------------------------+
```

### Step 2: Template Details
```text
+----------------------------------------+
| Create a Template                      |
| ■ ■ ■ □  Step 2 of 4                   |
+----------------------------------------+
| Template Details                       |
| Customize your template                |
+----------------------------------------+
| Template Name                          |
| [___________________________]          |
|                                        |
| Description                            |
| [___________________________]          |
|                                        |
| Category                               |
| [Production] [Team] [Growth] [Custom]  |
|                                        |
| Tags (Optional)                        |
| [___________________________]          |
+----------------------------------------+
|         [← Back]  [Next Step →]        |
+----------------------------------------+
```

### Step 3: Visibility
```text
+----------------------------------------+
| Create a Template                      |
| ■ ■ ■ ■  Step 3 of 4                   |
+----------------------------------------+
| Visibility                             |
| Choose who can see your template       |
+----------------------------------------+
| ● Private                              |
|   Only you can see this template       |
+----------------------------------------+
| ○ Team                                 |
|   Share with your team members         |
+----------------------------------------+
| ○ Public                               |
|   List on the marketplace              |
+----------------------------------------+
|         [← Back]  [Next Step →]        |
+----------------------------------------+
```

### Step 4: Review & Create
```text
+----------------------------------------+
| Create a Template                      |
| ■ ■ ■ ■  Step 4 of 4                   |
+----------------------------------------+
| Review & Create                        |
| Confirm your template details          |
+----------------------------------------+
| Name: My Production Dashboard          |
| Category: [Production]                 |
| Insights: 3 selected                   |
| Visibility: Private                    |
+----------------------------------------+
|       [← Back]  [✓ Create Template]    |
+----------------------------------------+
```

---

## Part 2: Report Marketplace Page

Single unified page showing all templates with filtering.

```text
+----------------------------------------------------------------+
| [🏪] Report Marketplace                   [📥 Shared with You] |
|      Discover and install report templates                     |
+----------------------------------------------------------------+
| [🔍 Search templates...]     [All Categories ▼] [Popular ▼]    |
+----------------------------------------------------------------+
| [All] [Production] [Team] [Growth] [Custom]                    |
|                                                                |
| 3 templates  •  577 total installs                             |
+----------------------------------------------------------------+
|  +------------------+  +------------------+  +------------------+
|  | [Team] ⭐ 4.8    |  | [Growth] ⭐ 4.6  |  | [Prod] ⭐ 4.5    |
|  | Team Production  |  | Growth Tracker   |  | Production Pulse |
|  | Dashboard        |  | Pro              |  |                  |
|  | Description...   |  | Description...   |  | Description...   |
|  | [tag] [tag]      |  | [tag] [tag]      |  | [tag]           |
|  | [👤] 234 📥      |  | [👤] 187 📥      |  | [👤] 156 📥     |
|  +------------------+  +------------------+  +------------------+
+----------------------------------------------------------------+
```

---

## File Changes

### New Files (11 files)

| File | Purpose |
|------|---------|
| `src/components/dashboard/CreateTemplateWizard.tsx` | Main wizard dialog component |
| `src/components/dashboard/wizard/TemplateStepInsights.tsx` | Step 1: Widget selection |
| `src/components/dashboard/wizard/TemplateStepDetails.tsx` | Step 2: Name, description, category |
| `src/components/dashboard/wizard/TemplateStepVisibility.tsx` | Step 3: Privacy setting |
| `src/components/dashboard/wizard/TemplateStepReview.tsx` | Step 4: Summary and confirm |
| `src/components/dashboard/wizard/WizardProgress.tsx` | Progress bar indicator |
| `src/components/marketplace/TemplateCard.tsx` | Individual template card |
| `src/components/marketplace/MarketplaceFilters.tsx` | Search, category tabs, sort dropdown |
| `src/pages/marketplace/ReportMarketplace.tsx` | Main marketplace page |
| `src/data/mockTemplates.ts` | Sample templates for marketplace |

### Modified Files (7 files)

| File | Changes |
|------|---------|
| `src/types/dashboard.ts` | Add `DashboardTemplate` type and related types |
| `src/contexts/DashboardContext.tsx` | Add template state, CRUD actions, localStorage persistence |
| `src/components/dashboard/DashboardToolbar.tsx` | Add "Create Template" button |
| `src/data/mockData.ts` | Add "Report Marketplace" to navigation |
| `src/components/layout/Sidebar.tsx` | Add Store icon mapping |
| `src/components/layout/MobileNavDrawer.tsx` | Add marketplace to mobile nav |
| `src/App.tsx` | Add `/marketplace` route |

---

## Technical Details

### New Types (src/types/dashboard.ts)

```typescript
export type TemplateCategory = 'production' | 'team' | 'growth' | 'custom';
export type TemplateVisibility = 'private' | 'team' | 'public';

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  visibility: TemplateVisibility;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
    badge?: 'star' | 'verified';
  };
  rating: number;
  installCount: number;
  isOwned: boolean;
}
```

### Context Updates (src/contexts/DashboardContext.tsx)

New state and actions:
- `templates: DashboardTemplate[]` - User's created templates
- `createTemplate(data)` - Save new template from wizard
- `deleteTemplate(id)` - Remove a template
- `applyTemplate(id)` - Replace dashboard with template widgets
- Templates persisted to localStorage key: `dashboard-templates`

### Wizard State Management

```typescript
interface WizardState {
  step: 1 | 2 | 3 | 4;
  selectedWidgetIds: string[];
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  visibility: TemplateVisibility;
}
```

### Category Badge Colors

| Category | Background | Text |
|----------|------------|------|
| Production | `bg-orange-100` | `text-orange-700` |
| Team | `bg-purple-100` | `text-purple-700` |
| Growth | `bg-green-100` | `text-green-700` |
| Custom | `bg-gray-100` | `text-gray-700` |

### Navigation Addition

```typescript
// In mockData.ts resources section
{
  title: "Report Marketplace",
  icon: "Store",
  url: "/marketplace"
}
```

---

## User Flows

### Creating a Template
1. User clicks "Create Template" button in Dashboard Toolbar
2. Wizard opens as a Dialog/Sheet
3. User completes 4 steps
4. Template saved to context and localStorage
5. Success toast shown
6. Wizard closes

### Installing a Template
1. User browses marketplace at `/marketplace`
2. Clicks "Install" on a template card
3. Confirmation dialog: "Replace current dashboard?"
4. On confirm: widgets replaced, redirected to home
5. Success toast shown

---

## Implementation Order

1. Add types to `dashboard.ts`
2. Update `DashboardContext.tsx` with template state
3. Create wizard components (progress bar, 4 steps, main wizard)
4. Add "Create Template" button to toolbar
5. Create marketplace components (filters, card)
6. Create marketplace page
7. Add mock templates data
8. Update navigation (sidebar, mobile, routes)

