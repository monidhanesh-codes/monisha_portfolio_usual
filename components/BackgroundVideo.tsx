'use client'

import { useRef, useState, useEffect } from 'react'
import { Volume2, VolumeX, Orbit, X } from 'lucide-react'

interface BackgroundVideoProps {
    onEnded?: () => void
    isFixed?: boolean
    showAudioToggle?: boolean
}

export default function BackgroundVideo({
    onEnded,
    isFixed = true,
    showAudioToggle = true,
}: BackgroundVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    const [videoError, setVideoError] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [showPopup, setShowPopup] = useState(false)

    // Check mobile viewport (<= 767px) on mount for every page load / refresh popup
    useEffect(() => {
        if (typeof window === 'undefined') return

        const isMobile = window.matchMedia('(max-width: 767px)').matches

        if (isMobile) {
            setShowPopup(true)
        }
    }, [])

    const handleClosePopup = () => {
        setShowPopup(false)
    }

    useEffect(() => {
        const video = videoRef.current

        if (!video) return

        // Default audio state: ON
        video.muted = false
        video.volume = 1

        const removeInteractionListeners = () => {
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('pointerdown', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        }

        const unlockAudio = async () => {
            const currentVideo = videoRef.current

            if (!currentVideo) return

            try {
                // Turn audio ON after user interaction
                currentVideo.muted = false
                currentVideo.volume = 1

                await currentVideo.play()

                setIsMuted(false)

                // Audio has successfully been unlocked
                removeInteractionListeners()
            } catch (error) {
                console.log(
                    'Unable to enable video audio:',
                    error
                )
            }
        }

        const playVideo = async () => {
            try {
                // First attempt: autoplay WITH audio
                video.muted = false
                video.volume = 1

                await video.play()

                setIsMuted(false)

                // Audio autoplay worked
                removeInteractionListeners()
            } catch (error) {
                console.log(
                    'Unmuted autoplay blocked by browser policy.',
                    error
                )

                // Browser blocked audio autoplay.
                // Start video muted temporarily.
                video.muted = true
                setIsMuted(true)

                try {
                    await video.play()
                } catch (playError) {
                    console.log(
                        'Video playback failed:',
                        playError
                    )
                }
            }
        }

        playVideo()

        // Listen for the first user interaction.
        // This allows audio to turn ON automatically.
        window.addEventListener(
            'click',
            unlockAudio
        )

        window.addEventListener(
            'pointerdown',
            unlockAudio
        )

        window.addEventListener(
            'keydown',
            unlockAudio
        )

        return () => {
            removeInteractionListeners()
        }
    }, [])

    const toggleAudio = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation()

        const video = videoRef.current

        if (!video) return

        if (video.muted) {
            // Turn audio ON
            video.muted = false
            video.volume = 1

            setIsMuted(false)
        } else {
            // Turn audio OFF
            video.muted = true

            setIsMuted(true)
        }
    }

    return (
        <div
            aria-hidden="true"
            className={`
                ${isFixed ? 'sticky top-0' : 'absolute'}
                inset-0
                z-0
                w-full
                h-screen
                overflow-hidden
                select-none
                pointer-events-none
            `}
            style={{
                backgroundColor: '#0b1528',

                position: isFixed
                    ? 'sticky'
                    : 'absolute',

                top: isFixed
                    ? 0
                    : undefined,

                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                zIndex: 0,
            }}
        >
            {/* Background Video */}
            {!videoError && (
                <video
                    ref={videoRef}
                    src="/scene_01.mp4"
                    autoPlay
                    playsInline
                    preload="auto"
                    muted={false}
                    onEnded={onEnded}
                    onError={() => setVideoError(true)}
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                    "
                />
            )}

            {/* Deep Vignette */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                "
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 30%, rgba(11,21,40,0.65) 100%)',
                }}
            />

            {/* Bottom-to-Top Gradient */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                "
                style={{
                    background:
                        'linear-gradient(to top, rgba(11,21,40,0.85) 0%, transparent 40%, rgba(11,21,40,0.3) 100%)',
                }}
            />

            {/* Colour Grade */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                "
                style={{
                    background:
                        'rgba(11,21,40,0.35)',
                    mixBlendMode: 'multiply',
                }}
            />

            {/* First Visit Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1528]/80 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-auto">
                    <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#172B45]/90 backdrop-blur-xl border border-[#72E6E8]/30 shadow-[0_0_40px_rgba(114,230,232,0.15)] flex flex-col items-center text-center">
                        {/* Glowing Icon */}
                        <div className="w-16 h-16 rounded-full bg-[#72E6E8]/10 border border-[#72E6E8]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(114,230,232,0.3)]">
                            <Orbit className="w-8 h-8 text-[#72E6E8]" />
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl font-bold text-[#F2F6FA] tracking-tight mb-3">
                            Optimal Experience
                        </h2>

                        {/* Body Text */}
                        <p className="text-[#B7C7D9] font-light leading-relaxed mb-8">
                            For the best experience, please view this site in a web browser.
                        </p>

                        {/* Action Button */}
                        <button
                            type="button"
                            onClick={handleClosePopup}
                            className="w-full py-3.5 rounded-full bg-[#72E6E8]/10 hover:bg-[#72E6E8]/20 border border-[#72E6E8]/50 text-[#72E6E8] font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(114,230,232,0.1)] hover:shadow-[0_0_25px_rgba(114,230,232,0.3)] cursor-pointer"
                        >
                            Continue to Site
                        </button>
                        
                        {/* Subtle Close Icon Top Right */}
                        <button 
                            type="button"
                            onClick={handleClosePopup}
                            className="absolute top-4 right-4 p-2 text-[#B7C7D9] hover:text-[#F2F6FA] transition-colors rounded-full hover:bg-[#F2F6FA]/10 cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Audio Toggle */}
            {showAudioToggle && (
                <div
                    className="
                        absolute
                        top-20
                        right-4
                        sm:top-24
                        sm:right-6
                        z-30
                        pointer-events-auto
                    "
                >
                    <button
                        type="button"
                        onClick={toggleAudio}
                        aria-label={
                            isMuted
                                ? 'Unmute video audio'
                                : 'Mute video audio'
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#F2F6FA]/10
                            bg-[#142B52]/50
                            px-3
                            py-1.5
                            text-xs
                            font-mono
                            text-[#B7C7D9]
                            backdrop-blur-md
                            shadow-md
                            transition-all
                            hover:bg-[#142B52]/80
                            hover:text-[#72E6E8]
                            cursor-pointer
                        "
                    >
                        {isMuted ? (
                            <>
                                <VolumeX
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#AAA2C8]
                                    "
                                />

                                <span className="hidden sm:inline">
                                    SOUND OFF
                                </span>
                            </>
                        ) : (
                            <>
                                <Volume2
                                    className="
                                        h-3.5
                                        w-3.5
                                        animate-pulse
                                        text-[#72E6E8]
                                    "
                                />

                                <span
                                    className="
                                        hidden
                                        text-[#72E6E8]
                                        sm:inline
                                    "
                                >
                                    SOUND ON
                                </span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}