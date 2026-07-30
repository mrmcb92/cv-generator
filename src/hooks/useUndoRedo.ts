"use client";
import { useState, useCallback, useRef } from "react";

const MAX_HISTORY = 50;

export function useUndoRedo<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);
  const skipNext = useRef(false);

  const pushState = useCallback((next: T) => {
    if (skipNext.current) {
      skipNext.current = false;
      setPresent(next);
      return;
    }
    setPast((prev) => [...prev.slice(-MAX_HISTORY + 1), present]);
    setPresent(next);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, -1));
    // setFuture must be called with a callback to capture present value
    setFuture((prev) => [present, ...prev]);
    setPresent(previous);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setPast((prev) => [...prev, present]);
    setPresent(next);
  }, [future, present]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const replaceState = useCallback((state: T) => {
    skipNext.current = true;
    setPresent(state);
    setPast([]);
    setFuture([]);
  }, []);

  return { state: present, setState: pushState, undo, redo, canUndo, canRedo, replaceState };
}