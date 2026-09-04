# Frameline development trials

## Purpose

This file is the program-level path for Frameline. It records the outcome, boundary, and completion gate for each trial without duplicating the detailed execution plan inside that trial's numbered file.

Frameline began with one local-first teleprompter. Its broader direction is now a private creative studio: a bookmark-worthy collection of focused tools that creators can open and use immediately. **Frameline is the umbrella brand; each tool has its own clear product name and job.**

Trial 1 and Trial 2 are complete. Trial 3 is the next product transition. Its reviewed execution plan is documented in [`triage_3.md`](triage_3.md), including the selected Human Canvas design direction.

## Sequence and status

```text
Trial 1: final client-side teleprompter                    COMPLETE
    ↓ proven local product
Trial 2: Vercel delivery and public release               COMPLETE
    ↓ stable public foundation
Trial 3: Frameline creator-studio foundation              NEXT
    ↓ one proven tool in a foundation designed to grow
Trial 4: optional accounts, sync, and connected benefits  DEFERRED
```

Each trial is a decision gate. Later capabilities must not leak into the current trial merely because the framework can support them.

## Shared product principles

- **Frameline is the studio, not the teleprompter.** Product surfaces and copy must leave room for multiple creator tools.
- **Tools are named by the job they do.** The existing teleprompter becomes **Daily Prompter** in user-facing product language. The planned animated-code tool uses **Code Animator** as its working name until naming is validated.
- **The useful default never requires an account.** A creator can open a tool, do the core job, and export or use the result without signing in, joining a waitlist, or starting a trial.
- **Accounts may add convenience, never permission.** Future identity can provide benefits such as sync, backup, reusable libraries, or cross-device continuity, but must not unlock the basic ability to use a tool.
- **Private and local-first where technically possible.** Inputs and generated outputs stay on the creator's device unless the creator explicitly chooses a feature that requires transfer or sync.
- **No artificial output restrictions.** Frameline should not use watermarks, intentionally degraded exports, or arbitrary project limits to force registration. Genuine device or browser constraints must be explained honestly.
- **Focused tools over an all-in-one editor.** Each product should solve one creator job well, open quickly, and keep its own workflow understandable.
- **The collection must feel coherent.** Tools share Frameline's visual language, navigation, privacy posture, quality bar, and interaction principles without being forced into one oversized workspace.
- **Public routes remain server-rendered by default.** Browser-dependent editing, rendering, encoding, persistence, and export behavior stay behind focused client boundaries.
- **Phone-first remains a release requirement.** Public and product surfaces must work across narrow portrait, landscape, desktop, browser chrome changes, safe-area insets, and 200% text zoom.
- **Claims are proven.** Browser capabilities, local processing, supported exports, and device compatibility must be verified rather than implied by marketing copy.
- **The public codebase remains source-available and open to contributions** under the licensing direction in `product.md`.

## Product architecture

Frameline has three distinct layers:

1. **Studio layer — Frameline**
   The shared brand, home page, product discovery, navigation, principles, trust language, and future cross-tool conveniences.
2. **Product layer — named creator tools**
   Independent product pages that explain one job, show its output, state its limitations, and lead directly into the tool.
3. **Tool layer — focused workspaces**
   Local-first interactive experiences such as Daily Prompter and Code Animator. A creator should be able to deep-link directly to a tool without navigating through a dashboard or account flow.

“A creator's bookmark” is the product test for this architecture: Frameline should become a site creators remember and revisit because it contains small, trustworthy tools that remove recurring friction. It is positioning, not a requirement to build a literal browser-bookmark manager.

## Trial 1 — Final client-side application

**Status: complete**

### Outcome

Delivered the maintainable, client-side teleprompter: Next.js foundation, project-owned design system, marketing page, local draft and setting persistence, responsive editor and preview, dedicated WebCodecs/WebM worker pipeline, prepared-video playback, and Picture-in-Picture workflow.

### Preserved boundary

The teleprompter runtime remains on-device and usable without an account, backend, upload, or retained generated file. Its detailed implementation history remains in [`triage_1.md`](triage_1.md).

## Trial 2 — Vercel delivery and public release

**Status: complete**

### Outcome

Delivered Frameline as a public HTTPS website on Vercel with the production origin, search and social metadata foundation, deployable worker assets, and a public path into the teleprompter experience.

### Preserved boundary

Production delivery does not change the local processing promise. Script text and generated teleprompter video are not product data for a server, account, analytics event, or logging pipeline.

## Trial 3 — Frameline creator-studio foundation

**Status: next**

### Goal

Reposition Frameline from “a teleprompter product” to “a private creative studio made of focused tools,” then prove that positioning with a coherent discovery experience, one proven launch product, and a foundation that can add tools without another redesign.

### Expected scope

#### Brand and product language

- Keep **Frameline** as the umbrella brand.
- Stop using Frameline and teleprompter as interchangeable product names.
- Introduce **Daily Prompter** as the user-facing name of the existing teleprompter.
- Use **Code Animator** as the working name for the animated-code product until the Trial 3 plan completes naming and demand validation.
- Define one durable Frameline promise around immediate, private, no-account creative work.
- Update the product specification, README, design guidance, contributor rules, page metadata, social cards, and in-product language so they describe the same portfolio architecture.

#### Information architecture

- Rebuild the root landing page as the Frameline studio home rather than a single-product sales page.
- Add a browsable products/tools index that feels intentional with one live tool and can grow without becoming a cluttered marketplace.
- Give every tool a dedicated public product page with its job, example output, privacy model, supported platforms, limitations, and direct launch action.
- Keep product explanation separate from the focused tool workspace.
- Establish shared navigation between the studio home, product pages, and tool workspaces without introducing a required dashboard.
- Define stable, descriptive URLs and a redirect policy before renaming or moving the existing `/teleprompter` route.
- Extend the sitemap, canonical metadata, Open Graph output, robots policy, and structured product copy for the multi-product site.

