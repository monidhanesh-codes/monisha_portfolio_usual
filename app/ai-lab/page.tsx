"use client";

import { useState, useEffect } from "react";
import { X, Orbit } from "lucide-react";

export default function AiLabPage() {
  const [showPopup, setShowPopup] = useState(false);

  // Check localStorage on first mount
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenBrowserPrompt");
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  // Handle closing the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenBrowserPrompt", "true");
  };

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#0b1528] overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/coming_soon.png"
          alt="Futuristic space exploration background"
          className="w-full h-full object-cover object-center md:object-left"
        />
        {/* Atmospheric Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1528]/80 via-[#0b1528]/50 to-[#0b1528]/90 md:bg-gradient-to-r md:from-[#0b1528]/95 md:via-[#0b1528]/60 md:to-transparent" />
      </div>


      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-[100dvh] w-full pt-20">

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-24 max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#72E6E8]/40 bg-[#172B45]/70 backdrop-blur-md w-fit mb-6 shadow-[0_0_20px_rgba(114,230,232,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#72E6E8] shadow-[0_0_10px_#72E6E8] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] text-[#F2F6FA] uppercase">
              System Status · In Development
            </span>
          </div>




          <h1 className="text-3xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#F2F6FA] leading-[1.05]">
            Coming {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72E6E8] via-[#AAA2C8] to-[#D99BCF]">
              Soon
            </span>
          </h1>


          <p className="text-lg sm:text-xl md:text-2xl text-[#B7C7D9] font-light max-w-md leading-relaxed drop-shadow-md">
            Something new is being explored.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="w-full px-6 sm:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F2F6FA]/5 border border-[#F2F6FA]/10 backdrop-blur-md flex items-center justify-center shrink-0 hidden sm:flex">
            <span className="text-[#F2F6FA] font-bold text-lg">N</span>
          </div>
        </div>

      </div>
    </main>
  );
}