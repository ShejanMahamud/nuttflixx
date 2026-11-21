import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ — NuttFlixx",
  description: "Frequently Asked Questions about NuttFlixx.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ — NuttFlixx",
    description: "Frequently Asked Questions about NuttFlixx.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — NuttFlixx",
    description: "Frequently Asked Questions about NuttFlixx.",
  },
}

export default function FAQPage() {
  const faqs = [
    {
      question: "What is NuttFlixx?",
      answer:
        "NuttFlixx is a free streaming platform that organizes and provides a beautiful interface for discovering and watching movies and TV shows.",
    },
    {
      question: "Do you host the movies and TV shows?",
      answer:
        "No. NuttFlixx does not host, store, or upload any media content. We simply aggregate links and embed players that are already publicly available on the internet.",
    },
    {
      question: "Is NuttFlixx legal?",
      answer:
        "NuttFlixx only acts as an index and directory of media found publicly on the internet, much like a search engine. We do not control or host any of the media shown.",
    },
    {
      question: "Why do I see ads on the video player?",
      answer:
        "The video players are provided by third-party services. NuttFlixx does not control these third-party players and does not profit from the ads they may display.",
    },
    {
      question: "How often is new content added?",
      answer:
        "Our catalog is synced with TMDB (The Movie Database), meaning our library updates automatically in real-time as new movies and episodes are released globally.",
    },
  ]

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-20 md:px-8 lg:px-12">
      <h1
        className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Frequently Asked Questions
      </h1>
      <p className="mb-10 text-lg font-medium text-[#e50914]">
        Disclaimer: We do not host any movies or TV shows. We only link to
        content already available on the internet.
      </p>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <h3 className="mb-3 text-xl font-bold text-white">
              {faq.question}
            </h3>
            <p className="leading-relaxed text-white/60">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
