# Frameline

Frameline is a local-first creator studio for focused tools that work without an account. Its first product, **Teleprompter**, is a private floating teleprompter for current Android Chrome. Script layout, video encoding, and the generated WebM stay on the device.

## Routes

- `/` — Frameline studio home
- `/products` — the creator-tool collection
- `/teleprompter` — Teleprompter product and support information
- `/teleprompter/app` — the working teleprompter
- `/daily-prompter` and `/daily-prompter/app` — permanent compatibility redirects

## Runtime

- Node.js 24.14.1 (minimum supported by the project: 20.9)
- npm 11.11.0
- Next.js App Router with the webpack production build path, selected because the module worker pipeline is explicitly verified there

## Commands

```bash
npm ci
npm run dev       # http://localhost:4444
npm run lint
npm run typecheck
npm test
npm run build
```

Open Graph, canonical, and sitemap URLs use `https://frameline.sksop.in` by default. Set `NEXT_PUBLIC_SITE_URL` to override that origin (for example a preview or ngrok HTTPS URL). Localhost is never published as `metadataBase`, because crawlers cannot fetch it and treat the share tags as missing.

## Privacy and local data

The current draft is saved in IndexedDB and small display preferences in localStorage. The Clear action removes the draft. Generated video is held in one in-memory Blob URL and revoked on replacement or cleanup.

## Android acceptance record

Real WebCodecs/Picture-in-Picture acceptance remains a physical-device release gate. Record device, Android version, Chrome version, VP8 support, script length, preparation time, output size, continuity through Camera/Instagram/Snapchat, rotation, lock/unlock, and repeated-attempt memory for a current Pixel, mid-range Samsung, and lower-memory Android device.
