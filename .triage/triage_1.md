# Trial 1 plan — Final client-side application

## Outcome

Deliver the complete client-side teleprompter described in [`../product.md`](../product.md): a creator opens the site on Android Chrome, pastes a script, adjusts its presentation, prepares a video locally, enters Picture-in-Picture, and completes repeated recording attempts without an account, backend, upload, or permanent download.

This plan ends at a locally verified production build. Vercel deployment belongs to Trial 2.

## Fixed boundaries

### In scope

- Next.js App Router, React, strict TypeScript, Tailwind CSS, and shadcn/ui
- A project-owned design system and component guide
- The marketing landing page and its Coming next section
- SEO metadata and a branded Open Graph/social-sharing image
- The full client-side teleprompter user experience
- Local draft/settings persistence
- Client `HTMLCanvasElement` painting and `VideoFrame` creation, transferable frames, a dedicated WebCodecs/WebM encoding worker, video playback, and PiP
- Automated verification and real Android device acceptance

### Out of scope

- Authentication or accounts
- API routes, Server Actions for product data, or a separate backend
- Database, cloud storage, synchronization, or third-party imports
- Vercel project setup or production deployment
- Billing, teams, collaboration, or administration
- Selecting vendors or architecture for Trial 3

## Trial-wide mobile-first quality bar

The product targets phone-first creators, so extreme responsiveness is a completion requirement for every implementation phase rather than a landing-page enhancement.

- Design the narrow portrait layout first, then enhance it at content-driven wider breakpoints.
- Support small Android viewports, portrait and landscape orientation, browser chrome changes, display scaling, and at least 200% text zoom without losing actions or causing horizontal page overflow.
- Respect safe-area insets where controls can approach screen edges.
- Keep primary controls in comfortable thumb reach and target at least 44 × 44 CSS pixels wherever practical; never violate the WCAG 2.2 minimum target-size requirement.
- Avoid hover-only interactions. Every action must work with touch and keyboard, with persistent visible focus.
- Test representative narrow, mid-size, and wide layouts in every phase; final confidence still comes from real Android phones.

## Phase 0 — Documentation and evidence baseline

### What to establish

Before implementation begins, record the exact runtime versions and confirm every non-trivial API against current documentation. Treat the existing concept as evidence and reusable logic, not production code.

### Allowed documented patterns

- Create the application with the current `create-next-app` CLI and App Router.
- Keep Server Components as the default and place `'use client'` only at focused interactive entry points.
- Create the encoder with the browser-standard module-worker form:

  ```ts
  new Worker(new URL("./teleprompter-encoder.worker.ts", import.meta.url), {
    type: "module",
  })
  ```

- Communicate through typed `postMessage` messages and terminate the worker during cancellation, failure, replacement, and component cleanup.
- Initialize shadcn/ui with its CLI, use CSS-variable theming, and maintain the complete repository-owned `base-nova` component catalog.
- Initialize the selected Elegant Luxury registry theme with the exact reviewed command in Phase 2.
- Use Playwright role/label locators and retrying assertions rather than CSS selectors and fixed sleeps.

