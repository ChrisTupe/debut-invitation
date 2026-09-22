import { useState, useRef, useEffect } from "react"
import {
  Volume2,
  VolumeX,
  Sparkles,
  Crown,
  Gift,
  PartyPopper,
  Star,
  Flower2,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Palette (used consistently throughout instead of arbitrary one-off hexes)
//   cream       #fdf6f1  page background
//   blush       #f6e7de  card / secondary background
//   wine        #7a1330  primary accent, headings
//   wine-deep   #4e0c1f  hover / strong accent
//   plum        #4a1942  secondary accent (violet, from dress code)
//   rose-gold   #b8895f  hairlines, ornament strokes
//   ink         #2a1620  body text
//   ink-soft    #7a5c68  muted / secondary text
//   hero-black  #0d0308  hero backdrop, anchors the swirl motif
// ---------------------------------------------------------------------------

// Dress code colors, displayed as simple named swatches
const DRESS_CODE: { name: string; hex: string; border?: string }[] = [
  { name: "Red", hex: "#c9184b" },
  { name: "Violet", hex: "#7b2d8e" },
  { name: "Black", hex: "#111111", border: "#b8895f" },
]

// Faint, scattered debut-themed icons in the background.
// Sized responsively (clamp) so they read clearly on mobile, low-opacity
// so they sit quietly behind the cream page instead of cluttering it.
function BackgroundDecor() {
  const icons: {
    Icon: typeof Sparkles
    top: string
    left: string
    size: number
    minSize: number
    rotate: number
    opacity: number
    color: string
  }[] = [
    { Icon: Sparkles, top: "4%", left: "10%", size: 46, minSize: 26, rotate: -12, opacity: 0.08, color: "#b8895f" },
    { Icon: Crown, top: "8%", left: "78%", size: 56, minSize: 30, rotate: 10, opacity: 0.07, color: "#7a1330" },
    { Icon: Star, top: "16%", left: "40%", size: 28, minSize: 18, rotate: 8, opacity: 0.08, color: "#b8895f" },
    { Icon: PartyPopper, top: "22%", left: "6%", size: 46, minSize: 26, rotate: -18, opacity: 0.06, color: "#4a1942" },
    { Icon: Gift, top: "26%", left: "88%", size: 44, minSize: 26, rotate: 15, opacity: 0.07, color: "#7a1330" },
    { Icon: Sparkles, top: "34%", left: "58%", size: 26, minSize: 18, rotate: 22, opacity: 0.07, color: "#4a1942" },
    { Icon: Flower2, top: "40%", left: "16%", size: 38, minSize: 22, rotate: -6, opacity: 0.08, color: "#4a1942" },
    { Icon: Star, top: "46%", left: "90%", size: 26, minSize: 18, rotate: -10, opacity: 0.07, color: "#b8895f" },
    { Icon: Crown, top: "52%", left: "30%", size: 34, minSize: 20, rotate: -8, opacity: 0.06, color: "#4a1942" },
    { Icon: Sparkles, top: "58%", left: "72%", size: 32, minSize: 20, rotate: 20, opacity: 0.07, color: "#7a1330" },
    { Icon: PartyPopper, top: "64%", left: "10%", size: 40, minSize: 24, rotate: 25, opacity: 0.06, color: "#b8895f" },
    { Icon: Gift, top: "68%", left: "50%", size: 28, minSize: 18, rotate: -22, opacity: 0.06, color: "#4a1942" },
    { Icon: Flower2, top: "74%", left: "84%", size: 36, minSize: 22, rotate: 12, opacity: 0.07, color: "#7a1330" },
    { Icon: Star, top: "80%", left: "20%", size: 26, minSize: 18, rotate: 6, opacity: 0.06, color: "#b8895f" },
    { Icon: Crown, top: "86%", left: "62%", size: 40, minSize: 24, rotate: -8, opacity: 0.06, color: "#4a1942" },
    { Icon: Sparkles, top: "92%", left: "34%", size: 30, minSize: 20, rotate: 12, opacity: 0.06, color: "#7a1330" },
    { Icon: PartyPopper, top: "96%", left: "78%", size: 34, minSize: 22, rotate: -15, opacity: 0.06, color: "#b8895f" },
    { Icon: Flower2, top: "12%", left: "58%", size: 24, minSize: 16, rotate: 4, opacity: 0.06, color: "#7a1330" },
    { Icon: Gift, top: "48%", left: "4%", size: 26, minSize: 18, rotate: 18, opacity: 0.06, color: "#4a1942" },
    { Icon: Star, top: "62%", left: "94%", size: 22, minSize: 16, rotate: -14, opacity: 0.06, color: "#b8895f" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((item, i) => {
        const { Icon, top, left, size, minSize, rotate, opacity, color } = item
        return (
          <Icon
            key={i}
            style={{
              position: "absolute",
              top,
              left,
              width: `clamp(${minSize}px, 8vw, ${size}px)`,
              height: `clamp(${minSize}px, 8vw, ${size}px)`,
              transform: `rotate(${rotate}deg)`,
              opacity,
              color,
            }}
          />
        )
      })}
    </div>
  )
}

// A thin laurel-style hairline used to flank the monogram and as a section
// divider. Kept to a single reusable motif rather than mixing ornament
// styles across the page.
function Sprig({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 24"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
    >
      <path d="M2 12 H92" stroke="#b8895f" strokeWidth="1" />
      <path d="M92 12 L84 7" stroke="#b8895f" strokeWidth="1" strokeLinecap="round" />
      <path d="M92 12 L84 17" stroke="#b8895f" strokeWidth="1" strokeLinecap="round" />
      <path d="M70 12 L62 6" stroke="#b8895f" strokeWidth="1" strokeLinecap="round" />
      <path d="M52 12 L46 18" stroke="#b8895f" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// Thin corner brackets overlaid on the hero photo to frame it like a
// keepsake portrait rather than a flat full-bleed image.
function CornerFrame() {
  const common = "absolute w-8 h-8 sm:w-10 sm:h-10 border-[#f6e7de]/70"
  return (
    <>
      <span className={`${common} top-4 left-4 border-t border-l`} />
      <span className={`${common} top-4 right-4 border-t border-r`} />
      <span className={`${common} bottom-4 left-4 border-b border-l`} />
      <span className={`${common} bottom-4 right-4 border-b border-r`} />
    </>
  )
}

// Original red-and-gold swirl backdrop for the hero portrait: a deep
// wine-to-black glow with flowing ribbon strokes and scattered sparkle
// points, echoing the dress code palette (red / violet / black) rather
// than a flat photo background.
function SwirlBackdrop() {
  const sparkles: { cx: number; cy: number; r: number; opacity: number }[] = [
    { cx: 90, cy: 620, r: 2.2, opacity: 0.9 },
    { cx: 150, cy: 560, r: 1.4, opacity: 0.6 },
    { cx: 230, cy: 660, r: 1.8, opacity: 0.8 },
    { cx: 310, cy: 520, r: 1.2, opacity: 0.5 },
    { cx: 400, cy: 610, r: 2.4, opacity: 0.9 },
    { cx: 470, cy: 540, r: 1.4, opacity: 0.6 },
    { cx: 560, cy: 600, r: 1.8, opacity: 0.75 },
    { cx: 640, cy: 500, r: 1.3, opacity: 0.55 },
    { cx: 700, cy: 580, r: 2, opacity: 0.85 },
    { cx: 120, cy: 430, r: 1.3, opacity: 0.5 },
    { cx: 340, cy: 380, r: 1.6, opacity: 0.6 },
    { cx: 560, cy: 340, r: 1.2, opacity: 0.45 },
    { cx: 720, cy: 390, r: 1.5, opacity: 0.55 },
    { cx: 60, cy: 250, r: 1.1, opacity: 0.4 },
    { cx: 680, cy: 200, r: 1.3, opacity: 0.45 },
  ]

  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#4e0c1f" />
          <stop offset="55%" stopColor="#1c0510" />
          <stop offset="100%" stopColor="#0d0308" />
        </radialGradient>
        <linearGradient id="ribbonGold1" x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#f6d9a8" />
          <stop offset="45%" stopColor="#c9184b" />
          <stop offset="100%" stopColor="#7a1330" />
        </linearGradient>
        <linearGradient id="ribbonGold2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b8895f" />
          <stop offset="50%" stopColor="#e8a94f" />
          <stop offset="100%" stopColor="#7a1330" />
        </linearGradient>
        <linearGradient id="ribbonPlum" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b2d8e" />
          <stop offset="100%" stopColor="#4a1942" />
        </linearGradient>
      </defs>

      <rect width="800" height="800" fill="url(#heroGlow)" />

      {/* flowing ribbon strokes, layered thick-to-thin like the reference swirl art */}
      <path
        d="M -60 640 C 140 520, 210 760, 400 610 S 690 430, 880 560"
        stroke="url(#ribbonGold1)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M -60 690 C 160 600, 230 800, 440 680 S 720 520, 900 630"
        stroke="url(#ribbonGold2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M -60 500 C 180 380, 260 630, 520 480 S 780 300, 900 420"
        stroke="url(#ribbonPlum)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M -60 760 C 220 700, 300 860, 560 730 S 820 620, 900 700"
        stroke="url(#ribbonGold1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {sparkles.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#f6d9a8" opacity={s.opacity} />
      ))}
    </svg>
  )
}

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.6
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }, [])

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
    setHasInteracted(true)
  }

  return (
    <div className="min-h-screen w-full bg-[#fdf6f1] relative overflow-x-hidden">
      {/* Google Fonts: Playfair Display (display serif) + Jost (clean sans) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,500&family=Jost:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Jost', sans-serif; }
      `}</style>

      {/* Replace src with your own legally obtained audio file */}
      <audio ref={audioRef} src="/nanana.mp3" loop />

      {/* Soft radial warmth behind everything, kept subtle so the page reads light */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at top, #f6e7de 0%, #fdf6f1 55%), radial-gradient(ellipse at bottom, #f3ddd0 0%, transparent 60%)",
        }}
      />

      {/* Faint background decor */}
      <BackgroundDecor />

      <div className="relative z-10 font-body">
        {/* Music toggle button */}
        <button
          onClick={toggleAudio}
          className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2 bg-[#fdf6f1]/85 backdrop-blur-sm border border-[#b8895f]/50 text-[#7a1330] px-3 py-2 rounded-full text-xs tracking-wide shadow-sm hover:border-[#7a1330] transition-colors"
        >
          {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span className="hidden sm:inline">{isPlaying ? "Music On" : "Play Music"}</span>
        </button>

        {/* Tap to begin overlay */}
        {!hasInteracted && !isPlaying && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#2a1620]/50 backdrop-blur-sm transition-opacity duration-300 px-6">
            <div className="bg-[#fdf6f1] border border-[#b8895f]/60 rounded-2xl px-8 py-9 flex flex-col items-center text-center shadow-xl max-w-xs">
              <span className="text-2xl mb-3">🌹</span>
              <p className="font-display italic text-[#7a1330] text-lg mb-1">You're Invited</p>
              <p className="font-body text-[#7a5c68] text-xs mb-5">Tap below to open</p>
              <button
                onClick={toggleAudio}
                className="bg-[#7a1330] text-[#fdf6f1] px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4e0c1f] transition-colors"
              >
                Open Invitation
              </button>
            </div>
          </div>
        )}

        {/* Hero image, now set against an original red-and-gold swirl backdrop */}
        <div className="relative w-full h-[56vh] sm:h-[64vh] md:h-[74vh] overflow-hidden bg-[#0d0308]">
          <SwirlBackdrop />

          <img
            src="/mae2.png"
            alt="Jhastine Mae Santos"
            className="relative z-10 w-full h-full object-contain object-bottom"
          />
          {/* Gradient blending the photo into the cream page below */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#fdf6f1] via-[#2a1620]/5 to-[#2a1620]/25 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#2a1620]/35 via-transparent to-transparent pointer-events-none" />
          <div className="z-30 relative">
            <CornerFrame />
          </div>

          <div className="absolute top-8 left-0 right-0 z-30 text-center px-4">
            <p className="text-[#f6e7de] tracking-[0.35em] text-[10px] sm:text-xs uppercase font-body">
              Celebrating the 18th birthday of
            </p>
          </div>
        </div>

        {/* Text content */}
        <div className="w-full px-4 sm:px-6 pt-10 sm:pt-12 pb-10 text-center -mt-10 sm:-mt-14 relative">
          {/* Monogram crest, bridging the hero and the content card */}
 

          <h1 className="font-display text-[#4e0c1f] text-4xl sm:text-5xl md:text-7xl tracking-wide mb-2 leading-tight break-words">
            Jhastine Mae Santos
          </h1>

          <p className="text-[#7a1330] text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mb-8">
            18th Debut Celebration
          </p>

          <p className="text-[#7a1330] tracking-[0.25em] text-[11px] uppercase mb-2">
            Thank you for coming!
          </p>

          <p className="text-[#5c3a44] text-sm sm:text-base md:text-lg leading-relaxed mb-1 max-w-xl mx-auto font-body">
            Join us for an evening of celebration, music,
          </p>
          <p className="text-[#5c3a44] text-sm sm:text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto font-body">
            and a night to remember.
          </p>

          {/* Event details */}
          <div className="max-w-sm mx-auto mb-10 bg-[#f6e7de]/70 border border-[#b8895f]/40 rounded-xl px-6 py-7 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CalendarDays size={20} className="text-[#7a1330] shrink-0" />
              <p className="font-display text-[#4e0c1f] text-lg sm:text-xl md:text-2xl">
                Friday, September 25, 2026
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Clock size={16} className="text-[#7a1330] shrink-0" />
              <p className="text-[#7a1330] text-sm sm:text-base">5:00 PM to 9:00 PM</p>
            </div>
            <div className="flex items-center justify-center gap-3 px-2">
              <MapPin size={16} className="text-[#7a1330] shrink-0" />
              <p className="text-[#7a1330] text-sm sm:text-base text-left sm:text-center">
                JCJ Santos Resort, Pulilan, Bulacan
              </p>
            </div>
          </div>

          {/* Google Maps preview */}
          <div className="max-w-md mx-auto mb-10 rounded-xl overflow-hidden border border-[#b8895f]/50 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.1806056688465!2d120.84169817334589!3d14.927027969004989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396551bc0f85df7%3A0xa697e6d951eb9a9b!2sJCJ%20Resort!5e0!3m2!1sen!2sph!4v1789228027525!5m2!1sen!2sph"
              width="100%"
              height="220"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Venue location map"
            />
          </div>

          <Sprig className="w-24 sm:w-32 h-6 mx-auto mb-10 opacity-80" />

          {/* Dress code, shown as color swatches */}
          <div className="mb-4">
            <p className="text-[#7a1330] tracking-[0.25em] text-xs uppercase mb-4">
              Dress Code
            </p>
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              {DRESS_CODE.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-2">
                  <span
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-md ring-2 ring-offset-2 ring-offset-[#fdf6f1] ring-[#b8895f]/40"
                    style={{
                      backgroundColor: color.hex,
                      border: `2px solid ${color.border ?? "rgba(255,255,255,0.5)"}`,
                    }}
                  />
                  <span className="text-[#7a5c68] text-xs tracking-wide font-body">{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer credit */}
          <footer className="w-full px-4 pt-8 pb-2 text-center border-t border-[#b8895f]/25 mt-8">
            <p className="text-[#7a5c68] text-[10px] sm:text-xs tracking-widest uppercase font-body">
              Developed by Christopher Santos
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App