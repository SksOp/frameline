# Frameline design system

This file is the source of truth for Frameline's visual language. The approved direction is energetic, graphic, creator-first, and intentionally unlike generic productivity software. It pairs acid color, heavy black structure, playful movement, and concise copy with a calm, trustworthy product workflow.

## Design principles

1. **Creator energy, utility discipline.** Marketing can be loud; the teleprompter must remain focused. Both surfaces share color, type, geometry, and motion, but the product workspace uses them with less visual noise.
2. **Confidence over polish theater.** Prefer bold hierarchy, useful labels, visible controls, and immediate feedback over glassy decoration or stacked cards.
3. **Physical digital objects.** Controls should feel pressable. Use hard offset shadows, clear borders, small translations, and immediate active states.
4. **Motion communicates state.** Continuous motion is reserved for expressive marketing moments and live status. Product motion should explain a transition, response, or system state.
5. **Private by default.** Privacy language is direct and specific: on-device, no account, no upload. Never imply unsupported security or storage behavior.
6. **Phone-first, not phone-only.** Every control must work at narrow portrait widths, in landscape, at desktop sizes, with browser chrome changes, and at 200% text zoom.

## Visual character

The system is neo-brutalist without becoming hostile: thick ink borders, squared or lightly rounded geometry, offset shadows, saturated blocks, oversized display type, and mono utility labels. Avoid beige editorial minimalism, generic SaaS gradients, excessive glassmorphism, and decorative card stacks.

### Core palette

Core colors are semantic variables in `src/app/globals.css`:

- `--fl-ink`: near-black structure, text, and dark surfaces.
- `--fl-lime`: the primary brand field and high-energy action color.
- `--fl-pink`: expressive accent and hard-shadow color.
- `--fl-violet`: secondary accent, focus, and selected-state color.
- `--fl-paper`: low-noise workspace and content background.
- `--fl-white`: high-contrast text and controls on dark or violet surfaces.
- `--fl-positive`, `--fl-warning`, and `--fl-danger`: product status colors.

Use shared variables for brand colors, interactive states, surfaces, text, borders, focus, and product status. A small one-off illustration shade may remain a literal inside tightly scoped CSS when promoting it to a token would make the palette harder to understand. Do not duplicate a recurring color literal across files.

### Typography

- **Display:** `Inter Variable`, very heavy (850–1000), tight tracking, compact line height, often uppercase.
- **Utility:** `Roboto Mono Variable`, 600–900, uppercase, short labels, metadata, counters, and status.
- **Editorial accent:** `Newsreader Variable` only when a warmer human voice is useful; never as the dominant product UI face.
- **Body:** `Inter Variable`, 450–700, readable line heights, sentence case.

Headlines should feel authored. Use short phrases, hard line breaks, outline-to-fill treatments, or a controlled skew. Do not sacrifice legibility for novelty.

### Geometry and depth

- Brand borders are usually 2–3px solid `--fl-ink`.
- Primary marketing buttons and featured objects use hard offset shadows, normally 6–12px.
- Product controls use smaller 3–5px offsets so the workspace stays compact.
- Use square corners or 8–14px radii for most elements. Reserve pills for compact status and binary controls.
- Avoid soft ambient shadows as the only depth cue. They may support, but not replace, the hard structural shadow.

## Interaction and motion

### Required control behavior

Every actionable control needs visible default, hover, focus-visible, active, and disabled states.

- **Hover:** translate 2–4px against the shadow, change accent, or move the icon.
- **Active:** compress the hard shadow and move toward it, creating a pressed effect.
- **Focus-visible:** use a high-contrast violet or lime outline with at least 3px thickness and an offset.
- **Disabled:** keep labels readable, remove motion, and reduce contrast without making the control disappear.
- **Touch targets:** at least 44×44 CSS pixels wherever practical.

Hover is enhancement only. Essential content and actions must remain understandable without it.

### Continuous motion

Marketing may use looping headline fills, slow object floats, scrolling marquees, and restrained geometric movement. Loops should have different durations to avoid mechanical synchronization. Pausing a marquee on hover is encouraged.

The teleprompter workspace should not continuously move except for the actual scrolling preview, reading progress, preparation status, or another live state. Preview animation must pause during encoding.

All nonessential animation must stop under `prefers-reduced-motion: reduce`. The underlying content must remain visible and usable.

## Marketing surface

- Lead with an assertive creator benefit, not a feature inventory.
- The primary hero treatment is the approved “Talk like you mean it” outline-to-fill animation.
- Use a graphic phone/teleprompter demonstration rather than stock photography.
- Use an angled creator-use marquee to transition from hero to product explanation.
- Feature cards may tilt and deepen their shadows on hover, but their information cannot depend on hover.
- Copy should be contemporary without trying too hard: specific, concise, and useful. Avoid unexplained slang or promises the product cannot meet.

## Teleprompter surface

The workspace keeps its existing workflow and information architecture:

1. Write or paste the script.
2. Preview and tune its reading behavior.
3. Prepare the video locally.
4. Launch Picture-in-Picture and switch to the camera.

Visual migration must not change reducer actions, persistence, preparation behavior, encoding, playback, keyboard behavior, or accessibility semantics.

- Use `--fl-paper` as the calm base and reserve lime, pink, and violet for navigation, selection, focus, and primary actions.
- Keep the script and preview as the dominant panes; do not bury them inside decorative cards.
- The dock remains reachable without scrolling and uses clear selected, stale, generating, ready, and disabled states.
- Settings use compact bordered rows, strong output values, tactile sliders/switches, and the same responsive dialog/drawer behavior.
- The preview's user-selected text/background colors remain authoritative and must not be replaced by brand colors.

## UI primitives and migration protocol

`src/components/ui/` is the project-owned primitive catalog. Only migrate a primitive when a real product surface begins using it. Do not restyle the entire catalog speculatively.

The primitives currently migrated for the marketing and teleprompter surfaces are:

- `alert.tsx`
- `badge.tsx`
- `button.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `hover-card.tsx`
- `native-select.tsx`
- `slider.tsx`
- `switch.tsx`
- `textarea.tsx`

Every migrated primitive must begin with this exact marker:

```ts
// DESIGN SYSTEM: Migrated to the current design.md.
```

An unmarked primitive is not migrated. Before using one in application code, migrate all of its visual and interactive states to this guide, add the marker, and verify it in the consuming surface. When a migrated primitive imports another primitive, that dependency must also be migrated and marked.

## Verification checklist

- Verify narrow portrait, landscape, desktop, browser chrome changes, and 200% text zoom.
- Verify keyboard focus, pointer hover/press, touch targets, disabled states, and screen-reader labels.
- Verify reduced motion.
- Verify that the primary product actions stay reachable.
- Verify that script persistence, settings, preview timing, video preparation, playback, cancellation, and Picture-in-Picture behavior remain unchanged.
- Run typecheck, unit tests, lint, Playwright tests, and the production build. Real Android Chrome remains the release gate for WebCodecs and Picture-in-Picture.
