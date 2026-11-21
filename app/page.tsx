import ContentRow from "@/components/content-row"
import ContinueWatchingRow from "@/components/continue-watching-row"
import GenreStrip from "@/components/genre-strip"
import HeroBanner from "@/components/hero-banner"
import TopTenRow from "@/components/top-ten-row"
import {
  getNowPlayingMovies,
  getOnAirTVShows,
  getPopularMovies,
  getPopularTVShows,
  getTopRatedMovies,
  getTopRatedTVShows,
  getTrending,
  getUpcomingMovies,
  type MediaItem,
} from "@/lib/tmdb"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const title = "NuttFlixx — Stream Movies & TV Shows Free"
  const description =
    "NuttFlixx is your ultimate destination for streaming movies and TV shows. No sign-up required. Just press play."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export const revalidate = 21600 // revalidate every 6 hours

export default async function HomePage() {
  // Fetch all data in parallel for maximum performance
  const [
    trending,
    popularMovies,
    topRatedMovies,
    nowPlaying,
    upcoming,
    popularTV,
    topRatedTV,
    onAirTV,
  ] = await Promise.all([
    getTrending("all", "week").catch(() => []),
    getPopularMovies().catch(() => []),
    getTopRatedMovies().catch(() => []),
    getNowPlayingMovies().catch(() => []),
    getUpcomingMovies().catch(() => []),
    getPopularTVShows().catch(() => []),
    getTopRatedTVShows().catch(() => []),
    getOnAirTVShows().catch(() => []),
  ])

  // Pick featured items for the hero banner: trending items with good backdrops
  const heroItems = (trending as MediaItem[])
    .filter((item) => item.backdrop_path && item.overview)
    .slice(0, 6)

  return (
    <div className="relative">
      {/* Hero Carousel */}
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      {/* Content Sections */}
      <div
        className={`relative z-10 space-y-6 pb-16 md:space-y-10 ${heroItems.length > 0 ? "-mt-16 md:-mt-24" : "pt-24"}`}
      >
        {/* Genre Quick Access */}
        <GenreStrip />

        {/* Continue Watching */}
        <ContinueWatchingRow />

        {/* Top 10 Trending */}
        {popularMovies.length > 0 && (
          <TopTenRow
            title="Top 10 Movies Today"
            items={popularMovies.slice(0, 10)}
            mediaType="movie"
          />
        )}

        {/* Trending This Week */}
        {trending.length > 0 && (
          <ContentRow
            title="Trending This Week"
            subtitle="What everyone is watching"
            items={trending
              .filter(
                (item): item is MediaItem & { media_type: "movie" } =>
                  item.media_type === "movie"
              )
              .slice(0, 20)}
            mediaType="movie"
            href="/trending"
          />
        )}

        {/* Popular TV Shows */}
        {popularTV.length > 0 && (
          <ContentRow
            title="Popular TV Shows"
            subtitle="Binge-worthy series"
            items={popularTV}
            mediaType="tv"
            variant="backdrop"
            href="/series"
          />
        )}

        {/* Now Playing in Theaters */}
        {nowPlaying.length > 0 && (
          <ContentRow
            title="Now Playing in Theaters"
            subtitle="Currently on the big screen"
            items={nowPlaying}
            mediaType="movie"
          />
        )}

        {/* Top Rated Movies */}
        {topRatedMovies.length > 0 && (
          <ContentRow
            title="Top Rated Movies"
            subtitle="Critically acclaimed masterpieces"
            items={topRatedMovies}
            mediaType="movie"
          />
        )}

        {/* On Air TV */}
        {onAirTV.length > 0 && (
          <ContentRow
            title="Currently Airing Shows"
            subtitle="New episodes every week"
            items={onAirTV}
            mediaType="tv"
          />
        )}

        {/* Top Rated TV */}
        {topRatedTV.length > 0 && (
          <ContentRow
            title="Top Rated TV Shows"
            subtitle="The best series of all time"
            items={topRatedTV}
            mediaType="tv"
            variant="backdrop"
          />
        )}

        {/* Coming Soon */}
        {upcoming.length > 0 && (
          <ContentRow
            title="Coming Soon"
            subtitle="Upcoming releases to look forward to"
            items={upcoming}
            mediaType="movie"
          />
        )}

        {/* Trending TV */}
        {trending.length > 0 && (
          <ContentRow
            title="Trending TV Shows"
            items={trending
              .filter(
                (item): item is MediaItem & { media_type: "tv" } =>
                  item.media_type === "tv"
              )
              .slice(0, 20)}
            mediaType="tv"
          />
        )}
      </div>
    </div>
  )
}
