"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import StarField from "@/components/StarField";

interface Project {
  id: string;
  number: string;
  title: string;
  tagline?: string;
  description: string;
  category: "Mobile Apps" | "Websites" | "Admin Portals" | "Admin Portal";
  year?: string;
  Skills?: string[];
  technologies?: string[];
  color?: string;
  visualHighlight?: string;
  demoUrl?: string;
  imageUrl?: string;
}

const PROJECTS: Project[] = [
  {
    id: "pass-shopping-experience",
    number: "01",
    title: "PASS Shopping Experience",
    description:
      "PASS isn't just an eCommerce app. It combines shopping, parcel delivery, and ride services into one connected ecosystem.",
    category: "Mobile Apps",
    year: "2026",
    Skills: ["Design System", "Gen AI", "Prototyping", "Secondary Research"],
    demoUrl: "https://gamma.app/docs/PASS-Shopping-experience-UX-Case-Study-l7q6tjwjgpi8u37?mode=doc",
    imageUrl: "/pass-preview.jpg",
    color: "#72E6E8",
    visualHighlight: "Bioluminescent Cyan Neural Array",
  },
  {
    id: "thangamayil",
    number: "02",
    title: "Thangamayil",
    description:
      "Thangamayil Jewellery is a trusted Tamil Nadu-based jewellery retail chain with 58+ showrooms, specializing in gold, silver, and diamond jewellery with a focus on quality, purity, and craftsmanship.",
    category: "Mobile Apps",
    year: "2024",
    Skills: ["User Journeys", "Wireframing & Prototyping", "Secondary Research"],
    demoUrl: "https://nova-airmail-fdb.notion.site/Thangamayil-69d6f0199f5d49ca8329d2f1fd2b749a?source=copy_link",
    imageUrl: "/thangamayil-preview.jpg",
    color: "#D99BCF",
    visualHighlight: "Atmospheric Lavender Volumetric Mesh",
  },
  {
    id: "u-mobile",
    number: "03",
    title: "U-Mobile",
    description:
      "U Mobile is an award-winning, data-centric mobile service company in Malaysia that leverages its status as the youngest telco to offer a modern, highly scalable network infrastructure tailored to customer preferences.",
    category: "Mobile Apps",
    year: "2023",
    Skills: ["Interaction Design", "Wireframing & Prototyping", "User Journeys"],
    demoUrl: "https://nova-airmail-fdb.notion.site/U-mobile-1525fd7f71e0808f8090ee5cc396ea1e?source=copy_link",
    imageUrl: "/u-mobile-preview.jpg",
    color: "#48C9D0",
    visualHighlight: "Aqua Teal Procedural Biosphere",
  },

  // Website Tab Projects
  {
    id: "apptivo",
    number: "01",
    title: "Apptivo",
    description:
      "Apptivo is an all-in-one cloud business management platform offering CRM, project management, invoicing, help desk, and other integrated business applications.",
    category: "Websites",
    year: "2024",
    Skills: ["Wireframing & Prototyping", "Prompt Engineering", "Information Architecture", "Interaction Design"],
    demoUrl: "https://www.apptivo.com/",
    imageUrl: "/apptivo-preview.png",
    color: "#72E6E8",
    visualHighlight: "Cloud Business Management Platform",
  },
  {
    id: "joggle",
    number: "02",
    title: "Joggle",
    description:
      "Joggle.Supply is a tech-enabled building materials distribution platform that connects brands, dealers, and end users to drive transparency, visibility, and growth.",
    category: "Websites",
    year: "2024",
    Skills: ["Design System", "Wireframing & Prototyping", "Primary Research", "User Journeys"],
    demoUrl: "https://nova-airmail-fdb.notion.site/Joggle-Ecommerce-1205fd7f71e08095b439f89ec99e9972?source=copy_link",
    imageUrl: "/joggle-preview.png",
    color: "#D99BCF",
    visualHighlight: "Building Materials Distribution Platform",
  },
  {
    id: "gulf-invest",
    number: "03",
    title: "Gulf Invest",
    description:
      "Gulf Invest Real Estate specializes in providing high-level services for selecting investment real estate units in Dubai, aiming to help clients find the best value in the market.",
    category: "Websites",
    year: "2024",
    Skills: ["Interaction Design", "Wireframing & Prototyping", "Competitor Research"],
    demoUrl: "https://nova-airmail-fdb.notion.site/Gulf-Invest-Website-Design-14b5fd7f71e080d698a4fc13027b1a8c?source=copy_link",
    imageUrl: "/gulf-invest-preview.jpg",
    color: "#48C9D0",
    visualHighlight: "Real Estate Investment Portal",
  },
  {
    id: "chalet",
    number: "04",
    title: "Chalet",
    description:
      "Gulf Invest Real Estate specializes in providing high-level services for selecting investment real estate units in Dubai, aiming to help clients find the best value in the market.",
    category: "Websites",
    year: "2024",
    Skills: ["Interaction Design", "Wireframing & Prototyping", "Competitor Research"],
    demoUrl: "https://nova-airmail-fdb.notion.site/Chalet-International-2af5fd7f71e080599ce9f08e5bcd2924?source=copy_link",
    imageUrl: "/chalet-preview.jpg",
    color: "#AAA2C8",
    visualHighlight: "International Hospitality Architecture",
  },
  {
    id: "ss-gold",
    number: "05",
    title: "S&S Gold",
    description:
      "Swati & Sunaina is a luxury textile brand specializing in exquisite, handcrafted Banaras silk sarees rooted in rare weaving traditions and heritage.",
    category: "Websites",
    year: "2024",
    Skills: ["Moodboard", "Wireframing & Prototyping", "Interaction Design"],
    demoUrl: "https://nova-airmail-fdb.notion.site/S-S-Gold-5aca52589d16420b8995da3c3ba328c0?source=copy_link",
    imageUrl: "/ss-gold-preview.jpg",
    color: "#E6C872",
    visualHighlight: "Luxury Handcrafted Textile Storefront",
  },

  // Admin Portals Tab Projects
  {
    id: "be-masterly",
    number: "01",
    title: "Be Masterly",
    description:
      "Be Masterly, backed by Navneet Education Limited, is an ed-tech platform that empowers tutors and students by streamlining daily tutoring management across 100+ institutes, 1,300+ tutors, and 12,000+ students.",
    category: "Admin Portals",
    year: "2024",
    Skills: [
      "Wireframing & Prototyping",
      "Prompt Engineering",
      "Information Architecture",
      "Secondary Research",
    ],
    demoUrl: "https://nova-airmail-fdb.notion.site/Be-Masterly-School-Portal-1535fd7f71e0806b9ef3c160a3d4a57d?source=copy_link",
    imageUrl: "/be-masterly-preview.jpg",
    color: "#72E6E8",
    visualHighlight: "Ed-Tech Tutoring Management Platform",
  },
];

