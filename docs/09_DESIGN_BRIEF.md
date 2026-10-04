# Output 9: UX Principles and Design-System Brief (for Claude Design)

## 1. Who we are designing for

Capable, financially independent retired professionals aged about 60–75, who sometimes want convenience or a second pair of hands. They read carefully, value precision and dislike being talked down to. Many wear reading glasses, some have tremor or reduced contrast sensitivity, and most use a mid-range Android phone held at arm's length. **Design for comfort, not for incapacity.**

**Personality:** a well-run private bank's relationship desk crossed with a good concierge. Calm, competent, warm and unhurried.

## 2. UX principles

1. **One clear primary action per screen.** It is placed at the bottom on mobile, full width, at least 56 px tall. Secondary actions are text buttons.
2. **Always show where things stand.** Every request shows a status stepper, the owner and the next step.
3. **Say it plainly.** Short sentences, everyday words, no jargon ("Approve added work", not "Authorise scope variance"), and never "Oops".
4. **Prices before commitment.** Totals are visible before any confirm button; changes are highlighted.
5. **Help is visible, not hidden.** A labelled "Help" button sits in the top bar of every screen. "Get help with this" appears on every request and review screen.
6. **Prefill from the household.** Show "From your preferences · Edit" chips, so members see that SeniorG remembers them.
7. **Forgiving.** Undo for 10 s after non-payment actions; confirmations for anything involving money; nothing irreversible without saying so.
8. **No gesture-only interactions.** Every swipe has a button equivalent; no long-press requirements (except the hidden demo toggle).
9. **Respect, not stereotype.** No "elderly", "senior citizen" or "golden years" in the UI; the member is "you", and the product speaks as "we".
10. **Calm motion.** Transitions of 150–200 ms, fades and slides only; the reduced-motion setting is respected; no confetti.

## 3. Visual direction

**Mood words:** premium · calm · trustworthy · modern Indian · warm · spacious · readable.

**Avoid:** hospital teal-and-white, stock photos of elderly people, cartoon mascots, gradients behind text, neon fintech palettes, dense dashboards, tiny grey text.

### Colour (suggested starting tokens; Claude Design to refine and test contrast)

| Token | Role | Suggested value |
|---|---|---|
| `--ink` | Primary text, headings | Deep indigo-ink `#1F2440` |
| `--ink-2` | Secondary text (never below 4.5:1 on its background) | `#4A4F6A` |
| `--surface` | App background | Warm ivory `#FAF7F2` |
| `--card` | Cards | `#FFFFFF` with a 1 px `#E8E2D8` border, no heavy shadows |
| `--brand` | Primary actions, active tab | Deep teal-green `#0F5C55` (distinct from hospital teal by depth) |
| `--accent` | Sparing highlights (badges, selected chips) | Marigold `#D8901C`, used on fills with ink text, never as text on white |
| `--success` / `--warning` / `--critical` | Status only | Leaf `#2E7D4F` / amber `#B26A00` / brick `#B3261E` |
| `--info-tint` | Owner chip "SeniorG desk" | Soft blue-grey `#E7ECF4` |

Dark theme: optional for the prototype; if built, keep the same semantics.

### Typography

- **Family:** Noto Sans (body and UI) and Noto Serif Display or Noto Serif (screen titles only). Both support Devanagari, which keeps future Marathi and Hindi options open (translation itself is not established in the source material).
- **Mobile scale (Standard size):** body 18/28 · secondary 16/24 (absolute minimum) · labels and buttons 18 semibold · section titles 22 · screen titles 28 serif · big numbers (prices, times) 28 semibold with tabular figures.
- **Text-size setting** in Profile: Standard / Large (+15 %) / Extra large (+30 %). Layouts must reflow, not truncate.
- Sentence case everywhere. No all-caps except tiny badges (and even those optional).

### Layout and components

- **Spacing:** 8-point grid; 20–24 px screen margins on mobile; generous vertical rhythm (24–32 px between sections).
- **Touch targets:** at least 48 × 48 px; at least 8 px between adjacent targets.
- **Cards:** 16 px radius, 1 px border, white on ivory. A card is either tappable as a whole (with a chevron) or contains its own buttons, never both.
- **Key components to design first:**
  1. Top bar with the **Help** button (icon and label) and the bell
  2. Bottom tab bar (5 tabs, icon and label always) / desktop sidebar
  3. **Status stepper** (vertical, with time stamps; current step emphasised; failure steps in amber)
  4. **Owner chip** ("You" / "SeniorG desk · Priya" / "Ramesh · CoolCare")
  5. **Three-name provider card** (SeniorG · delivering business · professional, each with a one-line responsibility)
  6. **Price block** (estimate, line items, total; added-work delta highlighted)
  7. **Approval sheet** (scope, reason, photo, amount, Approve / Decline, both full-width)
  8. **Booking-type badge**: "Book through SeniorG" (brand fill) / "Partner" (outlined, with an external-link icon) / "Association" (accent fill)
  9. **Scope tag** (Prototype lens only): CORE / SHOWCASE / FUTURE
  10. **Reminder card** (date window bar, days left, three choices)
  11. **Event card** (date block, distance, price from, accessibility icons with labels)
  12. **Vertical video player** (large controls, Next button, captions, reviewed badge)
  13. **Permission toggles** with a live "They will see…" preview
  14. **Empty, locked and failure states** (illustration-free; icon + plain message + one action)
- **Icons:** Lucide, 24 px, stroke 1.75, always paired with a text label in navigation and actions.
- **Imagery:** prefer places and objects (an auditorium interior, a railway platform, a well-kept kitchen) and abstract warm textures. If people appear, show adults in active, dignified everyday contexts, never frail stereotypes. For prototype placeholders, use solid colour blocks with a caption rather than stock photos.
- **Desktop:** at 1024 px and above, use a left sidebar, a content column of at most 720 px, and a right rail for "Needs your attention" and Help. The desk console (O-01/O-02) is desktop-first.

## 4. Accessibility checklist

- WCAG 2.2 AA minimum; aim for AAA (7:1) for body text.
- Never use colour alone for status; always add an icon and words.
- Visible focus rings (3 px brand outline).
- Labels on every input; no placeholder-only fields.
- Captions on all videos; transcripts are a nice-to-have.
- Error messages say how to fix the problem, next to the field.
- Content is readable at 200 % zoom without horizontal scrolling.

## 5. Voice and microcopy

| Instead of | Write |
|---|---|
| "Senior citizen services" | "Services" |
| "Caregiver" | "Companion" |
| "Maid / janitor" | "House help" |
| "Submit" | "Confirm booking" / "Send to SeniorG" |
| "Error occurred" | "That didn't go through. Nothing was charged. Try again?" |
| "Your guardian will be notified" | "Meera will see this, because you chose to share it" |
| "Escalated" | "Priya from the SeniorG desk is handling this" |
| "Upsell / add-on" | "Added work: needs your approval" |

**The prototype must label simulations:** a small "Demo" tag on payment, partner hand-offs, calls and maps.
