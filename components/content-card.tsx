"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoPlay } from "react-icons/io5";
import { HiStar } from "react-icons/hi2";
import { getPosterUrl, formatRating, formatYear, getGenreName, type Movie, type TVShow } from "@/lib/tmdb";

interface ContentCardProps {
  item: Movie | TVShow;
  mediaType: "movie" | "tv";
  index?: number;
  variant?: "poster" | "backdrop" | "wide";
  className?: string;
}

export default function ContentCard({ item, mediaType, index = 0, variant = "poster", className = "" }: ContentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const title = mediaType === "tv" ? (item as TVShow).name : (item as Movie).title;
  const date = mediaType === "tv" ? (item as TVShow).first_air_date : (item as Movie).release_date;
  const href = mediaType === "tv" ? `/series/${item.id}` : `/movie/${item.id}`;
  const genres = item.genre_ids?.slice(0, 2).map((id) => getGenreName(id, mediaType)) || [];

  const widthClass = className ? "" : variant === "wide" ? "w-[300px] md:w-[350px]" : variant === "backdrop" ? "w-[260px] md:w-[300px]" : "w-[150px] md:w-[180px]";
  const aspectClass = variant === "wide" ? "aspect-video" : variant === "backdrop" ? "aspect-video" : "aspect-[2/3]";

  return (
    <Link
      href={href}
      className={`card-hover group relative flex-shrink-0 ${widthClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden rounded-lg ${aspectClass}`}>
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="skeleton absolute inset-0" />
        )}

        {/* Poster Image */}
        <Image
          src={
            variant === "poster"
              ? getPosterUrl(item.poster_path, "large")
              : getPosterUrl(item.backdrop_path || item.poster_path, "large")
          }
          alt={title}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes={variant === "poster" ? "(max-width: 768px) 150px, 180px" : "(max-width: 768px) 260px, 300px"}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/30">
              <IoPlay className="ml-0.5 h-5 w-5 text-white" />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <HiStar className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold text-white">{formatRating(item.vote_average)}</span>
              </div>
              <span className="text-xs text-white/50">{formatYear(date)}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {genres.map((g) => (
                <span key={g} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Badge (always visible) */}
        <div className={`absolute left-2 top-2 transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
          <div className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
            <HiStar className="h-3 w-3 text-yellow-400" />
            <span className="text-[11px] font-semibold text-white">{formatRating(item.vote_average)}</span>
          </div>
        </div>
      </div>

      {/* Title Below Card */}
      <div className="mt-2 px-0.5">
        <h3 className="truncate text-sm font-medium text-white/90 transition-colors group-hover:text-white">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-white/40">{formatYear(date)} · {mediaType === "tv" ? "Series" : "Movie"}</p>
      </div>
    </Link>
  );
}
