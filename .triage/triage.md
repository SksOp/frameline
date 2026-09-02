# Teleprompter development trials

## Purpose

This file is the program-level implementation path for the product described in [`../product.md`](../product.md). It defines the goal, boundary, and completion gate for each trial without duplicating the detailed phase plan inside that trial.

Only Trial 1 has a detailed plan today, in [`triage_1.md`](triage_1.md). Trial 2 and Trial 3 should receive their own plan files only when the product is ready to enter them.

## Sequence

```text
Trial 1: complete client-side product
    ↓ proven locally on supported Android devices
Trial 2: production delivery on Vercel
    ↓ stable public release
Trial 3: accounts, saved scripts, imports, and backend product
```

Each trial is a decision gate. Work from a later trial must not leak into an earlier one merely because the framework can support it.

## Shared product principles

- The teleprompter rendering and video generation path remains on the creator's device.
- The first usable product requires no account, backend, upload, or network request after the page is loaded.
- Android Chrome is the initial supported runtime.
- Product claims are proven on real phones, not inferred from desktop browser tests.
- Mobile-first is a release requirement, not a later optimization: every public and application screen must remain highly responsive across narrow Android phones, orientation changes, text zoom, display scaling, and wider screens without horizontal overflow.
- Browser-only APIs stay behind focused client boundaries; public content remains static or server-rendered by default.
- The script domain model stays independent from React, storage vendors, and future backend decisions.
- The public codebase is source-available under the licensing direction in `product.md` and is open to contributions.

## Trial 1 — Final client-side application

### Goal

Turn the selected WebCodecs concept into the complete, maintainable client-only product. This trial establishes the Next.js application, shadcn/ui component foundation, visual language, landing page, full teleprompter experience, dedicated encoding worker, local persistence, and verification on supported Android devices.

### Included

- Next.js App Router, React, strict TypeScript, and local quality tooling
- The complete official shadcn/ui component catalog installed as owned `base-nova` source for consistent long-term reuse
- Product-specific design tokens, responsive behavior, accessibility rules, and a design guide
- Public landing page with the immediate no-account workflow and restrained future direction
- Search metadata and branded Open Graph/social-sharing imagery
- Script editor, settings, preview, capability reporting, progress, cancellation, errors, and session recovery
- Client `HTMLCanvasElement` painting and `VideoFrame` creation, with one transferable frame at a time sent to a dedicated WebCodecs/WebM encoding worker
- HTML video playback and Android Picture-in-Picture lifecycle
- IndexedDB draft persistence and small local preferences
- Unit, integration, browser, performance, memory, and real-device validation

### Explicitly excluded

- Vercel project creation or production deployment
- Custom domain, production analytics, monitoring, or launch operations
- Authentication, accounts, database, cloud storage, billing, or team workspaces
- Third-party imports or synchronization
- A final architecture choice for any Trial 3 capability

### Completion gate

Trial 1 is complete only when the production build passes locally and the acceptance flow in `product.md` succeeds on the reference Android device tiers without uploads, server APIs, or retained generated files. Detailed execution is defined in [`triage_1.md`](triage_1.md).

## Trial 2 — Vercel delivery and public release

### Goal

Take the verified client-side build from Trial 1 and operate it as a reliable HTTPS website on Vercel.

### Expected scope

- Create and configure the Vercel project from the repository
- Establish preview and production deployment behavior
- Configure the production domain, HTTPS, caching, security headers, and browser policy headers
- Verify worker assets, WebAssembly-free encoding dependencies, Blob URLs, and PiP behavior in the deployed origin
- Define privacy-safe analytics and error reporting that never include script text
- Add production smoke tests, release checks, rollback instructions, and operational ownership
- Validate real-device flows against preview and production deployments

### Entry gate

Trial 1 is complete, the local production build is reproducible, and the client product has passed the phone acceptance matrix.

### Completion gate

The public HTTPS deployment passes the product acceptance criteria, has an understood rollback path, and exposes no script or generated-video content through logging or telemetry.

### Planning rule

Do not create `triage_2.md` until Trial 1 is close to its completion gate. Deployment details must be researched against the Vercel and Next.js versions used by the finished application.

## Trial 3 — Full creator product

### Goal

Expand the working teleprompter into a creator platform with identity, a reusable script library, cross-device continuity, imports, and structured scripts.

### Product direction

- User sign-in and account lifecycle
- Saved, organized, searchable, and versioned scripts
- Cross-device script access with a clear local-only versus synced state
- Imports from creator-selected external tools
- Rich script structures with sections, delivery cues, timing, emphasis, and visual treatments
- A fast path from a saved script into the same local-first teleprompter runtime

### Decisions deliberately deferred

- Authentication provider and identity architecture
- Database and storage technology
- Backend/runtime topology
- Integration providers and authorization model
- Billing, plans, collaboration, and organization model
- Rich-text editor technology

### Entry gate

Trial 2 is stable in production and there is validated user evidence for the first server-backed capability.

### Completion gate

Trial 3 will define its own measurable release gate when its scope is selected. The current roadmap does not pretend those later architecture decisions are settled.

### Planning rule

Do not create `triage_3.md` until the first server-backed product slice has been chosen from user evidence.

## Change control

- Update this file when a trial boundary or product-level dependency changes.
- Put executable tasks, exact file changes, and phase verification in the corresponding numbered plan.
- Do not expand Trial 1 to absorb a Trial 2 or Trial 3 concern; record it here and defer it.
- Re-read current official documentation at the start of every trial because framework, browser, and hosting behavior can change.
