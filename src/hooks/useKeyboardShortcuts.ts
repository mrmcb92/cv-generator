"use client";
import { useEffect, useRef } from "react";

interface ShortcutMap {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  // Store latest callbacks in a ref so the effect doesn't re-run on every render
  const shortcutsRef = useRef<ShortcutMap>(shortcuts);
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire inside inputs, textareas, selects, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) return;

      const mod = e.metaKey || e.ctrlKey;
      const key = `${mod ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.key.toUpperCase()}`;

      const fn = shortcutsRef.current[key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // empty deps — only mount/unmount
}
