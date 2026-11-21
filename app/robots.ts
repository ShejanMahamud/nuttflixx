import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search?q="], // Prevent search query spam indexing
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
