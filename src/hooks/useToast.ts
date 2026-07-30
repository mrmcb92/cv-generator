"use client";

import { useState, useCallback } from "react";

export type Toast = { id: number; message: string; kind: "success" | "error" };

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return { toasts, showToast };
}
