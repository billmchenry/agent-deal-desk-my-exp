

# Unified Search: Autocomplete + Mira AI Integration

## Overview
Enhance the global search bar to serve as both a navigation autocomplete and a gateway to Mira AI. As agents type, they see two distinct sections: matching pages/actions at the top for quick navigation, and a persistent "Ask Mira" prompt at the bottom that carries their search query directly into the Mira chat.

## How It Works

1. **Agent clicks into the search bar or presses Cmd+K**
2. **As they type**, two sections appear in the dropdown:
   - **Pages and Actions** -- filtered results matching their query (same as today)
   - **Ask Mira** -- a persistent bottom section showing "Ask Mira: [their query]" that opens the chat with their exact question pre-filled
3. **If no page results match**, the Mira option becomes the primary suggestion, encouraging agents to ask Mira instead
4. **Selecting a page result** navigates there; **selecting the Mira option** opens the chat panel with the query ready to go

## What the Agent Sees

- Typing "GCI" shows:
  - No matching pages (since we removed keyword hacks)
  - A bottom row: "Ask Mira: GCI" with a Sparkles icon -- clicking it opens Mira chat with "GCI" as the query
- Typing "transactions" shows:
  - Matching page results (Agent > Transactions)
  - Bottom row: "Ask Mira about transactions" as a fallback
- Typing a full question like "how do I increase my production" shows:
  - Few or no page matches
  - "Ask Mira: how do I increase my production" as the primary action

## Technical Details

### File: `src/components/layout/GlobalSearch.tsx`

**Changes to the dropdown rendering:**
- After the grouped page/action results, always render a "Mira" section at the bottom when there is a query
- The Mira row uses `openChatWithQuery(query)` from `MiraChatContext` to open the chat with the typed text
- The Mira row is styled distinctly with a Sparkles icon and a subtle highlight to differentiate it from navigation results
- When there are zero page matches, the Mira suggestion is promoted to the only visible option with slightly more prominent styling and helper text like "No pages found -- ask Mira instead"
- The Mira row is included in keyboard navigation (ArrowDown/ArrowUp and Enter) as the last item in the list

**Changes to the dropdown visibility:**
- `showDropdown` remains gated on `query.trim().length > 0` so nothing shows on empty focus

### No other files change
- `MiraChatContext` already exposes `openChatWithQuery` which is exactly what we need
- No new dependencies required

