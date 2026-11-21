import type { MediaItem } from "@/lib/tmdb"
import { getTrending } from "@/lib/tmdb"
import { ImageResponse } from "next/og"

export const alt = "NuttFlixx - Free Streaming Movies and TV Shows"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"
export const revalidate = 3600

export default async function Image() {
  try {
    const trending = await getTrending("all", "week").catch(() => [])
    const trendingMovie = (trending as MediaItem[]).find(
      (item) =>
        item.media_type === "movie" && item.backdrop_path && item.overview
    )

    if (trendingMovie && trendingMovie.media_type === "movie") {
      const title = trendingMovie.title || "Trending Now"
      const year = trendingMovie.release_date
        ? new Date(trendingMovie.release_date).getFullYear()
        : new Date().getFullYear()

      return new ImageResponse(
        <div
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Backdrop with overlay */}
          {trendingMovie.backdrop_path && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('https://image.tmdb.org/t/p/w1280${trendingMovie.backdrop_path}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.25,
              }}
            />
          )}

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(10, 10, 10, 0.85) 0%, rgba(26, 0, 0, 0.95) 100%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              zIndex: 1,
              padding: "60px 40px",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: "white",
                }}
              >
                Nutt
              </span>
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: "#e50914",
                }}
              >
                Flixx
              </span>
            </div>

            {/* Trending badge */}
            <div
              style={{
                fontSize: 20,
                color: "#e50914",
                fontWeight: "bold",
                marginBottom: "15px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              ⭐ Trending Now
            </div>

            {/* Movie Title */}
            <h1
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "white",
                margin: "0 0 10px 0",
                lineHeight: 1.2,
                maxWidth: "1000px",
              }}
            >
              {title}
            </h1>

            {/* Year */}
            <p
              style={{
                fontSize: 28,
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0 0 20px 0",
              }}
            >
              {year}
            </p>

            {/* Description */}
            {trendingMovie.overview && (
              <p
                style={{
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: "20px 0 0 0",
                  maxWidth: "900px",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {trendingMovie.overview}
              </p>
            )}

            {/* CTA */}
            <p
              style={{
                fontSize: 18,
                color: "#e50914",
                marginTop: "30px",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              ▶ WATCH FREE NOW
            </p>
          </div>
        </div>,
        size
      )
    }

    // Fallback to generic NuttFlixx image
    return new ImageResponse(
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
            }}
          >
            Nutt
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#e50914",
            }}
          >
            Flixx
          </span>
        </div>
        <p
          style={{
            fontSize: 40,
            color: "rgba(255, 255, 255, 0.7)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Stream Movies & TV Shows
        </p>
        <p
          style={{
            fontSize: 32,
            color: "#e50914",
            margin: "10px 0 0 0",
            fontWeight: "bold",
          }}
        >
          100% Free.
        </p>
      </div>,
      size
    )
  } catch {}

  // Fallback if everything fails
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "white",
          }}
        >
          Nutt
        </span>
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#e50914",
          }}
        >
          Flixx
        </span>
      </div>
      <p
        style={{
          fontSize: 40,
          color: "rgba(255, 255, 255, 0.7)",
          margin: 0,
          textAlign: "center",
        }}
      >
        Stream Movies & TV Shows
      </p>
      <p
        style={{
          fontSize: 32,
          color: "#e50914",
          margin: "10px 0 0 0",
          fontWeight: "bold",
        }}
      >
        100% Free.
      </p>
    </div>,
    size
  )
}
