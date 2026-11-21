import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — NuttFlixx",
  description: "Terms of Service for NuttFlixx.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — NuttFlixx",
    description: "Terms of Service for NuttFlixx.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — NuttFlixx",
    description: "Terms of Service for NuttFlixx.",
  },
}

export default function TermsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-20 leading-relaxed text-white/80 md:px-8 lg:px-12">
      <h1
        className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Terms of Service
      </h1>
      <p className="mb-10 text-lg font-medium text-[#e50914]">
        Disclaimer: We do not host any movies or TV shows. We only link to
        content already available on the internet.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using NuttFlixx, you agree to be bound by these Terms
            of Service. If you do not agree with any part of these terms, you
            are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            2. Nature of Service
          </h2>
          <p className="mb-4">
            NuttFlixx is an indexing platform and search engine for media.{" "}
            <strong>
              NuttFlixx does not host, upload, or manage any copyrighted media
              files.
            </strong>{" "}
            We merely scrape, aggregate, and embed links to media files that are
            publicly available on third-party domains.
          </p>
          <p>
            We do not control the servers where this content is hosted and
            therefore cannot be held responsible for the legality, accuracy, or
            quality of the content.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            3. External Links & Third-Party Content
          </h2>
          <p className="mb-4">
            Our platform contains iframes and links to external websites that
            are not operated by us. Clicking on a video player means you are
            interacting with third-party software.
          </p>
          <p>
            We have no control over, and assume no responsibility for, the
            content, privacy policies, pop-up ads, or practices of any
            third-party websites or services.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            4. DMCA & Copyright Infringement
          </h2>
          <p>
            If you are a copyright owner and find your content embedded on our
            site, please be aware that the media files are hosted externally.
            Removing the embed link from NuttFlixx will not take down the video
            from the internet. You must contact the third-party file hosting
            service directly to have the content permanently removed.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            5. Disclaimer of Warranties
          </h2>
          <p>
            NuttFlixx is provided &quot;as is&quot; without any warranties, expressed or
            implied. We do not guarantee that the site will be available at all
            times, secure, or free of errors. Your use of the website is
            entirely at your own risk.
          </p>
        </section>
      </div>
    </div>
  )
}
