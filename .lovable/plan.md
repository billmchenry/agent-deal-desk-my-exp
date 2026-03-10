

## Fix Connect Upline Card Header Alignment

The title "Connect with your Upline" is wrapping because it competes for space with the tabs in the flex row. Fix by adding `whitespace-nowrap` to the title and `shrink-0` to the tabs so they don't compress.

### Change: `src/components/dashboard/ConnectUplineCard.tsx` (line 47-48)
- Add `flex-wrap` to the container and `whitespace-nowrap` to the title
- Add `shrink-0` to the `Tabs` wrapper so the pill tabs never compress

