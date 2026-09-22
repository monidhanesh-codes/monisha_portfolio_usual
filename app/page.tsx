'use client'

import HeroParallaxTransition from '@/components/HeroParallaxTransition'
import Scene02Sequence from '@/components/Scene02Sequence'

export default function HomePage() {
    return (
        <main
            className="
                relative
                w-full
                bg-[#0b1528]
                text-[#F2F6FA]
                overflow-x-clip
            "
        >
            {/* SECTION 01 — HERO PARALLAX TRANSITION TRACK */}
            <HeroParallaxTransition />

            {/* SECTION 02 — STICKY SCROLL ANIMATION */}
            <Scene02Sequence />
        </main>
    )
}