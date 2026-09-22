"use client";

import { useState, useEffect } from "react";
import { FileDown, Check, Eye, X } from "lucide-react";

export default function ResumeButton() {
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [scrollOffsetY, setScrollOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const startFade = heroHeight * 0.35;
      const endFade = heroHeight * 0.8;

      if (scrollY <= startFade) {
        setScrollOpacity(1);
        setScrollOffsetY(0);
      } else if (scrollY >= endFade) {
        setScrollOpacity(0);
        setScrollOffsetY(24);
      } else {
        const progress = (scrollY - startFade) / (endFade - startFade);
        setScrollOpacity(1 - progress);
        setScrollOffsetY(progress * 24);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    // Trigger download
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Monisha_Dhanesh_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Button (Bottom Right) */}
      <aside
        aria-label="Resume quick access"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2 select-none"
        style={{
          opacity: scrollOpacity,
          transform: `translate3d(0, ${scrollOffsetY}px, 0)`,
          pointerEvents: scrollOpacity < 0.1 ? "none" : "auto",
          transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
        }}
      >
        <button
          type="button"
          onClick={handleDownload}
          aria-label={downloading ? "Resume downloaded" : "Download Resume"}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto gap-2.5 p-0 sm:px-5 sm:py-3 md:px-6 md:py-3.5 rounded-full text-sm md:text-[15px] font-medium text-[#F2F6FA] transition-all duration-300 ease-out cursor-pointer shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/40 active:translate-y-0"
          style={{
            background: "rgba(23, 43, 69, 0.65)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(242, 246, 250, 0.16)",
            boxShadow:
              "0 15px 30px -10px rgba(11, 21, 40, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 18px 35px -8px rgba(114, 230, 232, 0.22), 0 0 20px 0 rgba(114, 230, 232, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(114, 230, 232, 0.4)";
            e.currentTarget.style.background = "rgba(28, 52, 85, 0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 15px 30px -10px rgba(11, 21, 40, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(242, 246, 250, 0.16)";
            e.currentTarget.style.background = "rgba(23, 43, 69, 0.65)";
          }}
        >
          {downloading ? (
            <Check className="w-4 h-4 text-[#72E6E8] animate-bounce shrink-0" />
          ) : (
            <FileDown className="w-4 h-4 text-[#B7C7D9] group-hover:text-[#72E6E8] transition-colors shrink-0" />
          )}
          <span className="hidden sm:inline tracking-tight text-[#F2F6FA] group-hover:text-[#F2F6FA]">
            {downloading ? "Downloaded" : "Download Resume"}
          </span>
        </button>

      </aside>

      {/* Resume Quick Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1528]/80 backdrop-blur-md animate-fade-slide-up"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 relative shadow-2xl border border-[#F2F6FA]/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#F2F6FA]/10 pb-5 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#72E6E8]">
                  Curriculum Vitae · Creative Technologist
                </span>
                <h3 className="text-2xl font-semibold text-[#F2F6FA] mt-1">
                  Summary & Technical Credentials
                </h3>
                <p className="text-sm text-[#B7C7D9] mt-0.5">
                  AI Systems · Spatial Computing · Interactive Digital Worlds
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-full text-[#B7C7D9] hover:text-[#F2F6FA] hover:bg-[#F2F6FA]/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content summary */}
            <div className="space-y-5 text-sm text-[#B7C7D9] max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-[#AAA2C8] mb-1">
                  Core Disciplines
                </h4>
                <p className="text-[#F2F6FA]">
                  Generative AI Integration, Spatial Computing (WebXR/Three.js), Full-Stack Architecture (Next.js/React/TypeScript/Node.js), Creative Coding & Compute Shaders (GLSL/WebGPU), Interactive Experience Design.
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-[#AAA2C8] mb-1">
                  Selected Experience
                </h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#142B52]/30 border border-[#F2F6FA]/5">
                    <div className="flex justify-between items-center text-xs font-mono text-[#72E6E8]">
                      <span>Principal Creative Technologist · AI Lab</span>
                      <span>2023 — Present</span>
                    </div>
                    <p className="text-[#F2F6FA] text-sm mt-1">
                      Spearheading exploratory AI interfaces, real-time latent space visualizers, and spatial interaction engines.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#142B52]/30 border border-[#F2F6FA]/5">
                    <div className="flex justify-between items-center text-xs font-mono text-[#72E6E8]">
                      <span>Lead Interactive Engineer · Digital Studio</span>
                      <span>2020 — 2023</span>
                    </div>
                    <p className="text-[#F2F6FA] text-sm mt-1">
                      Engineered multi-sensory web experiences, 3D product narratives, and experimental generative toolkits for global brands.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-[#AAA2C8] mb-1">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "Next.js",
                    "React 19",
                    "TypeScript",
                    "Three.js / WebGL",
                    "WebGPU / Shaders",
                    "Tailwind CSS",
                    "Python & PyTorch",
                    "Latent Diffusion",
                    "WebXR",
                    "Framer Motion",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#172B45]/70 border border-[#72E6E8]/20 text-[#72E6E8]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#F2F6FA]/10 pt-5 mt-6">
              <span className="text-xs font-mono text-[#AAA2C8]">
                PDF FORMAT · 1 PAGE
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#B7C7D9] hover:text-[#F2F6FA] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownload();
                    setPreviewOpen(false);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-[#142B52] bg-[#72E6E8] hover:bg-[#48C9D0] transition-colors cursor-pointer shadow-[0_0_15px_rgba(114,230,232,0.4)]"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
