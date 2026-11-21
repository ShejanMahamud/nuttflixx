"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoPlay, IoInformationCircleOutline } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiStar } from "react-icons/hi2";
import { type MediaItem, getBackdropUrl, formatRating, formatYear, MOVIE_GENRES, TV_GENRES } from "@/lib/tmdb";

interface HeroBannerProps {
  items: MediaItem[];
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => goTo((current + 1) % items.length), [current, items.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + items.length) % items.length), [current, items.length, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [next]);

  if (!items.length) return null;

  const item = items[current];
  const title = item.media_type === "tv" ? (item as MediaItem & { name: string }).name : (item as MediaItem & { title: string }).title;
  const date = item.media_type === "tv" ? (item as MediaItem & { first_air_date: string }).first_air_date : (item as MediaItem & { release_date: string }).release_date;
  const detailHref = item.media_type === "tv" ? `/series/${item.id}` : `/movie/${item.id}`;
  const genres = item.genre_ids
    .slice(0, 3)
    .map((id) => {
      const genreMap = item.media_type === "tv" ? TV_GENRES : MOVIE_GENRES;
      return genreMap[id] || "Unknown";
    });

  return (
    <section className="relative h-[85vh] min-h-[500px] md:min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      {items.map((it, i) => (
        <div
          key={it.id}
          className={`absolute inset-0 transition-all duration-[800ms] ease-in-out ${
            i === current ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        >
          <Image
            src={getBackdropUrl(it.backdrop_path, "original")}
            alt=""
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-[2] flex items-end pb-24 md:pb-[12%] pt-20 md:pt-28">
        <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 lg:px-12">
          <div
            key={current}
            className="max-w-2xl animate-fade-in-up"
          >
            {/* Badge */}
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded bg-[#e50914] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                {item.media_type === "tv" ? "Series" : "Movie"}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <HiStar className="h-4 w-4" />
                <span className="text-sm font-semibold text-white">{formatRating(item.vote_average)}</span>
              </div>
              <span className="text-sm text-white/50">{formatYear(date)}</span>
            </div>

            {/* Title */}
            <h1
              className="mb-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h1>

            {/* Genres */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {genres.map((g) => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>

            {/* Overview */}
            <p className="mb-6 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              {item.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href={detailHref} className="btn-nuttflixx btn-primary">
                <IoPlay className="h-5 w-5" />
                Play Now
              </Link>
              <Link href={detailHref} className="btn-nuttflixx btn-secondary">
                <IoInformationCircleOutline className="h-5 w-5" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-[3] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/60 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white md:flex md:left-8"
      >
        <FiChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-[3] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/60 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white md:flex md:right-8"
      >
        <FiChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-[#e50914]" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
