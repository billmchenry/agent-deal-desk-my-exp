

## Implement Dark Mode

### Current State
- Dark mode CSS variables are fully defined in `src/index.css` (`.dark` class)
- Tailwind is configured with `darkMode: ["class"]` in `tailwind.config.ts`
- `next-themes` package is already installed
- `sonner.tsx` already uses `useTheme` from `next-themes`
- **Missing**: No `ThemeProvider` wrapping the app, and no UI toggle to switch themes

### Changes

#### 1. Wrap App with ThemeProvider (`src/App.tsx`)
- Import `ThemeProvider` from `next-themes`
- Wrap the app content with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`
- Place it inside `QueryClientProvider` so all components can access the theme

#### 2. Add Theme Toggle to Header (`src/components/layout/Header.tsx`)
- Add a Sun/Moon icon button in the header toolbar (next to search/notifications)
- Uses `useTheme` from `next-themes` to toggle between light, dark, and system
- Simple icon button: Sun icon in dark mode, Moon icon in light mode
- Clicking cycles through: light -> dark -> system

#### 3. Review Sidebar for Dark Mode (`src/components/layout/Sidebar.tsx`)
- The sidebar already uses `--sidebar-*` CSS variables which have dark variants defined
- Verify no hardcoded colors need updating

### Technical Details
- `ThemeProvider` from `next-themes` handles persisting the user's preference to `localStorage` and applying the `dark` class to `<html>`
- All existing components using CSS variables (`hsl(var(--...))`) will automatically respond to the theme change
- The eXp brand colors (navy, blue, gold, green) remain consistent across themes since they're defined the same in both modes
- Charts in `chart.tsx` already support a dark theme selector (`.dark` prefix)
