# Frameline design revamp plan

## Why this revamp exists

Frameline currently uses a neo-brutalist visual language across both the landing page and the teleprompter workspace. The style is energetic and noticeable, which helps the landing page speak to Gen Z and newer creators, but it is also deeply coupled to the first product: thick black borders, hard shadows, acid colors, squared geometry, and loud interaction states are repeated in global tokens, shadcn primitives, marketing styles, and product components.

That creates a scaling problem. Frameline is intended to grow from one teleprompter into a family of creator tools. A system built around one highly specific visual treatment will become noisy inside denser products, make new tools feel like variations of the same screen, and make future design changes expensive because the brand layer and the product-control layer are not sufficiently separated.

The goal is not to make Frameline generic or less appealing. The goal is to create a flexible creator brand with two coordinated modes:

- **Marketing mode:** expressive, memorable, motion-aware, and able to catch a young creator's attention.
- **Product mode:** calm, legible, accessible, and capable of supporting multiple tools and increasingly complex workflows.

Both modes should clearly belong to Frameline through shared typography, color logic, voice, iconography, and motion principles, without forcing every surface to use the same visual intensity.

## Final design decision

**Direction 03 — Human Canvas is finalized as the design direction for the Frameline revamp.**

The decision is based on its ability to feel young, memorable, and creator-focused without relying on neo-brutalist borders and shadows. Its warm, tactile marketing language has enough personality to attract new creators, while its guided product experience reduces visual pressure and makes the workflow easier to understand. It also gives Frameline room to grow into a family of tools by using reusable journey patterns rather than tying the brand to one teleprompter layout.

The revamp should adopt the following defining traits from `/3`:

- warm paper-like canvases rather than stark white or acid fields;
- coral as the primary action and brand signal, supported by sage and golden accents;
- expressive editorial typography for campaign headlines, paired with a neutral sans serif for product controls;
- soft, generous geometry and tactile overlapping compositions in marketing;
- a clear **Write → Practice → Record** product journey;
- progressive disclosure that shows one primary task at a time on phones;
- reassuring, human privacy and persistence language;
- motion that feels buoyant and helpful rather than mechanical or aggressive.

The preview is a direction, not a pixel-for-pixel production specification. During implementation, its visual character and guided hierarchy should be retained while the proven teleprompter behavior, accessibility, responsive requirements, and generated-video invariants remain authoritative.

## What will be reset

The revamp should begin from a controlled clean baseline rather than incrementally sanding down the current neo-brutalist system.

1. Create a git checkpoint before destructive work so the current implementation remains recoverable.
2. Inventory every import from `src/components/ui/` and map each primitive to its consuming feature.
3. Remove the current project-owned shadcn primitive catalog from `src/components/ui/`.
4. Reinitialize shadcn using its current default configuration and regenerate only the primitives required by live product flows.
5. Replace `src/app/globals.css` with a clean foundation: Tailwind/shadcn defaults, typography, accessibility defaults, semantic color roles, spacing, radii, elevation, and motion tokens.
6. Remove the current neo-brutalist styling from the landing page and teleprompter presentation layer.
7. Recompose the landing page and product shell with the selected design direction while preserving all application behavior.

This reset applies to presentation, not product logic. The reducer, persistence, rendering, WebCodecs worker, generated-output rules, cancellation, Picture-in-Picture behavior, and accessibility semantics must not be rewritten as part of the visual reset.

## Design-system architecture

The new system should have three layers.

### 1. Foundation

Stable primitives that can serve every future creator product:

- semantic colors such as canvas, surface, text, muted text, border, brand, accent, success, warning, and danger;
- a small type scale with display, heading, body, label, and numeric roles;
- spacing, radius, elevation, focus, and motion tokens;
- default shadcn components with product-neutral interaction states;
- accessibility rules for keyboard focus, reduced motion, contrast, touch targets, and 200% zoom.

### 2. Product shell

A shared creator-suite frame that can host Teleprompter and future products such as Captions, Clips, Scripts, or Planning. It should define product switching, navigation, document status, settings, mobile navigation, and a consistent action area without dictating each tool's internal workflow.

### 3. Expression

A marketing-only layer for campaign color, oversized type, graphic composition, richer motion, and product storytelling. Expression can evolve seasonally without requiring a redesign of product controls.

## Direction review record

Four isolated concept routes were created for comparison. Direction 03 is the selected direction; the others remain temporary references until the revamp is complete.

