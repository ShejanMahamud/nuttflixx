"use client";

import { useState, useEffect, useCallback } from "react";
import { IoShieldHalfOutline, IoRefreshOutline } from "react-icons/io5";

interface NavigatorExtended extends Navigator {
  brave?: {
    isBrave: () => Promise<boolean>;
  };
}

export default function AntiAdblockModal() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeGuide, setActiveGuide] = useState<"brave" | "extension">("extension");

  const detectAdBlocker = useCallback(async () => {
    if (typeof window === "undefined") return;

    let detected = false;

    // 1. Check for Brave browser (Brave Shields enabled by default)
    const nav = window.navigator as NavigatorExtended;
    if (nav.brave && typeof nav.brave.isBrave === "function") {
      try {
        const isBrave = await nav.brave.isBrave();
        if (isBrave) {
          detected = true;
        }
      } catch {
        // Continue to other checks
      }
    }

    // 2. Check via DOM bait element (triggers cosmetic / CSS filtering in uBlock, AdBlock, AdGuard)
    try {
      const bait = document.createElement("div");
      bait.className = "ad-banner adsbox ad_unit ad-placement sponsor-ad adsbygoogle";
      bait.setAttribute("aria-hidden", "true");
      bait.style.position = "absolute";
      bait.style.left = "-9999px";
      bait.style.top = "-9999px";
      bait.style.width = "100px";
      bait.style.height = "100px";
      bait.innerHTML = "&nbsp;";
      document.body.appendChild(bait);

      const style = window.getComputedStyle(bait);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        bait.offsetParent === null ||
        bait.offsetHeight === 0
      ) {
        detected = true;
      }
      document.body.removeChild(bait);
    } catch {
      // Continue
    }

    // 3. Check via Network Bait Request (ad blockers block network calls to ad domains)
    if (!detected) {
      try {
        const testAdUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        await fetch(new Request(testAdUrl, { method: "HEAD", mode: "no-cors" }));
      } catch {
        // Failed network request indicates ad blocking rule
        detected = true;
      }
    }

    // 4. Test user's Adsterra popunder host
    if (!detected) {
      try {
        const adsterraUrl = "https://aarems.org/1/58ecddbe51f824ba33eeb2fd5f7b5d2c";
        await fetch(new Request(adsterraUrl, { method: "HEAD", mode: "no-cors" }));
      } catch {
        detected = true;
      }
    }

    setIsBlocked(detected);

    if (detected) {
      // Lock page scrolling when ad blocker is active
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, []);

  useEffect(() => {
    // Run initial check after page hydration
    const timer = setTimeout(() => {
      detectAdBlocker();
    }, 800);

    // Re-check when window regains focus (e.g. after user disables ad blocker in extension menu)
    const handleFocus = () => {
      detectAdBlocker();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
      document.body.style.overflow = "";
    };
  }, [detectAdBlocker]);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-red-500/20 bg-[#121212] p-6 text-center shadow-2xl md:p-8">
        {/* Glow backdrop */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-inner ring-1 ring-red-500/30">
          <IoShieldHalfOutline className="h-9 w-9" />
        </div>

        {/* Title */}
        <h2
          className="mb-3 text-2xl font-black tracking-tight text-white md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ad Blocker Detected
        </h2>

        {/* Message */}
        <p className="mb-6 text-sm leading-relaxed text-white/70 md:text-base">
          We noticed you are using an <span className="font-semibold text-white">Ad Blocker</span> or{" "}
          <span className="font-semibold text-white">Brave Shields</span>. <span className="text-[#e50914] font-bold">NuttFlixx</span> is
          100% free with no paid subscriptions. Please disable your ad blocker or shield to support our servers and access free movies and shows.
        </p>

        {/* Quick Guide Tabs */}
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
          <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveGuide("extension")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                activeGuide === "extension"
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              AdBlock / uBlock Origin
            </button>
            <button
              onClick={() => setActiveGuide("brave")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                activeGuide === "brave"
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Brave Browser
            </button>
          </div>

          {activeGuide === "extension" ? (
            <ol className="list-decimal space-y-1.5 pl-4 text-xs text-white/80">
              <li>Click your ad blocker extension icon in the browser toolbar.</li>
              <li>Select <span className="font-semibold text-white">&quot;Pause on this site&quot;</span> or toggle it off.</li>
              <li>Click the refresh button below to continue watching.</li>
            </ol>
          ) : (
            <ol className="list-decimal space-y-1.5 pl-4 text-xs text-white/80">
              <li>Click the <span className="font-semibold text-white">Lion / Shield icon</span> next to the URL address bar.</li>
              <li>Toggle <span className="font-semibold text-white">&quot;Shields&quot;</span> to <strong>DOWN / OFF</strong> for this website.</li>
              <li>Click the refresh button below to continue watching.</li>
            </ol>
          )}
        </div>

        {/* Refresh Action */}
        <button
          onClick={() => window.location.reload()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e50914] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-[#f40612] hover:scale-[1.02] active:scale-[0.98]"
        >
          <IoRefreshOutline className="h-5 w-5 animate-spin-slow" />
          <span>I Have Disabled It — Refresh Page</span>
        </button>

        <p className="mt-4 text-[11px] text-white/40">
          Already disabled it? The page will automatically unblock once refreshed.
        </p>
      </div>
    </div>
  );
}
