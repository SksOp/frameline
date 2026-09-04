# Product specification: Frameline / Teleprompter

## Status

- Product direction: approved for design and implementation
- Selected technical concept: client-side WebCodecs
- Selected application framework: Next.js App Router with React and TypeScript
- Initial deployment target: Vercel
- Initial platform: Android phones using a Chromium-based browser
- Distribution: website only; no packaged Android application

## Product horizon

Frameline is a local-first creator studio. Its first product, Teleprompter, is deliberately a client-side utility: open the tool, paste a script, configure it, and launch the floating teleprompter. It does not require an account or a backend.

The codebase must nevertheless be structured as the foundation of a broader creator product. Later releases should let creators:

- Create an account and sign in.
- Save, organize, search, duplicate, archive, and reuse scripts.
- Select a saved script and enter teleprompter mode immediately.
- Import scripts from external document, note-taking, storage, and creator tools.
- Use richer script formats containing styled sections, delivery cues, timing cues, reading-speed changes, emphasis, and reusable visual treatments.
- Synchronize scripts across devices while preserving a local-first path for teleprompter playback.

Future capabilities are product direction, not MVP commitments. The MVP must not require an account, network request, or cloud persistence to prepare and run a pasted script.

## Product summary

Creators enter a script on a website, configure its appearance and reading speed, and generate a compact scrolling-text video entirely on their phone. The website places that video into Android Picture-in-Picture. The creator can then open Instagram, Snapchat, TikTok, YouTube, or a camera application and read the floating script while recording there.

The product preserves the creator's freedom to use another application's camera, filters, lenses, publishing tools, and recording workflow.

## Why concept 2 won

Client-side WebCodecs gives the product the strongest combination of the project requirements:

- No Android package or special overlay permission
- No server-side video-rendering bill
- No script upload for video generation
- No FFmpeg-WASM payload
- Faster-than-real-time video generation
- A real video source that continues when browser JavaScript is backgrounded
- Repeat attempts without regenerating or downloading another file
- Speed changes through `HTMLVideoElement.playbackRate`
- One-frame-at-a-time worker encoding that keeps the interface responsive

Concept 1 was not selected because backend FFmpeg introduces infrastructure cost, queueing, data transfer, retention, monitoring, and scaling work. Concept 3 was not selected because a live canvas stream depends on background JavaScript, while its dependency-free pre-composition fallback is tied to wall-clock recording time.

## Target customer

The first customer is a phone-first creator who:

- Records directly in social or camera applications
- Wants to maintain eye contact while speaking from a script
- Does not want to install another application
- Wants several attempts at different speeds
- Values quick setup more than desktop-grade editing controls

## Primary job to be done

> When I am recording in my preferred phone application, help me read my script close to the camera without memorizing it, installing an app, or permanently downloading generated teleprompter videos.

## Product promise

From pasted script to a floating, reusable teleprompter in a short browser workflow.

## Non-goals for the first version

- A genuinely transparent or click-through Android overlay
- An iOS-first experience
- Guaranteed support for every Android browser
- Recording the creator's camera inside this website
- Server-side FFmpeg rendering
- Full video editing
- Automatic posting into social platforms
- Burning captions into the creator's final camera recording
- Accounts, billing, team workspaces, and cloud script libraries
- Third-party script imports
- Rich or programmable script documents

## Application framework decision

Use **Next.js App Router, React, and TypeScript**, deployed on Vercel.

Next.js is selected for the product trajectory rather than because the encoding pipeline needs a full-stack framework. The MVP teleprompter itself is a browser application, but the same product is expected to gain public marketing pages, authentication, saved scripts, protected application routes, integrations, and server-side data access. Next.js supports those concerns in one codebase and has a first-class Vercel deployment path.

### Rendering boundaries

- Keep the landing page, help pages, privacy information, and other public content as Server Components or statically rendered pages by default.
- Put the interactive teleprompter workspace behind a narrow Client Component boundary.
- Keep `window`, `localStorage`, Picture-in-Picture, WebCodecs, client `HTMLCanvasElement` painting, `VideoFrame`, and worker lifecycle code in client-only modules.
- Do not import browser-only encoding modules from Server Components.
- Load the encoder worker only when the user enters or prepares the teleprompter so the landing page does not pay its bundle cost.
- Keep video generation entirely on the device even after accounts and cloud storage are introduced.

