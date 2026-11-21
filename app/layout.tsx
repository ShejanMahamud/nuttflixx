import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { getBaseUrl } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import AntiAdblockModal from "@/components/anti-adblock-modal"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "NuttFlixx — Stream Movies & TV Shows Free",
    template: "%s | NuttFlixx",
  },
  description:
    "NuttFlixx is your ultimate destination for streaming movies and TV shows. No sign-up required. Just press play.",
  keywords: [
    "movies",
    "tv shows",
    "streaming",
    "free movies",
    "watch online",
    "nuttflixx",
    "hd movies",
    "series",
  ],
  authors: [{ name: "NuttFlixx" }],
  creator: "NuttFlixx",
  publisher: "NuttFlixx",
  applicationName: "NuttFlixx",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NuttFlixx — Stream Movies & TV Shows Free",
    description:
      "Stream unlimited movies and TV shows. No subscriptions, no limits.",
    siteName: "NuttFlixx",
    locale: "en_US",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NuttFlixx - Free Streaming Movies and TV Shows",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NuttFlixx — Stream Movies & TV Shows Free",
    description:
      "Stream unlimited movies and TV shows. No subscriptions, no limits.",
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: "NuttFlixx - Free Streaming",
      },
    ],
    creator: "@nuttflixx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white antialiased">
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
        <Analytics />
        <AntiAdblockModal />
        <Script
          src="https://aarems.org/1/58ecddbe51f824ba33eeb2fd5f7b5d2c"
          strategy="afterInteractive"
          data-cfasync="false"
        />
      </body>
    </html>
  )
}
