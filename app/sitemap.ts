import { MetadataRoute } from "next";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/tmdb";
import { getBaseUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  // Static core routes
  const staticRoutes = [
    "",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.7,
  }));

  // Genre discovery routes (movies + tv shows combined keys)
  const genreKeys = new Set([...Object.keys(MOVIE_GENRES), ...Object.keys(TV_GENRES)]);
  const genreRoutes = Array.from(genreKeys).map((id) => ({
    url: `${baseUrl}/genre/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...genreRoutes];
}