### Suggested project shape

```text
app/
  (marketing)/           Landing, product, privacy, and documentation pages
  (app)/teleprompter/    Client-side editor, preview, generation, and PiP flow
components/
features/teleprompter/   UI and orchestration for the browser product
lib/scripts/             Versioned script domain model and validation
lib/client/              Browser-only storage and capability detection
workers/                 Encoding and muxing worker entry points
```

The precise folders can evolve, but the boundaries are important. Rendering and encoding should remain framework-independent TypeScript modules where practical, with React responsible for interface state and orchestration.

### MVP technology choices

- Next.js App Router
- React
- TypeScript in strict mode
- CSS Modules or a small token-based global CSS system; Tailwind CSS is optional, not an architectural requirement
- A dedicated module worker created with `new Worker(new URL(..., import.meta.url), { type: "module" })`
- A lightweight WebM muxing library that works in a browser worker
- IndexedDB for resilient local drafts and settings; `localStorage` only for small preferences
- Unit tests for layout, duration, and script-model logic
- Browser tests for the main workflow, plus mandatory manual testing on real Android devices

Do not add a separate API service, state-management framework, or database for the MVP without a concrete requirement. React state plus small feature-scoped modules is sufficient initially.

### Foundation for later expansion

Do not choose or implement authentication, a database, cloud storage, import providers, or a separate backend during the MVP. Those decisions belong to a later product and architecture phase.

The MVP only needs to preserve a clean path for that expansion:

- Keep the script document model independent from UI components and storage technology.
- Keep local persistence behind a small interface so cloud-backed persistence can be added later without rewriting the editor.
- Keep the teleprompter runtime local-first and able to run without a network connection.
- Keep import provenance in the future document model without committing to any particular integration.
- Avoid binding feature code to a specific future identity, database, or integration vendor.

### Why not begin with Vite alone

React with Vite would be a smaller fit for the client-only MVP, but it would require adding or integrating routing, server endpoints, authentication boundaries, and a separate backend architecture as the product grows. Given the stated roadmap and Vercel deployment target, starting with Next.js avoids an otherwise likely migration. This is a product-horizon tradeoff, not a claim that Next.js makes WebCodecs faster.

## Core user flow

1. The creator opens the HTTPS website on an Android phone.
2. The website checks PiP, Worker, `HTMLCanvasElement` 2D context, VideoFrame, and VideoEncoder support.
3. The creator pastes or writes a script.
4. The creator configures text and reading settings.
5. A normal browser preview shows the expected teleprompter.
6. The creator selects **Prepare floating teleprompter**.
7. The client builds one render plan, paints timestamped frames on an `HTMLCanvasElement`, and transfers them one at a time to a dedicated local encoding/muxing worker.
8. The UI shows progress and remains responsive.
9. The completed WebM is attached to a video through an in-memory Blob URL.
10. The creator selects **Open floating teleprompter**.
11. The website requests video Picture-in-Picture from the user's click.
12. The creator switches to their preferred recording application.
13. The video begins after a configured lead-in or when the creator presses play.
14. The creator can pause, restart, or return to the website and change speed.

## MVP features

### Script

- Paste or type plain text
- Preserve paragraph breaks
- Display word count
- Estimate reading duration
- Remember the current draft locally
- Clear the script explicitly

### Appearance

- Font size
- Line height
- Text color
- Background color
- Reading-window aspect ratio
- Horizontal padding
- Center reading guide
- Text alignment

The background is visually customizable but remains part of an opaque PiP video rectangle.

### Motion

- Reading speed expressed as words per minute in the product UI
- Immediate preview of the selected speed
- Configurable start delay
- Pause and resume
- Restart from the beginning
- Optional loop
- Reuse one encoded video across speed changes with `playbackRate`

### Generation

- Explicit progress
- Cancel generation
- Worker-based processing
- No script or video upload
- In-memory result
- Clear unsupported-browser explanation
- Retry after an encoding error

