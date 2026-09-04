# Trial 3 — Frameline Creator Studio Foundation

**Status:** implementation complete — Phases 0–6 complete; real-device product verification handed off
**Selected design:** Direction 03 — Human Canvas
**Launch products:** one — Daily Prompter
**Product boundary:** local-first, no account, no upload, no backend product data

## Live execution ledger

This section is the recovery source of truth for Trial 3. Update it in the same change that completes, defers, blocks, or materially changes a work item. Do not erase completed evidence when advancing phases.

### Status legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed
- `[-]` Deferred by explicit user direction
- `[!]` Blocked; the reason and resumption condition must be recorded

### Phase status

| Phase | Status | Completed evidence | Remaining / recovery point |
| --- | --- | --- | --- |
| Phase 0 — Documentation and evidence discovery | `[x]` Completed | This plan records the user overrides, route model, reset command, initial repository inventory, recovery reference, and baseline command results. Unit tests: **72/72 passed**. Serial typecheck: **passed**. Lint: **passed with one unrelated warning under `.concept`**. Production build: **passed**. | Complete. The shadcn add step may still require network/package resolution; that execution risk carries into Phase 2. |
| Phase 1 — Codify Human Canvas | `[x]` Completed | Rewrote `design.md` around the exact Human Canvas palette and semantic token contract; defined typography, spacing, radii, elevation, motion, complete primitive states, marketing/product intensity, responsive/accessibility rules, CSS/OG exceptions, runtime preservation, and the full-catalog migration marker. Reconciled Trial 3/full-catalog/E2E guidance in `AGENTS.md` and `CLAUDE.md`. | Complete. `design.md` is now the implementation source of truth. |
| Phase 2 — Reset shadcn and global CSS | `[x]` Completed | Phase 2A reset regenerated all 61 primitives. Phase 2B rebuilt `globals.css` with the exact Human Canvas roles and shadcn mappings, retained required imports/reset/accessibility rules, and fully reviewed and approved all ten live primitives and their only direct project-owned dependency (`button`). Serial typecheck and `git diff --check` pass. | Complete. The rest of the generated catalog is token-compatible but intentionally unmarked/unapproved until a live consumer requires it. Temporary `--fl-*` aliases now remain only for the outgoing marketing stylesheet and can be removed after Phase 5 migrates that consumer. |
| Phase 3 — Establish studio architecture and routes | `[x]` Completed | Added the typed static catalog and reusable server navigation, footer, catalog, and safe JSON-LD components under `src/features/studio/`; added static `/products`, `/daily-prompter`, and `/daily-prompter/app` routes; converted `/teleprompter` to a query-preserving permanent redirect; updated route metadata, root studio metadata, social artwork/palette, icon, viewport theme color, robots, and sitemap. Typecheck and production build pass. | Complete. Public routes are prerendered and their shipped route chunks contain no Daily Prompter runtime; only `/daily-prompter/app` imports it. URL fragments cannot be preserved by a server redirect because browsers do not send fragments in HTTP requests. |
| Phase 4 — Re-theme Daily Prompter | `[x]` Completed | Re-themed the existing workspace in place with Human Canvas semantic roles, soft depth, one-pixel boundaries, calm product typography, and Write → Practice → Record language. Added the Daily Prompter identity beside the Frameline wordmark while preserving its accessible name. Removed all `--fl-*` consumption and literal colors from the feature stylesheet, plus the obsolete partial dark skin. The reducer, hooks, persistence, rendering, encoding, worker, controller, preview inline settings, event handlers, focus order, control accessible names, and responsive pane/dock rules were untouched. Serial typecheck passed; unit tests passed **72/72**; `git diff --check` passed; the forbidden-runtime diff audit returned empty. Lint was also run and remains blocked only by the regenerated `carousel.tsx` and `use-mobile.ts` `react-hooks/set-state-in-effect` findings, plus the pre-existing `.concept` unused-variable warning; none is a Phase 4 file. | Complete. Responsive screenshots and hands-on Android Chrome/product verification remain Phase 6 release evidence and user handoff, as explicitly required. |
| Phase 5 — Build interactive studio and product marketing | `[x]` Completed | Replaced the old neo-brutalist root with the Human Canvas studio experience; rebuilt `/products` as an intentional one-product collection and `/daily-prompter` with a representative Write → Practice → Record walkthrough, local-privacy proof, support requirements, and honest Android/PiP limitations. Shared server composites now live under `src/features/studio/components/`, with all responsive composition and interaction in `src/features/studio/studio.css`. Native details disclosures, hover/focus/active states, touch fallbacks, and reduced-motion rules provide progressive interaction while preserving complete server HTML. Deleted `src/app/(marketing)/marketing.css` and removed the final `--fl-*` compatibility aliases. Updated `README.md` and `product.md`. Typecheck, production build, `git diff --check`, semantic-color audit, and built public-route chunk audit passed; `/`, `/products`, and `/daily-prompter` remain static and each page chunk is 290 bytes with no tool-runtime signatures. Lint was run and remains blocked only by the already-recorded regenerated `carousel.tsx` and `use-mobile.ts` `react-hooks/set-state-in-effect` findings plus the unrelated `.concept` warning; Phase 5 files introduced no lint findings. | Complete. Responsive screenshot capture and hands-on Android Chrome/product verification remain Phase 6 evidence and user handoff. |
| Phase 6 — Consolidate and release | `[x]` Completed | Removed the temporary concept route and design-preview feature, the Playwright specs/config/script/direct dependency, the stale Frameline-as-teleprompter heading, and the two shadcn-generator lint regressions without suppressions. Typecheck, **72/72** unit tests, lint with zero errors, production build, and `git diff --check` pass. The responsive screenshot matrix has no horizontal overflow or visible clipping; reduced-motion rules and a 200%-effective viewport check are recorded below. | Complete. The user must still perform hands-on Daily Prompter generation/playback and real Android Chrome WebCodecs/Picture-in-Picture verification; those product checks were explicitly excluded from this automated pass. |
| Browser E2E suite | `[-]` Deferred | User explicitly deprioritized Playwright coverage for this implementation pass. Removed `tests/e2e/app.spec.ts`, `tests/e2e/theme.spec.ts`, `playwright.config.ts`, the `test:e2e` script, and the direct `@playwright/test` devDependency plus its direct lockfile packages. | Do not replace or run browser E2E tests now; restore coverage in a later trial. The remaining optional `@playwright/test` references in the lockfile are peer metadata from Vitest, not an installed direct Playwright dependency. |

### Phase 0 evidence and inventory checkpoint

