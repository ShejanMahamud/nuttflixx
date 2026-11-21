import { MOVIE_GENRES, TV_GENRES } from "@/lib/tmdb"
import { ImageResponse } from "next/og"

export const revalidate = 3600
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"
export const alt = "Genre on NuttFlixx"

interface Props {
  params: Promise<{ id: string }>
}

const genreColors: { [key: number]: string } = {
  28: "#FF6B6B", // Action
  12: "#4ECDC4", // Adventure
  16: "#FFE66D", // Animation
  35: "#95E1D3", // Comedy
  80: "#7A4498", // Crime
  99: "#003366", // Documentary
  18: "#FF69B4", // Drama
  10751: "#FF8C42", // Family
  14: "#9B59B6", // Fantasy
  27: "#2C3E50", // Horror
  10402: "#F39C12", // Music
  9648: "#34495E", // Mystery
  10749: "#E91E63", // Romance
  878: "#00BCD4", // Science Fiction
  10770: "#FF5722", // TV Movie
  53: "#E74C3C", // Thriller
  10752: "#2ECC71", // War
  37: "#34495E", // Western
  10759: "#FF6B9D", // Action & Adventure
  10762: "#9B59B6", // Kids
  10763: "#3498DB", // News
  10764: "#16A085", // Reality
  10765: "#8E44AD", // Sci-Fi & Fantasy
  10766: "#27AE60", // Soap
  10767: "#F39C12", // Talk
  10768: "#C0392B", // War & Politics
}

export default async function Image({ params }: Props) {
  const { id } = await params
  const genreId = Number(id)
  const genreName = MOVIE_GENRES[genreId] || TV_GENRES[genreId] || "Genre"
  const color = genreColors[genreId] || "#e50914"

  return new ImageResponse(
    <div
      style={{
        background: `linear-gradient(135deg, #0a0a0a 0%, ${color}20 100%)`,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent circle */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          top: "-200px",
          right: "-200px",
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
            marginBottom: "30px",
          }}
        >
          <span style={{ fontSize: 60, fontWeight: 900, color: "white" }}>
            Plaa
          </span>
          <span style={{ fontSize: 60, fontWeight: 900, color: "#e50914" }}>
            a
          </span>
          <span style={{ fontSize: 60, fontWeight: 900, color: "white" }}>
            y
          </span>
        </div>

        {/* Genre Name */}
        <div style={{ marginBottom: "20px", maxWidth: "900px" }}>
          <h1
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: color,
              margin: "0",
              lineHeight: 1.2,
              textTransform: "uppercase",
              letterSpacing: "-2px",
            }}
          >
            {genreName}
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.7)",
            margin: "20px 0 0 0",
          }}
        >
          Movies & TV Shows
        </p>

        {/* Decorative line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: color,
            borderRadius: "2px",
            marginTop: "30px",
          }}
        />
      </div>
    </div>,
    size
  )
}
