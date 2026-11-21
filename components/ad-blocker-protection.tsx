"use client";

import { useEffect } from "react";

export default function AdBlockerProtection() {
  useEffect(() => {
    // 1. Clear any leftover ad tokens or counters from localStorage
    try {
      localStorage.removeItem("nuttflixx_ad_clicks");
      localStorage.removeItem("shown_at");
      localStorage.removeItem("unloaded_at");
    } catch {
      // Ignore if storage access is restricted
    }

    // 2. Prevent unwanted ad popups from rogue scripts
    if (typeof window !== "undefined") {
      const originalOpen = window.open;
      window.open = function (...args: Parameters<typeof window.open>) {
        const targetUrl = args[0] ? String(args[0]).toLowerCase() : "";

        // Known ad network patterns and popup redirects
        const adKeywords = [
          "effectivecpmnetwork",
          "adsterra",
          "popcash",
          "popads",
          "propellerads",
          "clickadu",
          "monetag",
          "casino",
          "bet",
          "/asb.html",
        ];

        if (adKeywords.some((keyword) => targetUrl.includes(keyword))) {
          console.warn("[NuttFlixx Ad Shield] Blocked ad popup attempt:", targetUrl);
          return null;
        }

        return originalOpen.apply(this, args);
      };

      return () => {
        window.open = originalOpen;
      };
    }
  }, []);

  return null;
}
