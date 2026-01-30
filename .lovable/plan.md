
# Customizable Dashboard Layout System

## Overview

Transform the dashboard into a fully customizable experience where users can reorder widgets, delete widgets, and save their layouts as templates. The fixed elements are the Stats Row (Cap, Units Closed, Gross Commission, Total Volume) - everything else becomes a pinnable/movable widget.

---

## Current State Analysis

**Fixed Elements (remain static):**
- Welcome Header ("Welcome to eXp! Hi Clifford!")
- StatsRow (Units Closed, Gross Commission, Total Volume)

**Components to Convert to Widgets:**
- HeroBannerCard (Capping Progress)
- ActionCenterCard (Influencer Status + FLQA)
- PromotionalCarousel
- NewsAndTrainingCard
- ConnectUplineCard
- AI-generated widgets (Forecast, Velocity, Pipeline)

---

## Architecture

```text
+---------------------+     +----------------------+     +-------------------+
| DashboardContext    | --> | LayoutContext        | --> | Index.tsx         |
| (widget data)       |     | (positions, order)   |     | (renders layout)  |
+---------------------+     +----------------------+     +-------------------+
        |                           |                           |
        v                           v                           v
+---------------------+     +----------------------+     +-------------------+
| Widget Registry     |     | Template Storage     |     | DraggableWidget   |
| (all widget types)  |     | (localStorage)       |     | (wrapper + delete)|
+---------------------+     +----------------------+     +-------------------+
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/contexts/LayoutContext.tsx` | Manages widget positions, order, and templates |
| `src/components/dashboard/DraggableWidget.tsx` | Wrapper component with drag handle and delete button |
| `src/components/dashboard/WidgetGallery.tsx` | Modal/sheet to add new widgets to dashboard |
| `src/components/dashboard/TemplateManager.tsx` | Save/load layout templates UI |
| `src/components/dashboard/widgets/HeroBannerWidget.tsx` | Wrapper for HeroBannerCard as widget |
| `src/components/dashboard/widgets/ActionCenterWidget.tsx` | Wrapper for ActionCenterCard |
| `src/components/dashboard/widgets/NewsTrainingWidget.tsx` | Wrapper for NewsAndTrainingCard |
| `src/components/dashboard/widgets/UplineWidget.tsx` | Wrapper for ConnectUplineCard |
| `src/components/dashboard/widgets/CarouselWidget.tsx` | Wrapper for PromotionalCarousel |
| `src/hooks/useLocalStorage.ts` | Hook for persisting layout data |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/contexts/DashboardContext.tsx` | Expand to include all widget types, merge with layout |
| `src/pages/Index.tsx` | Replace static layout with dynamic widget grid |
| `src/App.tsx` | Add LayoutProvider if separate context used |

---

## Data Models

### Widget Definition

```tsx
interface DashboardWidget {
  id: string;                // Unique instance ID
  type: WidgetType;          // Type identifier
  title: string;             // Display title
  position: number;          // Order in grid
  zone: 'main' | 'sidebar';  // Layout zone
  size: 'sm' | 'md' | 'lg';  // Widget size variant
  pinnedAt: Date;            // When added
  isDefault?: boolean;       // Part of default layout
}

type WidgetType = 
  | 'hero-banner'
  | 'action-center'
  | 'promotional-carousel'
  | 'news-training'
  | 'connect-upline'
  | 'forecast'
  | 'velocity'
  | 'pipeline';
```

### Layout Template

```tsx
interface LayoutTemplate {
  id: string;
  name: string;
  createdAt: Date;
  widgets: Array<{
    type: WidgetType;
    position: number;
    zone: 'main' | 'sidebar';
  }>;
}
```

---

## Implementation Details

### 1. Widget Registry

Central registry mapping widget types to their components:

```tsx
const widgetRegistry = {
  'hero-banner': { 
    component: HeroBannerCard, 
    title: 'Capping Progress',
    defaultZone: 'main',
    icon: Target 
  },
  'action-center': { 
    component: ActionCenterCard, 
    title: 'Action Center',
    defaultZone: 'main',
    icon: CheckCircle 
  },
  'promotional-carousel': { 
    component: PromotionalCarousel, 
    title: 'Promotions',
    defaultZone: 'main',
    icon: Sparkles 
  },
  'news-training': { 
    component: NewsAndTrainingCard, 
    title: 'News & Training',
    defaultZone: 'sidebar',
    icon: Newspaper 
  },
  'connect-upline': { 
    component: ConnectUplineCard, 
    title: 'Connect with Upline',
    defaultZone: 'sidebar',
    icon: Users 
  },
  'forecast': { 
    component: ForecastWidget, 
    title: 'Revenue Forecast',
    defaultZone: 'main',
    icon: TrendingUp 
  },
  'velocity': { 
    component: VelocityWidget, 
    title: 'Listing Velocity',
    defaultZone: 'main',
    icon: Zap 
  },
  'pipeline': { 
    component: PipelineWidget, 
    title: 'Active Pipeline',
    defaultZone: 'main',
    icon: BarChart 
  },
};
```

### 2. DraggableWidget Component

Wrapper that adds drag-and-drop and delete functionality:

```tsx
<DraggableWidget 
  widget={widget}
  onDelete={handleDelete}
  onDragStart={...}
  onDragOver={...}
  onDrop={...}
