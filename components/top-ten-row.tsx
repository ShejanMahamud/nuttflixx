"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getPosterUrl, formatRating, type Movie, type TVShow } from "@/lib/tmdb";
import { HiStar } from "react-icons/hi2";

interface TopTenRowProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType: "movie" | "tv";
}

export default function TopTenRow({ title, items, mediaType }: TopTenRowProps) {
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

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="row-container group/row relative py-4">
      <div className="mb-3 px-4 md:px-8 lg:px-12">
        <h2 className="section-title flex items-center gap-3">
          <span className="flex h-7 items-center rounded bg-[#e50914] px-2 text-xs font-bold tracking-wider text-white">
            TOP 10
          </span>
          {title}
        </h2>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="scroll-btn absolute left-1 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-[#0a0a0a] to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm hover:bg-black/80 hover:text-white">
              <FiChevronLeft className="h-5 w-5" />
            </div>
          </button>
        )}

        <div ref={scrollRef} className="content-row gap-4 px-4 md:px-8 lg:px-12">
          {items.slice(0, 10).map((item, i) => {
            const t = mediaType === "tv" ? (item as TVShow).name : (item as Movie).title;
            const href = mediaType === "tv" ? `/series/${item.id}` : `/movie/${item.id}`;
            return (
              <Link
                key={item.id}
                href={href}
                className="group relative flex flex-shrink-0 items-end"
                style={{ width: "220px", height: "180px" }}
              >
                {/* Big Number */}
                <span
                  className="absolute -left-2 bottom-0 select-none text-[140px] font-black leading-none tracking-tighter"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "transparent",
                    WebkitTextStroke: "2px rgba(255,255,255,0.12)",
                    zIndex: 0,
                  }}
                >
                  {i + 1}
                </span>

                {/* Poster */}
                <div className="relative z-[1] ml-auto h-[160px] w-[110px] overflow-hidden rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={getPosterUrl(item.poster_path, "medium")}
                    alt={t}
                    fill
                    className="object-cover"
                    sizes="110px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <div className="flex items-center gap-1">
                      <HiStar className="h-3 w-3 text-yellow-400" />
                      <span className="text-[10px] font-semibold text-white">{formatRating(item.vote_average)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="scroll-btn absolute right-1 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-[#0a0a0a] to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm hover:bg-black/80 hover:text-white">
              <FiChevronRight className="h-5 w-5" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
