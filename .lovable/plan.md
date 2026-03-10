

## Remove Modal Outline

The screenshot shows the CappingCelebrationModal has a visible blue/border outline around the dialog. Remove it by adding a border/outline/ring override on the DialogContent in `CappingCelebrationModal.tsx`.

### Change

**`src/components/dashboard/CappingCelebrationModal.tsx`**
- Add `border-none outline-none ring-0` to the DialogContent className to remove the visible outline.

