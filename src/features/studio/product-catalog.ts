export type StudioSolutionTag = "focused" | "private" | "client-side" | "immediate" | "free";
export type ProductArtKind = "prompt" | "code" | "clip" | "icon-motion";

type StudioProductBase = Readonly<{
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  artKind: ProductArtKind;
  solutionTags: readonly StudioSolutionTag[];
}>;

export type AvailableStudioProduct = StudioProductBase & Readonly<{
  availability: "available";
  productHref: `/${string}`;
  appHref: `/${string}/app`;
  platform: string;
  privacy: string;
  workflow: readonly [string, string, string];
  requirements: readonly string[];
  limitations: readonly string[];
}>;

export type ComingSoonStudioProduct = StudioProductBase & Readonly<{
  availability: "coming-soon";
  direction: string;
  productHref?: never;
  appHref?: never;
}>;

export type StudioProduct = AvailableStudioProduct | ComingSoonStudioProduct;

export const studioProducts: readonly StudioProduct[] = [
  {
    slug: "teleprompter",
    name: "Teleprompter",
    category: "On-device prompting",
    summary: "Keep your script near the lens while your phone camera stays yours.",
    description:
      "A focused teleprompter for Android Chrome that prepares a floating prompt video entirely in your browser.",
    availability: "available",
    artKind: "prompt",
    solutionTags: ["focused", "private", "client-side", "immediate", "free"],
    productHref: "/teleprompter",
    appHref: "/teleprompter/app",
    platform: "Android Chrome",
    privacy: "No account. Scripts and generated video stay on your device.",
    workflow: ["Write", "Practice", "Record"],
    requirements: [
      "A current version of Chrome on Android",
      "Browser support for WebCodecs and Picture-in-Picture",
      "Permission to place the prepared prompt video in Picture-in-Picture",
    ],
    limitations: [
      "Android controls the final Picture-in-Picture window size, position, and opacity.",
      "Browser and device support can vary; desktop emulation does not prove phone compatibility.",
      "The tool prepares a prompt video but does not record your camera or upload media.",
    ],
  },
  {
    slug: "code-animator",
    name: "Code Animator",
    category: "Motion for code",
    summary: "Turn code into clear motion for demos, launches, and tutorials.",
    description: "A focused direction for shaping code snippets into polished, shareable motion.",
    availability: "coming-soon",
    artKind: "code",
    solutionTags: ["focused", "client-side", "immediate"],
    direction: "Exploring a local input-to-preview-to-export workflow.",
  },
  {
    slug: "gif-mp4-extractor",
    name: "GIF / MP4 Extractor",
    category: "Fast clip extraction",
    summary: "Pull the moment you need into a shareable GIF or MP4.",
    description: "A lightweight direction for extracting a useful clip without opening a heavyweight editor.",
    availability: "coming-soon",
    artKind: "clip",
    solutionTags: ["focused", "private", "client-side"],
    direction: "Format support and export controls will be defined before implementation.",
  },
  {
    slug: "icon-animation-extractor",
    name: "Icon Animation Extractor",
    category: "Reusable motion assets",
    summary: "Isolate the icon motion you need for the rest of your workflow.",
    description: "A focused direction for turning small interface motion into a reusable asset.",
    availability: "coming-soon",
    artKind: "icon-motion",
    solutionTags: ["focused", "client-side"],
    direction: "Inputs, outputs, and browser support remain product-discovery questions.",
  },
];

export function isAvailableProduct(product: StudioProduct): product is AvailableStudioProduct {
  return product.availability === "available";
}

export const availableProducts = studioProducts.filter(isAvailableProduct);
export const comingSoonProducts = studioProducts.filter(
  (product): product is ComingSoonStudioProduct => product.availability === "coming-soon",
);
export const teleprompter = studioProducts[0] as AvailableStudioProduct;
export const studioNavigationProducts = studioProducts;
