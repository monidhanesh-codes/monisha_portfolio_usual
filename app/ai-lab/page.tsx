"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import StarField from "@/components/StarField";

interface Experiment {
  id: string;
  number: string;
  title: string;
  tagline?: string;
  description: string;
  category: "AI EXPERIMENTS" | "CREATIVE EXPERIMENTS";
  year?: string;
  tags: string[];
  color?: string;
  visualHighlight?: string;
  externalUrl: string;
  imageUrl?: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "aadu-puli-aattam",
    number: "01",
    title: "Aadu Puli Aattam — Ancient Tamil Strategy Game",
    description:
      "An ancient Tamil strategy game where the strength of the tiger meets the wisdom of the goats. Reimagined as an interactive digital experience, bringing a traditional strategy game to life through AI-assisted development.",
    category: "AI EXPERIMENTS",
    year: "2026",
    tags: [
      "Traditional Game",
      "OpenCode AI",
      "AI Experiment",
      "Game Development",
    ],
    externalUrl: "https://monisha-aadu-puli-aatam.vercel.app/",
    imageUrl: "/aadu-puli-card.png",
    color: "#72E6E8",
    visualHighlight: "Ancient Tamil Strategy Game",
  },
  {
    id: "fortune-cookies",
    number: "02",
    title: "Fortune Cookies — A Little Surprise for Your Day",
    description:
      "One little cookie. One unexpected prediction. A whole lot of possibilities. An interactive fortune cookie experience where a simple click reveals a random, positive prediction, turning an everyday moment into a little surprise.",
    category: "CREATIVE EXPERIMENTS",
    year: "2026",
    tags: [
      "Creative Coding",
      "Interactive Experience",
      "Generative Experience",
      "Web Experiment",
    ],
    externalUrl: "https://fortunecookie-snowy.vercel.app/",
    imageUrl: "/fortune-cookie-card.jpg",
    color: "#D99BCF",
    visualHighlight: "Interactive Fortune Prediction",
  },
];

