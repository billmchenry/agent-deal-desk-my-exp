

## Update Button Corner Radius to 51px

Change the base border-radius for all buttons from `rounded-md` to a custom `rounded-[51px]` in the button component.

### Change in `src/components/ui/button.tsx`

In the `buttonVariants` cva definition (line 8), replace `rounded-md` with `rounded-[51px]` in the base classes.

Also remove `rounded-md` from the `sm` and `lg` size variants (lines 20-21) since the base class already applies the radius.

Single file change, affects all buttons globally.

