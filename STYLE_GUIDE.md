# Design System & Styling Guidelines

This document outlines the core styling conventions, best practices, responsive behaviors, and component architectures derived from `src/style.css`. Any new enhancements must align with these patterns to preserve a consistent and polished UI, especially for touch accessibility.

## 1. The Mobile-First Breakpoint System
We build on a mobile-first philosophy relying on Tailwind's default breakpoints:
- **Base (mobile):** For screens smaller than 768px (`md:`). This is our base styling.
- **`md:` (desktop / standard):** `@media (min-width: 768px)`
- **`lg:` (large desktop):** `@media (min-width: 1024px)`

**Rule of Thumb:** Always write the accessible mobile dimension base sizes first. Progressively adjust or enhance the UI into `md:` and `lg:` size scaling (e.g., `@apply gap-5 md:gap-8;`).

## 2. Spacing System (Margin, Padding, Layout)
A tight compliance with the **4-point (base unit) grid** is followed for layout structural flow (where `1 tailwind unit = 0.25rem = 4px`).

### Touch Accessibility & Minimum Scaling
Mobile layouts **must** prioritize finger touch targets. This means minimum heights, paddings, and interaction boundaries need to be much wider on mobile base views, while occasionally crunching down for desktop efficiency (`md:`).

- **Component Padding (Cards, Buttons, Inputs):**
  - Standard buttons run on large touch padding: `@apply px-6 py-3 md:py-2.5;`
  - Form Fields and inputs mandate heights of roughly ~44px to prevent tap fatigue: `@apply py-2.5 md:py-2 px-4;`
  - Base container sizing defaults to generous breathing room for reading flows: `@apply max-w-container mx-auto px-6 md:px-12 lg:px-16;`

## 3. Sizing (Height, Width)
Explicit width and height properties define visual weight consistently:
- **Interactive Targets (Buttons, Icon Wrappers):** Standardized scaling for Apple/Google touch accessibilities guidelines.
  - Floating and icon buttons must map to a minimum 44px (e.g. `w-11 h-11`) layout box.
  - Responsive Flow: `@apply w-11 h-11 md:w-10 md:h-10;` or larger `w-14 h-14 md:w-12 md:h-12` for primary actions.

## 4. Typography Hierarchy
Text elements follow a strictly cascading size hierarchy that adjusts per breakpoint. To prevent iOS automatic scale-zooming into inputs, and to preserve reading ergonomics, do not drop below `text-sm` (14px) for reading, and ensure `text-base` (16px) is standard for mobile forms.

| Element Type       | Base (Mobile)       | `md:`             | `lg:`             |
|--------------------|---------------------|-------------------|-------------------|
| **Giant Headings** | `text-3xl`          | `text-4xl`        | -                 |
| **Section Titles** | `text-lg`           | `text-xl`         | —                 |
| **Article Titles** | `text-xl`           | —                 | —                 |
| **Base Body**      | `text-base`         | `text-lg`         | —                 |
| **Metatags/Small** | `text-xs`/`sm`      | `text-sm`         | —                 |

## 5. Border Radius (Rounding Aesthetics)
Following a refined UI approach, curve amounts depend on the element's visual hierarchy.
- **Pills & Circular Icons:** Fully rounded wrappers -> `@apply rounded-full;` (Used for floating action buttons, tags, profile pictures).
- **Global Cards & Drawers:** High rounding adds structural modernity -> `@apply rounded-xl` to `rounded-3xl` (or custom like `rounded-[1.25rem]`).
- **Forms & Inputs:** Standard elements have subtle rounding -> `@apply rounded-md;`

*Note: Nesting shapes logic dictates outer containers must use a higher radius (e.g., `3xl`) than structurally encapsulated inner modules (e.g., `xl`).*

## 6. CSS Layer Architecture
When authoring `@apply` blocks inside `style.css`:
- `Base`: For core resets, strict layout defaults, and CSS Native Variable Declarations (`--bg-main`, `--text-primary`).
- `Components`: Standard recurring component chunks. E.x (`.btn-primary`, `.header-main`, `.article-content`). Avoid inline utilities in `.vue` files for standard components if a centralized class will keep the ecosystem uniform.
- `Utilities`: Strictly custom interactions, non-Tailwind modifiers, transitions like `.layout-transition` and `.magnetic-hover`.

---

**Approval Guidelines**
Before pushing a `.vue` update to any existing module, double-check whether padding (`p-`), margin (`m-`), and size behaviors gracefully handle touch accessibility and readability benchmarks across mobile before expanding layout options to `md:` logic.
