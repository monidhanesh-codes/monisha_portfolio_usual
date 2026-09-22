'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react'

const TOTAL_FRAMES = 48

export default function Scene02Sequence() {
    const sectionRef = useRef<HTMLElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const framesRef = useRef<HTMLImageElement[]>([])
    const rafRef = useRef<number | null>(null)
    const drawnRef = useRef<number>(-1)
    const pendingRef = useRef<number>(-1)

    const [showArrows, setShowArrows] = useState(false)
    const [showArrival, setShowArrival] = useState(false)

    /* ------------------------------------------------------------------ */
    /* Draw one frame with object-fit: cover math + device-pixel scaling   */
    /* ------------------------------------------------------------------ */
    const drawFrame = useCallback((idx: number) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const img = framesRef.current[idx]
        if (!img?.complete || img.naturalWidth === 0) return

        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return

        const W = canvas.clientWidth
        const H = canvas.clientHeight
        if (W === 0 || H === 0) return

        const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
        const cw = Math.round(W * dpr)
        const ch = Math.round(H * dpr)

        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw
            canvas.height = ch
        }

        ctx.save()
        ctx.scale(dpr, dpr)

        const iW = img.naturalWidth
        const iH = img.naturalHeight
        const iRatio = iW / iH
        const cRatio = W / H

        let sx = 0
        let sy = 0
        let sw = iW
        let sh = iH

        if (iRatio > cRatio) {
            sw = iH * cRatio
            sx = (iW - sw) / 2
        } else {
            sh = iW / cRatio
            sy = (iH - sh) / 2
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H)
        ctx.restore()

        drawnRef.current = idx
    }, [])

    /* ------------------------------------------------------------------ */
    /* Preload all 48 frames                                               */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const imgs: HTMLImageElement[] = Array.from(
            { length: TOTAL_FRAMES },
            (_, i) => {
                const img = new Image()

                img.src = `/scene_02/ezgif-frame-${String(i + 1).padStart(
                    3,
                    '0',
                )}.jpg`

                img.onload = () => {
                    if (i === 0) drawFrame(0)
                }

                img.onerror = () =>
                    console.warn(
                        `[Scene02] failed to load frame ${i + 1}`,
                    )

                return img
            },
        )

        framesRef.current = imgs

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [drawFrame])

    /* ------------------------------------------------------------------ */
    /* Scroll → progress → frame                                          */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const onScroll = () => {
            const section = sectionRef.current
            if (!section) return

            const rect = section.getBoundingClientRect()
            const scrollable = rect.height - window.innerHeight

            if (scrollable <= 0) return

            const progress = Math.min(
                1,
                Math.max(0, -rect.top / scrollable),
            )

            const target = Math.min(
                TOTAL_FRAMES - 1,
                Math.floor(progress * TOTAL_FRAMES),
            )

            if (target !== pendingRef.current) {
                pendingRef.current = target

                if (rafRef.current)
                    cancelAnimationFrame(rafRef.current)

                rafRef.current = requestAnimationFrame(() => {
                    drawFrame(pendingRef.current)
                    rafRef.current = null
                })
            }

            // Frame 41 = index 40 → 40/48 ≈ 0.833
            setShowArrows(progress >= 40 / 48)
            setShowArrival(progress >= 0.88)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })

        onScroll()

        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)

            if (rafRef.current)
                cancelAnimationFrame(rafRef.current)
        }
    }, [drawFrame])

    /* ------------------------------------------------------------------ */
    /* JSX                                                                */
    /* ------------------------------------------------------------------ */
    return (
        <section
            ref={sectionRef}
            id="scene-02"
            aria-label="Scene 02: Cinematic Launch Sequence"
            className="relative w-full"
            style={{ height: '360vh' }}
        >
            {/* ── Sticky viewport ─────────────────────────────────────── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0b1528] select-none">

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full block"
                    style={{ backgroundColor: '#0b1528' }}
                />

                {/* Radial vignette */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, transparent 35%, rgba(11,21,40,0.55) 100%)',
                    }}
                />

                {/* Bottom → top gradient */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(11,21,40,0.7) 0%, transparent 35%, rgba(11,21,40,0.4) 100%)',
                    }}
                />

                {/* ── Arrow buttons — visible from frame 41 onward ─── */}
                {showArrows && (
                    <div
                        aria-label="Scene destinations"
                        className="absolute inset-0 z-20 pointer-events-none animate-fade-slide-up"
                    >
                        {/* AI LAB — LEFT FACING ARROW */}
                        <Link
                            href="/ai-lab"
                            aria-label="Go to AI Lab"
                            className="
                            pointer-events-auto
                            group
                            absolute
                            left-[25.5%]
                            top-[90%]
                            -translate-x-1/2
                            -translate-y-1/2

                            flex items-center justify-center

                            w-11 h-11
                            sm:w-12 sm:h-12

                            rounded-full

                            bg-[#172B45]/85
                            backdrop-blur-md

                            border
                            border-[#72E6E8]/35

                            shadow-[0_4px_18px_rgba(11,21,40,0.45),0_0_16px_rgba(114,230,232,0.12)]

                            transition-all
                            duration-300
                            ease-out

                            hover:-translate-x-1/2
                            hover:-translate-y-[calc(50%+2px)]
                            hover:border-[#72E6E8]/70
                            hover:bg-[#1b3655]/90
                            hover:shadow-[0_6px_24px_rgba(11,21,40,0.5),0_0_24px_rgba(114,230,232,0.28)]

                            active:scale-95
                        "
                        >
                            <ArrowLeft
                                className="
                                w-5 h-5
                                text-[#72E6E8]
                                transition-transform
                                duration-300
                                group-hover:-translate-x-0.5
                                drop-shadow-[0_0_6px_rgba(114,230,232,0.45)]
                            "
                                strokeWidth={1.8}
                            />

                            <span
                                aria-hidden="true"
                                className="
                                absolute inset-0
                                rounded-full
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity duration-300
                                shadow-[inset_0_0_12px_rgba(114,230,232,0.12)]
                            "
                            />
                        </Link>

                        {/* MY PROJECTS — RIGHT FACING ARROW */}
                        <Link
                            href="/projects"
                            aria-label="Go to projects"
                            className="
                            pointer-events-auto
                            group
                            absolute
                            right-[25.5%]
                            top-[90%]
                            translate-x-1/2
                            -translate-y-1/2

                            flex items-center justify-center

                            w-11 h-11
                            sm:w-12 sm:h-12

                            rounded-full

                            bg-[#172B45]/85
                            backdrop-blur-md

                            border
                            border-[#72E6E8]/35

                            shadow-[0_4px_18px_rgba(11,21,40,0.45),0_0_16px_rgba(114,230,232,0.12)]

                            transition-all
                            duration-300
                            ease-out

                            hover:translate-x-1/2
                            hover:-translate-y-[calc(50%+2px)]
                            hover:border-[#72E6E8]/70
                            hover:bg-[#1b3655]/90
                            hover:shadow-[0_6px_24px_rgba(11,21,40,0.5),0_0_24px_rgba(114,230,232,0.28)]

                            active:scale-95
                        "
                        >
                            <ArrowRight
                                className="
                                w-5 h-5
                                text-[#72E6E8]
                                transition-transform
                                duration-300
                                group-hover:translate-x-0.5
                                drop-shadow-[0_0_6px_rgba(114,230,232,0.45)]
                            "
                                strokeWidth={1.8}
                            />

                            <span
                                aria-hidden="true"
                                className="
                                absolute inset-0
                                rounded-full
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity duration-300
                                shadow-[inset_0_0_12px_rgba(114,230,232,0.12)]
                            "
                            />
                        </Link>
                    </div>
                )}

                {/* ── Arrival overlay ─────────────────────────────────── */}
                {showArrival && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-12 animate-fade-slide-up">

                        {/* Banner */}
                        <div className="pt-20 text-center max-w-xl mx-auto">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[#72E6E8] bg-[#142B52]/70 border border-[#72E6E8]/30 backdrop-blur-md shadow-[0_0_15px_rgba(114,230,232,0.2)]">
                                <Sparkles className="w-3.5 h-3.5" />
                                DESTINATION REACHED · MONISHA PORTFOLIO
                            </span>
                        </div>

                    </div>
                )}
            </div>
        </section>
    )
}