export interface Capability { key: string; label: string; supported: boolean; recovery: string }

export async function detectCapabilities(): Promise<Capability[]> {
  const encoder = "VideoEncoder" in globalThis;
  let codec = false;
  if (encoder) {
    try {
      const result = await VideoEncoder.isConfigSupported({ codec: "vp8", width: 900, height: 300, framerate: 30, bitrate: 1_500_000 });
      codec = result.supported === true;
    } catch { codec = false; }
  }
  return [
    { key: "secure", label: "Secure connection", supported: globalThis.isSecureContext, recovery: "Open this site over HTTPS (or localhost)." },
    { key: "worker", label: "Background worker", supported: "Worker" in globalThis, recovery: "Update Chrome for Android." },
    { key: "canvas", label: "Offscreen canvas", supported: "OffscreenCanvas" in globalThis, recovery: "Update Chrome for Android." },
    { key: "encoder", label: "Video encoder", supported: encoder && "VideoFrame" in globalThis, recovery: "This device does not expose WebCodecs. Try current Chrome for Android." },
    { key: "codec", label: "VP8 encoding", supported: codec, recovery: "Your device cannot encode the required VP8 video." },
    { key: "pip", label: "Picture-in-Picture", supported: "pictureInPictureEnabled" in document && document.pictureInPictureEnabled, recovery: "Enable Picture-in-Picture for Chrome in Android settings." },
  ];
}
