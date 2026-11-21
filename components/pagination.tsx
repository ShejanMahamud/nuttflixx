import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // The base URL with any necessary search params (e.g. "/search?q=query&")
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Max pages to display from TMDB is 500
  const maxPages = Math.min(totalPages, 500);

  // Generate an array of page numbers to show
  let pages: (number | string)[] = [];
  if (maxPages <= 7) {
    pages = Array.from({ length: maxPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 4) {
      pages = [1, 2, 3, 4, 5, "...", maxPages];
    } else if (currentPage >= maxPages - 3) {
      pages = [1, "...", maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1, maxPages];
    } else {
      pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", maxPages];
    }
  }

  // Handle URL creation correctly depending on whether the baseUrl already has query params
  const createUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="mt-12 mb-8 flex items-center justify-center gap-2">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createUrl(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <IoChevronBack className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-transparent text-white/20 cursor-not-allowed"
        >
          <IoChevronBack className="h-4 w-4" />
        </button>
      )}

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-white/40">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <Link
            key={page}
            href={createUrl(page as number)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all text-sm font-medium ${
              isCurrent
                ? "border-[#e50914] bg-[#e50914]/10 text-[#e50914]"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < maxPages ? (
        <Link
          href={createUrl(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <IoChevronForward className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-transparent text-white/20 cursor-not-allowed"
        >
          <IoChevronForward className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
