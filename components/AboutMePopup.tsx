"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface AboutMePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutMePopup({ isOpen, onClose }: AboutMePopupProps) {
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock background scroll & handle Escape / focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Focus close button for accessibility
    const t = setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /*
     * OUTER OVERLAY — fixed, full-screen, flex-centred.
     * overflow:hidden here prevents any accidental page scroll leak.
     */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-8 overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-me-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1528]/80 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
       * MODAL SHELL
       * ─ Fixed height: viewport minus safe margin on every breakpoint.
       * ─ flex-col splits the panel into header + scroll body.
       * ─ overflow:hidden clips the content so only the inner area scrolls.
       */}
      <div
        className="
          relative z-10 w-full max-w-2xl
          flex flex-col
          rounded-3xl
          bg-[#172B45]/90
          border border-[#72E6E8]/35
          shadow-[0_0_50px_rgba(114,230,232,0.18),0_25px_60px_rgba(11,21,40,0.95)]
          backdrop-blur-2xl
          ring-1 ring-white/10
          text-[#F2F6FA]
          overflow-hidden
          transition-all transform scale-100 opacity-100
          max-h-[calc(100vh-24px)]
          sm:max-h-[calc(100vh-40px)]
          lg:max-h-[calc(100vh-64px)]
        "
      >
        {/* ── Ambient Lighting Halos (decorative, non-scrolling) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl -z-10">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#72E6E8]/15 blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-[#AAA2C8]/15 blur-3xl opacity-60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#D99BCF]/10 blur-3xl opacity-40" />
          {/* Top glass line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#72E6E8]/50 to-transparent" />
        </div>

        {/* ── STICKY HEADER ── always visible, never scrolls away */}
        <div className="relative flex-none px-6 sm:px-8 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-4 z-10">
          <h2
            id="about-me-title"
            className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#F2F6FA] flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <span className="text-[#72E6E8] font-bold text-sm sm:text-2xl tracking-widest uppercase drop-shadow-[0_0_12px_rgba(114,230,232,0.5)]">
              ✦ GET TO KNOW
            </span>
            <span className="text-[#F2F6FA] font-extrabold tracking-tight">
              THE HUMAN
            </span>
            <span className="inline-block text-2xl sm:text-3xl hover:scale-110 transition-transform">
              👨‍🚀
            </span>
          </h2>

          {/* Close button — always in the top-right corner */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex-none w-10 h-10 rounded-full bg-[#142B52]/60 hover:bg-[#72E6E8]/20 border border-[#F2F6FA]/15 hover:border-[#72E6E8]/60 text-[#B7C7D9] hover:text-[#72E6E8] flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/60 cursor-pointer shadow-lg group"
            aria-label="Close About Me popup"
          >
            <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Thin separator line below the header */}
        <div className="flex-none h-[1px] mx-6 sm:mx-8 bg-gradient-to-r from-transparent via-[#72E6E8]/20 to-transparent" />

        {/*
         * ── SCROLLABLE CONTENT BODY ──
         * flex-1 fills remaining panel height.
         * overflow-y-auto creates the internal scroll.
         * overscroll-behavior:contain stops the scroll chain reaching the page.
         * Custom scrollbar via inline styles (webkit) + utility classes.
         */}
        <div
          ref={scrollBodyRef}
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            px-6 sm:px-8
            pt-5 pb-6 sm:pb-8
            space-y-6
            scroll-smooth
            popup-scrollbar
          "
        >
          {/* Profile Image */}
          <div className="flex justify-center pt-1">
            <div className="relative group cursor-pointer">
              {/* Ambient halo */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-[#72E6E8]/50 via-[#AAA2C8]/30 to-[#D99BCF]/40 blur-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 animate-pulse-glow" />
              <div className="relative p-1 rounded-full bg-gradient-to-b from-[#72E6E8] via-[#48C9D0]/70 to-[#AAA2C8]/50 border-2 border-[#72E6E8] shadow-[0_0_30px_rgba(114,230,232,0.45)] group-hover:shadow-[0_0_40px_rgba(114,230,232,0.7)] transition-all duration-300">
                <img
                  src="/avatar.jpg"
                  alt="Monisha Dhanesh Profile Avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-top border-2 border-[#F2F6FA]/90 shadow-inner group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* 🚀 01 / MISSION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#142B52]/40 border border-[#72E6E8]/20 backdrop-blur-md shadow-sm transition-all hover:border-[#72E6E8]/40 hover:bg-[#142B52]/60">
            <div className="text-xs font-semibold tracking-wider text-[#72E6E8] uppercase mb-1 flex items-center gap-1.5">
              <span>🚀</span> 01 / MISSION
            </div>
            <p className="text-base sm:text-lg font-medium text-[#F2F6FA] leading-relaxed">
              Turning ideas into{" "}
              <span className="text-[#72E6E8] font-semibold glow-cyan-subtle">
                digital experiences worth exploring.
              </span>{" "}
              ✨
            </p>
          </div>

          {/* 🎨 02 / ROLE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#142B52]/40 border border-[#AAA2C8]/20 backdrop-blur-md shadow-sm transition-all hover:border-[#AAA2C8]/40 hover:bg-[#142B52]/60">
            <div className="text-xs font-semibold tracking-wider text-[#AAA2C8] uppercase mb-2 flex items-center gap-1.5">
              <span>🎨</span> 02 / ROLE
            </div>
            <div className="space-y-1 text-sm sm:text-base font-normal text-[#B7C7D9]">
              <p className="text-[#F2F6FA] font-semibold flex items-center gap-2">
                Designer by heart. <span className="text-[#72E6E8]">💙</span>
              </p>
              <p className="flex items-center gap-2">A little code. 💻</p>
              <p className="flex items-center gap-2">A lot of curiosity. 🔭</p>
            </div>
          </div>

          {/* ✨ 03 / THINGS THAT SPARK ME */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#142B52]/40 border border-[#72E6E8]/20 backdrop-blur-md shadow-sm space-y-3 transition-all hover:border-[#72E6E8]/40 hover:bg-[#142B52]/60">
            <div className="text-xs font-semibold tracking-wider text-[#72E6E8] uppercase flex items-center gap-1.5">
              <span>✨</span> 03 / THINGS THAT SPARK ME
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "🧩 Clever interactions",
                "🎬 Cinematic visuals",
                "🍜 Good food & 🎵 good music",
                "🌅 Sunrises · 💦 Waterfalls · ⛰️ Mountains",
              ].map((spark, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#244A78]/40 border border-[#72E6E8]/25 text-[#F2F6FA] hover:border-[#72E6E8]/60 hover:bg-[#244A78]/70 transition-all shadow-sm"
                >
                  {spark}
                </span>
              ))}
            </div>
          </div>

          {/* 🔍 04 / DESIGN HABIT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#142B52]/40 border border-[#D99BCF]/25 backdrop-blur-md shadow-sm transition-all hover:border-[#D99BCF]/50 hover:bg-[#142B52]/60">
            <div className="text-xs font-semibold tracking-wider text-[#D99BCF] uppercase mb-1.5 flex items-center gap-1.5">
              <span>🔍</span> 04 / DESIGN HABIT
            </div>
            <p className="text-sm sm:text-base font-normal text-[#B7C7D9] leading-relaxed">
              Iterating until it{" "}
              <span className="text-[#F2F6FA] font-semibold italic text-[#72E6E8]/90">
                feels just right.
              </span>{" "}
              🎯
            </p>
            <p className="text-sm sm:text-base font-medium text-[#F2F6FA] mt-1 flex items-center gap-1">
              Worth it? <span className="text-[#72E6E8] font-bold">Always.</span> 😌
            </p>
          </div>

          {/* 🌌 05 / INSPIRATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#142B52]/40 border border-[#AAA2C8]/20 backdrop-blur-md shadow-sm space-y-3 transition-all hover:border-[#AAA2C8]/40 hover:bg-[#142B52]/60">
            <div className="text-xs font-semibold tracking-wider text-[#AAA2C8] uppercase flex items-center gap-1.5">
              <span>🌌</span> 05 / INSPIRATION
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "🎬 Movies",
                "🎵 Music",
                "🏛️ Architecture",
                "🌿 Nature",
                "✨ And random discoveries along the way.",
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#716B9B]/25 border border-[#AAA2C8]/30 text-[#F2F6FA] hover:border-[#AAA2C8]/60 transition-all"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 🛰️ 06 / CURRENT ORBIT */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#142B52]/70 via-[#244A78]/50 to-[#172B45]/90 border border-[#72E6E8]/40 shadow-[0_0_20px_rgba(114,230,232,0.15)] backdrop-blur-md space-y-3">
            <div className="text-xs font-bold tracking-wider text-[#72E6E8] uppercase flex items-center gap-1.5">
              <span>🛰️</span> 06 / CURRENT ORBIT
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-xl bg-[#72E6E8]/10 border border-[#72E6E8]/40 text-[#72E6E8] font-bold text-sm sm:text-base tracking-wide shadow-sm">
              🎨 Design × 💻 Technology × 🤖 AI
            </div>
            <p className="text-sm sm:text-base font-normal text-[#B7C7D9] leading-relaxed pt-1">
              Exploring ways to make digital experiences feel less like{" "}
              <span className="text-[#F2F6FA] font-medium">software</span> — and more like{" "}
              <span className="text-[#72E6E8] font-semibold glow-cyan-subtle">
                a world waiting to be discovered.
              </span>{" "}
              🌎✨
            </p>
          </div>
        </div>

        {/* Subtle bottom-fade scroll affordance */}
        <div
          className="flex-none h-px"
          style={{
            background:
              "linear-gradient(to top, rgba(23,43,69,0.9) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
