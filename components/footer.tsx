"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const FOOTER_LINKS = {
  "Genres": [
    { href: "/genre/28", label: "Action" },
    { href: "/genre/35", label: "Comedy" },
    { href: "/genre/18", label: "Drama" },
    { href: "/genre/27", label: "Horror" },
  ],
  "Help": [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1800px] px-4 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group inline-block">
              <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Nutt<span className="text-[#e50914]">Flixx</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#808080]">
              Stream unlimited movies and TV shows. No subscriptions, no limits. Just press play.
            </p>
            <div className="mt-4 flex gap-3">
              {[FaGithub, FaTwitter, FaInstagram].map((Icon, i) => (
                <button key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#808080] transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-[#808080]">
            © {new Date().getFullYear()} NuttFlixx. All rights reserved. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs text-[#808080]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
