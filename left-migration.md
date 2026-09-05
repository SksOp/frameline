# Component-First Styling Migration Handoff

## Objective

Finish the repository-wide migration from feature stylesheets to component-owned, token-backed Tailwind utilities.

The intended end state is:

- `src/features/studio/studio.css` and `src/features/teleprompter/teleprompter.css` do not exist.
- `src/app/globals.css` contains only Tailwind/plugin imports, theme mappings, design tokens, resets/document-wide behavior, and the two documented Teleprompter preview keyframes.
- Existing approved components in `src/components/ui/` are reused before introducing a feature component.
- Repeated generic styling belongs in a UI primitive or typed variant; repeated domain structure belongs in a semantic feature component.
- Runtime-calculated preview CSS variables and user-selected colors remain inline in `PreviewPane`; static inline presentation is forbidden except for Next.js `ImageResponse` artwork.

Read `AGENTS.md`, `CLAUDE.md`, and `design.md` before editing. Also follow the installed Next.js guides at:

- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Working-tree warning

The worktree was already materially dirty before this migration. Do not reset, restore from `HEAD`, delete untracked assets, or rewrite unrelated files. In particular, the existing changes in `src/features/studio/product-catalog.ts`, `src/features/studio/studio-solutions.ts`, `src/app/icon.svg`, `src/app/social-card.tsx`, and `public/` are user-owned and must be preserved.

No commits have been created for this migration.

## Completed work

### Contributor policy and global foundation

- Added the component-first/primitive-first rules to `AGENTS.md`, `CLAUDE.md`, and `design.md`.
- Preserved the explicit exceptions for runtime/user-selected values and Next.js `ImageResponse` artwork.
- Moved the exact `frameline-preview-scroll` and `frameline-reading-progress` keyframes into a documented runtime section of `src/app/globals.css`.
- Removed global `.sr-only`, `.wordmark`, `.frameline-*`, and the redundant global Bubble primitive override. Their presentation is now owned by Tailwind/components.
- The import of `teleprompter.css` intentionally remains in `globals.css` until the Teleprompter phase is finished.

### UI primitives

The following primitives are migrated to `design.md` and carry the required first-line marker:

- Card
- Accordion
- Item
- Separator
- Field
- Label
- Input
- Alert

Notable API work:

- `Card` supports semantic rendering through the verified Base UI `useRender`/`mergeProps` pattern.
- `Alert` has a `warning` variant.
- `ItemGroup` supports semantic rendering, allowing `ItemGroup render={<ul />}` with `Item render={<li />}`.
- `Field invalid errorId?` owns invalid state and error identity.
- `FieldControl render={<Input />}` enforces `aria-invalid`, merges/deduplicates `aria-describedby`, and cannot be overridden by render-element ARIA props.
- `FieldError` uses the Field-owned ID and includes an aria-hidden danger icon.

Coverage lives in `src/components/ui/component-foundation.test.tsx`. The last focused foundation result was 8 tests passing after ItemGroup list coverage was added.

### Studio/public routes

- `src/features/studio/studio.css` is deleted.
- All five imports of that stylesheet are removed.
- `/`, `/studio`, `/products`, `/solutions`, and `/teleprompter` use component-owned Tailwind utilities.
- Added server-compatible `StudioShell`, `StudioContainer`, `StudioPageHero`, and `StudioSectionHeading`.
- Existing Button variants style semantic Next.js links directly; navigation links are not rendered through the Base UI Button component because that incorrectly adds button semantics.
- Studio surfaces reuse Button variants, Badge, Card, Item, and Accordion.
- ProductRail remains native, server-rendered horizontal scrolling; no Carousel or ScrollArea was introduced.
- Coming-soon products remain informational and noninteractive.
- Item lists now use valid `ul`/`li` semantics.
- Dark Teleprompter-marketing accordions have explicit contrast-safe inverse hover/active/open states.
- PrompterDemo composes Card/CardHeader/CardContent/CardFooter.
- Decorative artwork is represented by explicit aria-hidden elements rather than stylesheet pseudo-elements where required.
- Focused studio/foundation checks most recently passed 15/15 tests before the final small cleanup request.

Studio coverage lives in `src/features/studio/components/studio-components.test.tsx` and checks semantic links/destinations, shell landmarks, truthful catalog behavior, valid lists, inert coming-soon menu entries, mobile navigation, and accordion toggling.

## Remaining work

### 1. Finish three small Studio cleanups

An interrupted cleanup turn left these items outstanding:

1. `src/features/studio/components/studio-navigation.tsx` still declares a duplicate local `studioSolutions` array. Import the authoritative `studioSolutions` from `src/features/studio/studio-solutions.ts` and map its `iconKind` through a static icon map. Do not change the authoritative catalog copy.
2. `ProductMenuPreview` still contains unreachable coming-soon preview branches. Coming-soon navigation entries are now inert, so simplify preview state/rendering to the reachable available-product behavior while leaving the informational entries visible.
3. The same eyebrow utility string is copied in `studio-layout.tsx`, `studio-hero.tsx`, and `solution-pillars.tsx`. Introduce/use a semantic `StudioEyebrow` component (with the required tone/spacing variants), then remove the unused `eyebrowClass` and `titleClass` exports from `studio-layout.tsx`.

