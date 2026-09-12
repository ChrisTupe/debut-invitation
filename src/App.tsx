import { useState, useRef, useEffect } from "react"
import {
  Volume2,
  VolumeX,
  Flower2,
  X,
  Mail,
  Sparkles,
  Crown,
  Gift,
  PartyPopper,
  Star,
  Banknote,
  Wine,
  Flame,
  Heart,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react"

// The 18 Roses
const ROSES = [
  "John Mark Santos",
  "Christopher Ryan Santos",
  "Kevin Del Rosario",
  "Dr. Giovanni Santos",
  "Engr. Gian Carlo Santos",
  "Tristan Martin",
  "Agri Engr 2 Lt. Reynaldo Santos Jr.",
  "Dominic Intacto",
  "Christopher Bong Santos",
  "Justin Santos",
  "John Gabriel Valenzuela",
  "Tristanlex Valenzuela",
  "Isaiah Zamora",
  "Jared Zamora",
  "JM Oliva",
  "Carlo Aldana",
  "Julius Aldana",
  "Jhas Santos",
]

// The 18 Bills
const BILLS = [
  "Dra. Maria Salvacion Santos",
  "Tes Del Rosario RN",
  "Jack Intacto",
  "Maritess Gaufo",
  "Vilma Martin",
  "Alice Zamora",
  "Jennifer de Lara",
  "Annie Espigar",
  "Claudette Paulino - RN",
  "Doc Kaye Javier",
  "Doc Lhen Valenzuela",
  "Doc Ayen Valenzuela",
  "Brianne Tagalag - RMT",
  "Erlinda San Pedro - RM",
  "Emelita Alejandro - RM",
  "Chona Samson - RM",
  "Valerie de Vera - RM/LPT",
  "Nor Alcarion - RN/RM",
]

// The 18 Shots
const SHOTS = [
  "Jhas Santos",
  "Edilberto Santos",
  "Crispin Santos",
  "Reynaldo Santos",
  "Danilo Boyet Santos",
  "Joel Santos",
  "Joey Santos",
  "Billy Gaufo",
  "Edwin Martin",
  "Freddie Intacto",
  "Onofre Valenzuela",
  "Boy Tagalag",
  "Lando Paulino",
  "Neil Zamora",
  "Emman Santos",
  "Johnny Valenzuela",
  "Tito Valenzuela",
  "Junior Carlos",
]

// The 18 Candles
const CANDLES = [
  "Belen Guanzon",
  "Gloria Santos",
  "Marites Santos",
  "Evangeline Santos",
  "Lola Lourdes Valenzuela",
  "Lola Paneng Soriaga",
  "Lola Estela Paulino",
  "Lola Fe Tagalag",
  "Raquel Aldana",
  "Rein Aldana",
  "Jillian Espigar",
  "Helena Paulino",
  "Carla Ysabel Paulino",
  "Marie Oliva",
  "Trisha Martin",
  "Bea Santos",
  "Ayesha Gaufo",
  "Mommy Tina Santos",
]

// Wishes from Classmates & Friends of Mae (placeholder names for now)
const WISHES = [
  "Mae's Classmate",
  "Mae's Classmate",
  "Mae's Classmate",
  "Mae's Classmate",
  "Mae's Classmate",
  "Mae's Classmate",
  "Mae's Classmate",
  "Mae's Classmate",
]

type SectionKey = "roses" | "bills" | "shots" | "candles" | "wishes"

const SECTIONS: {
  key: SectionKey
  title: string
  list: string[]
  Icon: typeof Flower2
  glyphSize: number
}[] = [
  { key: "roses", title: "18 Roses", list: ROSES, Icon: Flower2, glyphSize: 30 },
  { key: "bills", title: "18 Bills", list: BILLS, Icon: Banknote, glyphSize: 28 },
  { key: "shots", title: "18 Shots", list: SHOTS, Icon: Wine, glyphSize: 30 },
  { key: "candles", title: "18 Candles", list: CANDLES, Icon: Flame, glyphSize: 30 },
  { key: "wishes", title: "Wishes of Classmates & Friends", list: WISHES, Icon: Heart, glyphSize: 28 },
]

// Dress code colors, displayed as simple named swatches
const DRESS_CODE: { name: string; hex: string; border?: string }[] = [
  { name: "Red", hex: "#c9184b" },
  { name: "Violet", hex: "#7b2d8e" },
  { name: "White", hex: "#f5e6ee", border: "#7b2d8e" },
]

const STOP_WORDS = new Set(["dr", "dra", "doc", "engr", "lt", "jr", "agri", "rn", "rm", "rt", "rmt", "de", "del", "san", "lola", "ni"])

function normalize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[.,\-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
}

// Allows partial / prefix matches, e.g. "chris" matches "christopher"
function tokensMatch(inputToken: string, nameToken: string): boolean {
  if (inputToken === nameToken) return true
  if (inputToken.length >= 3 && nameToken.startsWith(inputToken)) return true
  if (nameToken.length >= 3 && inputToken.startsWith(nameToken)) return true
  return false
}

function scoreMatch(input: string, name: string): number {
  const inputTokens = normalize(input)
  const nameTokens = normalize(name)
  if (inputTokens.length === 0) return 0
  const overlap = inputTokens.filter((t) =>
    nameTokens.some((nt) => tokensMatch(t, nt))
  ).length
  const ratio = overlap / inputTokens.length
  return overlap > 0 && ratio >= 0.5 ? overlap : 0
}

function findMatchingGuest(
  input: string
): { section: SectionKey; name: string } | null {
  let best: { section: SectionKey; name: string } | null = null
  let bestScore = 0

  for (const section of SECTIONS) {
    for (const name of section.list) {
      const score = scoreMatch(input, name)
      if (score > bestScore) {
        bestScore = score
        best = { section: section.key, name }
      }
    }
  }

  return best
}

// Small helper hook to drive smooth mount/unmount transitions for modals
function useModalTransition(isOpen: boolean, duration = 300) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>
    let hideTimer: ReturnType<typeof setTimeout>

    if (isOpen) {
      setShouldRender(true)
      showTimer = setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      hideTimer = setTimeout(() => setShouldRender(false), duration)
    }

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isOpen, duration])

  return { shouldRender, isVisible }
}

