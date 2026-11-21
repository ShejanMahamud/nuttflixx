import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — NuttFlixx",
  description: "Privacy Policy for NuttFlixx.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — NuttFlixx",
    description: "Privacy Policy for NuttFlixx.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — NuttFlixx",
    description: "Privacy Policy for NuttFlixx.",
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-20 leading-relaxed text-white/80 md:px-8 lg:px-12">
      <h1
        className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Privacy Policy
      </h1>
      <p className="mb-10 text-lg font-medium text-[#e50914]">
        Disclaimer: We do not host any movies or TV shows. We only link to
        content already available on the internet.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            NuttFlixx is designed to be a completely anonymous streaming directory.
            We do not require you to create an account, and we do not collect
            personally identifiable information such as names, email addresses,
            or phone numbers.
          </p>
          <p>
            We may automatically collect non-personal information such as
            browser type, operating system, and IP address for analytics and
            security purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">2. Cookies</h2>
          <p>
            We use minimal cookies solely to remember your preferences (such as
            theme or UI toggles) and to optimize website performance. You can
            disable cookies in your browser settings at any time, though it may
            affect certain website functionalities.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            3. Third-Party Links & Embeds
          </h2>
          <p className="mb-4">
            NuttFlixx indexes and embeds content from third-party video hosts and
            APIs (like TMDB and video streaming servers).
          </p>
          <p>
            When you click &quot;Play&quot; on a video, you are interacting with a
            third-party service. These third parties may collect data, use
            cookies, or serve advertisements. NuttFlixx has no control over the
            privacy practices of these external websites and services, and we
            strongly encourage you to review their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            4. Changes to This Policy
          </h2>
          <p>
            We reserve the right to update or modify this Privacy Policy at any
            time without prior notice. Continued use of the website indicates
            your acceptance of any changes.
          </p>
        </section>
      </div>
    </div>
  )
}
