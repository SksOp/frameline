# Frameline Human Canvas design system

This is the visual and interaction source of truth for Frameline Trial 3, including Revision 2. **Human Canvas** replaces the former neo-brutalist system with a warm, tactile creator brand and a quieter product system. The `/3` concept and `.triage/human-canvas-selected.jpg` are direction references; this document is authoritative where they differ from behavior or accessibility. **Frameline** is the studio and **Teleprompter** is the available product; never use the former mistranscribed product name in current UI or documentation.

## Principles and intensity

1. Be human, warm, specific, and honest. Say no account, local saving, and on-device processing only where technically true.
2. Marketing may be expressive and compositional; product UI stays calm and task-led. Both share tokens, type, geometry, voice, and motion.
3. Creator content is the object. Cards contain a meaningful step, object, tip, or action—not every region.
4. Motion explains relationships or confirms state; it must not compete with product work.
5. Design phone-first for narrow portrait, landscape, desktop, safe areas, changing browser chrome, and 200% zoom.

Marketing (`/`, `/studio`, `/products`, `/solutions`, `/teleprompter`) may use the full palette, editorial display type, overlapping shapes, gentle rotations up to 4 degrees, and buoyant response motion. It must communicate Frameline's focused creator-tool promise, no-account use, local privacy posture, and available Teleprompter within the first viewport. Interactive demonstrations need pointer, keyboard, touch, reduced-motion, and meaningful static states; they must not import the tool runtime.

Teleprompter uses the same system at lower intensity. Coral identifies primary action/current step; sage, gold, and editorial type are accents. The script and preview remain dominant. Use **Write → Practice → Record** language without changing the established Trial 3 workspace UX or layout.

## Exact foundation tokens

Define these exact properties in light-mode `:root` in `src/app/globals.css`. Components consume semantic roles, never copied values.

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` | `#f4ead8` | Global warm canvas |
| `--surface` | `#fffaf0` | Content/control surface |
| `--surface-elevated` | `#fffdf8` | Dialogs, menus, raised objects |
| `--surface-inset` | `#eadbc3` | Wells, groups, tracks |
| `--surface-strong` | `#e7d7bd` | Section/product surround |
| `--text-primary` | `#28251f` | Default text/icons |
| `--text-secondary` | `#625c51` | Supporting normal text |
| `--text-subtle` | `#756e61` | Metadata/large secondary labels |
| `--text-inverted` | `#fffaf1` | Text on strong dark fills |
| `--border` | `#c9b99f` | Control/container boundary |
| `--divider` | `#d5c6af` | Quiet separator |
| `--brand-coral` | `#df5d37` | Recognizable brand/large field |
| `--brand-coral-strong` | `#a83b20` | Accessible link/primary control |
| `--brand-coral-soft` | `#f4c5b3` | Selected/highlight surface |
| `--accent-sage` | `#8eb888` | Supporting brand field |
| `--accent-sage-strong` | `#47764b` | Positive accessible text |
| `--accent-sage-soft` | `#d7e5d2` | Positive/secondary surface |
| `--accent-gold` | `#f0bd50` | Warm illustrative highlight |
| `--accent-gold-strong` | `#775515` | Accessible warning text |
| `--accent-gold-soft` | `#f8e2aa` | Warning/highlight surface |
| `--focus` | `#7138a8` | Focus-visible ring |
| `--positive` / `--positive-surface` | `#47764b` / `#d7e5d2` | Success/saved |
| `--warning` / `--warning-surface` | `#775515` / `#f8e2aa` | Warning/stale |
| `--danger` / `--danger-surface` | `#a7352b` / `#f5d3ce` | Error/destructive |
| `--informative` / `--informative-surface` | `#365f78` / `#d8e8ef` | Product information |
| `--disabled` / `--disabled-foreground` | `#b7aa96` / `#625c51` | Disabled control/label |
| `--overlay` | `rgb(40 37 31 / 0.48)` | Modal backdrop |

