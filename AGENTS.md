<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frameline contributor rules

## Product boundary

- Frameline is a local-first Android Chrome teleprompter. Script processing and generated video stay on the device.
- Trial 1 has no accounts, API routes, Server Actions for product data, database, upload, analytics, or backend fallback.
- Keep public routes server-rendered by default. Add client boundaries only around browser-dependent interaction.

## Component architecture

- Read `design.md` before changing any user-facing UI or introducing a new UI primitive.
- Treat `src/components/ui/` as the project-owned shadcn primitive catalog. Reuse and compose those primitives instead of implementing parallel buttons, dialogs, popovers, tooltips, or controls.
- UI primitives are migrated on demand, not speculatively. Before using an unmarked file from `src/components/ui/`, migrate every visual and interactive state to `design.md` and add `// DESIGN SYSTEM: Migrated to the current design.md.` as the first line. A migrated primitive that depends on another primitive requires that dependency to be migrated and marked too.
- Shared brand, interaction, surface, and status colors belong in `src/app/globals.css`. One-off illustration colors may stay as literals in tightly scoped CSS when a token would obscure rather than clarify the palette. Never repeat a recurring color literal across files.
- Put product composites under `src/features/teleprompter/components/`, not in `components/ui`.
- Keep `teleprompter-app.tsx` as a readable composition root. Extract independently testable panes, dialogs, controls, and action surfaces before they become monolithic.
- Prefer explicit imports and ownership boundaries. Avoid barrel files that obscure client/server boundaries or introduce circular dependencies.
- Keep shared design tokens in `src/app/globals.css`; keep feature-specific styling with the teleprompter feature.

## State and effects

- Use a typed reducer/context for coordinated serializable script, settings, and application UI state. Use a closed discriminated action union and test the pure reducer.
- Keep transient interaction state local when only one component owns it. Do not move state into context merely to avoid passing one or two props.
- Derive word count, duration, preview timing, generated-output signatures, stale status, and action labels; do not synchronize duplicate mutable copies.
- Keep browser resources in focused hooks. Workers, `VideoFrame`s, canvases, video elements, Blob URLs, and cancellation handles must never enter reducer state.
- Persistence belongs behind hooks or repository-owned interfaces. Do not read or write browser storage throughout presentation components.

## Responsive interaction

- Follow the interaction, motion, geometry, copy, and accessibility rules in `design.md`.
- Design phone-first and verify narrow portrait, landscape, desktop, browser chrome changes, safe-area insets, and 200% text zoom.
- Primary actions must stay reachable without scrolling and touch targets should be at least 44 CSS pixels wherever practical.
- Never make hover the only way to discover essential content. Desktop Hover Cards must have a focus path, and phone help must open by tap/click without overlaying other dialogs.
- Avoid stacks of decorative cards and borders. Preserve the compact camera-app hierarchy shared by phone and desktop.

## Rendering and encoding invariants

- Preserve the proven frame path: paint on an `HTMLCanvasElement`, create `VideoFrame` on the client, transfer one frame at a time, and encode/mux in the dedicated worker.
- Keep deterministic timestamps, bounded encoder queue depth, regular keyframes, transferable output, cancellation, and immediate frame cleanup.
- Pause the animated preview during encoding so it does not compete for CPU.
- Settings baked into frames must mark prepared output stale. Playback-only speed and looping must not force recompilation.
- Preview and generated video must remain visually consistent for paragraph breaks, center guide, reading progress, colors, alignment, typography, and timing.

## Verification

- Run `npm run typecheck`, `npm test`, `npm run lint`, and `npx playwright test` for relevant changes.
- Add unit coverage for pure state/rendering changes and desktop/mobile browser coverage for interaction changes.
- Treat the production build and real Android Chrome checks as release gates; desktop emulation does not prove WebCodecs or PiP support on a phone.
- Preserve unrelated user changes in a dirty worktree.
