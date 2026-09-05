# Component-First Styling Migration

## Summary

Remove both large feature stylesheets—`studio.css` and `teleprompter.css`—and move static presentation into token-backed Tailwind utilities owned by components. Reuse approved `src/components/ui` primitives before creating feature components; new feature components are reserved for meaningful domain structure or repeated compositions.

`globals.css` remains limited to Tailwind/theme setup, design tokens, resets, document-wide accessibility behavior, and the two Teleprompter preview keyframes. Runtime preview variables and user-selected colors remain inline because they are calculated state, not reusable styling.

## Public Interfaces and Rules

- Add server-compatible studio composites:
  - `StudioShell({ children, mainClassName? })`
  - `StudioContainer({ children, className? })`
  - `StudioPageHero({ eyebrow, title, titleId, lede, variant, children? })`
  - `StudioSectionHeading({ eyebrow, title, titleId, description?, tone })`
- Enhance existing UI primitives instead of duplicating them:
  - Make `Card` support semantic rendering through its existing-style `render` API so domain cards can remain `<article>` elements.
  - Add a `warning` variant to `Alert`.
  - Migrate and approve `Card`, `Accordion`, `Item`, `Separator`, `Field`, `Label`, and `Input`, including their dependencies and supported states.
  - Continue using approved `Button`, `Badge`, `NavigationMenu`, `Drawer`, `Dialog`, `HoverCard`, `NativeSelect`, `Slider`, `Switch`, and `Textarea`.
- Do not add custom action, status-badge, disclosure, field, generic card, toggle, or alert components when these primitives already fit.
- Update `AGENTS.md`, `CLAUDE.md`, and the conflicting CSS section of `design.md` with this policy:
  - Reuse an approved UI primitive first.
  - Put static Tailwind utilities and finite variants in the owning component.
  - Extract generic repeated behavior into a UI primitive/variant and domain-specific repeated structure into a feature component.
  - Prohibit feature stylesheets, CSS Modules, reusable feature selectors, dynamic class-name fragments, and static inline styles.
  - Reserve global CSS for framework imports, tokens, resets, document-wide behavior, and documented runtime keyframes.
  - Permit inline styles only for runtime-calculated or user-selected rendering values in the component that owns them.

## Implementation Phases

### Phase 0 — Documentation and Baseline

- Follow the installed Next.js App Router CSS and Server/Client Component guidance in `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` and `05-server-and-client-components.md`.
- Treat `PrompterDemo` as the repository example for component-owned token utilities and `Button`/`Badge` as the variant/composition examples.
- Preserve the current working tree rather than rebuilding from `HEAD`.
- Baseline is: typecheck passes, 72 unit tests pass, production build passes, and lint has one existing warning in `.concept/concepts/live-canvas/encoder.worker.js`.

Verification: confirm the Tailwind v4 theme exposes every required design token and record route/component screenshots before changing presentation.

Guard: do not introduce new client boundaries for styling or rely on APIs not present in the checked-in primitives.

### Phase 1 — Primitive and Global Foundation

- Migrate and mark only the additional primitives that will actually be consumed: Card, Accordion, Item/Separator, Field/Label, and Input.
- Ensure each approved primitive implements the states required by `design.md`; add Card semantic rendering and Alert’s warning variant.
- Move `.wordmark`, `.frameline-*`, and other reusable presentation out of `globals.css` and into `FramelineLogo`/owning components. Replace `.sr-only` uses with Tailwind’s `sr-only`.
- Move the exact `frameline-preview-scroll` and `frameline-reading-progress` keyframes into a clearly documented runtime section of `globals.css`.
- Add the component-first policy to `AGENTS.md` and `CLAUDE.md`, and revise `design.md` so it no longer permits general feature CSS.

Verification: primitive tests cover semantics, render passthrough, variants, focus, disabled, invalid, and warning states.

Guard: do not approve unused primitives such as Carousel, ScrollArea, Tabs, Progress, AspectRatio, or ButtonGroup merely because they exist.

### Phase 2 — Studio and Public Routes

