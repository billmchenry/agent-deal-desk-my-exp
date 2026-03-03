# WCAG 2.2 Level A & AA — Accessibility Checklist

Reference this checklist whenever adding or modifying components, pages, or features.

---

## 1. Perceivable

### Text Alternatives (1.1.1)
- Every `<img>` has a descriptive `alt` attribute (or `alt=""` if purely decorative)
- Icon-only buttons have `aria-label` describing their action
- SVG icons used inline include `aria-hidden="true"` when decorative, or `role="img"` + `<title>` when meaningful

### Color Contrast (1.4.3 / 1.4.11)
- **Normal text**: minimum 4.5:1 contrast ratio against background
- **Large text** (≥18pt or ≥14pt bold): minimum 3:1
- **UI components & graphical objects**: minimum 3:1
- Never use opacity values below `/70` on text over dark backgrounds
- Always use semantic color tokens (`text-foreground`, `text-muted-foreground`) — never hardcode `text-white`, `text-black`, `bg-white`, `bg-black`

### Don't Rely on Color Alone (1.4.1)
- Active/selected states must have a non-color indicator (bold text, border, icon, underline)
- Charts must include labels, patterns, or direct annotations — not just color coding

### Text Spacing & Reflow (1.4.4 / 1.4.12)
- Content reflows at 320px viewport width without horizontal scrolling
- No loss of content when text spacing is increased (line-height 1.5×, letter-spacing 0.12em)

---

## 2. Operable

### Keyboard Access (2.1.1 / 2.1.2)
- Every interactive element is focusable and operable via keyboard
- No keyboard traps — users can always Tab away from any component
- Custom widgets (drag-and-drop, carousels) have keyboard alternatives

### Focus Visible (2.4.7)
- Never suppress `outline` on `:focus` — use `:focus-visible` for focus rings
- Focus indicator has ≥3:1 contrast against adjacent colors
- Use the project's `ring` token: `focus-visible:ring-2 focus-visible:ring-ring`

### Skip Navigation (2.4.1)
- The layout includes a "Skip to main content" link as the first focusable element
- `<main>` has `id="main-content"`

### Page Titles (2.4.2)
- Every page sets a unique `document.title` using `useDocumentTitle("Page Name")`
- Format: `"Page Name | MY eXp"`

### Link & Button Purpose (2.4.4 / 2.4.9)
- Link text is descriptive (avoid "click here", "read more" without context)
- If link text is generic, use `aria-label` or `aria-describedby` for context

### Touch Target Size (2.5.8 — WCAG 2.2)
- All interactive elements are at least 44×44px on touch devices
- Use `min-h-[44px] min-w-[44px]` on mobile-facing buttons and links

### Dragging Movements (2.5.7 — WCAG 2.2)
- Drag-and-drop has a non-dragging alternative (e.g., move up/down buttons)
- Announce reorder changes via `aria-live` region

---

## 3. Understandable

### Language (3.1.1)
- `<html lang="en">` is set in `index.html`
- If content is in another language, use `lang` attribute on that element

### Labels & Instructions (3.3.2)
- Every form input has an associated `<label>` or `aria-label`
- Required fields are indicated (not by color alone)
- Error messages are specific and associated with the field (`aria-describedby`)

### Error Identification (3.3.1)
- Errors are announced to screen readers (`role="alert"` or `aria-live="assertive"`)
- Error text appears near the field, not just at the top of the form

### Consistent Navigation (3.2.3)
- Navigation order is consistent across pages
- Sidebar, header, and footer appear in the same order on every page

---

## 4. Robust

### Valid Semantics (4.1.1 / 4.1.2)
- Use semantic HTML: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`
- Never use `<div onClick>` or `<a>` without `href` — use `<button>` or `<Link>`
- Custom components expose correct ARIA roles, states, and properties

### Status Messages (4.1.3)
- Toast notifications use `role="status"` or `aria-live="polite"`
- Loading states announce to screen readers
- Dynamic content changes (filters, sorts, searches) announce results count

---

## Quick Component Checklist

When creating or modifying any component, verify:

- [ ] Semantic HTML elements used (not div-soup)
- [ ] All interactive elements keyboard-accessible
- [ ] Focus indicator visible on `:focus-visible`
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Color contrast meets minimums (4.5:1 text, 3:1 UI)
- [ ] No information conveyed by color alone
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Uses design system tokens (no hardcoded colors)
- [ ] Dark mode renders correctly
- [ ] Page title set via `useDocumentTitle()`