- `[x]` Detailed migration plan retained and converted into this live, recoverable ledger.
- `[x]` Public route intent reconciled: `/products` is the catalog, `/daily-prompter` is the product-marketing page, and `/daily-prompter/app` is the tool. There is no literal `/product` route unless later evidence establishes a compatibility requirement.
- `[x]` The existing Daily Prompter behavior, reducer/persistence/rendering pipeline, accessible names, and current workspace UX/layout are preservation boundaries.
- `[x]` Unit baseline: `npm test` passed **72/72** tests.
- `[x]` Lint baseline: `npm run lint` passed with one unrelated warning in `.concept`.
- `[x]` Build baseline: `npm run build` passed.
- `[x]` Initial concurrent `npm run typecheck` was not a trustworthy baseline because the production build was rewriting generated `.next` files; the required serial rerun subsequently **passed**.
- `[x]` Pre-reset recovery reference: current `HEAD` is **`02e68c6`**. The tracked `src/components/ui/` catalog can be restored from that commit without resetting or overwriting unrelated work.
- `[x]` Dirty inventory recorded at the Phase 0 boundary: modified `.triage/triage.md` and `next-env.d.ts`; untracked `.triage/human-canvas-selected.jpg`, `.triage/triage_3.md`, `design-plan-revamp.md`, `src/app/(concepts)/`, and `src/features/design-preview/`. These are existing user/worktree changes: preserve them and do **not** commit, reset, clean, or overwrite them as part of the UI reset.
- `[x]` The anticipated network/tooling gap was resolved during Phase 2A: the sandboxed generator attempt failed with `EAI_AGAIN`, then the exact same command succeeded with approved network escalation. No generated contents were invented locally.

### Phase 2A evidence — generated shadcn baseline

- `[x]` Immediately before deletion, `src/components/ui/` contained exactly **61 files**: `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `attachment.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `bubble.tsx`, `button-group.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `combobox.tsx`, `command.tsx`, `context-menu.tsx`, `dialog.tsx`, `direction.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `empty.tsx`, `field.tsx`, `hover-card.tsx`, `input-group.tsx`, `input-otp.tsx`, `input.tsx`, `item.tsx`, `kbd.tsx`, `label.tsx`, `marker.tsx`, `menubar.tsx`, `message-scroller.tsx`, `message.tsx`, `native-select.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `questionnaire.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `spinner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toggle-group.tsx`, `toggle.tsx`, and `tooltip.tsx`.
- `[x]` Exact pre-reset `git status --short`: modified `.triage/triage.md`, `AGENTS.md`, `CLAUDE.md`, `design.md`, and `next-env.d.ts`; untracked `.triage/human-canvas-selected.jpg`, `.triage/triage_3.md`, `design-plan-revamp.md`, `src/app/(concepts)/`, and `src/features/design-preview/`. The `next-env.d.ts` diff consisted only of the production-build rewrite from `.next/dev/types/*` imports to `.next/types/*`; it was restored to the pre-build development imports with `apply_patch`.
- `[x]` Deleted every file under exactly `src/components/ui/` with `apply_patch`, without touching any other directory, then ran exactly `npm exec shadcn -- add --all --overwrite --yes` from the repository root.
- `[x]` The first sandboxed generator attempt failed while resolving `https://ui.shadcn.com/r/index.json` with `getaddrinfo EAI_AGAIN ui.shadcn.com`. The approved network retry succeeded and reported **61 created files** plus one generated update to `src/hooks/use-mobile.ts`.
- `[x]` Preserved generator-managed dependency changes: `cn@^0.2.5` was added to `package.json` and `package-lock.json`. The generator did not modify `src/app/globals.css` in this baseline step.
- `[x]` Generated baseline verification: catalog count **61**; `git diff --check` **passed**; `npm run typecheck` **passed**.
- `[x]` Phase 2B rebuilt `src/app/globals.css` around the exact light-only Human Canvas semantic palette, type, spacing, radius, depth, and motion tokens; mapped the shadcn roles directly to that palette; retained Tailwind, `tw-animate-css`, shadcn, and teleprompter imports plus reset, focus, screen-reader, tap, and reduced-motion utilities.
- `[x]` Kept a documented temporary `--fl-*` compatibility bridge because the current teleprompter and outgoing marketing feature stylesheets still consume those names. Every alias resolves to a Human Canvas semantic role; removal is deferred to the Phase 3–4 feature CSS migration.
- `[x]` Reviewed and migrated every live primitive: `alert.tsx`, `badge.tsx`, `button.tsx`, `dialog.tsx`, `drawer.tsx`, `hover-card.tsx`, `native-select.tsx`, `slider.tsx`, `switch.tsx`, and `textarea.tsx`. `dialog.tsx` imports `button.tsx`; there are no other direct project-owned primitive dependencies in the live graph. Each approved file now begins with the exact design-system migration marker.
- `[x]` Live primitive states use semantic Human Canvas roles for default, hover/active where applicable, focus-visible, open/checked, disabled, invalid, and `aria-busy` styling where the underlying primitive exposes that state. Base UI continues to own accessible dialog/drawer focus containment and restoration; public component APIs were preserved.
- `[x]` Phase 2B verification: `npm run typecheck` **passed**; `git diff --check` **passed**. The non-live generated primitives remain unmarked, which records that they are token-compatible through the shared shadcn mappings but not yet approved for application imports.
- `[x]` Phase 3 route architecture: `src/features/studio/product-catalog.ts` is the typed static source of truth; reusable server components live in `src/features/studio/components/`; public pages are static server compositions and only `src/app/daily-prompter/app/page.tsx` imports `TeleprompterApp`.
- `[x]` Phase 3 SEO/discovery: root and route metadata now distinguish Frameline, the catalog, Daily Prompter marketing, and the tool; canonicals, Open Graph, X cards, safe JSON-LD, `robots.txt`, `sitemap.xml`, studio social artwork, icon, and viewport theme color use the new brand model.
- `[x]` Phase 3 redirect compatibility: `/teleprompter` uses documented `permanentRedirect` behavior and re-serializes query parameters onto the fixed `/daily-prompter/app` path, avoiding an open redirect. Fragments cannot be preserved server-side because they are not part of the HTTP request.
- `[x]` Phase 3 verification: `npm run typecheck` **passed**; `npm run build` **passed** with `/products`, `/daily-prompter`, and `/daily-prompter/app` prerendered static and `/teleprompter` dynamic; generated HTML contains the expected titles, canonicals, Open Graph URLs, X card metadata, and app `noindex, nofollow`; `git diff --check` **passed**. Starting `next start` inside the restricted sandbox was not possible (`listen EPERM`), so the build artifacts, rather than a live HTTP request, are the recorded redirect/metadata evidence.
- `[x]` Phase 6 cleanup removed `src/app/(concepts)/[concept]/page.tsx`, `src/features/design-preview/design-preview.tsx`, `src/features/design-preview/design-preview.module.css`, `tests/e2e/app.spec.ts`, `tests/e2e/theme.spec.ts`, and `playwright.config.ts`. `package.json`/`package-lock.json` no longer expose the E2E script or direct Playwright dependency. `carousel.tsx` and `use-mobile.ts` now subscribe to browser state with `useSyncExternalStore`, preserving behavior while satisfying the current hooks lint rule. `teleprompter-workspace.tsx` now names the product workspace rather than describing Frameline itself as a teleprompter.
- `[x]` Phase 6 retained checks: `npm run typecheck` **passed**; `npm test` **passed (12 files, 72/72 tests)**; `npm run lint` **passed with zero errors** and only the preserved `.concept/concepts/live-canvas/encoder.worker.js` unused-variable warning; `npm run build` **passed** with `/`, `/products`, `/daily-prompter`, and `/daily-prompter/app` static and `/teleprompter` dynamic; `git diff --check` **passed**. The build-generated `next-env.d.ts` production imports were restored to the pre-build development imports.
- `[x]` Responsive visual evidence is stored under `.triage/screenshots/trial-3/`: `home-desktop-1440x900.png`, `home-phone-390x844.png`, `products-desktop-1440x900.png`, `products-phone-390x844.png`, `daily-prompter-desktop-1440x900.png`, `daily-prompter-phone-390x844.png`, `daily-prompter-app-desktop-1440x900.png`, and `daily-prompter-app-phone-390x844.png`; `daily-prompter-app-phone-390x844-viewport.png` additionally records the fixed four-action phone dock that full-page capture omits. Browser geometry reported `scrollWidth === clientWidth` at every desktop and phone route, and visual inspection found no overflow or clipped content.
- `[x]` The 200% layout check is recorded as `home-200-percent-effective-viewport-720x450.png`, using half of the 1440×900 CSS viewport to exercise the same responsive layout pressure because the in-app browser does not expose a page-zoom override; it reported no horizontal overflow. Reduced-motion coverage was verified in the three active presentation layers: `src/app/globals.css`, `src/features/studio/studio.css`, and `src/features/teleprompter/teleprompter.css` each define `@media (prefers-reduced-motion: reduce)` fallbacks. Final OS-level 200% text zoom and reduced-motion preference checks can be repeated during the user handoff.
- `[x]` Recovery point: Trial 3 implementation is complete. Resume with user-led hands-on Daily Prompter generation/playback, settings/draft persistence, and a real Android Chrome pass for WebCodecs and Picture-in-Picture. Browser E2E restoration remains explicitly deferred to a later trial.

