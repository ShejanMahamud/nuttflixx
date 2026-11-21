import { getTVShowDetails } from "@/lib/tmdb"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import SeriesDetailClient from "./series-detail-client"

export const revalidate = 86400 // revalidate every 24 hours

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const show = await getTVShowDetails(Number(id))
    const title = `${show.name} (${show.first_air_date ? new Date(show.first_air_date).getFullYear() : "TBA"})`
    const description =
      show.overview || `Watch ${show.name} on NuttFlixx for free.`

    return {
      title: title,
      description: description,
      alternates: {
        canonical: `/series/${id}`,
      },
      openGraph: {
        title: title,
        description: description,
        type: "video.tv_show",
        url: `/series/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
      },
    }
  } catch {
    return { title: "TV Show — NuttFlixx" }
  }
}

export default async function SeriesPage({ params }: Props) {
  const { id } = await params
  let show: Awaited<ReturnType<typeof getTVShowDetails>> | null = null

  try {
    show = await getTVShowDetails(Number(id))
  } catch {
    notFound()
  }

  if (!show) {
    notFound()
  }

  return <SeriesDetailClient show={show} />
}