- `/1` — **Editorial Studio:** premium editorial typography, warm neutrals, and a confident cobalt signal. High brand range with a quiet product surface.
- `/2` — **Signal After Dark:** creator energy through dark surfaces, luminous mint, and restrained glow. Expressive without relying on brutalist borders.
- `/3` — **Human Canvas — SELECTED:** warm, tactile, approachable, and content-first. Uses color blocking, soft geometry, and a guided journey to stay youthful without becoming toy-like.
- `/4` — **Creator OS:** crisp, modular, and future-facing. A flexible suite architecture with a controlled spectral accent and the strongest multi-product framing.

The previews are intentionally self-contained. They do not modify the current landing page, teleprompter behavior, global tokens, or shadcn components.

## Recommended execution sequence

### Phase 1 — Codify Human Canvas

- Use `/3` as the approved visual and interaction reference.
- Rewrite `design.md` as the source of truth for the Human Canvas foundation, marketing expression, guided product journey, and future product shell.
- Translate the concept palette, typography, geometry, depth, illustration, and motion into semantic tokens rather than copying page-specific values.
- Define token names and component-state specifications before changing live screens.

### Phase 2 — Reset the foundation

- Make the recovery checkpoint.
- Record the current primitive/import inventory.
- Remove and reinitialize the shadcn catalog.
- Establish the new global tokens and neutral base styles.
- Add a small visual test route for primitive states: default, hover, focus-visible, active, disabled, invalid, loading, and dark mode where applicable.

### Phase 3 — Rebuild the product shell first

- Migrate the teleprompter header, writing surface, practice preview, preparation action, settings, alerts, and status feedback into the Human Canvas system.
- Express the workflow as **Write → Practice → Record**, using progressive disclosure on phones and an efficient expanded arrangement on larger screens.
- Preserve every existing capability and behavioral contract even when controls move into the new journey.
- Verify narrow portrait, landscape, desktop, browser chrome changes, touch reachability, and 200% text zoom.
- Confirm preview and generated-video visual parity remains unchanged.

Building the product first proves that the system can carry real density. It also prevents a highly expressive landing page from accidentally dictating unsuitable product controls.

### Phase 4 — Rebuild marketing expression

- Rework the landing page around Human Canvas's warm, overlapping, tactile expression.
- Keep the benefit-led creator voice, immediate product demonstration, privacy proof, and strong call to action.
- Make motion purposeful and reduced-motion safe.
- Present Frameline as an expandable creator-tool brand, while keeping Teleprompter the clear current product.

### Phase 5 — Consolidate and remove the previews

- Extract only proven shared patterns into reusable components.
- Remove legacy tokens, legacy CSS, and unused shadcn packages or primitives.
- Update metadata and social artwork if the chosen brand direction changes them.
- Keep `/1`–`/4` during implementation as visual references, then remove or gate them before release.

## Acceptance criteria

- The landing page remains distinctive and creator-focused without depending on neo-brutalism.
- The finished visual language is recognizably derived from Human Canvas: warm canvas, coral/sage/gold signals, editorial display type, soft geometry, and tactile composition.
- The teleprompter feels calmer than marketing while unmistakably belonging to the same brand.
- The product journey clearly communicates Write, Practice, and Record without removing expert control or hiding necessary status.
- A second creator product can fit into the shell without inventing a new navigation or control language.
- Brand expression can change without rewriting core product primitives.
- All controls have complete pointer, keyboard, touch, disabled, and error states.
- Primary actions remain reachable on phone without unnecessary scrolling.
- Existing script, persistence, preview, encoding, playback, cancellation, and Picture-in-Picture behavior is unchanged.
- Typecheck, unit tests, lint, Playwright, production build, and real Android Chrome release checks pass.

## Implementation guardrails

- Do not dilute Human Canvas into generic beige SaaS minimalism; coral, sage, gold, editorial type, and authored composition are part of the decision.
- Do not turn every product element into a decorative card. Cards should communicate a step, object, or contained action—not merely decorate layout.
- Do not bring back heavy black borders, hard offset shadows, or acid color as recurring structural devices.
- Do not copy the `/3` mockup when it conflicts with real product behavior. Adapt the selected system to the existing reducer, rendering, persistence, encoding, and Picture-in-Picture contracts.
- Keep future creator tools in mind when naming tokens and shell components. Avoid names tied only to teleprompter concepts when the role is shared.
- Keep `/1`–`/4` available during implementation for historical comparison, but treat `/3` as the only approved target.