### Picture-in-Picture

- Enter PiP only after a user gesture
- Detect PiP support before generation
- Play/pause controls where Android exposes them
- Recover cleanly after PiP closes
- Preserve the generated video for repeated attempts during the session

## Technical architecture

```text
Main browser document
  ├── Script editor and controls
  ├── Capability detection
  ├── Shared text layout and preview
  ├── HTMLCanvasElement frame painting
  ├── VideoFrame creation and one-at-a-time transfer
  ├── Progress and cancellation
  └── HTMLVideoElement → Android Picture-in-Picture

Dedicated encoding worker
  ├── Receives one transferable VideoFrame at a time
  ├── VideoEncoder with bounded queue depth
  └── WebM muxer → transferable ArrayBuffer
```

### Main-thread responsibilities

- Own all user interaction
- Validate the script and configuration
- Perform capability checks
- Create and terminate the encoding worker
- Measure and wrap text once into a shared immutable render plan
- Paint each frame on an `HTMLCanvasElement`, create its timestamped `VideoFrame`, and transfer it to the worker
- Report worker progress
- Convert the returned buffer into a Blob URL
- Own the video element and PiP lifecycle
- Change `playbackRate` without regeneration
- Revoke obsolete Blob URLs

### Worker responsibilities

- Request and receive one transferable frame at a time
- Submit frames to one asynchronous VideoEncoder
- Apply encoder queue backpressure
- Insert regular keyframes
- Mux encoded chunks in timestamp order
- Transfer the final buffer without copying
- Respond to cancellation and release resources

## Rendering model

The animation is a deterministic vertical translation of laid-out text.

1. Normalize paragraphs and whitespace.
2. Measure words once using the selected font.
3. Wrap the script into immutable lines.
4. Calculate line positions and total content height.
5. For each frame, calculate scroll position from its timestamp.
6. Determine the first and last visible line.
7. Clear the compact video canvas.
8. Draw only visible lines and the reading guide.
9. Create a VideoFrame with an explicit microsecond timestamp.
10. Enqueue it for encoding and close the raw frame immediately.

This avoids repeating layout work for every frame.

## Frame-rate decision

The product target is **30 FPS**.

Concept 3 temporarily reduced generation to 12 FPS to shorten its processing time. That was useful as an experiment, but the resulting scrolling is not consistently smooth enough for a reading product, particularly with larger text or higher scroll speeds. The selected product must generate a true 30 FPS timeline unless device testing proves that an adaptive 24 FPS mode is visually equivalent.

Possible later optimization:

- Default: 30 FPS
- Battery-saver option: 24 FPS
- Never silently fall below the selected frame rate

## Video encoding

Initial target:

- Container: WebM
- Preferred codec: VP8 for broad Chromium encoding compatibility
- Resolution: begin with 900 × 300 and validate smaller PiP-oriented sizes
- Frame rate: 30 FPS
- Pixel format: opaque video; alpha is not required
- Latency mode: realtime for faster preparation
- Hardware acceleration: prefer when supported, then retry with the browser default
- Keyframe interval: approximately four seconds

Every device configuration must be checked using `VideoEncoder.isConfigSupported()` before encoding begins.

## Speed model

Encode one canonical scroll animation. Do not regenerate when the creator changes reading speed.

```text
playbackRate = selectedScrollSpeed / canonicalScrollSpeed
```

The product should keep playback rates within a tested quality range. If a requested speed would exceed that range, regenerate at a better canonical speed rather than creating visibly uneven playback.

## Long-script performance

Long scripts increase frame count, encoding work, output size, and memory use. Optimization order:

1. Layout once.
2. Render only visible lines.
3. Paint on a client `HTMLCanvasElement`, create a `VideoFrame`, and transfer only one frame at a time to the encoding worker.
4. Use one asynchronous encoder with bounded queue depth.
5. Prefer hardware acceleration but retain a portable configuration.
6. Transfer rather than copy the completed ArrayBuffer.
7. Avoid multiple encoder workers unless device profiling proves the encoder is not the bottleneck.
8. Investigate streaming muxer output or origin-private storage before supporting extremely long scripts.