- Introduce the four studio layout/content composites above, keeping them server-compatible.
- Convert navigation, hero, footer, product catalog/rail, solution pillars, principles, and demo presentation to colocated utilities.
- Use:
  - `Button render={<Link />}` for all CTA and text-link interactions.
  - `Badge` for availability labels.
  - `Card` parts for product, app, solution, and principle surfaces.
  - `Item` parts for repeated icon/title/description facts.
  - `Accordion` for Teleprompter requirement disclosures.
- Keep domain composites such as `ProductCard`, `ProductRail`, `StudioNavigation`, `StudioHero`, and artwork components because they own catalog truth, semantics, responsive behavior, or illustration structure.
- Replace decorative pseudo-elements with explicit `aria-hidden` elements inside their owning illustration component where necessary.
- Remove dead legacy selectors implicitly by migrating from rendered markup rather than translating all 1,039 stylesheet lines.
- Convert all five public routes to `StudioShell`, remove their stylesheet imports, and delete `studio.css`.

Verification: add tests for shell landmarks, heading associations, availability truthfulness, unavailable-product non-interactivity, CTA destinations, navigation semantics, and disclosure behavior.

Guard: keep ProductRail as native server-rendered scrolling; do not replace it with Carousel or ScrollArea, and do not give coming-soon products fake routes or controls.

### Phase 3 — Teleprompter Workspace

- Keep existing domain components and move their static styling into their JSX:
  - AppHeader, panes, dock, prepared video, capability notice, settings, and workspace.
  - Add small semantic compositions such as `PaneHeader` or `WorkspacePane` only where repeated structure has no matching UI primitive.
- Replace the raw workspace error with destructive `Alert`; use warning `Alert` for capability notices.
- Rebuild settings markup with Field/Label/Input plus existing NativeSelect, Slider, Switch, Dialog, Drawer, HoverCard, and Button primitives.
- Keep `RangeControl` as the typed scalar-to-Slider adapter and `SettingWithInfo` as the responsive desktop-hover/phone-tap composition.
- Continue using Buttons for dock controls; express selected state with `aria-pressed` and primary-action state through explicit CVA/static mappings or `data-session-state`, never `state-${sessionState}` class construction.
- Replace styling-class test hooks in PreviewPane with stable `data-slot` attributes.
- Preserve PreviewPane’s runtime CSS properties, selected colors, alignment, aspect ratio, animation keys, measured layout, pause behavior, and the two synchronized keyframes exactly.
- Remove the Teleprompter stylesheet import from `globals.css`, then delete `teleprompter.css`.

Verification: cover dock selected/generating/ready/stale/disabled states, mobile pane switching, Dialog-versus-Drawer settings behavior, labelled setting updates, prepared-output visibility, runtime colors/alignment, animation remounting, and paused/generating preview behavior.

Guard: do not replace mobile panes with Tabs, reading progress with the generic Progress primitive, or PreviewPane geometry with AspectRatio; those changes could alter rendering and lifecycle invariants.

### Phase 4 — Final Verification

- Static checks must prove:
  - Both feature CSS files are absent.
  - No imports reference them.
  - No legacy studio/workspace styling selectors remain.
  - No undiscoverable dynamic class fragments remain.
  - Runtime inline styling is confined to components with calculated/user-selected values, principally PreviewPane.
  - The two required preview keyframes exist only in `globals.css`.
- Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`.
- Capture comparison screenshots for all public routes and the workspace at 320px portrait, phone landscape, and desktop; additionally inspect 200% zoom, keyboard focus, touch/hover-none behavior, safe-area spacing, and reduced motion.
- Hand off final Android Chrome verification for WebCodecs and Picture-in-Picture; do not add or run Playwright.

## Assumptions

- “All feature CSS” means both current feature stylesheets are removed now, and the no-feature-CSS rule applies repo-wide afterward.
- “plot.html” meant the existing `CLAUDE.md`, as confirmed.
- The migration preserves current behavior and visual direction; it is not a redesign.
- Semantic component reuse is preferred over creating a wrapper for every styled element.
- Existing uncommitted work is authoritative and must be preserved.
