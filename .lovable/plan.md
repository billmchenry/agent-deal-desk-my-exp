

# Context-Aware Mira Welcome Message

## Overview
Update Mira's welcome/introduction message to be page-aware, similar to how suggestion chips already adapt per route. This way, when a user opens the chat on the Transactions page, Mira's greeting references transactions rather than GCI trends.

## Changes

**File: `src/components/chat/ChatPanel.tsx`**

Add a route-based welcome message map alongside the existing `ROUTE_SUGGESTIONS`:

| Route | Welcome Message |
|-------|----------------|
| `/agent/transactions` | "Hi! I'm Mira, your AI assistant. I can help you analyze your transactions -- ask about pending deals, closing timelines, or volume breakdowns!" |
| `/agent/dashboard` | (Current default message about GCI, velocity, pipeline) |
| `/agent/icon-program` | "Hi! I'm Mira, your AI assistant. I can help you track your ICON progress -- ask about your cap status, production goals, or award tiers!" |
| `/revshare` (prefix) | "Hi! I'm Mira, your AI assistant. I can help with your revenue share -- ask about earnings, organization growth, or sponsor tree performance!" |
| `/team` (prefix) | "Hi! I'm Mira, your AI assistant. I can help you manage your team -- ask about team performance, top producers, or recruiting trends!" |
| Default | Current generic message |

**Implementation details:**
- Create a `getWelcomeMessageForRoute(pathname)` function using the same prefix-matching logic as `getSuggestionsForRoute`
- When the chat opens or a new chat starts, generate the welcome message based on `location.pathname` instead of using the static `WELCOME_MESSAGE` constant
- Pass the route-aware welcome message into `ChatContent` or set it when initializing `currentMessages`
- The welcome message ID stays `'welcome'` so existing logic (e.g., filtering it out for previews) remains unchanged

**File: `src/contexts/MiraChatContext.tsx`**
- Minor update: `startNewChat` and the initial state will need to accept a dynamic welcome message, or the welcome message replacement will happen in `ChatPanel` after mount. The simpler approach is to handle it entirely in `ChatPanel.tsx` by replacing the welcome message content based on route when rendering, keeping the context untouched.

## Technical Approach
The cleanest path is to **not change the context** and instead override the welcome message at render time in `ChatPanel.tsx`. When mapping over `currentMessages`, if the message ID is `'welcome'`, substitute its content with the route-appropriate text. This avoids coupling routing logic into the context layer.