Run only the focused studio/foundation tests after these edits. Full verification is intentionally deferred until the end.

### 2. Migrate the Teleprompter workspace

`src/features/teleprompter/teleprompter.css` still contains the static workspace presentation and is imported by `src/app/globals.css`.

Migrate its static rules into the owning components:

- `teleprompter-workspace.tsx`: root shell, responsive stage, mobile pane visibility, and destructive Alert for application errors.
- `app-header.tsx`: sticky header, metadata, privacy Badge, theme/settings Buttons, and wordmark layout.
- `script-pane.tsx`: pane/header composition, Textarea sizing/states, and script status.
- `preview-pane.tsx`: static preview geometry, guide/progress presentation, reduced-motion classes, and stable `data-slot` hooks.
- `teleprompter-dock.tsx`: safe-area dock layout, `aria-pressed` mobile selection, and explicit finite state mapping for idle/generating/ready/stale/disabled. Remove constructed `state-${sessionState}` class fragments.
- `prepared-video.tsx`: ready visibility, video surface, heading, and controls.
- `capability-notice.tsx`: use `Alert variant="warning"` without reaching into primitive slots from global CSS.
- `range-control.tsx`, `setting-with-info.tsx`, and `tune-dialog.tsx`: compose approved Field/Label/Input, NativeSelect, Slider, Switch, Dialog, Drawer, HoverCard, and Button primitives. Keep RangeControl as the scalar-to-Slider adapter and SettingWithInfo as the desktop-hover/phone-tap domain composition.

Do not replace the mobile panes with Tabs, reading progress with Progress, ProductRail with Carousel/ScrollArea, or PreviewPane geometry with AspectRatio.

#### Preview invariants

Preserve these runtime properties and user-driven inline values exactly in `PreviewPane`:

- `--preview-duration`
- `--preview-delay`
- `--preview-font-size`
- `--preview-line-height`
- `--preview-padding`
- `--preview-start-y`
- `--preview-end-y`
- `--preview-scale`
- `--preview-aspect`
- `--preview-play-state`
- selected foreground/background colors, alignment, font, and aspect ratio

The two keyframes already live in `globals.css`; do not recreate them in a feature file or replace the animation lifecycle.

Replace PreviewPane test selectors such as `.preview`, `.preview-line`, `.preview-viewport`, `.preview-script`, and `.reading-progress-track` with stable `data-slot` selectors while preserving all current layout, remount, font, and runtime-variable assertions.

After every Teleprompter component is migrated:

1. Remove `@import '../features/teleprompter/teleprompter.css';` from `src/app/globals.css`.
2. Delete `src/features/teleprompter/teleprompter.css`.
3. Verify no component reaches into UI primitive `[data-slot]` internals from global CSS.

### 3. Add/adjust focused Teleprompter tests

Cover:

- Dock selected, generating, ready, stale, and disabled states.
- Mobile script/preview switching without changing preview lifecycle.
- Desktop Dialog versus phone Drawer settings composition.
- Settings labels and updates.
- Prepared-output hidden/ready behavior.
- Runtime preview colors, alignment, pause/generating state, and synchronized script/progress remounting.
- Capability warning and workspace destructive error semantics.

Prefer roles, ARIA, and `data-slot` assertions. Do not test long Tailwind class strings except for a finite variant contract that cannot be proven behaviorally.

## Final verification only

The user requested that full checks run once at the end, not after every phase.

The dev server is already expected at `http://localhost:4444`. Use the in-app browser for route and responsive inspection rather than starting another server. Check the five public routes and `/teleprompter/app` at desktop and 320px, plus phone landscape, 200% zoom, keyboard focus, mobile navigation/settings, reduced motion, and document overflow. Inspect console errors.

Then run once:

```sh
npm run typecheck
npm test
npm run lint
npm run build
git diff --check
```

The known baseline lint result is one warning in `.concept/concepts/live-canvas/encoder.worker.js`; there were no lint errors.

Final static acceptance checks:

```sh
test ! -e src/features/studio/studio.css
test ! -e src/features/teleprompter/teleprompter.css
! rg -n 'features/(studio/studio|teleprompter/teleprompter)\.css' src
! rg -n 'state-\$\{sessionState\}' src/features/teleprompter
! rg -n 'className=.*\b(studio-|teleprompter-root|app-shell|app-stage|app-pane|pane-kicker|pane-toolbar|tool-button|dock-item|settings-dialog)\b' src
rg -n '@keyframes frameline-(preview-scroll|reading-progress)' src/app/globals.css
```

Expected result: only `src/app/globals.css` remains as authored CSS, and each preview keyframe is defined exactly once.

Do not create Playwright files or run repository Playwright coverage. Real Android Chrome WebCodecs and Picture-in-Picture verification remains a human release handoff.
