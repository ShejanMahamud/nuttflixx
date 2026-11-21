"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoPlay, IoArrowBack } from "react-icons/io5";
import { HiStar } from "react-icons/hi2";
import { BsShare } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { BiTime } from "react-icons/bi";
import { MdCalendarToday, MdLanguage } from "react-icons/md";
import ContentRow from "@/components/content-row";
import VideoPlayer from "@/components/video-player";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import {
  type MovieDetails,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  formatRating,
  formatRuntime,
  formatDate,
  getTrailerKey,
} from "@/lib/tmdb";

interface Props {
  movie: MovieDetails;
}

export default function MovieDetailClient({ movie }: Props) {
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const writers = movie.credits?.crew
    ?.filter((c) => c.department === "Writing")
    .slice(0, 3) || [];
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const similar = movie.similar?.results?.filter((m) => m.poster_path)?.slice(0, 12) || [];
  const recommendations = movie.recommendations?.results?.filter((m) => m.poster_path)?.slice(0, 12) || [];
  const trailerKey = getTrailerKey(movie.videos?.results);
  const [isPlaying, setIsPlaying] = useState(false);
  const { upsertItem } = useContinueWatching();

  const handlePlay = () => {
    setIsPlaying(true);
    // Save to Continue Watching with a simulated progress (10-60%)
    // In a real app, this would update as the video plays
    const simulatedProgress = Math.floor(Math.random() * 50) + 10;
    upsertItem({
      id: movie.id,
      mediaType: "movie",
      title: movie.title,
      backdropPath: movie.backdrop_path,
      posterPath: movie.poster_path,
      progress: simulatedProgress,
    });
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on NuttFlixx!`,
          url,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Backdrop */}
      <div className={isPlaying ? "fixed inset-0 z-50 bg-black" : "absolute inset-0 h-[75vh]"}>
        {isPlaying ? (
          <VideoPlayer
            mediaType="movie"
            id={movie.id}
            title={movie.title}
            onClose={() => setIsPlaying(false)}
          />
        ) : (
          <>
            <Image
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
      </>
        )}
      </div>

      {/* Back Button */}
      <div className="relative z-10 px-4 pt-20 md:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
        >
          <IoArrowBack className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-4 pt-12 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative mx-auto w-[220px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 md:w-[300px]">
              <div className="aspect-[2/3]">
                <Image
                  src={getPosterUrl(movie.poster_path, "large")}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                  priority
                />
              </div>
            </div>

            {/* Trailer Button under poster */}
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nuttflixx btn-ghost mt-4 w-full justify-center"
              >
                <IoPlay className="h-4 w-4" /> Watch Trailer
              </a>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pb-8">
            {/* Badges */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded bg-[#e50914] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Movie
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <HiStar className="h-4 w-4" />
                <span className="text-sm font-semibold text-white">{formatRating(movie.vote_average)}</span>
              </div>
              <span className="text-sm text-white/40">{movie.vote_count.toLocaleString()} votes</span>
              {movie.status && movie.status !== "Released" && (
                <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="mb-2 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="mb-4 text-base italic text-white/40">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta Row */}
            <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <MdCalendarToday className="h-3.5 w-3.5" /> {formatDate(movie.release_date)}
              </span>
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1.5">
                  <BiTime className="h-3.5 w-3.5" /> {formatRuntime(movie.runtime)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MdLanguage className="h-3.5 w-3.5" /> {movie.original_language.toUpperCase()}
              </span>
            </div>

            {/* Genres */}
            <div className="mb-6 flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <Link
                  key={g.id}
                  href={`/genre/${g.id}`}
                  className="genre-tag"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="mb-8 flex flex-wrap gap-3">
              <button onClick={handlePlay} className="btn-nuttflixx btn-primary text-base">
                <IoPlay className="h-5 w-5" /> Watch Now
              </button>
              <button onClick={handleShare} className="btn-nuttflixx btn-ghost">
                <BsShare className="h-4 w-4" /> {isCopied ? "Copied!" : "Share"}
              </button>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-nuttflixx btn-ghost"
                >
                  <FiExternalLink className="h-4 w-4" /> IMDb
                </a>
              )}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/40">Overview</h3>
              <p className="max-w-2xl text-base leading-relaxed text-white/70">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Crew */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {director && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/30">Director</p>
                  <p className="mt-1 text-sm font-medium text-white/80">{director.name}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/30">Writers</p>
                  <p className="mt-1 text-sm font-medium text-white/80">
                    {writers.map((w) => w.name).join(", ")}
                  </p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/30">Budget</p>
                  <p className="mt-1 text-sm font-medium text-white/80">
                    ${(movie.budget / 1_000_000).toFixed(0)}M
                  </p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/30">Revenue</p>
                  <p className="mt-1 text-sm font-medium text-white/80">
                    ${(movie.revenue / 1_000_000).toFixed(0)}M
                  </p>
                </div>
              )}
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">Cast</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {cast.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all hover:bg-white/[0.05]"
                    >
                      {member.profile_path ? (
                        <Image
                          src={getProfileUrl(member.profile_path, "small")}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/50">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/90">{member.name}</p>
                        <p className="truncate text-xs text-white/40">{member.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="relative z-10 mt-8">
          <ContentRow title="Recommended For You" items={recommendations} mediaType="movie" />
        </div>
      )}

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="relative z-10 mt-2">
          <ContentRow title="Similar Movies" items={similar} mediaType="movie" />
        </div>
      )}
    </div>
  );
}