A pool of frame workers is not the default architecture. Encoded chunks must be muxed in timestamp order, mobile hardware often exposes one effective encoder pipeline, and transferring many raw frames between workers can cost more than painting the small frame directly.

### Initial guardrails

- Warn when estimated output duration is unusually long.
- Provide a visible cancel action.
- Avoid retaining more than one generated Blob.
- Revoke the previous Blob URL before replacing it.
- Stop and close VideoEncoder when cancelled or failed.
- Start with a reasonable script-duration limit and raise it after device testing.

## Capability detection

Fast generation requires:

- HTTPS or another secure context
- Dedicated Worker
- `HTMLCanvasElement` 2D context
- VideoEncoder and VideoFrame
- A supported encoding configuration
- Video Picture-in-Picture

The UI must report these independently. It must not combine them into a generic “WebCodecs and worker support” error.

For local Android testing, use HTTPS or map the development port with ADB and open the site as phone-localhost.

## Browser strategy

The MVP targets current Chrome on Android. Other Chromium-based browsers are supported only after device validation.

If fast generation is unavailable:

1. Explain the exact missing capability.
2. Explain if the page is merely using insecure HTTP.
3. Offer the real-time MediaRecorder fallback only as an explicitly slower compatibility mode.
4. Do not silently upload the user's script to a backend.

Backend FFmpeg is not part of the selected product architecture.

## Privacy

- Script processing remains on the device.
- Generated video remains on the device.
- The result is stored in memory for the current session.
- No account is required for the MVP.
- No script text should be included in analytics or error reports.
- Local draft persistence must be disclosed and removable.
- Future cloud sync must be explicit, and the interface must distinguish a local-only draft from a synced script.
- Future third-party imports must request the narrowest practical access and explain what will be copied into the product.

## Future script model

Plain text is the MVP input, but it should be converted at the application boundary into a versioned internal document rather than passed around as an unstructured string. Version 1 can contain a single plain-text body while leaving room for later blocks and annotations.

Future rich scripts may support:

- Paragraph, heading, pause, stage-direction, and section blocks
- Inline emphasis, pronunciation notes, and non-spoken annotations
- Speed, timing, and delivery cues over a defined text range
- Per-section appearance or reusable theme references
- Import provenance and a link to the external source
- Schema version and migrations

The persisted format should be validated, deterministic, and independent of React components. Do not store arbitrary HTML or serialized editor state as the canonical script. The encoder should consume a normalized render plan derived from the document model, so richer editing does not require replacing the video pipeline.

## Studio and product-page direction

The Frameline studio home presents a focused collection without implying products that do not exist. The separate Teleprompter page leads directly into the no-account workflow and makes the current value concrete:

1. Paste a script.
2. Prepare it privately on the phone.
3. Open the teleprompter over the creator's preferred camera or social application.

It should state that scripts and generated video stay on the device for the MVP. It must also set expectations that Android Chrome is the initial supported platform and that the floating window is an opaque system Picture-in-Picture video, not a transparent overlay.

Future products and capabilities belong in documented direction, not empty catalog cards or promises on the live studio. Potential later work includes:

- A personal script library with sign-in and cross-device sync
- Imports from the tools creators already use
- Rich scripts with delivery cues, timed sections, and visual treatments
- Faster reuse of saved scripts across recording sessions

The roadmap copy must be presented as direction rather than as available functionality or a dated promise. The primary call to action remains **Paste your script**; a future waitlist is optional and must not block use of the MVP.

## Source availability, licensing, and contributions

The project intends to develop in public and accept community contributions. People and organizations may self-host it for their own personal or internal use, but may not offer the application to other people as a hosted, managed, or competing product.

That restriction is not compatible with the formal Open Source Definition, which requires free redistribution and does not permit this kind of field-of-use restriction. Product and repository copy should therefore use **source-available** or **public source**, not **open source**, unless the project later adopts an OSI-approved license.

### Recommended licensing direction

