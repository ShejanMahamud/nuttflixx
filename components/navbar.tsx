"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
            : "bg-gradient-to-b from-[#0a0a0a]/80 to-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-3 md:px-8 lg:px-12">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-1">
            <span className="text-2xl font-black tracking-tight text-white transition-all duration-300 md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}>
              Nutt<span className="text-[#e50914] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.6)]">Flixx</span>
            </span>
          </Link>


          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form 
                  onSubmit={handleSearchSubmit} 
                  className="animate-fade-in absolute inset-y-0 right-0 flex w-[calc(100vw-32px)] items-center md:static md:w-auto"
                >
                  <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-black/95 px-4 py-2 backdrop-blur-lg md:bg-black/80">
                    <IoSearch className="h-4 w-4 flex-shrink-0 text-white/60" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search movies, shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none md:w-56"
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="flex-shrink-0">
                      <IoClose className="h-4 w-4 text-white/60 transition-colors hover:text-white" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <IoSearch className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
