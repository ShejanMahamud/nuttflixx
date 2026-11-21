"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { IoPlay } from "react-icons/io5";
import { getPosterUrl } from "@/lib/tmdb";
import {
  useContinueWatching,
  type ContinueWatchingItem,
} from "@/hooks/use-continue-watching";

// ─── Individual Card ───

function ContinueWatchingCard({
  item,
  onRemove,
}: {
  item: ContinueWatchingItem;
  onRemove: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const href =
    item.mediaType === "tv"
      ? `/series/${item.id}`
      : `/movie/${item.id}`;

  const imageSrc = item.backdropPath
    ? getPosterUrl(item.backdropPath, "large")
    : item.posterPath
      ? getPosterUrl(item.posterPath, "large")
      : "/placeholder-backdrop.svg";

  // Time-ago string
  const timeAgo = getTimeAgo(item.lastWatched);

  return (
    <div
      className="group/card relative flex-shrink-0 w-[280px] md:w-[320px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg aspect-video">
          {/* Skeleton */}
          {!imageLoaded && <div className="skeleton absolute inset-0" />}

          {/* Backdrop Image */}
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className={`object-cover transition-all duration-500 group-hover/card:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 280px, 320px"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Play button on hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg shadow-black/30 transition-transform hover:scale-110">
              <IoPlay className="ml-0.5 h-6 w-6 text-[#0a0a0a]" />
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/70 backdrop-blur-sm transition-all hover:bg-black/90 hover:text-white ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            title="Remove from Continue Watching"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>

          {/* Episode badge (TV only) */}
          {item.mediaType === "tv" && item.seasonNumber && item.episodeNumber && (
            <div className="absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              S{item.seasonNumber}:E{item.episodeNumber}
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="truncate text-sm font-semibold text-white">
              {item.title}
            </h3>
            {item.episodeName && (
              <p className="mt-0.5 truncate text-xs text-white/50">
                {item.episodeName}
              </p>
            )}
            <p className="mt-1 text-[11px] text-white/35">{timeAgo}</p>

            {/* Progress Bar */}
            <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#e50914] transition-all duration-300"
                style={{ width: `${Math.min(item.progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Time-ago helper ───

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─── Main Row Component ───

export default function ContinueWatchingRow() {
  const { items, removeItem } = useContinueWatching();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
    };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Don't render if there's nothing to continue watching
  if (!items.length) return null;

  return (
    <section className="row-container group/row relative py-4" id="continue-watching">
      {/* Section Header */}
      <div className="mb-3 flex items-end justify-between px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          {/* Animated pulsing dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e50914] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#e50914]" />
          </span>
          <div>
            <h2 className="section-title">Continue Watching</h2>
            <p className="mt-0.5 text-sm text-white/40">
              Pick up where you left off
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Row */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="scroll-btn absolute left-1 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-[#0a0a0a] to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white">
              <FiChevronLeft className="h-5 w-5" />
            </div>
          </button>
        )}

        {/* Content */}
        <div
          ref={scrollRef}
          className="content-row gap-3 px-4 md:px-8 lg:px-12"
        >
          {items.map((item) => (
            <ContinueWatchingCard
              key={`${item.mediaType}-${item.id}`}
              item={item}
              onRemove={() => removeItem(item.id, item.mediaType)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="scroll-btn absolute right-1 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-[#0a0a0a] to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white">
              <FiChevronRight className="h-5 w-5" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
