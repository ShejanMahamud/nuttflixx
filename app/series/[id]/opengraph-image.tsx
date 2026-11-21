import { getTVShowDetails } from "@/lib/tmdb"
import { ImageResponse } from "next/og"

export const revalidate = 3600
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"
export const alt = "TV Series on NuttFlixx"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Image({ params }: Props) {
  const { id } = await params

  try {
    const show = await getTVShowDetails(Number(id))

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
        {/* Backdrop background with overlay */}
        {show.backdrop_path && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('https://image.tmdb.org/t/p/w1280${show.backdrop_path}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.3,
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 0, 0, 0.9) 100%)",
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
            padding: "40px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: 60, fontWeight: 900, color: "white" }}>
              Nutt
            </span>
            <span style={{ fontSize: 60, fontWeight: 900, color: "#e50914" }}>
              Flixx
            </span>
          </div>

          {/* Series Title */}
          <div style={{ marginBottom: "20px", maxWidth: "900px" }}>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "white",
                margin: "0 0 10px 0",
                lineHeight: 1.2,
              }}
            >
              {show.name}
            </h1>
            {show.first_air_date && (
              <p
                style={{
                  fontSize: 32,
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: 0,
                }}
              >
                {new Date(show.first_air_date).getFullYear()} •{" "}
                {show.number_of_seasons} Season
                {show.number_of_seasons > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Description */}
          {show.overview && (
            <p
              style={{
                fontSize: 24,
                color: "rgba(255, 255, 255, 0.6)",
                margin: "20px 0 0 0",
                maxWidth: "800px",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {show.overview}
            </p>
          )}

          {/* Rating */}
          {show.vote_average > 0 && (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{ fontSize: 28, color: "#e50914", fontWeight: "bold" }}
              >
                ⭐
              </span>
              <span
                style={{ fontSize: 28, color: "white", fontWeight: "bold" }}
              >
                {(show.vote_average / 2).toFixed(1)}/5
              </span>
            </div>
          )}
        </div>
      </div>,
      size
    )
  } catch {
    // Fallback image if series data fails to load
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
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: 80, fontWeight: 900, color: "white" }}>
            Plaa
          </span>
          <span style={{ fontSize: 80, fontWeight: 900, color: "#e50914" }}>
            a
          </span>
          <span style={{ fontSize: 80, fontWeight: 900, color: "white" }}>
            y
          </span>
        </div>
        <p style={{ fontSize: 40, color: "rgba(255, 255, 255, 0.7)" }}>
          Watch Series Free
        </p>
      </div>,
      size
    )
  }
}
