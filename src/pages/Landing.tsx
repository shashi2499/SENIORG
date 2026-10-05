import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
} from "lucide-react";
import { Photo } from "@/components/ds/Photo";
import { Wordmark } from "@/components/shell/TopBar";
import { DIRECT_NAME, DIRECT_TAGLINE, DirectMark, DirectProspectSheet } from "@/components/direct/SeniorGDirect";
import { CHECKOUT_NOTE, MEMBERSHIP_PRICE, PRICE_NOTE, TRIAL_DAYS } from "@/lib/onboarding";
import { ShowcaseCarousel } from "@/components/landing/ShowcaseCarousel";

const ease = [0.2, 0, 0, 1] as const;

// Gentle entrance as a section scrolls into view — once, never on repeat.
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// A small piece of real SeniorG UI floating over imagery — slow, shallow drift.
function Floating({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={["absolute rounded-tile border border-white/60 bg-card/95 p-3 shadow-lift backdrop-blur sm:p-3.5", className].join(" ")}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: 0.4 + delay },
        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 + delay },
      }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={["text-tag font-semibold uppercase tracking-[0.14em]", light ? "text-accent" : "text-brand"].join(" ")}>{children}</p>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [directOpen, setDirectOpen] = useState(false);
  const start = () => navigate("/join/details");
  const explore = () => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-surface text-ink">
        {/* ── Top bar ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-line/60 bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-3 page-gutter">
            <Link to="/" aria-label="SeniorG home">
              <Wordmark />
            </Link>
            <nav className="hidden items-center gap-7 text-body-sm font-semibold text-ink-2 md:flex" aria-label="On this page">
              <a href="#discover" className="hover:text-ink">What SeniorG does</a>
              <a href="#direct" className="hover:text-ink">{DIRECT_NAME}</a>
              <a href="#membership" className="hover:text-ink">Membership</a>
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDirectOpen(true)}
                className="flex h-11 items-center gap-2 rounded-pill pl-1.5 pr-1.5 font-semibold text-brand-dark hover:bg-brand-tint sm:pr-4"
                aria-label={`${DIRECT_NAME} — talk to SeniorG`}
              >
                <DirectMark size="sm" />
                <span className="hidden text-body-sm sm:inline">{DIRECT_NAME}</span>
              </button>
              <button onClick={start} className="flex h-11 items-center rounded-pill bg-brand px-4 text-body-sm font-semibold text-white shadow-soft hover:bg-brand-dark sm:px-5">
                Start
              </button>
            </div>
          </div>
        </header>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="mx-auto max-w-page page-gutter pb-16 pt-10 sm:pt-14 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 rounded-pill bg-sand px-3 py-1 text-tag font-semibold text-ink-2">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /> Now in Pune & Mumbai · pilot
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.05 }}
              className="mt-5 text-balance font-serif text-[2.375rem] leading-[1.08] tracking-tight text-ink sm:text-[3.25rem] lg:text-[3.75rem]"
            >
              Your trusted companion <span className="text-brand">for independent ageing.</span>
            </motion.h1>
            <ul className="mt-6 space-y-1.5">
              {["Live independently.", "Get things done.", "Stay connected."].map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease, delay: 0.25 + i * 0.12 }}
                  className="flex items-center gap-3 font-serif text-[1.375rem] leading-snug text-ink-2 sm:text-[1.5rem]"
                >
                  <span className="h-1.5 w-6 rounded-full bg-accent" aria-hidden="true" />
                  {line}
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <button onClick={start} className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-pill bg-brand px-7 text-label font-semibold text-white shadow-hero transition hover:bg-brand-dark">
                Start with SeniorG <ArrowRight size={20} className="transition group-hover:translate-x-0.5" />
              </button>
              <button onClick={explore} className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-pill border border-brand/30 bg-card px-7 text-label font-semibold text-brand-dark transition hover:border-brand/60 hover:bg-brand-tint">
                Explore SeniorG <ChevronDown size={20} />
              </button>
            </motion.div>
            <p className="mt-4 text-body-sm text-ink-2">
              Membership <span className="font-semibold text-ink">{MEMBERSHIP_PRICE} / month</span> · or try free for {TRIAL_DAYS} days
            </p>
          </div>

          {/* Hero visual: one real photograph, three real moments from the product */}
          <div className="relative mx-auto mt-10 h-[17rem] w-full max-w-[30rem] sm:mt-12 sm:aspect-[5/4] sm:h-auto sm:max-w-none lg:mt-0 lg:aspect-[4/5]">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease }} className="absolute inset-0">
              <Photo slot="home" eager className="h-full w-full shadow-hero" rounded="rounded-[2rem]" />
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-brand-deep/45 via-transparent to-transparent" />
            </motion.div>

            <Floating className="bottom-4 left-3 w-[15rem] max-w-[86%] sm:bottom-auto sm:left-auto sm:right-5 sm:top-[42%] sm:w-[14.5rem]" delay={0.6}>
              <div className="flex items-center gap-3">
                <DirectMark size="md" />
                <div>
                  <p className="font-semibold leading-snug text-ink">{DIRECT_NAME}</p>
                  <p className="text-meta text-ink-2">{DIRECT_TAGLINE}</p>
                </div>
              </div>
            </Floating>

            <Floating className="bottom-4 left-3 hidden w-[16rem] max-w-[84%] sm:bottom-6 sm:left-5 sm:block" delay={1.2}>
              <p className="flex items-center gap-2 text-meta font-semibold text-needs">
                <CalendarClock size={15} /> Due in November
              </p>
              <p className="mt-1 font-semibold leading-snug text-ink">Life certificate — explained, step by step</p>
            </Floating>
          </div>
        </section>

        {/* ── What SeniorG does: a compact, rotating showcase ── */}
        <section id="discover" className="scroll-mt-20 py-14 sm:py-20">
          <div className="mx-auto max-w-page">
            <Reveal className="page-gutter">
              <Eyebrow>What SeniorG does</Eyebrow>
              <h2 className="mt-2 max-w-2xl text-balance font-serif text-[1.75rem] leading-tight text-ink sm:text-[2.25rem]">
                Everyday life, kept in good order.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-7">
              <ShowcaseCarousel />
            </Reveal>
          </div>
        </section>

        {/* ── SeniorG Direct: the bell ────────────────────────── */}
        <section id="direct" className="scroll-mt-16 bg-brand-deep py-16 text-white sm:py-24">
          <div className="mx-auto max-w-page page-gutter">
            <Reveal>
              <DirectMark size="xl" pulse />
              <p className="mt-8 text-tag font-semibold uppercase tracking-[0.14em] text-accent">{DIRECT_NAME}</p>
              <p className="mt-1 text-body-sm font-semibold text-white/80">{DIRECT_TAGLINE}</p>
              <h2 className="mt-2 font-serif text-[2.25rem] leading-tight sm:text-[3rem]">
                Need a hand?
                <br />
                Talk to SeniorG.
              </h2>
              <p className="mt-4 max-w-md text-body text-white/85">
                Call or chat with SeniorG when you need assistance. A real person — who can see your requests — picks up, and can take over anything you'd rather not do.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setDirectOpen(true)} className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-pill bg-white px-7 text-label font-semibold text-brand-deep hover:bg-brand-tint">
                  Call SeniorG
                </button>
                <button onClick={() => setDirectOpen(true)} className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-pill border border-white/40 px-7 text-label font-semibold text-white hover:bg-white/10">
                  Chat with SeniorG
                </button>
              </div>
              <p className="mt-4 text-meta text-white/60">Look for the bell — wherever you see it, a person at SeniorG is one tap away.</p>
            </Reveal>
          </div>
        </section>

        {/* ── Principle ───────────────────────────────────────── */}
        <section className="border-y border-line bg-card py-16 sm:py-20">
          <Reveal className="mx-auto max-w-page page-gutter text-center">
            <p className="mx-auto max-w-3xl text-balance font-serif text-[1.75rem] leading-snug text-ink sm:text-[2.25rem]">
              “I decide. You handle. My family knows what I choose them to know.”
            </p>
            <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
              {[
                "Your account is yours — nothing happens without your OK.",
                "Family sees only what you choose to share.",
                "Spouses each have their own independent account.",
              ].map((t) => (
                <p key={t} className="flex items-start gap-2 text-body-sm text-ink-2">
                  <Check size={18} className="mt-0.5 shrink-0 text-brand" /> {t}
                </p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Membership ──────────────────────────────────────── */}
        <section id="membership" className="scroll-mt-16 py-16 sm:py-24">
          <div className="mx-auto max-w-page page-gutter">
            <Reveal className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-card shadow-hero ring-1 ring-card-border">
              <div className="bg-brand-deep p-7 text-white sm:p-10">
                <Eyebrow light>SeniorG Membership</Eyebrow>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-[3.5rem] leading-none sm:text-[4.5rem]">{MEMBERSHIP_PRICE}</span>
                  <span className="text-section text-white/80">/ month</span>
                </p>
                <p className="mt-1 text-meta text-white/65">{PRICE_NOTE}</p>
                <p className="mt-3 max-w-md text-body text-white/85">Your trusted companion for independent ageing.</p>
              </div>
              <div className="p-7 sm:p-10">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {["Home services", "Go With Me", DIRECT_NAME, "Reminders", "Local Events", "Smart Minutes"].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-body font-semibold text-ink">
                      {b === DIRECT_NAME ? <DirectMark size="sm" /> : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                          <Check size={16} strokeWidth={2.5} />
                        </span>
                      )}
                      {b}
                    </li>
                  ))}
                </ul>
                <button onClick={start} className="mt-8 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-pill bg-brand px-6 text-label font-semibold text-white shadow-soft hover:bg-brand-dark">
                  Start with SeniorG <ArrowRight size={20} />
                </button>
                <p className="mt-5 text-center text-body-sm text-ink-2">
                  Not ready yet?{" "}
                  <button onClick={start} className="font-semibold text-brand-dark underline underline-offset-4">
                    Try SeniorG free for {TRIAL_DAYS} days
                  </button>
                </p>
                <p className="mt-2 text-center text-meta text-ink-3">{CHECKOUT_NOTE}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer / prototype honesty ──────────────────────── */}
        <footer className="border-t border-line bg-sand py-10">
          <div className="mx-auto flex max-w-page flex-col gap-6 page-gutter sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Wordmark />
              <p className="mt-2 max-w-xl text-meta text-ink-2">
                Prototype for demonstration. People, providers, venues and prices are fictional. No real Aadhaar, OTP or payment is collected or processed.
              </p>
            </div>
            <Link to="/home" className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap text-body-sm font-semibold text-brand-dark hover:underline">
              Skip to the demo app <ArrowRight size={16} />
            </Link>
          </div>
        </footer>

        <DirectProspectSheet open={directOpen} onClose={() => setDirectOpen(false)} />
      </div>
    </MotionConfig>
  );
}
