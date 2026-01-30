
# Plan: Bridge the AI Widget Creation Discovery Gap

## Problem Summary
There's a user experience disconnect where agents don't realize they can create custom insight widgets through conversations with Mira AI. The current "Add Widget" button only shows pre-built widgets, with no indication that personalized AI-generated insights can be pinned as widgets.

## Solution Overview
Add visual cues and entry points that connect the dashboard customization experience to Mira AI, making it clear that conversations can become pinned widgets.

---

## Implementation Steps

### 1. Add "Create with Mira" Option in the Add Widget Dropdown
Modify `DashboardToolbar.tsx` to include a special menu item at the bottom of the "Add Widget" dropdown that opens the Mira chat panel.

**What it does:**
- Adds a highlighted option like "Ask Mira for a custom insight" with a sparkles icon
- When clicked, opens the Mira chat panel
- Creates a clear path from dashboard customization to AI-powered widget creation

**Requires:** Passing a callback from `DashboardLayout` to open the chat, or using a simple event/state management approach.

### 2. Update Empty Dashboard State with Mira Prompt
Modify the empty state message in `CustomizableDashboard.tsx` to suggest asking Mira.

**Current message:**
```
No widgets in main area
Click "Add Widget" to add content
```

**Proposed message:**
```
No widgets in main area
Click "Add Widget" or ask Mira for personalized insights
[Chat with Mira] button
```

### 3. Add a Floating Tooltip/Hint on First Visit
Add a one-time tooltip or callout near the Mira floating button that says "Ask me anything and pin my answers to your dashboard!"

### 4. Enhance Mira's Welcome Message
Update the initial welcome message in `ChatPanel.tsx` to be more explicit about the pinning capability:

**Current:**
> "Hi! I'm Mira, your AI assistant. Ask me about your forecast, listing velocity, or pipeline to see insights you can pin to your dashboard."

**Proposed:**
> "Hi! I'm Mira, your AI assistant. Ask me anything about your business and I can give you insights you can **pin as widgets** on your dashboard. Try asking about your forecast, listing velocity, or pipeline!"

### 5. Add Visual Badge on Mira Button
Add a subtle indicator on the floating Mira button (like a small "+" badge) to hint that it can add content to the dashboard.

---

## Technical Details

### File Changes

| File | Change |
|------|--------|
| `src/components/dashboard/DashboardToolbar.tsx` | Add "Create with Mira" menu item that triggers chat open |
| `src/components/dashboard/CustomizableDashboard.tsx` | Update empty state with Mira CTA and button |
| `src/components/chat/ChatPanel.tsx` | Enhance welcome message |
| `src/components/layout/DashboardLayout.tsx` | Expose `setChatOpen` via context or callback prop |
| `src/pages/Index.tsx` | Wire up the chat open callback |

### Approach for Cross-Component Communication
Create a simple callback pattern:
1. Add `onOpenMiraChat` prop to `CustomizableDashboard` and `DashboardToolbar`
2. Pass the `setChatOpen(true)` function down from `DashboardLayout`

Alternatively, create a small `MiraChatContext` to manage chat open state globally.

---

## User Experience Flow After Implementation

1. User lands on dashboard and sees "Add Widget" button
2. Clicking it shows standard widgets PLUS "Ask Mira for custom insight"
3. Clicking that option opens Mira chat
4. User asks a question, Mira responds
5. User sees "Pin to Dashboard" button on the response
6. Pinned insight appears as a draggable widget

---

## Optional Enhancements (Future)
- Let users edit the title of an AI insight before/after pinning
- Add category tags to pinned insights (e.g., "Revenue", "Performance")
- Show a "Pinned from Mira" badge on AI insight widgets
