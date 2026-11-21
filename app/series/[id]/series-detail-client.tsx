"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoPlay, IoArrowBack } from "react-icons/io5";
import { HiStar } from "react-icons/hi2";
import { BsShare } from "react-icons/bs";
import { FiExternalLink, FiChevronDown } from "react-icons/fi";
import { BiTime } from "react-icons/bi";
import { MdCalendarToday, MdLanguage } from "react-icons/md";
import ContentRow from "@/components/content-row";
import VideoPlayer from "@/components/video-player";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import {
  type TVShowDetails,
  type Episode,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  getStillUrl,
  formatRating,
  formatYear,
  formatRuntime,
  formatDate,
  getTrailerKey,
} from "@/lib/tmdb";

interface Props {
  show: TVShowDetails;
}

export default function SeriesDetailClient({ show }: Props) {
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const creators = show.created_by || [];
  const similar = show.similar?.results?.filter((s) => s.poster_path)?.slice(0, 12) || [];
  const recommendations = show.recommendations?.results?.filter((s) => s.poster_path)?.slice(0, 12) || [];
  const trailerKey = getTrailerKey(show.videos?.results);
  const imdbId = show.external_ids?.imdb_id;

  // Filter out specials (season 0) for the season selector
  const seasons = show.seasons?.filter((s) => s.season_number > 0) || [];
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<number | null>(null);
  const { upsertItem } = useContinueWatching();

  const handlePlayEpisode = (seasonNum: number, episodeNum: number, epName?: string) => {
    if (seasonNum !== selectedSeason) {
      setSelectedSeason(seasonNum);
      setLoadingEpisodes(true);
    }
    setPlayingEpisode(episodeNum);
    // Save to Continue Watching
    const simulatedProgress = Math.floor(Math.random() * 50) + 10;
    upsertItem({
      id: show.id,
      mediaType: "tv",
      title: show.name,
      backdropPath: show.backdrop_path,
      posterPath: show.poster_path,
      progress: simulatedProgress,
      seasonNumber: seasonNum,
      episodeNumber: episodeNum,
      episodeName: epName || `Episode ${episodeNum}`,
    });
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: show.name,
          text: `Check out ${show.name} on NuttFlixx!`,
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

  useEffect(() => {
    let ignore = false;

    async function loadEpisodes() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${show.id}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        if (!ignore && res.ok) {
          const data = await res.json();
          setEpisodes(data.episodes || []);
        }
      } catch {
        if (!ignore) {
          setEpisodes([]);
        }
      } finally {
        if (!ignore) {
          setLoadingEpisodes(false);
        }
      }
    }

    loadEpisodes();

    return () => {
      ignore = true;
    };
  }, [show.id, selectedSeason]);

  const currentSeason = seasons.find((s) => s.season_number === selectedSeason);

  return (
    <div className="relative min-h-screen">
      {/* Backdrop */}
      <div className={playingEpisode !== null ? "fixed inset-0 z-50 bg-black" : "absolute inset-0 h-[75vh]"}>
        {playingEpisode !== null ? (
          <VideoPlayer
            mediaType="tv"
            id={show.id}
            title={show.name}
            seasonNumber={selectedSeason}
            episodeNumber={playingEpisode}
            episodeName={episodes.find((e) => e.episode_number === playingEpisode)?.name}
            onClose={() => setPlayingEpisode(null)}
          />
        ) : (
          <>
            <Image
              src={getBackdropUrl(show.backdrop_path, "original")}
              alt={show.name}
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

      {/* Back */}
      <div className="relative z-10 px-4 pt-20 md:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
        >
          <IoArrowBack className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Show Info */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-4 pt-12 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative mx-auto w-[220px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 md:w-[300px]">
              <div className="aspect-[2/3]">
                <Image
                  src={getPosterUrl(show.poster_path, "large")}
                  alt={show.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                  priority
                />
              </div>
            </div>
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

          {/* Details */}
          <div className="flex-1 pb-8">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded bg-[#e50914] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Series
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <HiStar className="h-4 w-4" />
                <span className="text-sm font-semibold text-white">{formatRating(show.vote_average)}</span>
              </div>
              <span className="text-sm text-white/40">{show.vote_count.toLocaleString()} votes</span>
              {show.status && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  show.in_production
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/10 text-white/50"
                }`}>
                  {show.status}
                </span>
              )}
            </div>

            <h1
              className="mb-2 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {show.name}
            </h1>

            {show.tagline && (
              <p className="mb-4 text-base italic text-white/40">&ldquo;{show.tagline}&rdquo;</p>
            )}

            <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <MdCalendarToday className="h-3.5 w-3.5" />
                {formatYear(show.first_air_date)}
                {show.last_air_date && show.last_air_date !== show.first_air_date
                  ? ` – ${show.in_production ? "Present" : formatYear(show.last_air_date)}`
                  : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <BiTime className="h-3.5 w-3.5" />
                {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""} · {show.number_of_episodes} Episodes
              </span>
              <span className="flex items-center gap-1.5">
                <MdLanguage className="h-3.5 w-3.5" /> {show.original_language.toUpperCase()}
              </span>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {show.genres?.map((g) => (
                <Link key={g.id} href={`/genre/${g.id}`} className="genre-tag">{g.name}</Link>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              <button onClick={() => handlePlayEpisode(1, 1, episodes.find(e => e.episode_number === 1)?.name)} className="btn-nuttflixx btn-primary text-base">
                <IoPlay className="h-5 w-5" /> Watch S1:E1
              </button>
              <button onClick={handleShare} className="btn-nuttflixx btn-ghost">
                <BsShare className="h-4 w-4" /> {isCopied ? "Copied!" : "Share"}
              </button>
              {imdbId && (
                <a href={`https://www.imdb.com/title/${imdbId}`} target="_blank" rel="noopener noreferrer" className="btn-nuttflixx btn-ghost">
                  <FiExternalLink className="h-4 w-4" /> IMDb
                </a>
              )}
            </div>

            <div className="mb-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/40">Overview</h3>
              <p className="max-w-2xl text-base leading-relaxed text-white/70">
                {show.overview || "No overview available."}
              </p>
            </div>

            {/* Creators */}
            {creators.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-wider text-white/30">Created By</p>
                <p className="mt-1 text-sm font-medium text-white/80">
                  {creators.map((c) => c.name).join(", ")}
                </p>
              </div>
            )}

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

        {/* ─── Seasons & Episodes ─── */}
        {seasons.length > 0 && (
          <div className="mt-8 pb-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="section-title">Episodes</h2>

              {/* Season Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Season {selectedSeason}
                  {currentSeason && ` · ${currentSeason.episode_count} Episodes`}
                  <FiChevronDown className={`h-4 w-4 transition-transform ${seasonDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {seasonDropdownOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 max-h-64 w-64 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a1a] p-2 shadow-2xl backdrop-blur-xl">
                    {seasons.map((s) => (
                      <button
                        key={s.season_number}
                        onClick={() => {
                          if (selectedSeason !== s.season_number) {
                            setSelectedSeason(s.season_number);
                            setLoadingEpisodes(true);
                          }
                          setSeasonDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                          selectedSeason === s.season_number
                            ? "bg-[#e50914]/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-white/30">{s.episode_count} ep · {formatYear(s.air_date)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Episode List */}
            {loadingEpisodes ? (
              <div className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => handlePlayEpisode(selectedSeason, ep.episode_number, ep.name)}
                    className="group flex flex-col sm:flex-row cursor-pointer sm:items-start gap-3 sm:gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 sm:p-4 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center sm:items-start gap-3 sm:gap-4 flex-shrink-0">
                      {/* Episode Number */}
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-lg font-bold text-white/20 sm:mt-2">
                        {ep.episode_number}
                      </span>

                      {/* Still Image */}
                      <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-20 sm:w-36">
                        {ep.still_path ? (
                          <Image
                            src={getStillUrl(ep.still_path, "medium")}
                            alt={ep.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="144px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <IoPlay className="h-6 w-6 text-white/15" />
                          </div>
                        )}
                        {/* Play overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <IoPlay className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Episode Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-white/90 group-hover:text-white">
                        {ep.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                        {ep.runtime && <span>{formatRuntime(ep.runtime)}</span>}
                        {ep.air_date && <span>{formatDate(ep.air_date)}</span>}
                        {ep.vote_average > 0 && (
                          <div className="flex items-center gap-1">
                            <HiStar className="h-3 w-3 text-yellow-400/60" />
                            <span>{formatRating(ep.vote_average)}</span>
                          </div>
                        )}
                      </div>
                      {ep.overview && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/40">
                          {ep.overview}
                        </p>
                      )}
                    </div>

                    {/* Play Button */}
                    <button className="mt-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all group-hover:border-[#e50914] group-hover:bg-[#e50914]/10 group-hover:text-[#e50914]">
                      <IoPlay className="ml-0.5 h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="relative z-10 mt-8">
          <ContentRow title="Recommended For You" items={recommendations} mediaType="tv" />
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div className="relative z-10 mt-2">
          <ContentRow title="Similar Shows" items={similar} mediaType="tv" />
        </div>
      )}
    </div>
  );
}
