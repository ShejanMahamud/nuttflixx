import { Metadata } from "next"
import { IoMail } from "react-icons/io5"

export const metadata: Metadata = {
  title: "Contact Us — NuttFlixx",
  description: "Get in touch with the NuttFlixx team.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us — NuttFlixx",
    description: "Get in touch with the NuttFlixx team.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — NuttFlixx",
    description: "Get in touch with the NuttFlixx team.",
  },
}

export default function ContactPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-20 md:px-8 lg:px-12">
      <h1
        className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Contact Us
      </h1>
      <p className="mb-10 text-lg font-medium text-[#e50914]">
        Disclaimer: We do not host any movies or TV shows. We only link to
        content already available on the internet.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <h2 className="mb-4 text-2xl font-bold text-white">DMCA & Copyright</h2>
        <p className="mb-6 leading-relaxed text-white/60">
          NuttFlixx respects the intellectual property rights of others. We do not
          host, upload, or store any video files on our servers. All media
          content is hosted by non-affiliated third parties.
        </p>
        <p className="mb-8 leading-relaxed text-white/60">
          If you are a copyright owner or an agent thereof and believe that any
          content linked on NuttFlixx infringes upon your copyright, please direct
          your DMCA notices directly to the third-party platforms hosting the
          files. Removing links from NuttFlixx will not remove the source files
          from the internet.
        </p>

        <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-black/40 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e50914]/20 text-[#e50914]">
            <IoMail className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold tracking-wider text-white/40 uppercase">
              Email Us
            </p>
            <p className="font-medium text-white">contact@nuttflixx.example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