### Recovery protocol

1. Treat the latest status row and checkbox in this ledger as the resume point.
2. Before deleting `src/components/ui/`, record the exact pre-reset commit/checkpoint and dirty-worktree inventory in this section.
3. Keep deletion/regeneration isolated from design customization where practical so the generated baseline can be inspected or reproduced.
4. Use exactly `npm exec shadcn -- add --all --overwrite --yes` from the repository root to reinstall **all** shadcn components. Do not substitute the earlier inventory-only regeneration plan.
5. After each phase, record commands run, results, intentional deviations, and the next safe step. Never mark a phase complete while any non-deferred gate remains unresolved.

## Explicit user overrides for this execution

These directions supersede conflicting provisional language later in this document:

- Fully delete `src/components/ui/`, then re-add the complete shadcn component catalog with `npm exec shadcn -- add --all --overwrite --yes`. Full-catalog installation is intentional for this trial.
- Remove the Playwright E2E test files and configuration and defer browser automation. Keep unit tests; do not weaken or remove them.
- Preserve the current Daily Prompter UX and workspace layout. Re-theme, rebrand, and reroute it, but defer a workspace UX/layout redesign.
- Interpret “SSO” in the request as **SEO**. Update titles, descriptions, canonicals, Open Graph/X metadata, structured discovery surfaces, robots, and sitemap. Authentication/SSO remains explicitly prohibited.
- Make the landing page, `/products`, and `/daily-prompter` product page meaningfully interactive for marketing, with accessible keyboard/touch behavior and reduced-motion handling. This does not authorize importing the tool runtime into public pages.
- Prefer semantic CSS variables for every recurring brand color. Direct CSS is allowed for complex responsive composition, interaction, and layout when it consumes those variables.
- Update the studio Open Graph artwork, app/site icons, manifest/theme color, and other visible brand surfaces. Product-specific OG artwork is optional unless the implementation needs it.
- Next.js `ImageResponse` artwork may use inline styles because its renderer requires them. Put recurring social-art colors in a small shared TypeScript palette synchronized with the canonical CSS variables; this is the sole presentation inline-style exception.
- Update `design.md`; also update `AGENTS.md` and `CLAUDE.md` only if their design guidance still encodes neo-brutalism. Preserve all runtime, safety, local-first, and verification constraints.
- Visual verification for this pass is responsive screenshot comparison and retained non-E2E checks. The user will perform final hands-on product verification; do not claim that handoff as an automated behavioral guarantee.

## Source material and authority

This plan combines the program direction in [`triage.md`](triage.md) with the approved visual direction in [`../design-plan-revamp.md`](../design-plan-revamp.md).

The selected visual reference is captured below so the implementation plan remains understandable after the temporary `/1`–`/4` comparison routes are removed.

![Selected Human Canvas design direction](human-canvas-selected.jpg)

The screenshot is a direction reference, not a pixel-perfect implementation contract. It establishes the warmth, visual rhythm, progressive disclosure, and relationship between expressive marketing and calm product UI. The existing working application remains authoritative for behavior, accessibility semantics, browser resources, encoding, persistence, and Picture-in-Picture.

When sources disagree, use this order:

1. Runtime safety, accessibility, privacy, and rendering invariants in `AGENTS.md`.
2. The explicit user overrides recorded in this file's live execution ledger.
3. Trial boundaries and portfolio direction in `.triage/triage.md`.
4. The selected design decision and guardrails in `design-plan-revamp.md`.
5. This file's remaining implementation sequence and file-level plan.
6. The screenshot as a visual reference.

Before implementation begins, rewrite `design.md` for Human Canvas. Once approved and committed, that rewritten file becomes the visual source of truth for implementation details.

## Outcome