Use the **Elastic License 2.0 (ELv2)** for the application code, subject to legal review before publication. It permits people to read, use, modify, redistribute, and self-host the code for themselves or for internal organizational use. It prohibits them from providing the licensed software itself to third parties as a hosted or managed service and from removing licensing notices.

This matches the intended boundary: **self-host for yourself or your organization—yes; host it as a product for other users—no**. A lawyer should still review the chosen license against the final business model before publication.

Before accepting contributions, the repository should include:

- A `LICENSE` file containing the exact unmodified license text
- A `CONTRIBUTING.md` describing development, testing, review, and licensing expectations
- A code of conduct
- A lightweight contributor license agreement or developer certificate of origin, selected with legal advice, so the project can safely incorporate contributions and retain a coherent licensing path
- A trademark policy, because a code license alone does not define who may use the product name, logo, or brand
- A dependency policy ensuring third-party packages are compatible with the distribution model

Marketing should say **source-available and open to contributions**, not simply **open source**. No license notice should promise that cloning is impossible; licensing creates legal permissions and restrictions, not a technical barrier to copying public code.

## Failure states

The product needs specific messages for:

- Insecure HTTP context
- PiP unavailable or disabled
- VideoEncoder missing
- Canvas 2D context or client `VideoFrame` creation unavailable
- Unsupported codec configuration
- Encoder initialization failure
- Worker crash
- Memory pressure
- Generation cancelled
- PiP request rejected because it lacked a user gesture
- Another PiP window replacing this one

## Performance targets

Targets require validation on real phones:

- Main interface remains responsive throughout generation.
- Generation is meaningfully faster than playback duration on reference devices.
- Output is a stable 30 FPS video.
- The prepared video continues through five minutes of app switching and recording.
- Repeated attempts do not increase retained memory.
- Speed changes and restarts do not trigger regeneration.

Reference device tiers should include a current Pixel, a mid-range Samsung, and at least one lower-memory Android phone.

## Product acceptance criteria

The MVP is successful when a creator can:

1. Open the HTTPS website in supported Android Chrome.
2. Paste a representative script.
3. Prepare a 30 FPS teleprompter locally.
4. Open it in PiP.
5. Switch to Instagram, Snapchat, and the native Camera application.
6. Complete a recording while the teleprompter continues smoothly.
7. Retry at another speed without generating or downloading another video.
8. Close the session without leaving generated files in Downloads or Gallery.

## Test matrix

- Short, medium, and long scripts
- 24 and 30 FPS experiments, with 30 FPS as the acceptance target
- Low, medium, and high reading speeds
- Large and small fonts
- Pixel and Samsung phones
- Chrome foreground → PiP → Camera
- Chrome foreground → PiP → Instagram
- Chrome foreground → PiP → Snapchat
- Screen rotation
- PiP resize and movement
- Pause, resume, restart, and repeated attempts
- Lock/unlock and returning to Chrome
- Low-memory interruption
- Offline operation after the page is loaded

## Delivery phases

### Phase 1: product foundation

- Convert concept 2 into a maintainable application structure
- Define the visual design system
- Build the editor and responsive preview
- Move encoding into a dedicated worker
- Implement precise capability reporting

### Phase 2: reliable generation

- Implement the 30 FPS frame pipeline
- Add cancellation and progress
- Add codec/configuration probing
- Bound queue and memory usage
- Add Blob lifecycle management

### Phase 3: creator workflow

- Add lead-in, speed, restart, pause, and loop
- Add local draft persistence
- Refine PiP handoff instructions
- Add session recovery

### Phase 4: phone validation

- Run the Android device matrix
- Tune resolution, bitrate, and encoding configuration
- Establish script-duration guardrails
- Fix browser/OEM-specific behavior

## Open product questions

- What PiP aspect ratio gives the best eye line without hiding important camera controls?
- Should speed be configured in words per minute, pixels per second, or both?
- What is the maximum acceptable preparation time for a five-minute script?
- What script-duration limit is safe for mid-range phone memory?
- Is 900 × 300 necessary, or does a smaller frame preserve text quality in Android PiP?
- Should the video start immediately, after a countdown, or paused for manual start?
- Which Android Chromium browsers beyond Chrome should be formally supported?
