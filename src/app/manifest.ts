import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Generator CV",
    short_name: "CV",
    description: "Creează, editează și exportă CV-ul tău în PDF, Word și HTML — direct din browser.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "window-controls-overlay"],
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "ro",
    dir: "ltr",
    orientation: "any",
    categories: ["productivity", "business", "utilities"],
    prefer_related_applications: false,
    screenshots: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "narrow",
        label: "Generator CV — formular de editare",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "wide",
        label: "Generator CV — previzualizare și export",
      },
    ],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
  };
}
