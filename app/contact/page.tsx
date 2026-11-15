"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import StarField from "@/components/StarField";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const email = "moni.dhanesh@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen px-6 sm:px-12 lg:px-16 pt-32 pb-36 relative flex flex-col justify-center overflow-x-hidden">
      {/* Three.js Atmospheric Blinking Star Field (Contact Hero) */}
      <div className="absolute top-0 left-0 right-0 h-[650px] pointer-events-none z-0 overflow-hidden">
        <StarField seed={456} density={320} />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Header with Recruiter-Focused Messaging */}
        <div className="max-w-3xl mb-12 sm:mb-16 animate-fade-slide-up">
          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#F2F6FA] leading-[1.05]">
            Let&apos;s build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72E6E8] via-[#AAA2C8] to-[#D99BCF]">
              something unexpected.
            </span>
          </h1>

          <p className="mt-4 text-lg text-[#B7C7D9] leading-relaxed max-w-2xl">
            Available for new opportunities, technical consulting, and innovative collaborations.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">

          {/* Direct Communication Channels (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#F2F6FA]/10">
              <h2 className="text-xs uppercase font-mono tracking-widest text-[#AAA2C8] mb-4">
                Contact Details
              </h2>

              {/* Copy Email Card */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#142B52]/40 border border-[#F2F6FA]/10 mb-6 gap-2">
                <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#72E6E8] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono text-[#F2F6FA] truncate select-all">
                    {email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="p-2 rounded-xl bg-[#172B45] text-[#B7C7D9] hover:text-[#72E6E8] transition-colors cursor-pointer shrink-0"
                  title="Copy email address"
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#72E6E8]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Connect / Socials */}
              <h2 className="text-xs uppercase font-mono tracking-widest text-[#AAA2C8] mb-3">
                Connect
              </h2>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/monishadhanesh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#142B52]/20 hover:bg-[#142B52]/50 border border-[#F2F6FA]/5 hover:border-[#72E6E8]/30 transition-all text-sm text-[#F2F6FA] group gap-1 sm:gap-2"
                >
                  <span className="flex items-center gap-2.5">
                    <LinkedinIcon className="w-4 h-4 text-[#72E6E8] shrink-0" />
                    <span className="font-medium">LinkedIn</span>
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-[#AAA2C8] group-hover:text-[#72E6E8] truncate">
                    /in/monishadhanesh
                  </span>
                </a>

                <a
                  href="https://www.instagram.com/monisha_dhanesh.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#142B52]/20 hover:bg-[#142B52]/50 border border-[#F2F6FA]/5 hover:border-[#72E6E8]/30 transition-all text-sm text-[#F2F6FA] group gap-1 sm:gap-2"
                >
                  <span className="flex items-center gap-2.5">
                    <InstagramIcon className="w-4 h-4 text-[#72E6E8] shrink-0" />
                    <span className="font-medium">Instagram</span>
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-[#AAA2C8] group-hover:text-[#72E6E8] truncate">
                    @monisha_dhanesh.ai
                  </span>
                </a>
              </div>
            </div>

            {/* Location & Hiring Telemetry */}
            <div className="glass-panel-subtle rounded-2xl p-4 text-[11px] sm:text-xs font-mono text-[#B7C7D9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>LOCATION: REMOTE / HYBRID</span>
              <span className="text-[#72E6E8] flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#72E6E8] animate-pulse" />
                AVAILABLE FOR ROLES
              </span>
            </div>
          </div>

          {/* Scheduling Portal (Right Column - Exclusively Calendly) */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#F2F6FA]/10">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-medium text-[#F2F6FA] mb-1">
                  Schedule a Call
                </h2>
                <p className="text-xs sm:text-sm text-[#B7C7D9]">
                  Pick a time that works for you to discuss roles, projects, or ideas.
                </p>
              </div>

              {/* Calendly Inline Widget Embed View */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-[#F2F6FA]/10 bg-[#142B52]/40 min-h-[580px]">
                <iframe
                  src="https://calendly.com/moni-dhanesh?embed_domain=localhost&embed_type=Inline&background_color=142b52&text_color=f2f6fa&primary_color=72e6e8"
                  width="100%"
                  height="580"
                  frameBorder="0"
                  title="Schedule a Meeting with Monisha"
                  className="w-full h-[580px] rounded-2xl"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