Trial 3 changes Frameline from a site that appears to be one teleprompter product into a bookmark-worthy private creator studio that currently contains one complete product and is structurally ready for more.

The finished experience has three clear layers:

1. **Studio home — Frameline:** explains the durable brand promise and presents the product collection.
2. **Product page — Daily Prompter:** explains the product's job, workflow, privacy model, support, limitations, and launch action.
3. **Tool workspace — Daily Prompter app:** preserves the proven teleprompter behavior behind a newly designed Human Canvas interface.

The foundation must feel intentional with one product. Do not ship empty slots, disabled “coming soon” cards, invented usage metrics, or a fake marketplace merely to imply scale.

## Final naming and URL model

### User-facing names

- **Frameline** is the studio and umbrella brand.
- **Daily Prompter** is the product name of the existing teleprompter.
- “Teleprompter” remains the plain-language product category and should appear in search copy, metadata, and explanatory text.
- **Code Animator** remains a future candidate and is not presented as a live or promised product in this trial.

### Canonical routes

| Route | Purpose | Rendering boundary |
| --- | --- | --- |
| `/` | Frameline creator-studio home and one-product catalog | Server rendered |
| `/products` | Scalable product index; initially contains Daily Prompter only | Server rendered |
| `/daily-prompter` | Daily Prompter public product page | Server rendered |
| `/daily-prompter/app` | Direct local-first teleprompter workspace | Focused client boundary inside a server page |
| `/teleprompter` | Compatibility redirect to `/daily-prompter/app` | Permanent redirect |

This convention scales cleanly: a future product receives `/{product-slug}` and `/{product-slug}/app` only after it exists. The public product page and tool workspace remain distinct, while every tool can still be deep-linked without passing through a dashboard.

### Redirect and persistence rules

- Preserve `/teleprompter` as a permanent redirect to `/daily-prompter/app` so existing bookmarks keep launching the tool.
- Do not rename existing local-storage keys merely because the user-facing product name changes. A storage-key migration is required only if a functional schema changes.
- Preserve query strings and documented fragments when redirecting where Next.js supports doing so safely.
- Add the new public routes to the sitemap and canonical metadata.
- Use `/daily-prompter/app` as the tool canonical and `/daily-prompter` as the product-marketing canonical.
- Remove `/1`–`/4` before release after the selected screenshot and design specification are committed.

## Selected design system: Human Canvas

### Brand expression

- Warm paper-like canvas rather than acid fields or sterile white.
- Coral as the primary brand/action signal, with sage and golden supporting accents.
- Editorial display typography for authored marketing moments.
- Neutral sans-serif typography for controls, status, body copy, and dense product UI.
- Generous, soft geometry and carefully overlapping tactile compositions on marketing surfaces.
- Buoyant, purposeful motion; no mechanical marquee dependence or constant product motion.
- Direct, reassuring language about local saving and privacy.

### Product expression

- Express the existing experience in **Write → Practice → Record** language without changing its current UX or layout in this trial.
- On phones, preserve the existing layout and reachable primary actions while applying the new responsive theme.
- On wider screens, preserve the established workspace geometry and behavior; defer structural workspace redesign.
- Use cards only for meaningful steps, objects, tips, or bounded actions. Do not wrap every region in a decorative container.
- Keep user-selected teleprompter foreground and background colors authoritative inside the preview and generated frames.
- Keep application status explicit: saved, stale, preparing, ready, unsupported, failed, and cancelled.

### Foundation tokens

The rewritten design system must define semantic roles before components are migrated:

- canvas, surface, elevated surface, and inset surface;
- primary text, secondary text, subtle text, and inverted text;
- brand coral, sage accent, golden accent, focus, border, and divider;
- positive, warning, danger, informative, and disabled;
- display, heading, body, label, numeric, and code typography;
- spacing, touch-target, radius, elevation, focus-ring, and motion scales;
- marketing-expression variants that do not leak into default product controls.

Recurring colors, shadows, radii, transition curves, and spacing values must come from tokens. A literal is allowed only for a genuinely one-off illustration detail documented at its use site.

## Hard engineering requirements

### Behavior must not change

The revamp is a presentation and information-architecture migration. It must not rewrite or subtly alter:

- reducer actions, state transitions, or derived selectors;
- draft and settings persistence timing, schemas, or failure behavior;
- preview timing, line layout, reading progress, paragraph handling, colors, or typography inputs;
- canvas painting, `VideoFrame` creation, deterministic timestamps, queue depth, keyframes, transfer behavior, cancellation, or immediate frame cleanup;
- worker ownership or WebM muxing;
- prepared-output signatures and stale rules;
- the rule that playback-only speed and looping do not force recompilation;
- preview pausing during encoding;
- Picture-in-Picture launch behavior and Android Chrome capability messaging;
- keyboard behavior, accessible names, focus order, dialog/drawer behavior, or live-region semantics.

Existing behavioral tests are contracts. Change a test only when a documented route or visible product name intentionally changes; never weaken assertions to make a visual migration pass.

### Clean component architecture

- `src/components/ui/` contains only project-owned shadcn primitives.
- `src/features/studio/` owns studio-home, product-discovery, global studio navigation, and public product-page composites.
- `src/features/daily-prompter/` is the long-term feature name for the existing teleprompter UI and runtime. Perform this directory rename only in an isolated mechanical phase after behavior is protected; otherwise keep the current directory during the visual migration and rename later.
- Product composites must not be placed in `src/components/ui/`.
- Keep root pages as readable server-rendered composition roots.
- Add client boundaries only around browser-dependent tool interaction.
- Prefer explicit imports; do not add barrel files that obscure client/server ownership.
- Keep transient browser resources inside focused hooks, never reducer or catalog state.
- Define the public product catalog as typed static data, not a database, API route, Server Action, or client-side fetch.

### No hard-coded component styling

“No hard CSS” means the implementation must satisfy all of the following:

- no inline `style` props for product or marketing presentation, except inside Next.js `ImageResponse` social artwork as recorded in the explicit overrides;
- no repeated literal colors, shadows, radii, spacing values, or transition curves in page and feature components;
- no copy-pasted bespoke button, input, dialog, tooltip, badge, slider, switch, textarea, select, or alert implementations;
- no page-specific CSS that reaches into shadcn internals or overrides primitive states by selector;
- no giant component containing both the entire marketing page and tool workspace;
- no dynamic class construction that Tailwind cannot statically discover;
- no arbitrary utility values when a semantic token or documented scale value exists;
- no visual state that exists only on hover.

