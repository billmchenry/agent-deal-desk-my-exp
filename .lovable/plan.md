

## Fix Auto-Scrolling During AI Response Streaming

**Problem**: The chat only scrolls to the bottom when a new message is added to `currentMessages`. During the typewriter animation, as the AI response text is revealed word-by-word, the content grows but the scroll position stays fixed -- so the user can't see the latest text being typed out.

### Root Cause
The `useEffect` that scrolls (line 622) depends on `[currentMessages]`, which only changes when a message is added/removed. The typewriter animation in `ChatMessage` updates internal state (`displayed` text), which doesn't trigger the parent's scroll logic.

### Solution

**File: `src/components/chat/ChatPanel.tsx`**

1. Add a `scrollToBottom` helper function that smoothly scrolls the messages container to the bottom.
2. Set up a polling interval (e.g., every 100ms) that auto-scrolls while any message has `isStreaming: true`. This keeps the view pinned to the bottom as text is revealed word-by-word.
3. Clear the interval once streaming is done (no messages have `isStreaming`).
4. Keep the existing `useEffect` on `[currentMessages]` for instant scroll on new messages (user sends, AI message appears).

**File: `src/components/chat/ChatMessage.tsx`**

No changes needed -- the typewriter hook already works correctly. The fix is entirely in the scroll logic of the parent container.

### Technical Detail

```text
// New useEffect in ChatPanel:
useEffect(() => {
  const hasStreaming = currentMessages.some(m => m.isStreaming);
  if (!hasStreaming) return;

  const interval = setInterval(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, 100);

  return () => clearInterval(interval);
}, [currentMessages]);
```

This polls while streaming is active and automatically cleans up once the streaming flag is cleared, ensuring the chat always stays scrolled to the latest word being revealed.