// Faint, scattered debut-themed icons in the background.
// Sized responsively (clamp) so they read clearly on mobile instead of
// disappearing entirely, and spaced more densely so there are no large
// empty gaps on narrow viewports.
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
    { Icon: Sparkles, top: "4%", left: "10%", size: 52, minSize: 30, rotate: -12, opacity: 0.12, color: "#e8b4c8" },
    { Icon: Crown, top: "8%", left: "78%", size: 64, minSize: 34, rotate: 10, opacity: 0.1, color: "#c9184b" },
    { Icon: Star, top: "16%", left: "40%", size: 34, minSize: 22, rotate: 8, opacity: 0.12, color: "#e8b4c8" },
    { Icon: PartyPopper, top: "22%", left: "6%", size: 54, minSize: 30, rotate: -18, opacity: 0.1, color: "#7b2d8e" },
    { Icon: Gift, top: "26%", left: "88%", size: 52, minSize: 30, rotate: 15, opacity: 0.1, color: "#c9184b" },
    { Icon: Sparkles, top: "34%", left: "58%", size: 30, minSize: 20, rotate: 22, opacity: 0.1, color: "#7b2d8e" },
    { Icon: Flower2, top: "40%", left: "16%", size: 44, minSize: 26, rotate: -6, opacity: 0.12, color: "#7b2d8e" },
    { Icon: Star, top: "46%", left: "90%", size: 32, minSize: 20, rotate: -10, opacity: 0.1, color: "#e8b4c8" },
    { Icon: Crown, top: "52%", left: "30%", size: 40, minSize: 24, rotate: -8, opacity: 0.1, color: "#7b2d8e" },
    { Icon: Sparkles, top: "58%", left: "72%", size: 38, minSize: 24, rotate: 20, opacity: 0.11, color: "#c9184b" },
    { Icon: PartyPopper, top: "64%", left: "10%", size: 46, minSize: 28, rotate: 25, opacity: 0.1, color: "#e8b4c8" },
    { Icon: Gift, top: "68%", left: "50%", size: 34, minSize: 22, rotate: -22, opacity: 0.1, color: "#7b2d8e" },
    { Icon: Flower2, top: "74%", left: "84%", size: 42, minSize: 26, rotate: 12, opacity: 0.11, color: "#c9184b" },
    { Icon: Star, top: "80%", left: "20%", size: 30, minSize: 20, rotate: 6, opacity: 0.1, color: "#e8b4c8" },
    { Icon: Crown, top: "86%", left: "62%", size: 48, minSize: 28, rotate: -8, opacity: 0.1, color: "#7b2d8e" },
    { Icon: Sparkles, top: "92%", left: "34%", size: 36, minSize: 22, rotate: 12, opacity: 0.1, color: "#c9184b" },
    { Icon: PartyPopper, top: "96%", left: "78%", size: 40, minSize: 24, rotate: -15, opacity: 0.1, color: "#e8b4c8" },
    { Icon: Flower2, top: "12%", left: "58%", size: 28, minSize: 18, rotate: 4, opacity: 0.09, color: "#c9184b" },
    { Icon: Gift, top: "48%", left: "4%", size: 30, minSize: 20, rotate: 18, opacity: 0.09, color: "#7b2d8e" },
    { Icon: Star, top: "62%", left: "94%", size: 26, minSize: 18, rotate: -14, opacity: 0.09, color: "#e8b4c8" },
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