>
  <WidgetComponent />
</DraggableWidget>
```

Features:
- Drag handle (grip icon) in top-left corner
- Delete button (X) in top-right corner
- Visual feedback during drag (opacity, border highlight)
- Drop zones between widgets

### 3. Drag-and-Drop Implementation

Use native HTML5 drag-and-drop (no external library needed):

```tsx
// On drag start
const handleDragStart = (e, widgetId) => {
  e.dataTransfer.setData('widgetId', widgetId);
  setDraggedWidget(widgetId);
};

// On drop
const handleDrop = (e, targetPosition) => {
  const draggedId = e.dataTransfer.getData('widgetId');
  reorderWidgets(draggedId, targetPosition);
};
```

### 4. Template System

**Save Template:**
- Click "Save Layout" button
- Enter template name in dialog
- Saves current widget order/zones to localStorage

**Load Template:**
- Select from dropdown of saved templates
- Confirms before replacing current layout
- "Reset to Default" option always available

**Default Template:**
The initial layout users see:
- Main zone: HeroBannerCard, StatsRow (fixed), ActionCenterCard, PromotionalCarousel
- Sidebar: NewsAndTrainingCard, ConnectUplineCard

### 5. Widget Gallery

Sheet/modal for adding new widgets:
- Shows all available widget types not currently on dashboard
- Each shows icon, title, description
- Click to add to dashboard (appends to main zone)
- AI widgets can also be added here manually

### 6. Layout Persistence

Using localStorage with a custom hook:

```tsx
const useLayoutPersistence = () => {
  const STORAGE_KEY = 'dashboard-layout';
  
  const saveLayout = (widgets) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  };
  
  const loadLayout = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : getDefaultLayout();
  };
  
  return { saveLayout, loadLayout };
};
```

---

## Updated Dashboard Layout

### Index.tsx Structure

```tsx
const Index = () => {
  const { widgets, removeWidget, reorderWidgets } = useLayout();
  
  const mainWidgets = widgets.filter(w => w.zone === 'main');
  const sidebarWidgets = widgets.filter(w => w.zone === 'sidebar');
  
  return (
    <DashboardLayout>
      {/* Header - Fixed */}
      <WelcomeHeader />
      
      {/* Layout Controls */}
      <div className="flex justify-between mb-4">
        <h2>Your Dashboard</h2>
        <div className="flex gap-2">
          <AddWidgetButton />
          <TemplateDropdown />
          <SaveLayoutButton />
        </div>
      </div>
      
      {/* Stats Row - Fixed */}
      <StatsRow />
      
      {/* Dynamic Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Zone (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {mainWidgets.map((widget, index) => (
            <DraggableWidget 
              key={widget.id}
              widget={widget}
              index={index}
              zone="main"
            />
          ))}
          <DropZone zone="main" />
        </div>
        
        {/* Sidebar Zone (1 col) */}
        <div className="space-y-6">
          {sidebarWidgets.map((widget, index) => (
            <DraggableWidget 
              key={widget.id}
              widget={widget}
              index={index}
              zone="sidebar"
            />
          ))}
          <DropZone zone="sidebar" />
        </div>
      </div>
    </DashboardLayout>
  );
};
```

---

## User Flow

### Reordering Widgets
1. User hovers over widget - drag handle appears
2. User drags widget by handle
3. Drop zones highlight as user drags
4. User drops in new position
5. Layout auto-saves to localStorage

### Deleting Widgets
1. User hovers over widget - X button appears
2. User clicks X
3. Confirmation toast appears with "Undo" option
4. Widget removed from dashboard

### Adding Widgets
1. User clicks "+ Add Widget" button
2. Widget Gallery sheet opens
3. User selects widget type
4. Widget appears at bottom of main zone
5. User can drag to reposition

### Saving Templates
1. User clicks "Save Layout" button
2. Dialog opens for template name
3. User enters name and confirms
4. Toast: "Template saved successfully"

### Loading Templates
1. User clicks template dropdown
2. User selects saved template
3. Confirmation dialog: "Replace current layout?"
4. Layout updates to template

---

## Technical Notes

- StatsRow remains fixed and is NOT part of the widget system
- Drag-and-drop uses native HTML5 API (no additional dependencies)
- Layouts persist in localStorage (can upgrade to backend later)
- Each widget instance has unique ID for tracking
- AI-pinned widgets integrate seamlessly with manually added widgets
- Templates only store widget types and positions, not data

---

## File Summary

| Action | File |
|--------|------|
| Create | `src/contexts/LayoutContext.tsx` |
| Create | `src/components/dashboard/DraggableWidget.tsx` |
| Create | `src/components/dashboard/WidgetGallery.tsx` |
| Create | `src/components/dashboard/TemplateManager.tsx` |
| Create | `src/components/dashboard/LayoutControls.tsx` |
| Create | `src/hooks/useLocalStorage.ts` |
| Modify | `src/contexts/DashboardContext.tsx` |
| Modify | `src/pages/Index.tsx` |