#### Daily Prompter transition

- Preserve the working teleprompter behavior, local persistence, encoder pipeline, and Android Picture-in-Picture flow.
- Rename the user-facing product to Daily Prompter without presenting a risky technical rewrite as part of the rebrand.
- Add a Daily Prompter product page that explains the workflow and then launches the existing tool directly.
- Preserve old public links through redirects or a compatibility route when the final URL is selected.
- Keep Daily Prompter's Android Chrome and opaque Picture-in-Picture limitations explicit.

#### Future Code Animator product

- Keep Code Animator as a candidate for the next tool, not a placeholder product shipped during the foundation revamp.
- Do not advertise it as available, add a nonfunctional product page, or load speculative runtime code.
- Preserve room in the product catalog, route conventions, design system, and feature boundaries so it can be validated and implemented later without restructuring the studio.
- When it is selected for implementation, give it a separate evidence-backed plan covering its local input-to-preview-to-export contract, browser rendering research, privacy boundary, and practical export format.

#### Shared multi-product foundation

- Separate shared studio concerns from product-specific feature code. Daily Prompter and Code Animator should not depend on each other's reducers, browser resources, or persistence schemas.
- Reuse the project-owned design primitives and shared tokens; add new primitives only through the migration protocol in `design.md`.
- Define a small typed product catalog for shared public metadata and navigation without turning content into a backend requirement.
- Give each local tool its own versioned storage keys, cleanup controls, capability reporting, and output lifecycle.
- Keep heavy browser code out of the studio home and product pages. Load product runtimes only inside their focused workspaces.
- Add portfolio-level accessibility, responsive, performance, metadata, and browser-test coverage alongside product-specific tests.

### Explicitly excluded

- Required authentication, account creation, or onboarding before tool use
- A cloud dashboard as the default entry point
- Database, cloud project storage, cross-device sync, team workspaces, or billing
- Social publishing integrations or automatic posting
- Executing user-provided code
- Server-side rendering of private creator inputs or generated media as a fallback
- Launching a large catalog of shallow placeholder tools
- Rebuilding the proven Daily Prompter engine merely to match the new naming
- Choosing Trial 4 vendors or architecture in advance

### Entry gate

- Trial 1 and Trial 2 are complete.
- The current public teleprompter flow has a known baseline that can be protected during the portfolio transition.
- Daily Prompter has a concise job statement, known behavioral baseline, and protected automated tests before implementation scope is locked.

### Completion gate

Trial 3 is complete when:

- A new visitor can understand within the first screen that Frameline is a collection of creator tools, not the name of one teleprompter.
- Daily Prompter has a dedicated product page and a working, directly accessible tool.
- Daily Prompter completes its default core job without account creation, upload, watermark, or artificial output restriction.
- The studio catalog and route architecture can add a second product without changing the Daily Prompter URLs, global navigation, or shared foundation.
- Existing teleprompter links and saved local data survive the user-facing rename.
- Studio navigation, product discovery, metadata, responsive behavior, accessibility, reduced motion, and performance pass automated and manual checks.
- Privacy and capability claims are accurate for each product, including real-device verification where browser media APIs are involved.
- The landing and product pages do not ship either tool's heavy runtime code before the creator opens that tool.

### Planning rule

Do not implement Trial 3 from this roadmap alone. Execute it from [`triage_3.md`](triage_3.md). That detailed plan begins with documentation and product-evidence discovery, resolves the launch names and URLs, lists exact file changes, and splits the work into independently verifiable phases. Code Animator requires its own later plan when it becomes an active product rather than a speculative placeholder.

## Trial 4 — Optional accounts, sync, and connected benefits

**Status: deferred**

### Goal

Add identity only where it provides clear convenience across Frameline products while preserving immediate, no-account use of every default tool.

### Product direction

- Optional sign-in and account lifecycle
- Explicit local-only versus synced project state
- Saved, organized, searchable, and versioned scripts or creative projects
- Cross-device continuity, backup, reusable presets, templates, and brand kits
- Creator-selected imports from external tools using narrowly scoped authorization
- Rich Daily Prompter scripts with sections, delivery cues, timing, emphasis, and visual treatments
- Shared libraries that speed up repeat work without becoming a gate in front of the tools

### Decisions deliberately deferred

- Authentication provider and identity architecture
- Database, object storage, and synchronization model
- Backend/runtime topology
- Integration providers and authorization model
- Billing, plans, collaboration, and organization model
- Rich-text editor technology

### Entry gate

Trial 3 is stable in production and creator evidence identifies a specific cross-device or connected benefit worth the privacy, operational, and maintenance cost.

### Completion gate

Trial 4 will define measurable release gates when its first connected slice is selected. No account feature is complete if signing out removes access to the default local tool workflow.

### Planning rule

Do not create `triage_4.md` until user evidence selects the first connected capability. Do not choose vendors merely to make the repository look ready for accounts.

## Change control

- Update this file whenever a trial boundary, status, or product-level dependency changes.
- Put executable tasks, exact file changes, documentation references, and phase verification in the corresponding numbered trial plan.
- Protect completed Trial 1 and Trial 2 behavior while Trial 3 changes positioning and information architecture.
- Do not let Trial 4 identity or storage concerns become hidden prerequisites for Trial 3 tools.
- Re-read the repository's installed Next.js documentation and current browser documentation at the start of every implementation trial.
