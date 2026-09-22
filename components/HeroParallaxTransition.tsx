'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import BackgroundVideo from '@/components/BackgroundVideo'

interface HeroParallaxTransitionProps {
    onVideoEnded?: () => void
}

export default function HeroParallaxTransition({
    onVideoEnded,
}: HeroParallaxTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [videoEnded, setVideoEnded] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    // Animated values stored in refs for jitter-free 60fps rendering
    const progressRef = useRef(0)
    const targetProgressRef = useRef(0)
    const rafIdRef = useRef<number | null>(null)

    // DOM elements for GPU-accelerated updates
    const videoLayerRef = useRef<HTMLDivElement>(null)
    const cockpitOverlayRef = useRef<HTMLDivElement>(null)
    const fogLayerRef = useRef<HTMLDivElement>(null)
    const scrollDownRef = useRef<HTMLDivElement>(null)
    const identityLayerRef = useRef<HTMLDivElement>(null)

    const handleVideoEnd = useCallback(() => {
        setVideoEnded(true)
        onVideoEnded?.()
    }, [onVideoEnded])

    const handleScrollDownClick = () => {
        const scene02 = document.getElementById('scene-02')
        if (scene02) {
            scene02.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    // Check reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Smooth animation loop & cinematic easing math
    useEffect(() => {
        // Cinematic S-curve easing: subtle anchoring at start, smooth acceleration & deceleration
        const getCinematicEase = (t: number) => {
            if (t <= 0) return 0
            if (t >= 1) return 1
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }

        const updateParallax = () => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const scrollable = rect.height - window.innerHeight

            if (scrollable <= 0) {
                targetProgressRef.current = 0
            } else {
                // Compute scroll progress within the hero pinning container
                const raw = -rect.top / scrollable
                targetProgressRef.current = Math.min(1, Math.max(0, raw))
            }

            if (prefersReducedMotion) {
                progressRef.current = targetProgressRef.current
            } else {
                // Smooth interpolation (lerp) for 60fps jitter-free GPU movement
                const diff = targetProgressRef.current - progressRef.current
                progressRef.current += diff * 0.14
            }

            const p = progressRef.current
            const eased = getCinematicEase(p)

            // 1. Hero Video Layer (Camera Push: translate & scale zoom)
            if (videoLayerRef.current) {
                if (prefersReducedMotion) {
                    videoLayerRef.current.style.transform = 'none'
                    videoLayerRef.current.style.opacity = `${Math.max(0, 1 - p * 1.2)}`
                } else {
                    const translateY = -eased * 50
                    const scale = 1 + eased * 0.16
                    const opacity = Math.max(0, 1 - eased * 1.15)
                    videoLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
                    videoLayerRef.current.style.opacity = `${opacity}`
                }
            }

            // 2. Cockpit Frame & Controls Overlay Layer (Medium speed transform)
            if (cockpitOverlayRef.current) {
                if (prefersReducedMotion) {
                    cockpitOverlayRef.current.style.transform = 'none'
                    cockpitOverlayRef.current.style.opacity = `${Math.max(0, 1 - p * 1.2)}`
                } else {
                    const translateY = -eased * 100
                    const scale = 1 + eased * 0.22
                    const opacity = Math.max(0, 1 - eased * 1.25)
                    cockpitOverlayRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
                    cockpitOverlayRef.current.style.opacity = `${opacity}`
                }
            }

            // 3. Atmospheric Fog & Light Streak Layer
            if (fogLayerRef.current) {
                if (prefersReducedMotion) {
                    fogLayerRef.current.style.opacity = '0'
                } else {
                    const translateY = -eased * 180
                    const scale = 1 + eased * 0.3
                    const fogOpacity = Math.sin(eased * Math.PI) * 0.65
                    fogLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
                    fogLayerRef.current.style.opacity = `${fogOpacity}`
                }
            }

            // 4. Personal Identity Block (Sticky at bottom within Section 1, scrolls away naturally when Section 1 ends)
            if (identityLayerRef.current) {
                if (prefersReducedMotion) {
                    identityLayerRef.current.style.transform = 'none'
                    identityLayerRef.current.style.opacity = '1'
                } else {
                    const translateY = -eased * 35
                    // Visible throughout Section 1, fading gracefully only at the very end (p > 0.85) as Section 2 takes over
                    const opacity = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1
                    identityLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
                    identityLayerRef.current.style.opacity = `${opacity}`
                    identityLayerRef.current.style.pointerEvents =
                        opacity < 0.1 ? 'none' : 'auto'
                }
            }

            // 5. Scroll Down Indicator (Natural fade out)
            if (scrollDownRef.current) {
                const opacity = Math.max(0, 1 - p * 3.8)
                const translateY = p * 30
                scrollDownRef.current.style.opacity = `${opacity}`
                scrollDownRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
                scrollDownRef.current.style.pointerEvents =
                    opacity < 0.1 ? 'none' : 'auto'
            }

            rafIdRef.current = requestAnimationFrame(updateParallax)
        }

        rafIdRef.current = requestAnimationFrame(updateParallax)

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        }
    }, [prefersReducedMotion])

    return (
        <section
            ref={containerRef}
            id="hero-section"
            aria-label="Hero Section"
            className="relative w-full h-[150vh] bg-[#0b1528] select-none"
        >
            {/* Sticky viewport frame */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0b1528]">
                {/* ── LAYER 1: HERO VIDEO & CAMERA PUSH ───────────────── */}
                <div
                    ref={videoLayerRef}
                    className="absolute inset-0 z-10 w-full h-full pointer-events-none will-change-transform"
                >
                    <BackgroundVideo
                        onEnded={handleVideoEnd}
                        isFixed={false}
                        showAudioToggle={true}
                    />
                </div>

                {/* ── LAYER 2: COCKPIT FRAME & INSTRUMENT PARALLAX ───── */}
                <div
                    ref={cockpitOverlayRef}
                    className="absolute inset-0 z-20 w-full h-full pointer-events-none will-change-transform flex flex-col justify-between p-6 sm:p-12"
                >
                    {/* Top glass refraction highlight */}
                    <div
                        className="w-full h-32 opacity-25"
                        style={{
                            background:
                                'linear-gradient(to bottom, rgba(114,230,232,0.15), transparent)',
                        }}
                    />

                    {/* Cockpit Canopy Frame Glass Glow & Telemetry Highlights */}
                    <div className="relative w-full max-w-7xl mx-auto h-full flex justify-between items-center pointer-events-none">
                        {/* Astronaut Visor Refraction Glow (Left) */}
                        <div
                            className="w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(circle, rgba(114,230,232,0.5) 0%, rgba(20,43,82,0) 70%)',
                            }}
                        />

                        {/* Flight Instrument Control Telemetry Glow (Right) */}
                        <div
                            className="w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(circle, rgba(72,201,208,0.4) 0%, rgba(11,21,40,0) 70%)',
                            }}
                        />
                    </div>
                </div>

                {/* ── LAYER 3: ATMOSPHERIC FOG & VOLUMETRIC CYAN STREAKS ─ */}
                <div
                    ref={fogLayerRef}
                    className="absolute inset-0 z-25 w-full h-full pointer-events-none opacity-0 will-change-transform"
                >
                    {/* Atmospheric Fog Vapor Blob */}
                    <div
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[100px] opacity-25"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, rgba(114,230,232,0.3) 0%, rgba(20,43,82,0.15) 50%, transparent 75%)',
                        }}
                    />
                    {/* Atmospheric Light Rays Sweep */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background:
                                'linear-gradient(145deg, rgba(114,230,232,0.12) 0%, transparent 40%, rgba(72,201,208,0.08) 70%, transparent 100%)',
                        }}
                    />
                </div>

                {/* ── LAYER 4: PERSONAL IDENTITY BLOCK (STICKY WITHIN SECTION 1) ───── */}
                <div
                    ref={identityLayerRef}
                    className="
                        absolute
                        left-5
                        sm:left-12
                        bottom-[72px]
                        sm:bottom-10
                        z-30
                        pointer-events-auto
                        will-change-transform
                        animate-fade-slide-up
                        max-w-[calc(100vw-8rem)]
                        sm:max-w-none
                    "
                >
                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-0.5
                            sm:gap-1
                            pl-3
                            sm:pl-3.5
                            border-l-2
                            border-[#72E6E8]/50
                            sm:border-l-0
                        "
                    >
                        {/* Mobile Scroll Indicator — animated hand + KEEP SCROLLING */}
                        {videoEnded && (
                            <div className="sm:hidden mb-2">
                                <button
                                    type="button"
                                    onClick={handleScrollDownClick}
                                    aria-label="Keep scrolling to begin the experience"
                                    className="
                                        group
                                        pointer-events-auto
                                        flex
                                        flex-col
                                        items-start
                                        gap-2
                                        cursor-pointer
                                        bg-transparent
                                        border-none
                                        p-0
                                        outline-none
                                    "
                                >
                                    {/* Animated hand gesture — SVG outline finger/hand */}
                                    <span aria-hidden="true" className="animate-hand-swipe inline-block will-change-transform">
                                        <svg
                                            width="28"
                                            height="36"
                                            viewBox="0 0 28 36"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{
                                                filter: "drop-shadow(0 0 6px rgba(114,230,232,0.5))",
                                            }}
                                        >
                                            {/* Index finger */}
                                            <rect x="11" y="1.5" width="5.5" height="13" rx="2.75" stroke="#72E6E8" strokeWidth="1.6" fill="none"/>
                                            {/* Middle finger */}
                                            <rect x="17.5" y="5" width="5.5" height="10" rx="2.75" stroke="#72E6E8" strokeWidth="1.6" fill="none"/>
                                            {/* Ring finger */}
                                            <rect x="4.5" y="5" width="5.5" height="10" rx="2.75" stroke="#72E6E8" strokeWidth="1.6" fill="none"/>
                                            {/* Palm body — connects fingers to palm */}
                                            <path
                                                d="M4.5 13 C4.5 13 3 13 2 14.5 L1.2 22 C0.8 26 2.5 30.5 7 33 L11 34.5 C12.5 35 15.5 35 17 34.5 L21 33 C25.5 30.5 27.2 26 26.8 22 L26 14.5 C25 13 23.5 13 23.5 13 L23 12"
                                                stroke="#72E6E8"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="rgba(20,43,82,0.35)"
                                            />
                                            {/* Thumb */}
                                            <path
                                                d="M4.5 14 L3.5 17 C3 19 3.5 20.5 5 21"
                                                stroke="#72E6E8"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                fill="none"
                                            />
                                        </svg>
                                    </span>

                                    {/* KEEP SCROLLING label */}
                                    <span
                                        className="
                                            text-[10px]
                                            font-semibold
                                            tracking-widest
                                            uppercase
                                            text-[#F2F6FA]
                                            drop-shadow-[0_0_8px_rgba(114,230,232,0.35)]
                                            transition-colors
                                            duration-300
                                            group-hover:text-[#72E6E8]
                                        "
                                    >
                                        KEEP SCROLLING
                                    </span>
                                </button>
                            </div>
                        )}


                        {/* Primary Name */}
                        <h1
                            className="
                                text-lg
                                sm:text-[21px]
                                font-bold
                                sm:font-semibold
                                tracking-tight
                                text-[#F2F6FA]
                                drop-shadow-[0_2px_10px_rgba(11,21,40,0.95)]
                            "
                        >
                            Monisha Dhanesh
                        </h1>

                        {/* Secondary Role */}
                        <p
                            className="
                                text-xs
                                sm:text-[13px]
                                font-medium
                                sm:font-normal
                                tracking-wide
                                text-[#72E6E8]
                                sm:text-[#B7C7D9]
                                drop-shadow-[0_0_8px_rgba(114,230,232,0.4)]
                                flex
                                items-center
                                gap-1.5
                            "
                        >
                            <span>AI Product Designer</span>
                        </p>
                    </div>
                </div>

                {/* ── LAYER 5: HERO UI (SCROLL DOWN INDICATOR FOR TABLET/DESKTOP) ────────── */}
                <div className="hidden sm:flex absolute inset-0 z-30 flex-col justify-end items-center pb-8 px-6 pointer-events-none">
                    <div
                        ref={scrollDownRef}
                        className="flex flex-col items-center justify-end min-h-[96px] will-change-transform"
                    >
                        {videoEnded && (
                            <button
                                type="button"
                                onClick={handleScrollDownClick}
                                aria-label="Scroll down to begin Scene 02"
                                className="
                                    group
                                    pointer-events-auto
                                    animate-fade-slide-up
                                    flex
                                    items-center
                                    gap-3
                                    cursor-pointer
                                    bg-transparent
                                    border-none
                                    p-0
                                    outline-none
                                    transition-all
                                    duration-300
                                "
                            >
                                <ChevronDown
                                    className="
                                        w-5 h-5
                                        text-[#72E6E8]
                                        animate-arrow-bob
                                        transition-colors
                                        duration-300
                                        group-hover:text-[#72E6E8]
                                    "
                                    strokeWidth={2}
                                />
                                <span
                                    className="
                                        text-xs
                                        sm:text-sm
                                        font-medium
                                        tracking-widest
                                        uppercase
                                        text-[#F2F6FA]
                                        drop-shadow-[0_0_10px_rgba(114,230,232,0.35)]
                                        transition-colors
                                        duration-300
                                        group-hover:text-[#72E6E8]
                                        group-hover:drop-shadow-[0_0_15px_rgba(114,230,232,0.6)]
                                    "
                                >
                                    KEEP SCROLLING
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}