Reusable visual behavior belongs in shadcn primitive variants built with the repository's established class utilities and `class-variance-authority` where appropriate. Shared colors and system values belong in `src/app/globals.css`. Feature components compose primitives and own only their layout and product-specific presentation.

## Shadcn and CSS reset protocol

This is a deliberate reset, not an incremental restyle.

1. Create a recoverable git checkpoint and record the clean behavioral baseline.
2. Inventory every import from `src/components/ui/`, including primitive-to-primitive dependencies and test selectors.
3. Record which components are actually required by the landing, product page, and Daily Prompter flows so their states receive focused review after full-catalog generation.
4. Remove the current `src/components/ui/` catalog in the reset commit.
5. Re-run the installed/current shadcn generator using `components.json` with exactly `npm exec shadcn -- add --all --overwrite --yes`.
6. Regenerate the complete primitive catalog. Prioritize migration and verification for primitives with live consumers, while keeping every regenerated primitive token-compatible.
7. Reimplement primitive variants and states against the new Human Canvas tokens.
8. Add the exact design-system migration marker required by the rewritten `design.md` to every approved primitive.
9. Reconnect feature composites to the regenerated primitives without changing event handlers, reducer actions, or accessible names.
10. Delete obsolete primitive dependencies and CSS only after all live imports have migrated.

At minimum, expect the live application to need button, badge, alert, textarea, dialog, drawer, slider, switch, native select or select, hover/focus help, and any dependencies those primitives require. The inventory determines focused migration coverage, while the explicit full-catalog command determines regeneration scope.

`src/app/globals.css` must also be rebuilt from a clean foundation:

- retain the framework, Tailwind, animation, and shadcn imports required by the current installed versions;
- replace legacy `--fl-*` neo-brutalist tokens and compatibility aliases with Human Canvas semantic tokens;
- define light mode first and a complete dark-mode mapping only if dark mode remains in launch scope;
- retain universal box sizing, typography, form inheritance, tap behavior, focus visibility, screen-reader utilities, safe-area support, and reduced-motion defaults;
- keep feature-specific teleprompter layout outside the global sheet;
- delete old marketing and teleprompter selectors only after their consumers have migrated.

## Business and content foundation

### Frameline studio home

The root page must answer within the first viewport:

- Frameline is a collection of focused creator tools.
- The tools work immediately without an account.
- Creator inputs stay on the device where technically possible.
- Daily Prompter is the one available product and has a clear job.

Use the Human Canvas expressive mode: warm canvas, editorial headline, tactile product composition, and concise creator-first copy. Include:

- the studio promise and primary Daily Prompter action;
- an intentional one-product collection section;
- focused, private, and immediate studio principles;
- Daily Prompter proof and limitation language;
- a product-family frame that can accept future catalog entries without advertising them now;
- footer navigation and source-available project context where appropriate.

Do not import the Daily Prompter runtime, encoder, reducer, or browser persistence code into the studio home.

### Products index

`/products` must be worthwhile with one product. It should read as a concise catalog page, not an empty marketplace. Daily Prompter receives a strong featured treatment with its job, platform, privacy posture, and direct product-page link. The catalog component should render from typed data and support later entries without changing its public API.

### Daily Prompter product page

`/daily-prompter` should include:

- a plain job statement and representative interaction demonstration;
- the Write → Practice → Record workflow;
- privacy and local-processing explanation;
- supported browser and device requirements;
- an honest explanation of opaque Android Picture-in-Picture;
- known limitations and accessibility expectations;
- a primary “Open Daily Prompter” action linking to `/daily-prompter/app`;
- no tool runtime code in the initial public-page bundle.

### Metadata and discovery

- Update the root title and description for Frameline Creator Studio.
- Give `/products`, `/daily-prompter`, and `/daily-prompter/app` distinct titles, descriptions, canonicals, Open Graph fields, and X metadata.
- Replace the single-product social card with studio-level artwork in the selected design direction.
- Add product-specific metadata for Daily Prompter without generating per-route artwork unless materially needed.
- Update `robots.ts`, `sitemap.ts`, and structured public copy for the canonical routes.
- Keep private creator input out of URLs, metadata, logs, and server rendering.

## Planned repository shape

The exact filenames may adjust during discovery, but ownership should converge on this structure:

```text
src/
  app/
    (studio)/
      page.tsx                         # /
      products/page.tsx                # /products
      daily-prompter/page.tsx          # /daily-prompter
    (tools)/
      daily-prompter/app/page.tsx      # /daily-prompter/app
    globals.css
    layout.tsx
    robots.ts
    sitemap.ts
  components/
    ui/                                # regenerated shadcn primitives only
  features/
    studio/
      components/                      # navigation, catalog, product marketing
      product-catalog.ts               # typed static public catalog
      studio.css                       # only if complex composition requires it
    daily-prompter/                    # rename in a separate mechanical phase
      components/
      hooks/
      state/
      rendering/
      encoding/
      daily-prompter.css
      daily-prompter-app.tsx
  workers/
    daily-prompter-encoder.worker.ts
```

Prefer component-owned Tailwind/shadcn variants for reusable styling. A focused feature stylesheet is acceptable for complex responsive workspace geometry, canvas/video layout, safe-area behavior, and keyframes that would become less legible as utility strings. Such CSS must consume global tokens and must not recreate primitive states.

## Migration inventory

### Documentation and governance

- Rewrite `design.md` for Human Canvas and the component migration protocol.
- Update `AGENTS.md` only where old design-specific rules conflict with the selected foundation; preserve runtime and verification rules.
- Update `product.md` and `README.md` to distinguish Frameline, Daily Prompter, product pages, and tool workspaces.
- Keep `.triage/triage.md` synchronized with this one-product launch boundary.

### Routes and public content

- Replace `src/app/(marketing)/page.tsx` with the Frameline studio home composition.
- Replace or rename `src/app/(marketing)/marketing.css` after new studio components exist.
- Add the products index and Daily Prompter public product route.
- Move the current tool entry page to `/daily-prompter/app`.
- Convert `/teleprompter` into the compatibility redirect.
- Remove the temporary `[concept]` comparison route after final visual reference capture.

### Shared foundation

- Reset `src/components/ui/` through the shadcn protocol above.
- Rebuild `src/app/globals.css` around Human Canvas tokens.
- Add typed product catalog data and shared studio navigation.
- Update site metadata, sitemap, robots, and social-card generation.

### Daily Prompter presentation

