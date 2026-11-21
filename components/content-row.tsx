"use client";

import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ContentCard from "./content-card";
import { type Movie, type TVShow } from "@/lib/tmdb";

interface ContentRowProps {
  title: string;
  subtitle?: string;
  items: (Movie | TVShow)[];
  mediaType: "movie" | "tv";
  variant?: "poster" | "backdrop" | "wide";
  href?: string;
}

export default function ContentRow({ title, subtitle, items, mediaType, variant = "poster", href }: ContentRowProps) {
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
    return () => { if (el) el.removeEventListener("scroll", checkScroll); };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="row-container group/row relative py-4">
      {/* Section Header */}
      <div className="mb-3 flex items-end justify-between px-4 md:px-8 lg:px-12">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-white/40">{subtitle}</p>}
        </div>
        {href && (
          <a href={href} className="text-sm font-medium text-white/40 transition-colors hover:text-[#e50914]">
            See All →
          </a>
        )}
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
          {items.map((item, i) => (
            <ContentCard
              key={item.id}
              item={item}
              mediaType={mediaType}
              index={i}
              variant={variant}
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
