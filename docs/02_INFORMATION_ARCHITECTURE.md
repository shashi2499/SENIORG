# Output 2: Information Architecture

## 1. Evaluating the candidate navigation

Candidate: **Home · Services · Explore · Learn · My Requests · More**, plus a persistent Help button.

| Issue | Why it matters for this user | Change |
|---|---|---|
| Six tabs plus a floating Help button | Six bottom tabs leave about 60 px per tab on a 360 px phone, too tight for 14–16 px labels that must stay readable. A floating Help button covers content and is easy to miss or tap by accident | Use **five** tabs. Help becomes a **labelled button in the top bar** of every screen |
| "Learn" as its own tab | Smart Minutes is short content, used occasionally; it does not need a permanent tab. Its best placements are the Home card and contextual links (for example, the fraud video next to the Pause button) | Learn moves inside **Explore**: *Near you · Smart Minutes · Saved* |
| "More" | A junk drawer. Reminders, Documents and Family Circle are core household features and would be hidden there | Replace with **Household**, which gathers reminders, documents, family, trusted contacts, profile and receipts |
| Reminders have no home | Reminders drive J5, the proactive moment | Shown on **Home** under "Needs your attention", with the full list in **Household → Dates & reminders** |
| "My Requests" | Correct and essential: one list for everything in progress | Keep it, named **Requests** |

## 2. Recommended navigation

**Bottom tabs on mobile (left sidebar on desktop at 1024 px and above):**

| Tab | Icon (Lucide) | Contains |
|---|---|---|
| **Home** | `house` | Dashboard: today, needs attention, active requests, quick actions, suggestions |
| **Services** | `wrench` / `layout-grid` | Home Repairs, Go With Me, Temporary House Help, Banking & Pension help, Tax & Professional help, Coming later |
| **Explore** | `compass` | Near you (events, association activities, tickets) · Smart Minutes · Saved |
| **Requests** | `clipboard-list` | Needs your action · Active · Completed · Tickets |
| **Household** | `users` (or the member's initials) | Dates & reminders · Documents · Family Circle · Trusted contacts · Profile & preferences · Payments & receipts |

**Top bar, persistent on every screen:**

- Left: back arrow, or the SeniorG wordmark on top-level screens.
- Right: **"Help"** button with an icon and the word written out, which opens G-03. Next to it, the notifications bell (G-04).
- A **"Pause"** shield icon for the trusted contact sits on Home and in the Help sheet, not in the top bar, to avoid clutter. *Alternative for testing:* put it in the top bar for members who switch on "Show safety button everywhere".

**Contextual help:** every request detail, booking review and reminder detail has a secondary button **"Get help with this"**. It hands that exact item to the desk (A-03).

## 3. Home dashboard (H-01)

The dashboard answers **"What do I need to know or do today?"** Sections in order (only the first three show above the fold on a phone):

1. **Greeting and date:** "Good morning, Suresh · Tuesday, 6 October". One line of weather is optional [SHOWCASE]. No motivational quotes.
2. **Needs your attention** (at most 3 cards; "See all" opens Q-01 filtered). Examples:
   - "Approve added work: AC gas top-up · ₹1,800" (from J1)
   - "Life certificate window opens 1 Nov · 26 days" (J5)
   - "Mediclaim renewal options due soon" (illustrative)
3. **Today and upcoming:** a compact agenda of the next 3 dated items, e.g. "Today 11:00–13:00 AC repair · Ramesh is assigned", "Sat 7:30 PM Theatre ×2", "Sun 4:30 PM Airport assistance (Asha)".
4. **Quick actions** (2×3 grid of large labelled tiles): Home Repairs · Go With Me · House Help · Dates & Reminders · Explore · Talk to SeniorG.
5. **Near you this week** (horizontal carousel, 3 events) with a "Book through SeniorG" or "Partner" badge on each.
6. **Smart Minute for you** (one card, 45–90 s video thumbnail, e.g. "How to spot a fake bank call").
7. **Your circle** (one line, shown only if Family Circle is set up): "Meera can see 2 shared items · Manage".

Not on the dashboard: full calendar, document list, marketing banners or promotional discounts (v0.5 lists discount marketplaces as "what not to build first").

## 4. Screen hierarchy

Screen IDs match `03_SCREEN_INVENTORY.md`.

```
SeniorG
├── G  Global
│   ├── G-01 Demo entry / choose who you are
│   ├── G-02 Sign in (simulated)
│   ├── G-03 Help sheet (global)
│   ├── G-04 Notifications
│   ├── G-05 Prototype lens & demo controls (reviewer only)
│   └── G-06 Pause: trusted-contact sheet
├── H  Home
│   └── H-01 Dashboard
├── S  Services
│   ├── S-01 Services hub
│   ├── S-02 Home Repairs categories
│   │   └── R  Home repair flow (J1): R-01 … R-19
│   ├── W  Go With Me (J2, J3): W-01 … W-14
│   ├── T  Temporary House Help (J4): T-01 … T-12
│   ├── S-03 Partner referral template (Banking & Pension; Tax & Professional)
│   └── S-04 Coming later (Health coordination)
├── E  Explore
│   ├── E-01 Near you (list + filters E-02)
│   │   ├── E-03 Event detail
│   │   │   ├── E-04 Tickets / seats → E-05 Review & pay → E-06 Confirmed (E-07 invite, E-08 directions)
│   │   │   ├── E-09 Continue with partner (interstitial)
│   │   │   ├── E-12 Association event sign-up
│   │   │   └── E-13 Ask the desk about this event
│   │   ├── E-10 Sold out / waitlist
│   │   └── E-11 Event cancelled
│   ├── L  Smart Minutes: L-01 Feed · L-02 Categories · L-03 Video info · L-04 Saved · L-05 Report
│   └── Saved (events + videos)
├── Q  Requests
│   ├── Q-01 Requests list (Needs action · Active · Completed · Tickets)
│   ├── Q-02 Request detail (universal timeline)
│   ├── Q-03 Request history log
│   └── K  Tickets: K-01 My tickets · K-02 Ticket detail
├── A  Assisted Desk (opened from Help)
│   ├── A-01 Help home
│   ├── A-02 New assisted request
│   ├── A-03 Hand over a request
│   ├── A-04 Desk conversation
│   └── A-05 Call-back scheduled
├── HH Household
│   ├── HH-01 Household hub
│   ├── D  Dates & reminders (J5): D-01 … D-08
│   ├── DC Documents: DC-01 … DC-04
│   ├── F  Family Circle: F-01 … F-03 (+ family-side views F-04 … F-06)
│   ├── HH-02 Profile & preferences
│   ├── HH-03 Spouse & sharing
│   ├── HH-04 Trusted contacts
│   └── HH-05 Payments & receipts
└── Back office (role switcher)
    ├── P  Provider / companion job pages: P-01 … P-06
    ├── O  Desk console & admin: O-01 … O-06
    └── EV Event organiser: EV-01
```

## 5. Cross-links the prototype must support

| From | To | Why |
|---|---|---|
| Any request (Q-02) | A-03 Hand over | Self-serve to assisted with the same record |
| E-06 Event confirmed | W-01 pre-filled "Go With Me to this event" | Continuity across tasks (differentiation point 2) |
| D-02 Life certificate | DC-03 Pension document entry | Household context |
| DC-03 Document entry | D-02 related reminder | Same |
| G-06 Pause | L-01 video "Spot a fake bank call" | Learning tied to the task |
| Q-02 completed repair | R-01 "Book Ramesh again" | Rebooking and continuity |
| F-04 Family view | Locked item → "Ask Suresh to share" (sends a request, no access) | Permission boundary |
