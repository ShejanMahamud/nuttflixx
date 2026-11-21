import ContentCard from "@/components/content-card"
import Pagination from "@/components/pagination"
import { searchMulti } from "@/lib/tmdb"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Movies & TV Shows — NuttFlixx",
  description: "Search and discover movies and TV shows on NuttFlixx.",
  openGraph: {
    title: "Search Movies & TV Shows — NuttFlixx",
    description: "Search and discover movies and TV shows on NuttFlixx.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Movies & TV Shows — NuttFlixx",
    description: "Search and discover movies and TV shows on NuttFlixx.",
  },
}

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageStr } = await searchParams
  const query = q || ""
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1

  if (!query) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold text-white/50">
          Enter a search term to find movies and TV shows
        </h1>
      </div>
    )
  }

  const data = await searchMulti(query, currentPage).catch(() => ({
    results: [],
    total_pages: 0,
  }))
  const results = data?.results || []
  const totalPages = data?.total_pages || 0

  return (
    <div className="mx-auto min-h-screen max-w-[1800px] px-4 pt-24 pb-12 md:px-8 lg:px-12">
      <h1 className="mb-8 text-2xl font-semibold text-white md:text-3xl">
        Search results for{" "}
        <span className="text-[#e50914]">&quot;{query}&quot;</span>
      </h1>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <p className="text-xl text-white/50">
            No results found for &quot;{query}&quot;.
          </p>
          <p className="mt-2 text-sm text-white/30">
            Try suggesting different keywords or adjusting your search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {results.map((item, i) => (
              <ContentCard
                key={item.id}
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
            baseUrl={`/search?q=${encodeURIComponent(query)}`}
          />
        </>
      )}
    </div>
  )
}
