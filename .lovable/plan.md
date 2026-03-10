

## Two Non-Looping Carousels

Replace the current scroll rows with two separate Embla-based `<Carousel>` components, each containing 2 cards:

### Changes in `src/components/dashboard/GrowthAndDevelopmentRows.tsx`

- Remove `ScrollRow`, `IntersectionObserver`, and ref tracking logic
- Import `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselApi` from `@/components/ui/carousel`
- **Financial Growth carousel**: Revenue Share + Stock Purchase (2 items, `loop: false`)
- **Professional Development carousel**: DISC Assessment + Your Feedback (2 items, `loop: false`)
- Each carousel tracks active index via `CarouselApi.on("select")` and renders 2 non-interactive dots below
- Keep section titles ("Financial Growth", "Professional Development") above each carousel
- Keep existing card theme styles and NPS dialog unchanged

