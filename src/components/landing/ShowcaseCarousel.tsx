import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarClock, FileCheck2, PlayCircle, ShieldCheck, Ticket } from "lucide-react";
import { Photo } from "@/components/ds/Photo";
import { DIRECT_NAME, DirectMark } from "@/components/direct/SeniorGDirect";

// A compact, calm horizontal showcase for the landing page. One card leads,
// the next peeks in. It advances one card every few seconds while on screen,
// pauses while someone is touching, hovering or focusing it, and never moves
// on its own for reduced-motion users. Swipe works natively (scroll-snap).

const INTERVAL_MS = 3800;
const RESUME_AFTER_MS = 6000;

interface Slide {
  id: string;
  title: string;
  line: string;
  visual: React.ReactNode;
}

function Bubble({ children, me }: { children: React.ReactNode; me?: boolean }) {
  return (
    <div className={["flex", me ? "justify-end" : "justify-start"].join(" ")}>
      <p
        className={[
          "max-w-[85%] rounded-[1rem] px-3 py-1.5 text-meta leading-snug",
          me ? "rounded-br-sm bg-white text-ink" : "rounded-bl-sm bg-accent text-ink",
        ].join(" ")}
      >
        {children}
      </p>
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    id: "direct",
    title: DIRECT_NAME,
    line: "Connect with SeniorG anytime.",
    visual: (
      <div className="flex h-full flex-col bg-brand-deep p-4 text-white">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-2">
          <DirectMark size="sm" />
          <p className="min-w-0 truncate text-meta">
            <span className="font-semibold">Priya</span>
            <span className="text-white/70"> · available now · demo</span>
          </p>
        </div>
        <div className="mt-2.5 space-y-2">
          <Bubble me>Extra work on the AC — should I approve it?</Bubble>
          <Bubble>I've checked the quote. I can handle it — your call.</Bubble>
        </div>
      </div>
    ),
  },
  {
    id: "reminders",
    title: "Reminders & Renewals",
    line: "Stay on top of important dates.",
    visual: (
      <div className="flex h-full items-center bg-sand p-4">
        <ul className="w-full divide-y divide-line rounded-tile bg-card px-3.5 shadow-soft">
          {[
            { icon: FileCheck2, title: "Life certificate", meta: "Due 30 Nov · explained", tone: "text-needs" },
            { icon: ShieldCheck, title: "Health insurance renewal", meta: "In 9 weeks", tone: "text-ink-3" },
            { icon: CalendarClock, title: "Property tax", meta: "Paid · on record", tone: "text-success" },
          ].map(({ icon: Icon, title, meta, tone }) => (
            <li key={title} className="flex items-center gap-3 py-2">
              <Icon size={18} className={["shrink-0", tone].join(" ")} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-meta font-semibold text-ink">{title}</span>
                <span className={["block text-tag", tone].join(" ")}>{meta}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "events",
    title: "Local Life",
    line: "Events, outings and things worth doing.",
    visual: (
      <div className="relative h-full">
        <Photo slot="theatre" className="absolute inset-0 h-full w-full" rounded="rounded-none" />
        <div className="scrim-bottom absolute inset-0" />
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-tile bg-card p-2.5 shadow-lift">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-deep">
            <Ticket size={17} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-meta font-semibold text-ink">Pune Theatre — Demo</span>
            <span className="block truncate text-tag text-ink-2">Sat · 7 pm · 2 seats</span>
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "smart",
    title: "Smart Minutes",
    line: "Useful, verified learning in minutes.",
    visual: (
      <div className="relative h-full">
        <Photo slot="phone" className="absolute inset-0 h-full w-full" rounded="rounded-none" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-deep shadow-lift">
            <PlayCircle size={26} />
          </span>
        </span>
        <span className="absolute bottom-3 right-3 rounded-pill bg-ink/75 px-2.5 py-0.5 text-tag font-semibold text-white">1:45</span>
      </div>
    ),
  },
];

export function ShowcaseCarousel() {
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const lastTouch = useRef(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  const goTo = useCallback(
    (i: number, smooth = true) => {
      const el = scroller.current;
      const card = cards.current[i];
      if (!el || !card) return;
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      el.scrollTo({ left: card.offsetLeft - pad, behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [reduce]
  );

  // Which card leads, from the scroll position (covers swipes too).
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    let best = 0;
    let bestDist = Infinity;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const d = Math.abs(c.offsetLeft - pad - el.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  // Only rotate while the carousel is on screen.
  useEffect(() => {
    const el = scroller.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || hovering || !inView) return;
    const t = window.setInterval(() => {
      if (document.hidden || Date.now() - lastTouch.current < RESUME_AFTER_MS) return;
      const next = (activeRef.current + 1) % SLIDES.length;
      setActive(next);
      goTo(next);
    }, INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [reduce, hovering, inView, goTo]);

  const touched = () => {
    lastTouch.current = Date.now();
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="What SeniorG does"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div
        ref={scroller}
        onScroll={onScroll}
        onPointerDown={touched}
        onTouchStart={touched}
        onWheel={touched}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2 scroll-px-gutter sm:px-6 sm:scroll-px-6 lg:px-10 lg:scroll-px-10"
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              cards.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}: ${s.title}`}
            className={[
              "w-[84%] shrink-0 snap-start overflow-hidden rounded-[1.5rem] bg-card shadow-soft ring-1 ring-card-border transition-opacity duration-500 sm:w-[58%] lg:w-[38%]",
              i === active ? "opacity-100" : "opacity-70",
            ].join(" ")}
          >
            <div className="h-44 overflow-hidden sm:h-48">{s.visual}</div>
            <div className="px-5 py-4">
              <p className="font-serif text-subhead leading-tight text-ink">{s.title}</p>
              <p className="mt-0.5 text-body-sm text-ink-2">{s.line}</p>
            </div>
          </div>
        ))}
        {/* trailing space so the last card can settle at the gutter */}
        <div className="w-px shrink-0" aria-hidden="true" />
      </div>

      <div className="mt-3 flex justify-center gap-1" role="tablist" aria-label="Choose a card">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${s.title}`}
            onClick={() => {
              touched();
              setActive(i);
              goTo(i);
            }}
            className="flex h-11 w-9 items-center justify-center"
          >
            <span className={["h-1.5 rounded-full transition-all duration-300", i === active ? "w-6 bg-brand" : "w-1.5 bg-ink/25"].join(" ")} />
          </button>
        ))}
      </div>
    </div>
  );
}
