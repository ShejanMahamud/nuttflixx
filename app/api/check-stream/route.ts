import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "movie";
  const id = searchParams.get("id");
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const vidlinkUrl =
    type === "tv"
      ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
      : `https://vidlink.pro/movie/${id}`;

  let server1Available = false;
  const server2Available = true; // VAPlayer is the universal fallback

  try {
    const res = await fetch(vidlinkUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(2500),
      next: { revalidate: 3600 },
    });

    server1Available = res.ok && res.status === 200;
  } catch {
    server1Available = false;
  }

  const bestServer = server1Available ? "vidlink" : "vaplayer";

  return NextResponse.json(
    {
      server1Available,
      server2Available,
      bestServer,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