const CATEGORIES = ["Mobile Apps", "Websites", "Admin Portals"] as const;



// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
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
                {project.number}
              </span>
              <span>/</span>
              <span className="uppercase tracking-wider text-[#B7C7D9]">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F2F6FA] group-hover:text-[#72E6E8] transition-colors duration-300">
              {project.title}
            </h2>

            {project.tagline && (
              <p className="text-[11px] sm:text-sm font-mono text-[#72E6E8]/90 mt-0.5 sm:mt-2 font-medium">
                {project.tagline}
              </p>
            )}

            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#B7C7D9] leading-relaxed font-light line-clamp-3 sm:line-clamp-4">
              {project.description}
            </p>
          </div>

          {/* Skills + CTA */}
          <div className="mt-3 sm:mt-6 pt-3 sm:pt-5 border-t border-[#F2F6FA]/10 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(project.Skills || project.technologies || []).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono bg-[#142B52]/70 text-[#B7C7D9] border border-[#F2F6FA]/10"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div>
              <Link
                href={project.demoUrl || "/contact"}
                target={project.demoUrl ? "_blank" : undefined}
                rel={project.demoUrl ? "noopener noreferrer" : undefined}
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wider text-[#72E6E8] bg-[#72E6E8]/10 group-hover:bg-[#72E6E8]/20 border border-[#72E6E8]/40 transition-all duration-300 shadow-[0_0_15px_rgba(114,230,232,0.1)] group-hover:shadow-[0_0_25px_rgba(114,230,232,0.35)] cursor-pointer"
              >
                <span>VIEW PROJECT</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: visual frame */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] min-h-[140px] sm:min-h-[300px] rounded-xl sm:rounded-2xl bg-[#0b1528] border border-[#72E6E8]/30 overflow-hidden shadow-lg flex items-center justify-center">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={`${project.title} Preview`}
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
                    {project.visualHighlight || project.title}
                  </span>
                </div>
                <div className="my-auto flex items-center justify-center relative z-10">
                  <div
                    className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      borderColor: project.color || "#72E6E8",
                      boxShadow: `0 0 25px ${project.color || "#72E6E8"}40`,
                    }}
                  >
                    <Layers
                      className="w-7 h-7 transition-all duration-500 group-hover:rotate-12"
                      style={{ color: project.color || "#72E6E8" }}
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

function StackedProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="py-24 text-center text-[#B7C7D9] font-mono text-sm border border-dashed border-[#F2F6FA]/15 rounded-3xl">
        NO DISCOVERED ARTIFACTS IN THIS CATEGORY.
      </div>
    );
  }

  return (
    <section className="relative w-full flex flex-col pb-32 sm:pb-48">
      {projects.map((project, idx) => (
        <div
          key={project.id}
          className="transition-all duration-300 mb-24 sm:mb-36"
          style={{
            position: "sticky",
            top: `calc(96px + ${idx * 20}px)`,
            zIndex: idx + 1,
          }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Mobile Apps");

  const filteredProjects =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter(
          (p) =>
            p.category === activeCategory ||
            (activeCategory === "Admin Portals" && p.category === "Admin Portal")
        );

  return (
    <>
      <main
        className="min-h-screen px-6 sm:px-12 lg:px-16 pt-32 pb-36 relative"
      >
        {/* Star Field */}
        <div className="absolute top-0 left-0 right-0 h-[650px] pointer-events-none z-0 overflow-hidden">
          <StarField seed={123} density={320} />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Page Header */}
          <div className="max-w-3xl mb-12 sm:mb-16 animate-fade-slide-up">
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#F2F6FA] leading-[1.05]">
              My Selective{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72E6E8] to-[#AAA2C8]">
                Works
              </span>
            </h1>

            <p className="mt-4 text-lg text-[#B7C7D9] leading-relaxed max-w-2xl">
              A curated showcase of immersive websites, fluid mobile applications, and robust admin portals — designed to blend premium aesthetics with seamless, high-performance functionality.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap gap-2.5 items-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#72E6E8] text-[#142B52] font-semibold shadow-[0_0_15px_rgba(114,230,232,0.4)]"
                      : "bg-[#142B52]/40 text-[#B7C7D9] hover:text-[#F2F6FA] hover:bg-[#142B52]/60 border border-[#F2F6FA]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <StackedProjectsSection projects={filteredProjects} />
        </div>
      </main>
    </>
  );
}
