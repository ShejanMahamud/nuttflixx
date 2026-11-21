// ─── TMDB API Configuration ───
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const IMAGE_SIZES = {
  poster: { small: `${TMDB_IMAGE_BASE}/w185`, medium: `${TMDB_IMAGE_BASE}/w342`, large: `${TMDB_IMAGE_BASE}/w500`, original: `${TMDB_IMAGE_BASE}/original` },
  backdrop: { small: `${TMDB_IMAGE_BASE}/w780`, large: `${TMDB_IMAGE_BASE}/w1280`, original: `${TMDB_IMAGE_BASE}/original` },
  profile: { small: `${TMDB_IMAGE_BASE}/w185`, medium: `${TMDB_IMAGE_BASE}/h632`, original: `${TMDB_IMAGE_BASE}/original` },
  still: { small: `${TMDB_IMAGE_BASE}/w185`, medium: `${TMDB_IMAGE_BASE}/w300`, large: `${TMDB_IMAGE_BASE}/w500` },
} as const;

// ─── Types ───

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  adult: boolean;
  media_type?: "movie";
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  media_type?: "tv";
}

export interface MovieDetails extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  genres: Genre[];
  production_companies: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  spoken_languages: { english_name: string; iso_639_1: string }[];
  imdb_id: string | null;
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
  videos?: { results: Video[] };
}

export interface TVShowDetails extends TVShow {
  created_by: { id: number; name: string; profile_path: string | null }[];
  episode_run_time: number[];
  genres: Genre[];
  in_production: boolean;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  external_ids?: { imdb_id: string | null; tvdb_id: number | null };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: TVShow[] };
  recommendations?: { results: TVShow[] };
  videos?: { results: Video[] };
}

export interface Genre { id: number; name: string; }

export interface Season {
  id: number;
  air_date: string | null;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  runtime: number | null;
  crew: CrewMember[];
  guest_stars: CastMember[];
}

export interface SeasonDetails {
  id: number;
  air_date: string | null;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
  vote_average: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export type MediaItem = (Movie & { media_type: "movie" }) | (TVShow & { media_type: "tv" });

export const MOVIE_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

export const TV_GENRES: Record<number, string> = {
  10759: "Action & Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids", 9648: "Mystery",
  10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap",
  10767: "Talk", 10768: "War & Politics", 37: "Western",
};

// ─── Core Fetch Helper ───

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate: number = 86400
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not configured. Set NEXT_PUBLIC_TMDB_API_KEY in .env.local");
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    ...params,
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;

  const res = await fetch(url, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText} for ${endpoint}`);
  }

  return res.json() as Promise<T>;
}

// ─── Trending ───

export async function getTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>(`/trending/${mediaType}/${timeWindow}`);
  return data.results;
}

// ─── Movie Endpoints ───

export async function getPopularMovies(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/popular", { page: String(page) });
  return data.results;
}

export async function getTopRatedMovies(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/top_rated", { page: String(page) });
  return data.results;
}

export async function getNowPlayingMovies(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/now_playing", { page: String(page) });
  return data.results;
}

export async function getUpcomingMovies(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/upcoming", { page: String(page) });
  return data.results;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return tmdbFetch<MovieDetails>(`/movie/${movieId}`, {
    append_to_response: "credits,similar,recommendations,videos",
  });
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: Movie[]; total_pages: number }>("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });
  return { results: data.results, total_pages: data.total_pages };
}

// ─── TV Show Endpoints ───

export async function getPopularTVShows(page = 1): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>("/tv/popular", { page: String(page) });
  return data.results;
}

export async function getTopRatedTVShows(page = 1): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>("/tv/top_rated", { page: String(page) });
  return data.results;
}

export async function getOnAirTVShows(page = 1): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>("/tv/on_the_air", { page: String(page) });
  return data.results;
}

export async function getAiringTodayTVShows(page = 1): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>("/tv/airing_today", { page: String(page) });
  return data.results;
}

export async function getTVShowDetails(tvId: number): Promise<TVShowDetails> {
  return tmdbFetch<TVShowDetails>(`/tv/${tvId}`, {
    append_to_response: "credits,similar,recommendations,videos,external_ids",
  });
}

export async function getSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
  return tmdbFetch<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getTVShowsByGenre(genreId: number, page = 1): Promise<{ results: TVShow[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: TVShow[]; total_pages: number }>("/discover/tv", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });
  return { results: data.results, total_pages: data.total_pages };
}

// ─── Search ───

export async function searchMulti(query: string, page = 1) {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number; total_results: number }>(
    "/search/multi",
    { query, page: String(page), include_adult: "false" }
  );
  // Filter out people results
  data.results = data.results.filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );
  return data;
}

// ─── Utility Functions ───

export function getPosterUrl(path: string | null, size: keyof typeof IMAGE_SIZES.poster = "medium"): string {
  if (!path) return "/placeholder-poster.svg";
  return `${IMAGE_SIZES.poster[size]}${path}`;
}

export function getBackdropUrl(path: string | null, size: keyof typeof IMAGE_SIZES.backdrop = "large"): string {
  if (!path) return "/placeholder-backdrop.svg";
  return `${IMAGE_SIZES.backdrop[size]}${path}`;
}

export function getProfileUrl(path: string | null, size: keyof typeof IMAGE_SIZES.profile = "medium"): string {
  if (!path) return "";
  return `${IMAGE_SIZES.profile[size]}${path}`;
}

export function getStillUrl(path: string | null, size: keyof typeof IMAGE_SIZES.still = "medium"): string {
  if (!path) return "";
  return `${IMAGE_SIZES.still[size]}${path}`;
}

export function getGenreName(genreId: number, mediaType: "movie" | "tv" = "movie"): string {
  return (mediaType === "tv" ? TV_GENRES[genreId] : MOVIE_GENRES[genreId]) || "Unknown";
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatYear(dateString: string | null | undefined): string {
  if (!dateString) return "TBA";
  return new Date(dateString).getFullYear().toString();
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "TBA";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTrailerKey(videos: Video[] | undefined): string | null {
  if (!videos?.length) return null;
  const trailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  ) || videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  ) || videos.find(
    (v) => v.site === "YouTube"
  );
  return trailer?.key || null;
}
