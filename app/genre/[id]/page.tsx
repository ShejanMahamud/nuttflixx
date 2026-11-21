import ContentCard from "@/components/content-card"
import Pagination from "@/components/pagination"
import {
  getMoviesByGenre,
  getTVShowsByGenre,
  MOVIE_GENRES,
  TV_GENRES,
  type MediaItem,
} from "@/lib/tmdb"
import { Metadata } from "next"

export const revalidate = 43200 // revalidate every 12 hours

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const genreId = Number(id)
  const genreName = MOVIE_GENRES[genreId] || TV_GENRES[genreId] || "Genre"

  return {
    title: `${genreName} Movies & TV Shows — NuttFlixx`,
    description: `Watch the best ${genreName} movies and TV shows on NuttFlixx.`,
    alternates: {
      canonical: `/genre/${id}`,
    },
    openGraph: {
      title: `${genreName} Movies & TV Shows — NuttFlixx`,
      description: `Watch the best ${genreName} movies and TV shows on NuttFlixx.`,
      type: "website",
      url: `/genre/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${genreName} Movies & TV Shows — NuttFlixx`,
      description: `Watch the best ${genreName} movies and TV shows on NuttFlixx.`,
    },
  }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { id } = await params
  const genreId = Number(id)
  const genreName = MOVIE_GENRES[genreId] || TV_GENRES[genreId] || "Content"

  const { page: pageStr } = await searchParams
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1

  // Fetch movies and TV shows for this genre in parallel
  const [moviesData, tvShowsData] = await Promise.all([
    getMoviesByGenre(genreId, currentPage).catch(() => ({
      results: [],
      total_pages: 0,
    })),
    getTVShowsByGenre(genreId, currentPage).catch(() => ({
      results: [],
      total_pages: 0,
    })),
  ])

  const movies = moviesData?.results || []
  const tvShows = tvShowsData?.results || []

  const totalPages = Math.max(
    moviesData?.total_pages || 0,
    tvShowsData?.total_pages || 0
  )

  // Combine and sort by popularity
  const combined: MediaItem[] = [
    ...movies.map((m) => ({ ...m, media_type: "movie" as const })),
    ...tvShows.map((tv) => ({ ...tv, media_type: "tv" as const })),
  ].sort((a, b) => b.popularity - a.popularity)

  return (
    <div className="mx-auto min-h-screen max-w-[1800px] px-4 pt-24 pb-12 md:px-8 lg:px-12">
      <div className="mb-8">
        <h1
          className="text-3xl font-black tracking-tight text-white md:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {genreName}
        </h1>
        <p className="mt-2 text-sm text-white/50 md:text-base">
          Explore the most popular {genreName.toLowerCase()} movies and TV
          series
        </p>
      </div>

      {combined.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">🎬</div>
          <p className="text-xl text-white/50">
            No content found for this genre.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {combined.map((item, i) => (
              <ContentCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                mediaType={item.media_type as "movie" | "tv"}
                index={i}
                className="w-full"
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/genre/${genreId}`}
          />
        </>
      )}
    </div>
  )
}