### Documentation references

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js `use client`](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [MDN `Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)
- [MDN Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [shadcn/ui for Next.js](https://ui.shadcn.com/docs/installation/next)
- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
- [Shadcn Studio CLI theme setup](https://shadcnstudio.com/docs/getting-started/how-to-use-shadcn-cli)
- [MDN responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Next.js Playwright guide](https://nextjs.org/docs/app/guides/testing/playwright)
- [Playwright web server configuration](https://playwright.dev/docs/test-webserver)

### Existing evidence to preserve

- Copy the behavior of `.concept/shared/teleprompter.js::wrapText` into a tested, framework-independent TypeScript layout module.
- Copy the behavior of `.concept/shared/teleprompter.js::paintFrame` into a rendering module, then optimize it to draw only visible lines.
- Preserve the codec probe, timestamps, encoder queue backpressure, keyframes, muxing sequence, Blob lifecycle, playback rate, and PiP behavior demonstrated in `.concept/concepts/client-webcodecs/app.js`.
- Use `.concept/concepts/client-webcodecs/index.html` as the minimum control inventory, not as the final interface.
- Translate useful colors and layout ideas from `.concept/shared/styles.css` into semantic design tokens rather than copying its CSS wholesale.

### Early technical risk gate

Current browser documentation defines the module-worker pattern, while current Next.js documentation does not provide a complete App Router/Turbopack example for this exact TypeScript worker pipeline. Phase 1 must prove that a minimal worker imports, exchanges a typed message, and survives both development and production builds. The dedicated worker is required; the spike determines the supported bundler configuration. If Turbopack fails, use the documented Next.js webpack build option and record why.

### Verification checklist

- Runtime and package-manager versions are recorded.
- Every planned library has an official source and a browser-compatible build.
- The prototype-to-production mapping above is preserved in the implementation checklist.
- The module-worker risk is represented by an executable spike, not an assumption.

### Anti-pattern guards

- Do not use Next.js `<Script strategy="worker">`; the documented feature does not support App Router.
- Do not migrate `.concept/server.mjs` or its rejected backend-rendering route.
- Do not keep the prototype's CDN import for the muxer.
- Do not execute or interpret pasted script text as code.

## Phase 1 — Initialize Next.js and engineering foundations

### What to implement

1. Scaffold Next.js in the repository root using App Router, strict TypeScript, Tailwind CSS, ESLint, a `src/` directory, and the `@/*` alias. Preserve `product.md`, `.concept/`, and `.sks/` during initialization.
2. Use the package manager selected for the repository consistently and commit its lockfile.
3. Add scripts for development, linting, type-checking, unit tests, browser tests, and production builds. Set the development script to `next dev -p 4444` so `npm run dev` consistently serves `http://localhost:4444`; do not rely on a `.env` `PORT` value.
4. Establish the route groups from the product specification:

   ```text
   src/app/
     (marketing)/
     (app)/teleprompter/
   src/features/teleprompter/
   src/lib/client/
   src/lib/scripts/
   src/workers/
   ```

5. Add environment guards so browser-only modules cannot be imported into Server Components.
6. Complete the minimal module-worker spike. Test `postMessage`, transferable data, cancellation/termination, dev compilation, and production compilation.
7. Record whether Turbopack or webpack is the verified build path; do not maintain two untested paths.

### Documentation references

- Copy the scaffold choices from [Next.js installation](https://nextjs.org/docs/app/getting-started/installation).
- Copy the documented `-p`/`--port` option from the [Next.js CLI reference](https://nextjs.org/docs/app/api-reference/cli/next) for the fixed development port.
- Copy the root layout/page structure from the same guide.
- Copy the client-boundary pattern from [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- Copy the worker constructor and cleanup model from [MDN `Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

### Verification checklist

- Fresh install completes from the lockfile.
- `npm run dev` binds to port `4444`, and `http://localhost:4444/` plus `http://localhost:4444/teleprompter` load without console errors.
- Lint, type-check, tests, and production build all pass independently.
- The landing route remains a Server Component.
- The worker round-trip passes in development and the production build.
- No `.concept` CDN import appears in production source.

### Anti-pattern guards

- Do not mark the root layout or marketing route `'use client'`.
- Do not add API routes, authentication scaffolding, database packages, or deployment configuration.
- Do not hide a failing worker build by moving encoding back to the main thread.
- Do not delete or rewrite the concept before its reusable behavior is covered by tests.

## Phase 2 — Establish shadcn/ui component foundations

### What to implement

1. Initialize shadcn/ui in the existing Next.js application using CSS variables and React Server Component support.
2. Apply the selected **Elegant Luxury** Shadcn Studio registry base after the Next.js scaffold exists, using the exact command below. The URL must remain a plain quoted URL rather than Markdown link syntax.

   ```bash
   npx shadcn@latest init "https://shadcnstudio.com/r/themes/elegant-luxury.json" --base base
   ```

3. Treat the resulting `base-nova` style, Base UI primitive selection, Remix icon configuration, and Poppins/Libre Baskerville/IBM Plex Mono font dependencies as the chosen starting foundation. Inspect the generated output and record any intentional product-level overrides rather than rerunning initialization with a conflicting preset.
4. Install the complete official shadcn/ui component catalog using the repository's reviewed `base-nova` configuration. Run `npx shadcn@latest add --all --dry-run` first, review its dependency and file plan, then run `npx shadcn@latest add --all --yes` without `--overwrite`.
5. Keep generated components under `src/components/ui/`. Treat that code as application-owned: review it, style it with tokens, and test modifications.
6. Put product composites—capability notices, settings rows, generation status, and action bars—outside `components/ui`, under their feature or shared component boundary.

### Documentation references

- Copy the existing-project setup from [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next).
- Copy command forms from the [shadcn/ui CLI](https://ui.shadcn.com/docs/cli).
- Copy the CSS-variable convention from [shadcn/ui theming](https://ui.shadcn.com/docs/theming).
- Copy the remote-theme initialization pattern from [Shadcn Studio's CLI guide](https://shadcnstudio.com/docs/getting-started/how-to-use-shadcn-cli); the selected registry item is `https://shadcnstudio.com/r/themes/elegant-luxury.json`.

### Verification checklist

- `components.json` points to the actual `src/` CSS and alias paths.
- `components.json`, global CSS, fonts, icons, and installed dependencies match the reviewed Elegant Luxury registry output.
- A Server Component can render a non-interactive shadcn component.
- Interactive components work only beneath intentional client boundaries.
- Focus rings, disabled states, touch target sizes, and keyboard behavior remain intact.
- The installed `components/ui` inventory matches the official catalog reported by the reviewed `--all --dry-run` output, and routes import only the primitives they use.

### Anti-pattern guards

- Do not combine the catalog install with `--overwrite`; preserve reviewed application-owned changes and resolve collisions individually.
- Do not substitute another preset, primitive base, or theme during implementation without updating this plan.
- Do not leave a runtime dependency on the Shadcn Studio registry URL; generated theme source and dependencies must live in the project.
- Do not treat shadcn/ui as an immutable external package; its generated source is owned here.
- Do not fork accessibility behavior merely for visual styling.
- Do not introduce raw one-off colors where semantic tokens express the role.

## Phase 3 — Define the product design system and guide

### What to implement

1. Define semantic tokens for background, foreground, surface, muted surface, primary action, accent/reading guide, success, warning, destructive, borders, focus rings, and overlays.
2. Define typography for marketing display text, product headings, controls, script editing, and teleprompter output. Teleprompter font choices must be tested inside encoded frames, not only in DOM previews.
3. Define spacing, radius, elevation, motion, safe-area, content-driven breakpoint, and minimum touch-target rules for phone-first use. The default CSS must serve the narrow layout; wider layouts are progressive enhancements.
4. Define state patterns for supported, unsupported, insecure, generating, cancelling, ready, playing, paused, failed, and PiP closed.
5. Build a private development-only design-guide route or component gallery showing tokens, primitives, states, form controls, and mobile layouts. Ensure it cannot become a production marketing route accidentally.
6. Write concise design guidance near the tokens so contributors can extend the system without inventing parallel styles.

### Documentation references

- Copy semantic background/foreground token pairs and radius conventions from [shadcn/ui theming](https://ui.shadcn.com/docs/theming).
- Use the product states and appearance controls listed in [`../product.md`](../product.md) as the source of truth.
- Use `.concept/shared/styles.css` only as visual evidence for the selected dark, focused direction.

### Verification checklist

- All component examples use semantic tokens.
- Text/background and control contrast meet WCAG AA.
- Every interactive target is usable on a narrow Android viewport.
- There is no horizontal overflow at the agreed narrow-phone width, 200% text zoom keeps core actions reachable, and both portrait and landscape remain usable.
- Primary controls are at least 44 × 44 CSS pixels wherever practical and never depend on hover.
- Light/dark behavior is either fully designed and tested or intentionally deferred; there is no half-working toggle.
- Reduced-motion preferences do not disable the functional teleprompter video but do reduce decorative UI motion.

### Anti-pattern guards

- Do not confuse the opaque video background with the website theme.
- Do not encode state using color alone.
- Do not build an abstract design system larger than the landing and teleprompter flows require.
- Do not let a design-guide route add client JavaScript to the public landing page.

## Phase 4 — Build the landing page

### What to implement

1. Build a statically rendered landing page that immediately explains the product and leads into `/teleprompter`.
2. Present the three-step value path: paste a script, prepare privately on the phone, and open it over the preferred camera or social app.
3. State the platform boundary plainly: current Android Chrome, HTTPS, opaque system Picture-in-Picture rather than a transparent overlay.
4. Include privacy language: script processing and generated video remain on-device in Trial 1.
5. Add a restrained Coming next section covering a personal script library, future imports, rich script cues/treatments, and faster reuse. Describe direction without dates or claims of current availability.
6. Use semantic page structure and accessible heading/link landmarks; metadata and social-sharing assets are implemented separately in Phase 5.
7. Use a single primary CTA, **Paste your script**, linking to the application; do not place a waitlist or account wall in front of it.
8. Make every section highly responsive: compose for narrow portrait screens first, keep CTA and trust copy visible without crowding, avoid horizontal carousels for required content, and enhance rather than replace the content hierarchy on wider screens.

### Documentation references

- Follow the landing-page requirements in [`../product.md`](../product.md), especially **Landing page direction**, **Privacy**, and **Browser strategy**.
- Compose shadcn primitives using the Phase 3 tokens rather than copying a generic template.
- Follow [MDN responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) for the mobile-first layout model.

### Verification checklist

- The page renders meaningful HTML with JavaScript disabled.
- The CTA reaches `/teleprompter` and keyboard focus is visible.
- Mobile layout is verified on narrow portrait and landscape viewports, at 200% text zoom, and without horizontal overflow.
- Copy does not imply iOS support, transparency, accounts, imports, or cloud sync are already available.
- Landing-page JavaScript does not include the encoding worker or muxer bundle.

### Anti-pattern guards

- Do not make the landing page a full-page Client Component.
- Do not lead with the roadmap instead of the working product.
- Do not promise unsupported browsers or use vague privacy wording.
- Do not add analytics during Trial 1.

## Phase 5 — SEO and social sharing foundation

### What to implement

1. Export a typed static `Metadata` object from the root or marketing Server Component using `import type { Metadata } from "next"`. Define the product title and title template, description, canonical/alternates, Open Graph fields, and Twitter card fields. Use `metadataBase` through a centralized site-origin boundary; do not invent the final production hostname before Trial 2.
2. Add the file-convention favicon, app icon, and Apple touch icon in the root app segment.
3. Add explicit branded, accessible 1200 × 630 image routes at `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx`. Both should export `alt`, `size`, and `contentType`, use `ImageResponse` from `next/og`, and call one shared product-card renderer/constants module so the artwork cannot drift. Introduce a distinct Twitter/X composition only if a real crop or card requirement is identified.
4. Create typed `src/app/robots.ts` and `src/app/sitemap.ts` metadata routes. Include only public canonical routes and exclude the private development design guide.
5. Keep all search snippets and share-card claims within Trial 1 reality: Android Chrome, on-device processing, no account, and no currently available imports or cloud library.
6. Keep the metadata and image generation static and dependency-free from backend data. Trial 2 will set and externally validate the final production origin.

### Documentation references

- Copy the typed static metadata pattern and file conventions from [Next.js metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).
- Copy the generated social-card exports and `ImageResponse` pattern from [Open Graph and Twitter image conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image).
- Copy `metadataBase`, canonical, Open Graph, and Twitter fields from [Next.js `generateMetadata` reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), while using a static `Metadata` export for this static page.
- Follow the official [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) and [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) route conventions.

### Verification checklist

- Rendered HTML contains one correct title, description, canonical, Open Graph, and Twitter metadata set.
- The Open Graph and Twitter image routes each return a PNG at 1200 × 630 with meaningful alt text, readable type, safe text margins, and no clipping.
- `/robots.txt` and `/sitemap.xml` build successfully and expose only intended public routes.
- The share card is visually inspected at full size and realistic small social-preview size.
- The marketing route remains static and a Server Component; metadata introduces no backend or client-side head mutation.
- Local verification does not claim a placeholder or localhost URL as the production canonical origin; external platform validators are deferred to Trial 2.

### Anti-pattern guards

- Do not use client-side head mutation, the Pages Router `<Head>` component, or duplicate hand-written tags.
- Do not assume the Open Graph file convention automatically supplies `twitter:image`, and do not define competing file-based and config-based image metadata.
- Do not introduce a dynamic request or backend dependency to generate a static product share card.
- Do not index the design-guide route or invent a deployment hostname.
- Do not put future accounts, imports, iOS support, or cloud features into search/share copy as if they exist.
- Do not use CSS Grid or unsupported CSS in `ImageResponse`; use its documented supported layout subset.

## Phase 6 — Build the complete client-side application and user flow

Phase 6 is the product implementation phase. Complete its slices in order so each layer can be tested before the encoder and PiP lifecycle are attached.

### 6A. Script domain and local state

- Define a versioned `ScriptDocument` schema with a plain-text Version 1 representation and migration entry point.
- Normalize paragraphs and whitespace without losing intentional paragraph breaks.
- Implement word count and deterministic duration estimates.
- Put draft persistence behind a repository-owned interface backed by IndexedDB; use `localStorage` only for small preferences.
- Provide explicit clear/remove controls and disclose local persistence.

### 6B. Capability and failure model

- Detect secure context, Worker, `HTMLCanvasElement` 2D context, VideoEncoder, VideoFrame, codec configuration, and video Picture-in-Picture independently.
- Represent each capability as typed data and show a specific recovery message.
- Test the exact VP8 configuration with `VideoEncoder.isConfigSupported()` before generation.
- Model idle, validating, generating, cancelling, ready, playing, paused, failed, and unsupported states explicitly.

### 6C. Editor, controls, and live preview

- Build the responsive script editor and word/duration feedback.
- Implement font size, line height, colors, aspect ratio, horizontal padding, reading guide, alignment, words per minute, lead-in, and loop controls.
- Render a DOM or lightweight canvas preview that responds immediately without encoding.
- Keep the prepare action distinct from the open-PiP action so PiP is requested directly from a user gesture.
- Design navigation-loss and regeneration confirmation where an existing in-memory video would be replaced.

### 6D. Deterministic render plan

- Promote and test `wrapText` behavior from `.concept/shared/teleprompter.js` as `src/features/teleprompter/rendering/layout.ts`.
- Convert the versioned script document and settings into an immutable render plan.
- Measure and wrap once, compute line positions and total travel once, and select only visible lines per frame.
- Make timestamps, canonical duration, start delay, frame count, and keyframe cadence deterministic.
- Test empty, Unicode, emoji, long-word, many-paragraph, large-font, and long-script cases.

### 6E. Dedicated encoding worker

- Create typed request, progress, completion, cancellation, and error messages in `src/features/teleprompter/encoding/messages.ts`.
- Paint on a client `HTMLCanvasElement`, create and transfer one `VideoFrame` at a time, and implement `src/workers/teleprompter-encoder.worker.ts` using VideoEncoder plus a pinned locally installed browser-compatible WebM muxer.
- Encode the required 30 FPS timeline with explicit microsecond timestamps, bounded queue depth, regular keyframes, and asynchronous backpressure.
- Close each `VideoFrame` immediately after enqueueing it.
- Transfer the completed `ArrayBuffer` rather than copying it.
- On cancel or failure, stop work, close the encoder and frames, release resources, and send one terminal result.
- Report monotonic progress without flooding the main thread.

### 6F. Playback, session, and PiP orchestration

- Implement a session hook/controller that owns exactly one worker, one generated buffer result, one Blob URL, and one video element lifecycle.
- Revoke an obsolete Blob URL before replacement and during final cleanup.
- Apply speed changes through `HTMLVideoElement.playbackRate` inside the tested range without regeneration.
- Implement prepare, cancel, retry, play, pause, restart, loop, lead-in, enter PiP, leave PiP, and replacement-PiP recovery.
- Preserve the prepared video across repeated attempts during the browser session.
- Prevent duplicate generation actions and stale worker messages from mutating the current session.

### 6G. Full experience polish

- Add clear preparation progress, time expectation, cancel action, unsupported-device screen, and error-specific recovery actions.
- Add short in-context instructions for switching to the recording app and returning to adjust speed.
- Verify rotation, browser restoration, PiP resize/movement, lock/unlock, and low-memory interruption behavior.
- Make the editor and all controls usable with keyboard, screen reader, and touch.
- Keep script text out of logs, analytics hooks, thrown error metadata, and test snapshots.

### Documentation and source references

- Use the technical architecture, rendering model, capability list, failure states, and acceptance criteria in [`../product.md`](../product.md).
- Copy the basic layout/paint behavior from `.concept/shared/teleprompter.js`, then apply the product's layout-once and visible-lines-only requirements.
- Copy the encoder sequencing and PiP proof from `.concept/concepts/client-webcodecs/app.js`, but move encoding off the main thread and replace its CDN dependency.
- Use [MDN `Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for worker construction, messaging, transfers, and termination.
- Re-check MDN and browser compatibility data for WebCodecs, client `HTMLCanvasElement`/VideoFrame transfer, and Picture-in-Picture immediately before implementation because these APIs evolve independently of Next.js.

### Verification checklist

- Every MVP control and failure state in `product.md` is represented in the UI or an automated test.
- Main-thread responsiveness remains acceptable throughout generation.
- Output is a stable 30 FPS WebM with monotonically increasing timestamps.
- Cancellation and repeated generation do not leak workers, frames, Blob URLs, or event listeners.
- Speed changes and restart do not regenerate video.
- PiP is entered only from a user gesture and recovers cleanly after closing or replacement.
- A representative script works after the page has loaded and the network is disabled.
- No request payload, log, error event, or persistent browser record contains generated video data; script storage is limited to the disclosed local draft.

### Anti-pattern guards

- Do not encode on the main thread.
- Do not lay out all text again for every frame.
- Do not spawn a pool of frame workers without device evidence.
- Do not silently reduce the selected frame rate.
- Do not regenerate solely for an in-range speed change.
- Do not retain multiple generated Blobs.
- Do not upload scripts or introduce a server fallback.
- Do not request PiP from an effect, timer, or completed-worker callback.

## Phase 6H — Responsive help, complete component catalog, and application decomposition

This maintainability follow-up must be completed before adding more teleprompter controls.

### What to implement

1. Finish the current settings-help task by composing the official `HoverCard`, `HoverCardTrigger`, and `HoverCardContent` from `src/components/ui/hover-card.tsx` for desktop. Keep essential explanations available through a tap/click disclosure on phones; hover-only content is not accessible enough to be the sole source.
2. Run `npx shadcn@latest add --all --dry-run`, review the file and dependency list, then install the complete official component catalog with `npx shadcn@latest add --all --yes`. Preserve the `base-nova` style, reconcile shadcn semantic tokens with Frameline's tokens, and never apply `--overwrite` without an explicit per-file review.
3. Reduce `src/features/teleprompter/teleprompter-app.tsx` to a composition root. Extract the app header, capability notice, script pane, live preview pane, bottom action dock, Tune dialog, setting help, range control, and prepared-video surface into named feature components.
4. Create a typed teleprompter reducer and provider for coordinated serializable editor, settings, and UI state. Define a closed `TeleprompterAction` union and pure reducer tests. Keep worker/video lifecycle ownership inside `useTeleprompterSession`; do not mix `VideoFrame`, Worker, Blob URL, canvas, video-element, or cancellation resources into reducer state.
5. Extract local draft persistence, settings persistence, capability bootstrap, dialog lifecycle, generated-output signature comparison, and preview timing into focused hooks or pure modules. Derived values such as word count, duration, preview identity, stale-output status, and primary-action presentation must not be stored as independently mutable copies.
6. Use the following structure as the initial ownership boundary, adjusting names only when tests demonstrate a clearer model:

   ```text
   src/features/teleprompter/
     components/
       teleprompter-header.tsx
       capability-notice.tsx
       script-pane.tsx
       preview-pane.tsx
       teleprompter-dock.tsx
       tune-dialog.tsx
       setting-with-info.tsx
       range-control.tsx
       prepared-video.tsx
     state/
       teleprompter-context.tsx
       teleprompter-reducer.ts
       teleprompter-reducer.test.ts
       teleprompter-selectors.ts
     hooks/
       use-draft-persistence.ts
       use-settings-persistence.ts
     teleprompter-app.tsx
   ```

7. Move teleprompter-specific styling out of the marketing stylesheet into a feature-owned stylesheet or CSS module while keeping shared semantic tokens in `src/app/globals.css`.
8. Add `AGENTS.md` as the canonical repository instruction file and `CLAUDE.md` as a pointer to it. Record the client-only boundary, reusable-component ownership, responsive/touch requirements, state/effect rules, WebCodecs lifecycle invariants, and verification commands.

### Documentation references

- Follow the official [shadcn CLI](https://ui.shadcn.com/docs/cli) `add --all`, `--dry-run`, and default non-overwrite behavior.
- Follow the official [shadcn Hover Card](https://ui.shadcn.com/docs/components/base/hover-card) composition, trigger-delay, and positioning props.
- Follow the underlying [Base UI Preview Card](https://base-ui.com/react/components/preview-card) accessibility guidance: preview content is progressive enhancement and cannot be the only way touch or screen-reader users receive essential information.
- Copy the existing session resource ownership from `src/features/teleprompter/use-teleprompter-session.ts`; do not recreate it in context.
- Preserve the deterministic rendering APIs in `src/features/teleprompter/rendering/plan.ts` and `src/features/teleprompter/rendering/paint-frame.ts`.

### Verification checklist

- The catalog dry-run inventory and dependency changes are reviewed before installation; customized UI files are not overwritten silently.
- The complete catalog exists under `src/components/ui`, while production routes tree-shake primitives they do not import.
- `teleprompter-app.tsx` reads as orchestration rather than containing the full editor, preview, settings, persistence, and action implementations.
- Reducer actions and state transitions have unit tests; resource-bearing session state remains in the session hook.
- Desktop help uses the official shadcn Hover Card portal without shifting Tune dialog dimensions. Phone help opens by tap and remains readable without hover.
- Script changes and frame-affecting settings still mark prepared output stale; playback-only speed and loop changes still avoid recompilation.
- Preview and encoded frames preserve paragraph breaks, guide/progress options, timing, and output parity.
- Type-checking, unit tests, lint, the full desktop/mobile Playwright suite, production build, and real Android acceptance all pass.

### Anti-pattern guards

- Do not replace one large component with one equally large context provider.
- Do not put every value in context; keep truly local interaction state in its owning component and derive values instead of synchronizing copies.
- Do not put workers, frames, canvases, video elements, Blob URLs, or cancellation handles in reducer state.
- Do not create feature-specific forks inside `src/components/ui`; compose catalog primitives under the teleprompter feature.
- Do not make hover the only access path to help content.
- Do not add barrel files that hide client/server boundaries or create circular imports.

## Phase 7 — Verification and Trial 1 release gate

### What to implement

1. Add unit tests for script normalization, word count, duration, schema migration, wrapping, render-plan travel, timestamps, visible-line selection, and speed calculations.
2. Add worker integration tests for message validation, progress monotonicity, cancellation, error normalization, queue bounding, terminal results, and transferable output where the environment supports the APIs.
3. Add Playwright coverage for the browser-independent flow using capability adapters or controlled fixtures; retain real-device tests for actual WebCodecs and PiP behavior.
4. Run browser tests against the local production build, not only the development server.
5. Execute the complete `product.md` test matrix on a current Pixel, a mid-range Samsung, and at least one lower-memory Android phone.
6. Record preparation time, output size, peak memory, responsiveness, PiP continuity, and repeated-attempt memory behavior for short, medium, and long scripts.
7. Write a concise manual test record containing device, Android version, Chrome version, encoder configuration, result, and known limitation.
8. Remove debug logging, dead prototype imports, accidental server/backend code, and duplicate product components that should compose installed shadcn primitives. Retain the intentionally installed shadcn catalog.

### Documentation references

- Copy setup and configuration patterns from the [Next.js Playwright guide](https://nextjs.org/docs/app/guides/testing/playwright) and [Playwright web server documentation](https://playwright.dev/docs/test-webserver).
- Use the acceptance criteria, test matrix, performance targets, and initial guardrails in [`../product.md`](../product.md) as the release checklist.

### Verification checklist

- Clean install, lint, type-check, unit tests, production build, and browser tests pass.
- Grep confirms no CDN muxer import, no backend rendering endpoint, no auth/database packages, and no accidental script logging.
- The production bundle keeps worker/muxer code out of the marketing page's initial JavaScript.
- Every required real-device matrix row has a recorded result or an explicit release-blocking issue.
- Unsupported devices receive specific, actionable explanations.
- Five minutes of app switching and recording remains smooth on supported reference devices.
- Repeated attempts do not show increasing retained memory beyond an explained stable bound.

### Anti-pattern guards

- Do not substitute desktop Chromium emulation for Android PiP acceptance.
- Do not use fixed sleeps or brittle CSS selectors in Playwright; use accessible roles, labels, and retrying assertions.
- Do not waive a failed production build because development mode works.
- Do not move deployment work into this phase; Trial 1 stops at a verified local production artifact.

## Definition of done

Trial 1 is complete when:

- All seven phases and the Phase 0 evidence gate are satisfied.
- The local production build passes automated checks.
- The reference Android device matrix proves the end-to-end creator workflow.
- The application contains no account, backend, database, cloud sync, third-party import, or Vercel deployment implementation.
- The teleprompter remains useful offline after initial page load and keeps all rendering and generated video local.
- Known browser/OEM limitations and initial duration guardrails are documented.
- Trial 2 can begin without reopening product implementation work from Trial 1.