// ─── Experiment Card ──────────────────────────────────────────────────────────

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x - rect.width / 2) / (rect.width / 2);
    const normY = (y - rect.height / 2) / (rect.height / 2);

    cardRef.current.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
    cardRef.current.style.setProperty("--tilt-x", `${-normY * 2.2}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${normX * 2.2}deg`);
    cardRef.current.style.setProperty("--parallax-x", `${-normX * 16}px`);
    cardRef.current.style.setProperty("--parallax-y", `${-normY * 12}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    ["--parallax-x", "--parallax-y", "--tilt-x", "--tilt-y"].forEach((p) =>
      cardRef.current!.style.setProperty(p, p.includes("px") ? "0px" : "0deg")
    );
    cardRef.current.style.setProperty("--mouse-x", "50%");
    cardRef.current.style.setProperty("--mouse-y", "50%");
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={
        {
          perspective: "1200px",
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))"
            : "rotateX(0deg) rotateY(0deg)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        } as React.CSSProperties
      }
      className="group relative outline-none w-full max-w-6xl mx-auto rounded-2xl sm:rounded-[28px] overflow-hidden bg-[#172B45] border border-[#72E6E8]/25 hover:border-[#72E6E8]/50 shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_30px_rgba(72,201,208,0.05)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.45),0_0_35px_rgba(114,230,232,0.15)] transition-all duration-500 p-5 sm:p-8 lg:p-12"
    >
      {/* Cursor-based ambient light */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle 450px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(114,230,232,0.15) 0%, rgba(23,43,69,0.1) 50%, transparent 80%)",
        }}
      />
      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F2F6FA]/25 to-transparent pointer-events-none z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center relative z-10">
        {/* Left column */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div>
            {/* Number + Category */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#AAA2C8] mb-1.5 sm:mb-3">
              <span className="text-[#72E6E8] font-bold text-xs sm:text-base tracking-widest">
                {experiment.number}
              </span>
              <span>/</span>
              <span className="uppercase tracking-wider text-[#B7C7D9]">
                {experiment.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F2F6FA] group-hover:text-[#72E6E8] transition-colors duration-300">
              {experiment.title}
            </h2>

            {experiment.tagline && (
              <p className="text-[11px] sm:text-sm font-mono text-[#72E6E8]/90 mt-0.5 sm:mt-2 font-medium">
                {experiment.tagline}
              </p>
            )}

            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#B7C7D9] leading-relaxed font-light line-clamp-3 sm:line-clamp-4">
              {experiment.description}
            </p>
          </div>

          {/* Tags + CTA */}
          <div className="mt-3 sm:mt-6 pt-3 sm:pt-5 border-t border-[#F2F6FA]/10 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {experiment.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono bg-[#142B52]/70 text-[#B7C7D9] border border-[#F2F6FA]/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div>
              <Link
                href={experiment.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wider text-[#72E6E8] bg-[#72E6E8]/10 group-hover:bg-[#72E6E8]/20 border border-[#72E6E8]/40 transition-all duration-300 shadow-[0_0_15px_rgba(114,230,232,0.1)] group-hover:shadow-[0_0_25px_rgba(114,230,232,0.35)] cursor-pointer"
              >
                <span>VIEW EXPERIMENT</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: visual frame */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] min-h-[140px] sm:min-h-[300px] rounded-xl sm:rounded-2xl bg-[#0b1528] border border-[#72E6E8]/30 overflow-hidden shadow-lg flex items-center justify-center">
            {experiment.imageUrl ? (
              <img
                src={experiment.imageUrl}
                alt={`${experiment.title} Preview`}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            ) : (
              <div className="relative w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#172B45] via-[#142B52] to-[#0b1528]">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#72E6E8 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="flex items-center justify-between border-b border-[#F2F6FA]/10 pb-2 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#72E6E8]" />
                    <span className="w-2 h-2 rounded-full bg-[#AAA2C8]" />
                    <span className="w-2 h-2 rounded-full bg-[#D99BCF]" />
                  </div>
                  <span className="text-xs font-mono text-[#72E6E8]/90 uppercase tracking-widest truncate">
                    {experiment.visualHighlight || experiment.title}
                  </span>
                </div>
                <div className="my-auto flex items-center justify-center relative z-10">
                  <div
                    className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      borderColor: experiment.color || "#72E6E8",
                      boxShadow: `0 0 25px ${experiment.color || "#72E6E8"}40`,
                    }}
                  >
                    <Layers
                      className="w-7 h-7 transition-all duration-500 group-hover:rotate-12"
                      style={{ color: experiment.color || "#72E6E8" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Stacked Section ──────────────────────────────────────────────────────────

function StackedExperimentsSection({ experiments }: { experiments: Experiment[] }) {
  if (experiments.length === 0) {
    return (
      <div className="py-24 text-center text-[#B7C7D9] font-mono text-sm border border-dashed border-[#F2F6FA]/15 rounded-3xl">
        NO DISCOVERED EXPERIMENTS IN THIS CATEGORY.
      </div>
    );
  }

  return (
    <section className="relative w-full flex flex-col pb-32 sm:pb-48">
      {experiments.map((experiment, idx) => (
        <div
          key={experiment.id}
          className="transition-all duration-300 mb-24 sm:mb-36"
          style={{
            position: "sticky",
            top: `calc(96px + ${idx * 20}px)`,
            zIndex: idx + 1,
          }}
        >
          <ExperimentCard experiment={experiment} />
        </div>
      ))}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AiLabPage() {
  return (
    <>
      <main className="min-h-screen px-6 sm:px-12 lg:px-16 pt-32 pb-36 relative">
        {/* Star Field */}
        <div className="absolute top-0 left-0 right-0 h-[650px] pointer-events-none z-0 overflow-hidden">
          <StarField seed={456} density={320} />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Page Header */}
          <div className="max-w-3xl mb-12 sm:mb-16 animate-fade-slide-up">
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#F2F6FA] leading-[1.05]">
              AI & Creative{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72E6E8] to-[#AAA2C8]">
                Lab
              </span>
            </h1>

            <p className="mt-4 text-lg text-[#B7C7D9] leading-relaxed max-w-2xl">
              An exploratory space showcasing personal experiments, AI-assisted creations, interactive games, and creative web experiences — blending technology, play, and digital craftsmanship.
            </p>
          </div>

          {/* Experiments */}
          <StackedExperimentsSection experiments={EXPERIMENTS} />
        </div>
      </main>
    </>
  );
}
