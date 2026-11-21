"use client";

import { useRef } from "react";
import Link from "next/link";
import { MOVIE_GENRES } from "@/lib/tmdb";
import {
  MdLocalMovies, MdTheaterComedy, MdFamilyRestroom,
} from "react-icons/md";
import {
  GiSwordWound, GiMagnifyingGlass, GiSpaceship, GiDramaMasks,
} from "react-icons/gi";
import { FaSkull, FaHeart, FaBomb } from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";
import type { IconType } from "react-icons";

const GENRE_ICONS: Record<number, IconType> = {
  28: GiSwordWound,
  35: MdTheaterComedy,
  18: GiDramaMasks,
  27: FaSkull,
  878: GiSpaceship,
  10749: FaHeart,
  53: FaBomb,
  80: GiMagnifyingGlass,
  16: BiMoviePlay,
  10751: MdFamilyRestroom,
  12: MdLocalMovies,
  14: MdLocalMovies,
};

const GENRE_COLORS: Record<number, string> = {
  28: "from-red-600/20 to-red-900/10",
  35: "from-yellow-500/20 to-yellow-800/10",
  18: "from-purple-600/20 to-purple-900/10",
  27: "from-green-600/20 to-green-900/10",
  878: "from-blue-500/20 to-blue-900/10",
  10749: "from-pink-500/20 to-pink-900/10",
  53: "from-orange-600/20 to-orange-900/10",
  80: "from-slate-500/20 to-slate-800/10",
  16: "from-cyan-500/20 to-cyan-800/10",
  10751: "from-emerald-500/20 to-emerald-800/10",
  12: "from-amber-500/20 to-amber-800/10",
  14: "from-indigo-500/20 to-indigo-800/10",
};

const FEATURED_GENRES = [28, 35, 18, 27, 878, 10749, 53, 80, 16, 10751, 12, 14];

export default function GenreStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-4">
      <div className="mb-3 px-4 md:px-8 lg:px-12">
        <h2 className="section-title">Browse by Genre</h2>
      </div>
      <div
        ref={scrollRef}
        className="content-row gap-3 px-4 md:px-8 lg:px-12"
      >
        {FEATURED_GENRES.map((id) => {
          const Icon = GENRE_ICONS[id] || MdLocalMovies;
          const gradient = GENRE_COLORS[id] || "from-gray-600/20 to-gray-900/10";
          return (
            <Link
              key={id}
              href={`/genre/${id}`}
              className={`flex flex-shrink-0 items-center gap-2.5 rounded-xl bg-gradient-to-br ${gradient} border border-white/[0.04] px-5 py-3 transition-all duration-300 hover:scale-105 hover:border-white/10 hover:shadow-lg`}
            >
              <Icon className="h-4 w-4 text-white/60" />
              <span className="whitespace-nowrap text-sm font-medium text-white/80">
                {MOVIE_GENRES[id]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