`--brand-coral` is not automatically accessible behind small cream text; default primary controls use `--brand-coral-strong`. Map shadcn roles (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--input`, `--ring`, and foreground roles) to these properties—never a second palette. Dark mode is outside Trial 3 scope: set `color-scheme: light` and do not ship a partial `.dark` mapping.

### Type

- `--font-display: "Newsreader Variable", Georgia, serif` for authored marketing display and rare product-step headings.
- `--font-sans: "Inter Variable", Arial, sans-serif` for body, navigation, controls, and product UI.
- `--font-mono: "Roboto Mono Variable", ui-monospace, monospace` for numeric, timing, and technical metadata only.
- Display XL: `clamp(3.75rem, 9vw, 8rem)/0.88`, weight 560, tracking `-0.065em`.
- Display: `clamp(2.75rem, 6vw, 5.5rem)/0.92`, weight 560, tracking `-0.05em`.
- H1/H2/H3: `clamp(2rem,4vw,3.5rem)/1`, `clamp(1.5rem,2.5vw,2.25rem)/1.1`, `1.125rem/1.25`; weights 600/650/700.
- Body large/body/small: `1.125rem/1.6`, `1rem/1.55`, `0.875rem/1.5`; weights 450/450/500.
- Label and numeric/code: `0.8125rem/1.25` weight 700 and `0.8125rem/1.35` weight 650. Essential UI copy never falls below `0.75rem`.

### Spacing, shape, depth, motion

- 4px scale: `--space-1`…`--space-12` = `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`, `2.5rem`, `3rem`, `4rem`, `5rem`, `6rem`.
- `--content-gutter: clamp(1rem, 4vw, 4rem)`; `--content-max: 87.5rem`; `--target-min: 2.75rem`.
- `--radius-sm: .625rem`; `--radius-md: .875rem`; `--radius-lg: 1.25rem`; `--radius-xl: 1.75rem`; `--radius-2xl: 2.25rem`; `--radius-pill: 999px`.
- `--shadow-sm: 0 .25rem .875rem rgb(99 76 42 / .08)`; `--shadow-md: 0 .75rem 2rem rgb(99 76 42 / .12)`; `--shadow-lg: 0 1.5rem 3.75rem rgb(99 76 42 / .15)`.
- `--duration-fast: 120ms`; `--duration-standard: 200ms`; `--duration-slow: 420ms`; `--ease-standard: cubic-bezier(.2,.8,.2,1)`; `--ease-buoyant: cubic-bezier(.34,1.56,.64,1)`.

Use soft warm depth, one-pixel borders, and generous radii. Do not restore heavy black borders, hard offset shadows, acid fields, universal uppercase, or rigid shadow-press effects.

## First-viewport composition and motion

The landing page begins with the Frameline studio promise, not a Teleprompter-only headline. Teleprompter may be the concrete proof point, but the primary action leads to `/studio`; product discovery through `/products` is secondary. The first viewport should reveal the relationship between studio promise, available product, and future focused tools without requiring scroll, hover, or animation to understand it.

- Use one coordinated entrance sequence at most: editorial headline, supporting copy, then product objects. Keep the total reveal brief and interruptible.
- Prefer opacity and small translate/scale changes. Do not animate layout dimensions, create continuous parallax, or make text wait behind long choreography.
- Pointer movement may gently respond in an illustrative canvas only. It must not move controls, capture the pointer, or run on coarse/touch pointers.
- The static server-rendered state is complete. Under reduced motion, render that final state immediately and remove auto-cycling, floating, parallax, and scroll-linked transforms.
- Avoid expensive blur, filters, and large continuously repainted layers on phones. Motion is a hierarchy aid, not ambient decoration.

## Responsive sliding mega-navigation

The shared studio header owns navigation across `/`, `/studio`, `/products`, `/solutions`, and `/teleprompter`. Keep the Frameline wordmark at the left with **Products** and **Solutions** immediately after it. A quiet Studio link may sit at the far edge, but must not displace the primary navigation or compete with page-level actions.

The navigation frame uses the shared content gutter and a bounded wide maximum. It may be wider than page reading columns, but it must not stretch edge-to-edge indefinitely on large displays. The open panel spans the full width of that bounded frame so Products and Solutions feel like two views of one stable navigation surface.

### Desktop behavior

- Compose the project-owned shadcn `NavigationMenu`; migrate and mark it before use. Do not build a parallel menu/popover system.
- Products and Solutions are buttons/triggers, not hover-only links. Click, `Enter`, or `Space` opens the requested view; pointer hover may preview/open only when it preserves predictable click and focus behavior.
- Left/right arrow keys move between top-level triggers according to the primitive contract. `Escape` closes the panel and returns focus to its trigger. Tabbing enters the panel in DOM order and never crosses hidden content.
- Products and Solutions share one broad panel container. Switching triggers slides/fades the inner view horizontally while the outer panel remains anchored; avoid height jumps by using a stable measured/minimum panel geometry.
- Each entry includes a concise label and description. Product entries include an explicit **Available** or **Coming soon** status. An optional feature card is allowed only when it communicates real product information.
- Outside pointer activation and focus leaving the navigation close it predictably. Opening one view closes the other; route changes close the entire menu.

### Mobile behavior

- At the documented compact breakpoint, replace the desktop NavigationMenu interaction with the project-owned shadcn `Drawer`; migrate and mark it before use.
- The menu trigger is a labelled 44px target. The drawer exposes Products and Solutions as tap-first disclosure sections, preserves the same information and availability labels, respects safe-area insets, and keeps the close control reachable.
- Opening contains focus; closing or navigation restores focus appropriately. The body behind the drawer must not scroll or remain interactive.
- Never render the desktop popup off-canvas and call it mobile navigation. Never require hover, a fine pointer, horizontal dragging, or a gesture-only close.

At 200% zoom, the navigation must switch to the compact pattern before labels collide. The panel/drawer may scroll vertically within the viewport, but the document and panel must not gain horizontal overflow. Long product names and descriptions wrap; no content is clipped. Reduced motion replaces the shared sliding transition with an immediate view change or a short opacity change.

## Product rail and honest availability

The landing page may use a horizontally scrollable product rail; `/products` may use the rail or a selected-product treatment. Both render from the typed catalog and distinguish Teleprompter from the working concepts **Code Animator** and **Workflow Animator**.

- Teleprompter is first, visibly **Available**, and exposes real product and launch links.
- Unavailable concepts are visibly **Coming soon**. They are informational articles, not disabled controls; they have no fake product route, launch button, countdown, waitlist, pricing, or structured-data claim of availability.
- Every card has a product-specific visual motif, short job statement, and status. Do not reuse Teleprompter phone artwork for unrelated products.
- Use native horizontal scrolling with `scroll-snap` as progressive enhancement. Cards remain reachable by touch, trackpad, wheel/shift-wheel where supported, and keyboard focus. If previous/next buttons are present, label them and disable them truthfully at the bounds.
- Preserve a partial next-card cue without shrinking text or touch targets. At narrow widths, one primary card is legible at a time; at wide widths, show more cards without turning the rail into an edge-to-edge strip.
- Do not auto-advance. Selection cannot depend on drag, hover, or color. At 200% zoom, cards may stack or retain a vertically reachable snap rail without document-level horizontal overflow.

`/solutions` connects the studio principles—focused, private, client-side where technically possible, immediate/no-account access, and a real free path—to available or planned products. Claims must be qualified per product. A concept card may illustrate direction, but cannot imply that unavailable software exists.

## Production footer

The footer is a purposeful studio endpoint rather than a minimal line of links. It contains:

- a concise Frameline statement and the current truthful privacy/no-account boundary;
- a **Products** group with Teleprompter marked Available and the three future concepts marked Coming soon as plain text unless real routes exist;
- a **Solutions** group linking to useful anchors or sections that actually exist;
- a small studio/navigation group for Home, Products, Solutions, and source, status, privacy, support, or legal destinations only when those destinations are real;
- copyright, licensing, and source-availability language only after the exact terms and destination are verified.

Use semantic grouped navigation with visible headings, comfortable touch targets, logical reading order, and wrapping columns. On phones it stacks without accordions unless collapsing materially improves a long real footer. Do not invent customer logos, social accounts, contact channels, enterprise claims, policy pages, or filler links to make it look established.

## Component state contract

Every applicable primitive implements: default; subtle hover (color/elevation or max 2px lift); 3px `--focus` focus-visible ring with 2px offset; active/pressed without layout shift; selected/open/checked indicated by more than color; disabled with readable label and no motion; invalid with danger icon/text and `aria-describedby`; loading with stable dimensions, label context, `aria-busy`, and duplicate activation prevention.

Primary buttons use strong coral and are reserved for a region's main action. Secondary uses surface plus border. Ghost retains visible hover/focus surfaces. Destructive uses danger, never brand coral. Icon-only controls require accessible names and practical 44px targets.

Inputs, textarea, select, slider, switch, dialog, drawer, popover, tooltip/hover help, alert, and menu share these states. Dialog/drawer focus is contained and restored. Desktop hover help has a focus path and touch tap/click equivalent. Status never depends on color alone.

## Runtime, responsive, and accessibility invariants

The visual migration must not change reducer actions, derived state, persistence, preview timing/layout/progress, canvas painting, `VideoFrame` creation, worker/encoding ownership, timestamps, queues, keyframes, transfer/cleanup, signatures/stale rules, cancellation, playback, Picture-in-Picture, keyboard behavior, focus order, accessible names, dialog/drawer behavior, or live regions. Playback-only speed/looping still do not recompile; preview still pauses during encoding.

User-selected preview foreground/background colors remain authoritative in preview and generated frames. Brand tokens never replace them. Keep saved, stale, preparing, ready, unsupported, failed, and cancelled states explicit.

Test from 320px narrow portrait through landscape and desktop. Respect safe-area insets; keep primary actions reachable; reflow at 200% zoom without clipping or two-dimensional scrolling. Preserve semantic DOM order. Meet WCAG AA contrast for text, labels, focus, and status. Hover is enhancement only. Under `prefers-reduced-motion: reduce`, remove transforms, parallax, auto-cycling, and nonessential transitions while retaining all content and states.

## CSS, assets, and ownership

Use components over reusable CSS. Reuse and compose an approved project-owned shadcn primitive before creating a custom component. Static presentation belongs in token-backed Tailwind utilities on the owning component, and finite reusable states belong in primitive variants. Extract generic repeated behavior into a UI primitive or variant; extract repeated domain structure into a feature component.

Do not add feature stylesheets, CSS Modules, reusable feature selectors, undiscoverable dynamic class-name fragments, or static inline `style` props. `src/app/globals.css` is limited to framework/theme imports, shared color, spacing, radius, elevation, and motion tokens, resets, document-wide accessibility behavior, and documented runtime keyframes. Components must not reach into primitive internals.

Inline styles are allowed only for values calculated at runtime or selected by the user, in the component that owns those values. Next.js `ImageResponse` social artwork is also exempt because it cannot consume the CSS theme; keep recurring social colors in a typed TypeScript palette exactly synchronized with CSS tokens. A genuinely one-off illustration literal is allowed only when documented beside its use and not repeated. No component presentation may copy repeated literal colors/values or use arbitrary utilities when a token exists. Update Open Graph artwork, icons, manifest theme color, and visible brand surfaces; none may retain neo-brutalism.

## Full-catalog shadcn reset

Trial 3 resets the whole project-owned catalog:

1. Preserve the recorded recovery checkpoint and import inventory.
2. Delete `src/components/ui/` in full.
3. Run exactly `npm exec shadcn -- add --all --overwrite --yes` at repository root.
4. Make every generated primitive token-compatible; prioritize complete state review for live consumers/dependencies.
5. Add this exact first-line marker to every approved primitive:

```ts
// DESIGN SYSTEM: Migrated to the current design.md.
```

An unmarked primitive is generated but not approved for application use. Before a live import, migrate all supported states and dependencies, then mark each. Product composites belong in feature directories, never `src/components/ui/`.

## Trial 3 verification

Verify tokens/primitives, then public and product surfaces at narrow portrait, landscape, desktop, safe-area/chrome changes, 200% zoom, keyboard-only, touch, reduced motion, disabled, invalid, and loading states. Run typecheck, unit tests, lint, and production build; capture responsive screenshots.

Browser E2E files/configuration are explicitly deferred and removed for Trial 3; do not run or recreate Playwright coverage. Final hands-on Teleprompter and real Android Chrome verification belongs to the user and is a handoff, not an automated guarantee.