- Rebrand the app header within the current composition and connect it to the shared studio identity.
- Re-theme Script, Preview/Practice, Settings/Tune, preparation status, capability notice, prepared-video controls, and the reachable mobile action area without changing their established layout or UX.
- Preserve preview-canvas and generated-frame appearance rules.
- Keep the current controller, reducer, selectors, persistence hooks, render planner, painter, worker protocol, and encoder behavior functionally unchanged.
- Perform the `teleprompter` → `daily-prompter` directory and file rename only after visual migration tests pass, as a mechanical change with no logic edits.

## Phased execution plan

### Phase 0 — Documentation and evidence discovery

- Read the installed Next.js App Router, CSS, metadata, redirects, server/client component, lazy-loading, and testing documentation.
- Read current shadcn CLI and component guidance from the installed toolchain.
- Inventory routes, bundles, UI imports, global selectors, feature selectors, accessible names, persistence keys, and worker entry points.
- Record available baseline evidence for desktop, responsive states, reduced motion, dark mode, and Android-specific behavior; screenshot verification is the visual acceptance method for this pass.
- Run typecheck, unit tests, lint, and production build before reset work. Playwright is explicitly deferred and its files/configuration will be removed.

**Gate:** an exact migration inventory and green behavioral baseline exist.

### Phase 1 — Codify Human Canvas

- Rewrite `design.md` with approved tokens, typography, geometry, elevation, motion, copy voice, responsive behavior, and primitive states.
- Define marketing versus product intensity explicitly.
- Define component ownership and “no hard-coded styling” in testable terms.
- Add a temporary internal primitive-state gallery if needed for migration verification.

**Gate:** every required primitive state and semantic token has a written definition.

### Phase 2 — Reset shadcn and global CSS

- Make the recovery checkpoint.
- Remove and reinitialize the UI primitive catalog.
- Regenerate the full shadcn primitive catalog with the exact recorded command.
- Implement Human Canvas variants and complete interaction states.
- Rebuild global tokens and accessibility defaults.
- Verify primitives independently before consuming them in product features.

**Gate:** the primitive gallery passes light/dark, keyboard, pointer, disabled, invalid, loading, touch-target, and reduced-motion checks.

### Phase 3 — Establish studio architecture and routes

- Add typed product catalog data with Daily Prompter as the only entry.
- Add shared studio navigation and footer.
- Add `/products`, `/daily-prompter`, and `/daily-prompter/app`.
- Add the `/teleprompter` compatibility redirect.
- Update canonical metadata and sitemap.
- Verify routes and metadata through build output and responsive screenshots; browser E2E coverage is deferred.

**Gate:** all routes render correctly, the old URL remains useful, and public pages ship no tool runtime.

### Phase 4 — Migrate Daily Prompter presentation

- Re-theme and rebrand the current live workspace in place; use Write → Practice → Record as product language without reorganizing the current UX or layout.
- Migrate one independently testable surface at a time.
- Keep event wiring and state ownership unchanged unless extraction is purely structural and covered by tests.
- Verify preview/generated-output parity and preparation lifecycle after every major surface migration.
- Rename feature files and directories only after behavior and layout are stable.

**Gate:** all existing teleprompter behavior passes under the new presentation at every required viewport.

### Phase 5 — Build studio and product marketing

- Build the root studio home with one intentional product offering.
- Build the Daily Prompter product page and direct launch path.
- Add Human Canvas motion and tactile composition with reduced-motion equivalents.
- Update privacy, platform, limitation, and source-available language.
- Update social artwork and metadata.

**Gate:** a new visitor understands Frameline as a creator-tool studio and Daily Prompter as its current product within the first viewport.

### Phase 6 — Consolidate and release

- Remove temporary concept routes and unused legacy CSS, tokens, and components.
- Remove unused dependencies revealed by the reset.
- Confirm no stale Frameline-as-teleprompter copy remains.
- Check production bundle boundaries for studio and product pages.
- Run typecheck, unit tests, lint, production build, and the responsive screenshot matrix. Browser E2E remains deferred.
- Hand off real Android Chrome validation for WebCodecs and Picture-in-Picture to the user.

**Gate:** all completion criteria below pass and old route/data behavior remains compatible.

## Verification matrix

Run after each relevant phase and in full before release:

- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`

Playwright tests, configuration, and execution are deferred for this trial and will be restored in a later testing pass.

Also verify:

- narrow Android portrait with browser chrome expanded and collapsed;
- narrow landscape with the primary action reachable;
- desktop at representative widths;
- 200% root text zoom without clipped actions or dialogs;
- keyboard-only navigation and logical focus order;
- screen-reader names, descriptions, live regions, and dialog/drawer semantics;
- reduced motion;
- light and dark modes if both remain supported;
- script and settings persistence across the old redirect and new app route;
- preview timing and line layout;
- prepared-output stale behavior;
- generation progress, cancellation, failure, retry, and resource cleanup;
- generated-video visual parity;
- prepared-video playback, loop, restart, and speed behavior;
- canonical, Open Graph, X, robots, sitemap, and redirect behavior;
- public-page bundles do not include the encoder worker or browser-only tool runtime.

## Completion criteria

Trial 3 is complete when:

- Frameline is presented consistently as a private creator studio across UI, metadata, documentation, and source.
- Human Canvas is implemented through reusable tokens and shadcn variants rather than page-specific hard-coded styling.
- The root page and `/products` look deliberate with Daily Prompter as the sole live product.
- Daily Prompter has a dedicated public page and a directly accessible workspace.
- `/teleprompter` preserves existing bookmarks by reaching the canonical app route.
- Existing local drafts and settings survive the route and product-name transition.
- Daily Prompter runtime behavior and generated output are unchanged.
- A future product can be added through the typed catalog and established route pattern without redesigning shared navigation or primitives.
- No account, database, product-data API route, Server Action, upload, analytics, watermark, or artificial usage restriction has been introduced.
- Accessibility, responsiveness, metadata, performance, retained automated checks, and production build pass; real Android product checks are handed off explicitly to the user.

## Explicit exclusions

- Code Animator implementation or a nonfunctional placeholder for it
- Required or optional accounts, authentication, sync, database, or cloud project storage
- Analytics or behavior tracking
- Billing, plans, subscriptions, watermarks, or export degradation
- Social publishing integrations
- Server processing or storage of scripts and generated media
- Rewriting the WebCodecs/worker pipeline
- Changing persistence schemas solely for the rebrand
- Turning Frameline into a logged-in dashboard
- Adding non-shadcn speculative product composites with no live consumer (the explicit full shadcn catalog regeneration is allowed)

## Implementation handoff

Work through the phases in order. Do not begin the destructive component reset until Phase 0 has a clean standalone typecheck result, a complete import inventory, and a recorded recovery checkpoint. Keep this ledger current after every phase. Apply the Human Canvas foundation consistently to the preserved Daily Prompter workspace and the interactive marketing routes; the product is the stability test and the landing page is the expressive application of the system.

---

# Revision 2 — Teleprompter correction and studio expansion

**Added:** 2026-09-05

**Status:** Active; this ledger is the current recovery point for the revision

**Reason:** The earlier name “Daily Prompter” came from an incorrect microphone transcription. The canonical product name is **Teleprompter**. **Frameline** remains the creator-tool studio and must not be presented as the teleprompter itself.

This section is intentionally append-only. The completed Trial 3 entries above remain as implementation history and evidence; they are not being rewritten retroactively. For all work after this heading, this Revision 2 ledger supersedes the earlier **Daily Prompter** naming, the former `/daily-prompter` canonical route policy, the `/teleprompter`-as-legacy-redirect policy, and the earlier exclusions against showing honest coming-soon products.

## Live phase ledger

| Phase | Status | Recovery note |
| --- | --- | --- |
| Phase 0 — Discover and record the correction | `[x]` Complete | Audited routes, metadata, navigation/footer links, catalog data, Teleprompter runtime imports, and browser persistence. Confirmed that the route/name correction can be isolated from the proven local runtime and that same-origin persisted data is path-independent. Added this append-only recovery ledger. |
| Phase 1 — Correct information architecture, naming, and routes | `[x]` Complete | Updated the current design and contributor authority for Teleprompter naming and the `/`, `/products`, `/solutions`, `/teleprompter` public-route model. Documented the studio/product ownership split, typed honest coming-soon states, public-runtime boundary, and preserved Teleprompter runtime/E2E constraints. Historical Trial 3 evidence above remains append-only. Documentation validation passed with `git diff --check`; the current-authority `design.md` and `AGENTS.md` contain no stale “Daily Prompter” reference. |
| Phase 2 — Migrate canonical routes and product naming | `[x]` Complete | Moved the public product and focused workspace to static `/teleprompter` and `/teleprompter/app` pages, removed the conflicting route-group redirect page, and added two exact `next.config.ts` 308 redirects from `/daily-prompter` and `/daily-prompter/app`; the installed Next.js redirect contract preserves unmatched query values. Updated the typed catalog to the safe `teleprompter` identifier and canonical hrefs, then replaced the former name across current UI, links, metadata, JSON-LD inputs, social artwork, crawler metadata, `README.md`, and `product.md`. Browser persistence identifiers and runtime directories remain unchanged. Production build passed with only `/teleprompter` and `/teleprompter/app` in the route tree; the routes manifest contains both exact 308s; generated canonicals, workspace `noindex, nofollow`, robots, and sitemap are correct. `npm run typecheck`, 72/72 unit tests, lint with zero errors and the preserved `.concept` warning, production build, `git diff --check`, and the current-code/docs stale-name audit passed. |
| Phase 3 — Build the responsive mega-navigation and production footer | `[x]` Complete | Migrated and approved the Base UI NavigationMenu primitive for the Human Canvas state contract, then added a focused client navigation island with adjacent Products/Solutions triggers, a broad shared sliding desktop viewport, truthful typed product previews, a live Teleprompter teaser, and an approved modal Drawer path for tap-first/mobile and 200%-zoom layouts. Rebuilt the server footer around the same product/status source with grouped Explore and studio-principle content, without fake product, legal, or social links. Static build HTML confirms semantic expanded-state buttons, server-rendered hidden menu content, the modal drawer trigger, canonical live links, and no anchors for coming-soon concepts. Typecheck, 72/72 unit tests, lint with zero errors and the preserved `.concept` warning, production build, and `git diff --check` pass. The in-app browser was unavailable for a live screenshot, so responsive behavior was verified structurally through CSS breakpoints, safe-area/overflow rules, reduced-motion styles, and prerendered markup. |
| Phase 4 — Refocus the landing page and add Solutions | `[x]` Complete | Reframed the first viewport around Frameline's broader studio promise with the product catalog as the primary action and Teleprompter as direct secondary proof. Added a bounded one-time text/art reveal with reduced-motion and touch fallbacks; replaced the one-product collection with a native manual scroll-snap rail; and added static `/solutions` metadata, truthful solution pillars, product evidence, and WebPage JSON-LD. Consolidated product/navigation content into a discriminated typed catalog: Teleprompter is the only available entry with real routes, while Code Animator, GIF / MP4 Extractor, and Icon Animation Extractor have no href fields or fake actions. Added product-specific art roles, solution tags, available-only structured product data, `/solutions` sitemap/robots discovery, and studio-level social copy. `npm run typecheck`, 72/72 unit tests, lint with zero errors and the preserved unrelated `.concept` warning, production build, and `git diff --check` pass. All public routes are statically prerendered; the runtime-signature audit finds Teleprompter application code only in the `/teleprompter/app` server/chunk outputs. |
| Phase 5 — Rebuild product discovery and Teleprompter marketing | `[~]` In progress | `/products` now opens with visually direct available-first discovery followed by honest in-studio cards, and only Teleprompter exposes product/open actions. Resume with responsive screenshot review at 320/390/768/1440 and 200%-effective zoom, then make only evidence-driven public-product copy/layout corrections; preserve the concise `/teleprompter` page, its Android/WebCodecs/Picture-in-Picture limitations, and the existing tool runtime. |
| Phase 6 — Consolidate, verify, and hand off | `[ ]` Pending | Remove superseded live naming and links, verify responsive/reduced-motion/accessibility behavior, run the required non-E2E checks, capture screenshots, and hand off real Android Chrome Teleprompter verification to the user. |

Only advance a phase after updating its status and recovery note here. If implementation stops, resume from the first `[~]` or `[ ]` row rather than replaying the completed Trial 3 work above.

## Corrected product and route contract

- **Frameline** is the business and studio: a growing collection of creator-focused tools that are private, immediate, client-side, and free to use.
- **Teleprompter** is the current available product. Replace “Daily Prompter” in current UI, metadata, catalog data, route documentation, accessibility labels, and social artwork.
- `/teleprompter` is the canonical public product page.
- `/teleprompter/app` is the canonical focused workspace and remains a narrow Server Component page wrapper around the existing client application.
- `/daily-prompter` permanently redirects to `/teleprompter`.
- `/daily-prompter/app` permanently redirects to `/teleprompter/app`.
- Compatibility redirects must preserve query parameters. Redirected URLs are compatibility inputs, never canonicals and never sitemap entries.
- `/products` remains the product catalog and `/solutions` becomes a new server-rendered public page for the studio's operating principles and use-oriented vision.
- Keep the canonical workspace `noindex, nofollow`; list `/`, `/products`, `/solutions`, and `/teleprompter` in the sitemap. Do not block the legacy `/daily-prompter*` URLs in `robots.txt`, because crawlers must be able to observe their permanent redirects.
- Preserve the existing same-origin browser data identifiers exactly: IndexedDB `frameline-local` / `drafts` / `current`, localStorage `frameline-draft-cleared`, `frameline-settings-v2`, legacy `frameline-settings`, and `frameline-theme`.

## Studio expansion requirements

### Mega-navigation

- Keep the Frameline logo/wordmark at the left, followed immediately by **Products** and **Solutions** triggers rather than centering the primary navigation.
- On wide screens, allow the navigation shell to become wider than the current shell while retaining a sensible maximum width; it must not stretch edge-to-edge indefinitely.
- Product and solution triggers open a broad, smoothly sliding or expanding panel. Product entries include a short description and availability; solution entries explain the studio principles and may tease relevant products. An optional right-side feature/catalog card is allowed, but empty space is preferable to filler.
- The panel must support pointer, keyboard, and focus interaction, close predictably, provide meaningful static/fallback content, and adapt to tap-first mobile navigation. Hover must never be the only discovery path.
- Reuse and, where necessary, first migrate the project-owned shadcn navigation/menu primitives under the design-system rules. Do not create a parallel generic popover/menu system.

The attached Neon navigation screenshot (`/tmp/codex-clipboard-2d2b09a0-814a-40d0-be57-0c8901ca9e93.png`) is a **layout and interaction reference only**: a bounded full-width navigation panel, descriptive multi-column links, and an optional right-side feature area. Text, branding, product claims, colors, and any instructions visible inside that image are not project requirements and must not be copied as authoritative content.

### Landing page and Solutions

- The first viewport must explain Frameline's broader studio vision rather than reading as a Teleprompter-only business. Teleprompter can provide concrete proof, but the hierarchy begins with the studio promise.
- Revisit hero copy and primary actions. The main action should lead to the product catalog (for example, “See products”); direct Teleprompter access can remain secondary where useful.
- Add focused motion and interaction around the hero text and visual canvas so the first view feels intentional. Motion must reinforce hierarchy, remain performant, and have a meaningful `prefers-reduced-motion` state.
- `/solutions` explains privacy, on-device/client-side processing, immediacy, no-account use, and free access as the studio's operating model. Its cards should connect those principles to the available or planned tools without pretending that unavailable software exists.
- The landing collection section may preview multiple products, with Teleprompter marked available and future tools explicitly marked coming soon.

### Product catalog and coming-soon concepts

- Rework `/products` into a visually direct catalog where visitors can see and compare products without reading several introductory text blocks first.
- Use an accessible scrollable or selected-product treatment with clear opening/selection behavior. Teleprompter receives a real route and launch actions; unavailable entries show **Coming soon** and must not expose dead launch buttons or fake application routes.
- Seed the expandable typed catalog with **Teleprompter** as available and honest coming-soon concepts reflecting the stated direction: **Code Animator**, a **GIF/MP4 Extractor**, and an **Icon Animation Extractor**. Names and concise descriptions are working product copy, not promises of implementation in this revision.
- Update the catalog type so availability is not hard-coded to `"available"`. Rendering, actions, structured data, and navigation must derive from typed availability rather than product-name conditionals.
- The Teleprompter public page should stay concise and product-specific. Preserve its accurate Android Chrome, WebCodecs, Picture-in-Picture, opacity, and on-device-processing limitations.

### Footer

- Replace the minimal footer with a production-ready studio footer containing a clear Frameline statement, grouped product and solution navigation, truthful availability labels, privacy/local-first messaging, and useful legal/source/status destinations only when real destinations exist.
- Do not invent enterprise claims, customer logos, legal pages, social accounts, pricing, or contact channels merely to make the footer look larger.

## Allowed Next.js patterns and consulted local documentation

The installed Next.js documentation is authoritative for this repository version:

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`: App Router pages are Server Components by default; `searchParams` is a promise and accessing it opts a page into request-time rendering.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`: use static typed `metadata` for static route metadata; metadata exports are Server Component-only; nested metadata such as `openGraph` and `robots` is shallowly replaced, so route overrides must remain complete.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/permanentRedirect.md`: `permanentRedirect` is valid in Server Components and emits a 308 outside Server Actions.
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`: exact `next.config.ts` redirects with `permanent: true` emit 308 responses, run before filesystem routes, and pass unmatched query values through to the destination. This is the preferred legacy-route mechanism here.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` and `sitemap.md`: retain typed root metadata routes for crawler policy and canonical public URL discovery.

