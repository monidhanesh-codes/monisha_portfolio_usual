"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AboutMePopup from "./AboutMePopup";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "AI Lab", href: "/ai-lab" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center py-4 px-4 sm:px-6 pointer-events-none w-full">
        {/* Desktop Frosted Glass Navigation Bar */}
        <nav
          aria-label="Main Navigation"
          className={`hidden md:block pointer-events-auto transition-all duration-300 rounded-full px-8 py-3 mx-auto max-w-[calc(100vw-2rem)] ${
            scrolled
              ? "bg-[#142B52]/50 backdrop-blur-2xl border border-[#F2F6FA]/15 shadow-2xl shadow-[#0b1528]/80 ring-1 ring-white/10"
              : "bg-[#142B52]/35 backdrop-blur-xl border border-[#F2F6FA]/12 shadow-xl shadow-[#0b1528]/50"
          }`}
        >
          <div className="flex items-center gap-8">
            {/* Interactive Profile Avatar Button */}
            <button
              type="button"
              onClick={() => setIsAboutMeOpen(!isAboutMeOpen)}
              className="group relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/50 rounded-full cursor-pointer transition-all duration-300"
              aria-label="Open About Me profile"
              aria-expanded={isAboutMeOpen}
            >
              {/* Futuristic Soft Sci-Fi Chat Bubble on Hover (Positioned to the Left Side) */}
              <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-30 flex items-center">
                <div className="px-3.5 py-1 rounded-full bg-[#142B52]/95 backdrop-blur-md border border-[#72E6E8]/75 shadow-[0_0_15px_rgba(114,230,232,0.4)] text-[13px] font-semibold text-[#72E6E8] tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#72E6E8] animate-pulse" />
                  Monisha
                </div>
                {/* Right-pointing Chat Bubble Pointer */}
                <div className="w-2 h-2 -ml-1 rotate-45 bg-[#142B52] border-t border-r border-[#72E6E8]/75" />
              </div>

              <div className="relative flex items-center justify-center">
                <img
                  src="/avatar.jpg"
                  alt="Monisha Dhanesh Avatar"
                  className={`w-9 h-9 rounded-full object-cover object-top border transition-all duration-300 ${
                    isAboutMeOpen
                      ? "border-[#72E6E8] shadow-[0_0_18px_rgba(114,230,232,0.7)] brightness-110 scale-105"
                      : "border-[#72E6E8]/40 shadow-[0_0_10px_rgba(114,230,232,0.35)] group-hover:scale-105 group-hover:border-[#72E6E8] group-hover:shadow-[0_0_15px_rgba(114,230,232,0.5)] group-hover:brightness-105"
                  }`}
                />
              </div>
            </button>

            <ul className="flex items-center gap-10 list-none m-0 p-0">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={`text-[17px] font-medium tracking-tight transition-all duration-300 relative inline-flex items-center flex-col py-1 ${
                        isActive
                          ? "text-[#72E6E8] glow-cyan-subtle font-semibold"
                          : "text-[#B7C7D9] hover:text-[#72E6E8] hover:drop-shadow-[0_0_8px_rgba(114,230,232,0.6)]"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Mobile Top Navigation Header (Grouped Avatar, Name & Menu Controls in One Pill) */}
        <div className="flex md:hidden items-center justify-center pointer-events-auto mx-auto">
          <div className="flex items-center gap-3 pl-1.5 pr-2 py-1.5 rounded-full bg-[#142B52]/50 backdrop-blur-2xl border border-[#F2F6FA]/15 shadow-xl shadow-[#0b1528]/60 ring-1 ring-white/10">
            {/* Avatar Button + Name Link */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsAboutMeOpen(!isAboutMeOpen)}
                className="group relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/50 rounded-full cursor-pointer"
                aria-label="Open About Me profile"
                aria-expanded={isAboutMeOpen}
              >
                {/* Futuristic Soft Sci-Fi Chat Bubble on Hover (Positioned to the Left Side) */}
                <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-30 flex items-center">
                  <div className="px-2.5 py-0.5 rounded-full bg-[#142B52]/95 backdrop-blur-md border border-[#72E6E8]/75 shadow-[0_0_12px_rgba(114,230,232,0.4)] text-xs font-semibold text-[#72E6E8] tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72E6E8] animate-pulse" />
                    Monisha
                  </div>
                  <div className="w-1.5 h-1.5 -ml-1 rotate-45 bg-[#142B52] border-t border-r border-[#72E6E8]/75" />
                </div>

                <img
                  src="/avatar.jpg"
                  alt="Monisha Dhanesh Avatar"
                  className={`w-8 h-8 rounded-full object-cover object-top border transition-all duration-300 ${
                    isAboutMeOpen
                      ? "border-[#72E6E8] shadow-[0_0_18px_rgba(114,230,232,0.7)] brightness-110 scale-105"
                      : "border-[#72E6E8]/40 shadow-[0_0_10px_rgba(114,230,232,0.35)] group-hover:scale-105 group-hover:border-[#72E6E8]"
                  }`}
                />
              </button>
              <Link
                href="/"
                className="text-sm font-semibold tracking-tight text-[#F2F6FA] hover:text-[#72E6E8] transition-colors pr-1 focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/50 rounded-md"
                aria-label="Monisha Dhanesh Portfolio Home"
              >
                Monisha
              </Link>
            </div>

            {/* Vertical Divider */}
            <div className="h-5 w-[1px] bg-[#F2F6FA]/15" />

            {/* Close / Menu Toggle Glass Control */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#B7C7D9] hover:text-[#72E6E8] hover:bg-[#F2F6FA]/10 focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/50 cursor-pointer transition-all duration-300"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#72E6E8] transition-transform duration-300 rotate-90 scale-110" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Mobile Submenu Panel (Mesh Gradient + Glassmorphism) */}
        <div
          className={`w-full max-w-[calc(100vw-2rem)] mt-3 pointer-events-auto transition-all duration-400 ease-out md:hidden mx-auto ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 scale-100 max-h-[420px]"
              : "opacity-0 -translate-y-4 scale-95 max-h-0 overflow-hidden pointer-events-none"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#72E6E8]/25 shadow-[0_0_35px_rgba(114,230,232,0.12),0_20px_50px_rgba(11,21,40,0.9)] backdrop-blur-2xl bg-[#142B52]/40 p-6 text-center ring-1 ring-white/10">
            {/* Layer 1: Mesh Gradient Color Fields */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
              {/* Deep Blue Base */}
              <div className="absolute inset-0 bg-[#0b1528]" />
              {/* Purple Ambient Field (Top-Left) */}
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#3b1c59]/70 blur-3xl opacity-80" />
              {/* Deep Red Field (Center-Right) */}
              <div className="absolute top-1/4 -right-10 w-52 h-52 rounded-full bg-[#5c1d2e]/60 blur-3xl opacity-70" />
              {/* Orange Glow Field (Bottom-Left) */}
              <div className="absolute -bottom-10 -left-6 w-44 h-44 rounded-full bg-[#6e2c14]/50 blur-3xl opacity-60" />
              {/* Bioluminescent Cyan Atmospheric Touch (Center) */}
              <div className="absolute top-1/3 left-1/3 w-36 h-36 rounded-full bg-[#72E6E8]/15 blur-2xl opacity-40" />
            </div>

            {/* Layer 2: Dark Cinematic Vignette */}
            <div
              className="absolute inset-0 pointer-events-none -z-10"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 35%, rgba(11,21,40,0.85) 100%)",
              }}
            />

            {/* Layer 3: Glass Sheen Inner Top Border Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F2F6FA]/25 to-transparent pointer-events-none" />

            {/* Submenu Navigation Items */}
            <ul className="relative z-10 flex flex-col gap-2 list-none m-0 p-0">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium tracking-tight flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/50 ${
                        isActive
                          ? "text-[#72E6E8] font-semibold bg-[#72E6E8]/10 border border-[#72E6E8]/20 shadow-[0_0_15px_rgba(114,230,232,0.15)]"
                          : "text-[#F2F6FA] hover:text-[#72E6E8] hover:bg-[#F2F6FA]/5 border border-transparent"
                      }`}
                    >
                      <span>{item.label}</span>
                      {/* Active State Circle Indicator */}
                      {isActive ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#72E6E8] shadow-[0_0_10px_#72E6E8] animate-pulse" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full opacity-0" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>

      {/* About Me Character Profile Popup */}
      <AboutMePopup
        isOpen={isAboutMeOpen}
        onClose={() => setIsAboutMeOpen(false)}
      />
    </>
  );
}

