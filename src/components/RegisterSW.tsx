"use client";

import { useEffect } from "react";

// Registers the service worker in production only. In dev the SW is
// skipped because it conflicts with Turbopack HMR — PWA install/offline
// is verified on the deployed (production) build.
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