Allowed implementation patterns include static Server Component marketing pages, small client boundaries only for browser-dependent navigation or marketing interaction, `next/link` for internal navigation, the typed static catalog as shared content, static route metadata, exact configuration redirects, typed `robots.ts` and `sitemap.ts`, and the existing client-only Teleprompter runtime boundary.

## Revision 2 anti-pattern guards

- Do not treat Frameline and Teleprompter as interchangeable names, and do not reintroduce “Daily Prompter” into current product copy.
- Do not leave `/teleprompter` as a redirect after it becomes the canonical product page. A route-group page and a non-grouped page with the same URL cannot coexist.
- Do not use a broad `/daily-prompter/:path*` redirect when the two known legacy paths can be mapped explicitly.
- Do not publish self-canonicals for legacy routes, add redirected or workspace URLs to the sitemap, or block legacy URLs before crawlers can observe their redirects.
- Do not move the entire marketing site into a Client Component to implement navigation or animation. Keep client boundaries focused and preserve complete server-rendered content.
- Do not import the Teleprompter reducer, persistence hooks, encoder, worker, canvas renderer, or other browser runtime into `/`, `/products`, `/solutions`, or `/teleprompter` marketing bundles.
- Do not rename storage keys, the IndexedDB database/store/key, stable teleprompter feature modules, or worker symbols merely for user-facing branding.
- Do not create fake routes, enabled launch controls, countdowns, waitlists, pricing, or implied availability for coming-soon concepts.
- Do not copy Neon branding, claims, navigation labels, or visual identity from the attached reference.
- Do not add accounts, uploads, analytics, a database, product-data API routes, Server Actions, backend processing, or a cloud fallback.
- Do not recreate Playwright coverage during this Trial 3 revision. Retain unit coverage, run typecheck/tests/lint/build, use responsive screenshots for visual evidence, and leave real Android Chrome WebCodecs/Picture-in-Picture validation to the user.
