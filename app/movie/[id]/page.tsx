import { getMovieDetails } from "@/lib/tmdb"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import MovieDetailClient from "./movie-detail-client"

export const revalidate = 86400 // revalidate every 24 hours

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const movie = await getMovieDetails(Number(id))
    const title = `${movie.title} (${movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"})`
    const description =
      movie.overview || `Watch ${movie.title} on NuttFlixx for free.`

    return {
      title: title,
      description: description,
      alternates: {
        canonical: `/movie/${id}`,
      },
      openGraph: {
        title: title,
        description: description,
        type: "video.movie",
        url: `/movie/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
      },
    }
  } catch {
    return { title: "Movie — NuttFlixx" }
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params
  let movie: Awaited<ReturnType<typeof getMovieDetails>> | null = null

  try {
    movie = await getMovieDetails(Number(id))
  } catch {
    notFound()
  }

  if (!movie) {
    notFound()
  }

  return <MovieDetailClient movie={movie} />
}
