"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IoArrowBack, IoWarningOutline } from "react-icons/io5";
import { FiZap } from "react-icons/fi";

interface VideoPlayerProps {
  mediaType: "movie" | "tv";
  id: number;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeName?: string;
  onClose: () => void;
}

export type ServerType = "vidlink" | "vaplayer";

export default function VideoPlayer({
  mediaType,
  id,
  title,
  seasonNumber = 1,
  episodeNumber = 1,
  episodeName,
  onClose,
}: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<ServerType>("vidlink");
  const [isChecking, setIsChecking] = useState(true);
  const [autoSwitchNotice, setAutoSwitchNotice] = useState<string | null>(null);
  const [server1Status, setServer1Status] = useState<"checking" | "available" | "unavailable">("checking");
  const userManualSelection = useRef(false);
  const streamActiveRef = useRef(false);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // URLs for both servers
  const vidlinkUrl =
    mediaType === "tv"
      ? `https://vidlink.pro/tv/${id}/${seasonNumber}/${episodeNumber}?primaryColor=e50914&secondaryColor=ffffff`
      : `https://vidlink.pro/movie/${id}?primaryColor=e50914&secondaryColor=ffffff`;

  const vaplayerUrl =
    mediaType === "tv"
      ? `https://vaplayer.ru/embed/tv/${id}/${seasonNumber}/${episodeNumber}?title=${encodeURIComponent(
          title
        )}&primaryColor=%23e50914`
      : `https://vaplayer.ru/embed/movie/${id}?title=${encodeURIComponent(
          title
        )}&primaryColor=%23e50914`;

  // ─── 1. Pre-Check Server Availability via API ───
  useEffect(() => {
    let ignore = false;

    const checkAvailability = async () => {
      try {
        const query = new URLSearchParams({
          type: mediaType,
          id: String(id),
          season: String(seasonNumber),
          episode: String(episodeNumber),
        });

        const res = await fetch(`/api/check-stream?${query}`);
        if (!ignore && res.ok) {
          const data = await res.json();
          const server1Available = Boolean(data.server1Available);
          setServer1Status(server1Available ? "available" : "unavailable");

          // If Server 1 is not available and user hasn't overridden manually, auto-switch to Server 2
          if (!server1Available && !userManualSelection.current) {
            setSelectedServer("vaplayer");
            setAutoSwitchNotice("Server 1 unavailable for this title. Auto-switched to Server 2.");
          }
        }
      } catch {
        if (!ignore) {
          setServer1Status("available"); // Assume available on error and rely on runtime timeout
        }
      } finally {
        if (!ignore) {
          setIsChecking(false);
        }
      }
    };

    checkAvailability();

    return () => {
      ignore = true;
    };
  }, [id, mediaType, seasonNumber, episodeNumber]);

  // ─── 2. Runtime Monitoring & Timeout Fallback ───
  const startFallbackTimer = useCallback(() => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);

    // If Server 1 doesn't load or play within 7.5 seconds, auto-switch to Server 2
    timeoutTimerRef.current = setTimeout(() => {
      if (!streamActiveRef.current && selectedServer === "vidlink" && !userManualSelection.current) {
        setSelectedServer("vaplayer");
        setServer1Status("unavailable");
        setAutoSwitchNotice("Server 1 stream timed out. Auto-switched to Server 2.");
      }
    }, 7500);
  }, [selectedServer]);

  useEffect(() => {
    streamActiveRef.current = false;

    if (selectedServer === "vidlink") {
      startFallbackTimer();
    }

    // Listen for VidLink player events to confirm playback is working
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://vidlink.pro") {
        if (event.data?.type === "PLAYER_EVENT" || event.data?.type === "MEDIA_DATA") {
          streamActiveRef.current = true;
          setServer1Status("available");
          if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      window.removeEventListener("message", handleMessage);
    };
  }, [selectedServer, startFallbackTimer]);

  const handleManualSwitch = (server: ServerType) => {
    userManualSelection.current = true;
    setSelectedServer(server);
    setAutoSwitchNotice(null);
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Top Controls Bar */}
      <div className="absolute top-12 left-4 right-4 md:top-6 md:left-6 md:right-6 z-[60] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Back Button and Episode Info */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-black/90 transition shadow-lg border border-white/10"
          >
            <IoArrowBack className="h-4 w-4" />
            <span>Back to details</span>
          </button>
          {episodeName && (
            <span className="hidden lg:inline text-xs font-medium text-white/60 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              S{seasonNumber}:E{episodeNumber} · {episodeName}
            </span>
          )}
        </div>

        {/* Server Switcher Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Server Toggle Buttons */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/70 p-1 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={() => handleManualSwitch("vidlink")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedServer === "vidlink"
                  ? "bg-[#e50914] text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>Server 1 (Ad-Free)</span>
              {isChecking ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" title="Checking availability..." />
              ) : server1Status === "available" ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Online" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Unavailable / Fallback" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleManualSwitch("vaplayer")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedServer === "vaplayer"
                  ? "bg-[#e50914] text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>Server 2 (VA Player)</span>
              {selectedServer === "vaplayer" && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Active" />
              )}
            </button>
          </div>

          {/* Auto-Switch Indicator Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md border border-white/10"
            title="Auto-Switch monitors stream health and switches servers automatically if a title is missing"
          >
            <FiZap className="h-3.5 w-3.5 text-yellow-400" />
            <span>Auto-Switch Active</span>
          </div>
        </div>
      </div>

      {/* Auto-Switch Notification Toast */}
      {autoSwitchNotice && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 rounded-full bg-black/90 px-4 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-xl border border-amber-500/30 animate-fade-in">
          <IoWarningOutline className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span>{autoSwitchNotice}</span>
          <button
            onClick={() => setAutoSwitchNotice(null)}
            className="ml-2 text-white/50 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Video Iframe */}
      <iframe
        key={selectedServer}
        src={selectedServer === "vidlink" ? vidlinkUrl : vaplayerUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        className="h-full w-full"
      />
    </div>
  );
}