// Faint decorative icons inside each guest-list modal, echoing the
// background pattern but scaled down and mixed with the section's own
// icon so each modal (Roses / Bills / Shots / Candles / Wishes) feels
// consistent with the overall invitation design.
function ModalDecor({ Icon }: { Icon: typeof Sparkles }) {
  const icons: {
    Icon: typeof Sparkles
    top: string
    left: string
    size: number
    rotate: number
    opacity: number
    color: string
  }[] = [
    { Icon: Sparkles, top: "3%", left: "8%", size: 24, rotate: -12, opacity: 0.1, color: "#e8b4c8" },
    { Icon, top: "6%", left: "82%", size: 34, rotate: 14, opacity: 0.09, color: "#c9184b" },
    { Icon: Star, top: "22%", left: "90%", size: 18, rotate: 8, opacity: 0.1, color: "#e8b4c8" },
    { Icon, top: "34%", left: "4%", size: 28, rotate: -16, opacity: 0.09, color: "#7b2d8e" },
    { Icon: PartyPopper, top: "48%", left: "88%", size: 20, rotate: 20, opacity: 0.09, color: "#c9184b" },
    { Icon, top: "60%", left: "6%", size: 26, rotate: 10, opacity: 0.09, color: "#7b2d8e" },
    { Icon: Crown, top: "74%", left: "84%", size: 20, rotate: -10, opacity: 0.09, color: "#7b2d8e" },
    { Icon, top: "88%", left: "12%", size: 22, rotate: 6, opacity: 0.09, color: "#c9184b" },
    { Icon: Gift, top: "16%", left: "44%", size: 18, rotate: 12, opacity: 0.08, color: "#e8b4c8" },
    { Icon, top: "94%", left: "60%", size: 24, rotate: -8, opacity: 0.08, color: "#c9184b" },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((item, i) => {
        const { Icon: ItemIcon, top, left, size, rotate, opacity, color } = item
        return (
          <ItemIcon
            key={i}
            style={{
              position: "absolute",
              top,
              left,
              width: size,
              height: size,
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

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const guestSectionRef = useRef<HTMLDivElement | null>(null)
  const highlightedItemRef = useRef<HTMLLIElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [nameSubmitted, setNameSubmitted] = useState(false)

  const [openSection, setOpenSection] = useState<SectionKey | null>(null)
  const [highlighted, setHighlighted] = useState<{
    section: SectionKey
    name: string
  } | null>(null)

  const nameModalTransition = useModalTransition(showNameModal)
  const sectionModalTransition = useModalTransition(openSection !== null)

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

  // After the guest taps in (and audio starts), greet them by name
  useEffect(() => {
    if (hasInteracted && !nameSubmitted) {
      const timer = setTimeout(() => setShowNameModal(true), 500)
      return () => clearTimeout(timer)
    }
  }, [hasInteracted, nameSubmitted])

  useEffect(() => {
    if (openSection && highlighted && highlighted.section === openSection && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [openSection, highlighted])

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

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return

    const match = findMatchingGuest(trimmed)
    setNameSubmitted(true)
    setShowNameModal(false)

    if (match) {
      setHighlighted(match)
      setTimeout(() => {
        setOpenSection(match.section)
        setTimeout(() => {
          guestSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }, 100)
      }, 250)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#1f0d1a] relative overflow-x-hidden">
      {/* Replace src with your own legally obtained audio file */}
      <audio ref={audioRef} src="/kanibalismo.mp3" loop />

      {/* Faint background decor */}
      <BackgroundDecor />

      <div className="relative z-10">
        {/* Music toggle button */}
        <button
          onClick={toggleAudio}
          className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2 bg-[#1f0d1a]/80 backdrop-blur-sm border border-[#c9184b]/40 text-[#e8b4c8] px-3 py-2 rounded-full text-xs tracking-wide hover:border-[#c9184b] transition-colors"
        >
          {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span className="hidden sm:inline">{isPlaying ? "Music On" : "Play Music"}</span>
        </button>

        {/* Tap to begin overlay */}
        {!hasInteracted && !isPlaying && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f0d1a]/70 backdrop-blur-sm transition-opacity duration-300 px-6">
            <button
              onClick={toggleAudio}
              className="bg-[#c9184b] text-[#1f0d1a] px-6 py-3 rounded-full text-sm tracking-widest uppercase font-medium hover:bg-[#e8b4c8] transition-colors"
            >
              🌹 Tap to Begin
            </button>
          </div>
        )}

        {/* Name entry modal */}
        {nameModalTransition.shouldRender && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1f0d1a]/85 backdrop-blur-sm px-5 sm:px-6 transition-opacity duration-300 ${
              nameModalTransition.isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`bg-[#2a1220] border border-[#7b2d8e]/40 rounded-2xl px-5 sm:px-6 py-7 sm:py-8 max-w-sm w-full text-center transition-all duration-300 ease-out ${
                nameModalTransition.isVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4"
              }`}
            >
              <p className="text-[#c9184b] tracking-[0.2em] text-xs uppercase mb-2">
                Welcome
              </p>
              <h2 className="text-[#f5e6ee] text-xl sm:text-2xl font-serif mb-4">
                What's your name?
              </h2>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSubmit()
                }}
                placeholder="Enter your name"
                className="w-full bg-[#1f0d1a] border border-[#7b2d8e]/40 text-[#f5e6ee] placeholder-[#e8b4c8]/40 rounded-full px-4 py-2 text-sm mb-4 outline-none focus:border-[#c9184b]"
                autoFocus
              />
              <button
                onClick={handleNameSubmit}
                className="bg-[#c9184b] text-[#1f0d1a] px-6 py-2 rounded-full text-sm tracking-widest uppercase font-medium hover:bg-[#e8b4c8] transition-colors w-full"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Section modal (shared by Roses / Bills / Shots / Candles / Wishes) */}
        {sectionModalTransition.shouldRender && openSection && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1f0d1a]/85 backdrop-blur-sm px-5 sm:px-6 transition-opacity duration-300 ${
              sectionModalTransition.isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`bg-[#2a1220] border border-[#7b2d8e]/40 rounded-2xl max-w-md w-full max-h-[80vh] relative overflow-hidden transition-all duration-300 ease-out ${
                sectionModalTransition.isVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4"
              }`}
            >
              {SECTIONS.filter((s) => s.key === openSection).map((section) => (
                <ModalDecor key={`decor-${section.key}`} Icon={section.Icon} />
              ))}

              <div className="relative z-10 max-h-[80vh] overflow-y-auto px-5 sm:px-6 py-7 sm:py-8">
                <button
                  onClick={() => setOpenSection(null)}
                  className="absolute top-4 right-4 text-[#e8b4c8] hover:text-[#c9184b] transition-colors"
                >
                  <X size={18} />
                </button>

                {SECTIONS.filter((s) => s.key === openSection).map((section) => (
                  <div key={section.key}>
                    <div className="text-center mb-6 px-2">
                      <section.Icon className="mx-auto text-[#c9184b] mb-2" size={28} />
                      <h2 className="text-[#f5e6ee] text-xl sm:text-2xl font-serif leading-snug">{section.title}</h2>
                    </div>

                    <ul className="space-y-2">
                      {section.list.map((name, i) => {
                        const isHighlighted =
                          highlighted?.section === section.key && highlighted?.name === name
                        return (
                          <li
                            key={`${section.key}-${i}`}
                            ref={isHighlighted ? highlightedItemRef : null}
                            className={`flex items-baseline gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isHighlighted ? "bg-[#c9184b]/20 border border-[#c9184b]" : ""
                            }`}
                          >
                            <span className="text-[#7b2d8e] text-sm w-5 shrink-0">
                              {i + 1}.
                            </span>
                            <span
                              className={`text-sm ${
                                isHighlighted ? "text-[#f5e6ee] font-medium" : "text-[#e8b4c8]"
                              }`}
                            >
                              {name}
                            </span>
                          </li>
                        )
                      })}
                    </ul>

                    {highlighted?.section === section.key && (
                      <p className="text-center text-[#c9184b] text-xs tracking-wide mt-6">
                        Welcome, {highlighted.name} 🌹
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hero image */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
          <img
            src="/mae2.png"
            alt="Jhastine Mae Santos"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f0d1a] via-transparent to-[#1f0d1a]/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f0d1a]/40 via-transparent to-transparent" />
        </div>

        {/* Text content */}
        <div className="w-full px-4 sm:px-6 py-10 sm:py-12 text-center">
          <p className="text-[#c9184b] tracking-[0.3em] text-xs md:text-sm uppercase mb-3">
            You're Invited
          </p>

          <h1 className="text-[#f5e6ee] text-4xl sm:text-5xl md:text-7xl font-serif tracking-wide mb-2 leading-tight break-words">
            Jhastine Mae Santos
          </h1>

          <p className="text-[#c9184b] text-xs sm:text-sm md:text-base tracking-widest uppercase mb-8">
            18th Debut Celebration
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-10 sm:w-16 bg-[#7b2d8e]/50" />
            <span className="text-[#c9184b] text-2xl">🌹</span>
            <span className="h-px w-10 sm:w-16 bg-[#7b2d8e]/50" />
          </div>

          <p className="text-[#e8b4c8] text-sm sm:text-base md:text-lg leading-relaxed mb-1 max-w-xl mx-auto">
            Join us for an evening of celebration, music,
          </p>
          <p className="text-[#e8b4c8] text-sm sm:text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            and a night to remember.
          </p>

          {/* Event details, now with supporting icons */}
          <div className="space-y-3 mb-6 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3">
              <CalendarDays size={20} className="text-[#c9184b] shrink-0" />
              <p className="text-[#f5e6ee] text-lg sm:text-xl md:text-2xl font-medium">
                Saturday, September 26, 2026
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock size={18} className="text-[#c9184b] shrink-0" />
              <p className="text-[#c9184b] text-sm sm:text-base">6:00 PM to 10:00 PM</p>
            </div>
            <div className="flex items-center justify-center gap-3 px-2">
              <MapPin size={18} className="text-[#c9184b] shrink-0" />
              <p className="text-[#c9184b] text-sm sm:text-base text-left sm:text-center">
                JCJ Santos Resort, Tinejero, Pulilan, Bulacan
              </p>
            </div>
          </div>

          {/* Google Maps preview */}
          <div className="max-w-md mx-auto mb-10 rounded-xl overflow-hidden border border-[#7b2d8e]/40">
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

          {/* Dress code, shown as color swatches */}
          <div className="mb-10">
            <p className="text-[#c9184b] tracking-[0.2em] text-xs uppercase mb-3">
              Dress Code
            </p>
            <div className="flex items-center justify-center gap-6">
              {DRESS_CODE.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-2">
                  <span
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-md"
                    style={{
                      backgroundColor: color.hex,
                      border: `2px solid ${color.border ?? "rgba(255,255,255,0.15)"}`,
                    }}
                  />
                  <span className="text-[#e8b4c8] text-xs tracking-wide">{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guest-list sections: Roses / Bills / Shots / Candles / Wishes.
              Each renders as a full-width envelope so it reads as a real
              mailed invitation rather than a small icon grid. */}
          <div className="max-w-lg mx-auto pt-8 border-t border-[#7b2d8e]/30">
            <div ref={guestSectionRef} className="flex flex-col gap-4 sm:gap-5">
              {SECTIONS.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setOpenSection(section.key)}
                  className="group relative w-full rounded-xl border border-[#7b2d8e]/40 bg-[#2a1220]/60 hover:border-[#c9184b] hover:bg-[#2a1220] transition-colors overflow-hidden"
                  style={{ minHeight: 100 }}
                >
                  {/* Envelope flap */}
                  <div
                    className="absolute inset-x-0 top-0 h-full pointer-events-none"
                    style={{
                      clipPath: "polygon(0 0, 50% 42%, 100% 0)",
                      background:
                        "linear-gradient(180deg, rgba(201,24,75,0.18), rgba(201,24,75,0) 70%)",
                    }}
                  />
                  {/* Envelope body outline */}
                  <div className="absolute inset-2 rounded-lg border border-[#c9184b]/25 pointer-events-none" />

                  <div className="relative flex items-center gap-4 sm:gap-5 h-full px-4 sm:px-6 py-5 sm:py-6">
                    <div
                      className="relative flex items-center justify-center shrink-0 w-14 h-14 sm:w-[72px] sm:h-[72px]"
                    >
                      <Mail
                        size={72}
                        strokeWidth={1.3}
                        className="w-full h-full text-[#c9184b] group-hover:text-[#e8b4c8] transition-colors"
                      />
                      <section.Icon
                        size={section.glyphSize}
                        className="absolute w-5 h-5 sm:w-auto sm:h-auto text-[#e8b4c8] group-hover:text-[#c9184b] transition-colors"
                        style={{ top: "44%", left: "50%", transform: "translate(-50%, -50%)" }}
                      />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <span className="block text-[#f5e6ee] text-lg sm:text-xl md:text-2xl font-serif tracking-wide leading-snug">
                        {section.title}
                      </span>
                      <span className="block text-[#e8b4c8]/70 text-[10px] sm:text-xs tracking-widest uppercase mt-1">
                        Tap to open
                      </span>
                    </div>
                  </div>
                </button>
              ))}
        {/* Footer credit */}
        <footer className="w-full px-4 py-6 text-center border-t border-[#7b2d8e]/20">
          <p className="text-[#e8b4c8]/50 text-[10px] sm:text-xs tracking-widest uppercase">
            Developed by Christopher Santos
          </p>
        </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App