"use client";

import { useSyncExternalStore, useCallback } from "react";

// ─── Types ───

export interface ContinueWatchingItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  backdropPath: string | null;
  posterPath: string | null;
  progress: number; // 0–100
  lastWatched: number; // Unix timestamp (ms)
  // TV-specific
  seasonNumber?: number;
  episodeNumber?: number;
  episodeName?: string;
}

const STORAGE_KEY = "nuttflixx_continue_watching";
const MAX_ITEMS = 20;

let listeners: Array<() => void> = [];
let memoryCache: ContinueWatchingItem[] | null = null;
const EMPTY_ITEMS: ContinueWatchingItem[] = [];

function readFromStorage(): ContinueWatchingItem[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_ITEMS;
    return JSON.parse(raw) as ContinueWatchingItem[];
  } catch {
    return EMPTY_ITEMS;
  }
}

function writeToStorage(items: ContinueWatchingItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded — silently fail
  }
}

function notify() {
  memoryCache = null;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      notify();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): ContinueWatchingItem[] {
  if (memoryCache === null) {
    memoryCache = readFromStorage();
  }
  return memoryCache;
}

function getServerSnapshot(): ContinueWatchingItem[] {
  return EMPTY_ITEMS;
}

// ─── Hook ───

export function useContinueWatching() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Add or update an item in the Continue Watching list.
   * If the item already exists (matched by id + mediaType), it is updated
   * and moved to the front. Otherwise it is prepended.
   * Items with progress >= 95 are automatically removed (finished).
   */
  const upsertItem = useCallback(
    (item: Omit<ContinueWatchingItem, "lastWatched"> & { lastWatched?: number }) => {
      const prev = readFromStorage();
      if (item.progress >= 95) {
        const filtered = prev.filter(
          (i) => !(i.id === item.id && i.mediaType === item.mediaType)
        );
        writeToStorage(filtered);
        notify();
        return;
      }

      const existing = prev.filter(
        (i) => !(i.id === item.id && i.mediaType === item.mediaType)
      );

      const newItem: ContinueWatchingItem = {
        ...item,
        lastWatched: item.lastWatched ?? Date.now(),
      };

      const updated = [newItem, ...existing].slice(0, MAX_ITEMS);
      writeToStorage(updated);
      notify();
    },
    []
  );

  /**
   * Remove an item from Continue Watching
   */
  const removeItem = useCallback((id: number, mediaType: "movie" | "tv") => {
    const prev = readFromStorage();
    const filtered = prev.filter(
      (i) => !(i.id === id && i.mediaType === mediaType)
    );
    writeToStorage(filtered);
    notify();
  }, []);

  /**
   * Clear all Continue Watching items
   */
  const clearAll = useCallback(() => {
    writeToStorage([]);
    notify();
  }, []);

  return {
    items,
    upsertItem,
    removeItem,
    clearAll,
  };
}
