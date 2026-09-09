"use client";

import { useEffect, useState } from "react";
import { Theme } from "@/types/theme";
import { DeviceMobile, X, WifiSlash } from "@phosphor-icons/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface Props {
  theme: Theme;
}

export default function PWAInstallButton({ theme }: Props) {
  const isDark = theme.id === "dark";
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });
  const [isIos] = useState(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  });
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen for display-mode changes if launched into standalone
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mediaQuery.addEventListener("change", handleDisplayModeChange);

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // General feedback
      alert("Aplicația este deja instalată sau poți folosi opțiunea 'Instalează' din meniul browserului tău.");
    }
  };

  // If already standalone PWA and online, we can show a small offline indicator when connection drops
  return (
    <>
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs shadow-lg animate-bounce">
          <WifiSlash size={16} weight="bold" />
          <span>Mod Offline activ — datele sunt salvate local</span>
        </div>
      )}

      {!isStandalone && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            isDark
              ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800"
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
          }`}
          title="Instalează ca aplicație pe telefon sau desktop"
        >
          <DeviceMobile size={15} weight="bold" />
          <span className="hidden sm:inline">Instalează App</span>
        </button>
      )}

      {/* iOS install guide modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 border shadow-2xl space-y-4 ${
              isDark ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <DeviceMobile size={18} />
                Instalare pe iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                <X size={16} />
              </button>
            </div>
            <ol className="text-[12px] space-y-2 text-zinc-500 leading-relaxed list-decimal list-inside">
              <li>
                Apasă pe butonul de <strong>Partajare (Share)</strong> din bara de jos a browserului Safari.
              </li>
              <li>
                Derulează lista și selectează <strong>„Adăugați pe ecranul principal” (Add to Home Screen)</strong>.
              </li>
              <li>
                Apasă <strong>Adăugare</strong> în colțul din dreapta sus.
              </li>
            </ol>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white"
            >
              Am înțeles
            </button>
          </div>
        </div>
      )}
    </>
  );
}
