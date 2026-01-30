

# AI-to-Dashboard Widget Pinning System

## Overview

Build an interactive AI chat system that can display widget previews within chat messages and allow users to pin these widgets directly to their dashboard. This creates a customizable dashboard experience driven by AI-generated insights.

---

## Architecture

```text
+------------------+     +-------------------+     +------------------+
|   Mira Chatbot   | --> | Chat Context/Hook | --> |  Index (Home)    |
|                  |     | (shared state)    |     |  Dashboard       |
+------------------+     +-------------------+     +------------------+
        |                        |                        |
        v                        v                        v
+------------------+     +-------------------+     +------------------+
| ChatMessage      |     | dashboardWidgets  |     | PinnedWidgets    |
| Component        |     | pinnedWidgetIds   |     | Grid Section     |
+------------------+     +-------------------+     +------------------+
        |
        v
+------------------+
| Widget Previews  |
| (Forecast,       |
|  Velocity,       |
|  Pipeline)       |
+------------------+
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/contexts/DashboardContext.tsx` | Shared state for pinned widgets |
| `src/components/chat/ChatPanel.tsx` | Slide-out chat panel container |
| `src/components/chat/ChatMessage.tsx` | Renders text or widget preview messages |
| `src/components/chat/WidgetPreview.tsx` | In-chat widget preview with Pin button |
| `src/components/dashboard/PinnedWidgetsGrid.tsx` | Renders pinned widgets at top of dashboard |
| `src/components/dashboard/widgets/ForecastWidget.tsx` | Revenue Share forecast chart |
| `src/components/dashboard/widgets/VelocityWidget.tsx` | Listings velocity metric |
| `src/components/dashboard/widgets/PipelineWidget.tsx` | Active escrows summary |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Wrap with context, add PinnedWidgetsGrid |
| `src/components/layout/DashboardLayout.tsx` | Add ChatPanel and floating trigger button |
| `src/App.tsx` | Wrap app with DashboardProvider |

---

## Implementation Details

### 1. Dashboard Context (State Management)

Create a React context to manage:
- `dashboardWidgets`: Array of pinned widget objects
- `pinnedWidgetIds`: Set of IDs for quick lookup
- `addWidget()`: Function to pin a new widget
- `removeWidget()`: Function to unpin a widget

```tsx
interface DashboardWidget {
  id: string;
  type: 'forecast' | 'velocity' | 'pipeline';
  title: string;
  pinnedAt: Date;
}

interface DashboardContextType {
  widgets: DashboardWidget[];
  pinnedIds: Set<string>;
  addWidget: (widget: DashboardWidget) => void;
  removeWidget: (id: string) => void;
}
```

### 2. Chat Panel Component

- Slide-out sheet (using existing Sheet component) triggered by floating Mira button
- Contains message history and input field
- Messages array with sender ('user' | 'ai') and content (text or widget)

### 3. Chat Message Component

Renders two types of content:
- **Standard Text**: Regular chat bubble with markdown support
- **Widget Preview**: Embedded widget card with Pin button

```tsx
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  widget?: {
    type: 'forecast' | 'velocity' | 'pipeline';
    id: string;
    title: string;
  };
  timestamp: Date;
}
```

### 4. Widget Preview Component

- Renders inside chat bubble as a mini dashboard card
- Displays widget content (chart, metric, or summary)
- **Pin to Dashboard** button:
  - Default: Blue button with pin icon
  - After pinning: Green checkmark with "Pinned" text, disabled

### 5. Widget Components

**Forecast Widget:**
- Line/area chart showing projected Revenue Share for next 6 months
- Uses recharts (already installed)
- Mock data showing upward trend

**Velocity Widget:**
- Single metric card showing days-on-market average
- Comparison to previous period
- Color-coded indicator (green = fast, yellow = average)

**Pipeline Widget:**
- Summary card with escrow counts
- Total value in pipeline
- Status breakdown (pending, in escrow, closing soon)

### 6. AI Response Simulation

When user types specific phrases, simulate AI responses:

| User Input | AI Response |
|------------|-------------|
| "show me my forecast" | Text explanation + Forecast Widget preview |
| "how fast are my listings selling" | Text explanation + Velocity Widget preview |
| "what's in my pipeline" | Text explanation + Pipeline Widget preview |

### 7. Pinned Widgets Grid

- Appears at the **top** of the main dashboard content (above HeroBannerCard)
- Responsive grid (1-3 columns based on screen size)
- Each pinned widget has an "X" button to remove
- Animates in when new widget is pinned

### 8. Toast Notification

When widget is pinned, show toast:
- Message: "Insight added to your Command Center"
- Duration: 3 seconds
- Uses existing sonner toast system

---

## User Flow

1. User clicks floating Mira button (bottom right)
2. Chat panel slides open from the right
3. User types "Show me my forecast"
4. AI responds with:
   - Text: "Based on your current trajectory, here's your projected Revenue Share for the next 6 months..."
   - Widget Preview: Forecast chart with "Pin to Dashboard" button
5. User clicks "Pin to Dashboard"
6. Button changes to green checkmark "Pinned"
7. Toast appears: "Insight added to your Command Center"
8. Forecast widget appears at top of home dashboard
9. User can close chat and see widget on dashboard
10. User can remove widget by clicking X on the widget card

---

## Technical Notes

- Use `useState` in context for simplicity (no external state library needed)
- Widget IDs are unique strings combining type and timestamp
- Pinned state persists only in memory (refreshing clears - can add localStorage later)
- Charts use recharts with consistent theming matching existing dashboard

