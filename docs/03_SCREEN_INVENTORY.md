# Output 3: Complete Screen Inventory

**Priority:** **P0** = needed for the hero journeys and the demo · **P1** = supporting flows and failure states · **P2** = nice to have, or a back-office demo.
**Scope:** C = [CORE] · S = [SHOWCASE] · F = [FUTURE] placeholder · X = prototype-only tooling.
**Journeys:** J1 Home repair · J2 Airport/station · J3 Hospital companion · J4 Temporary house help · J5 Life certificate · J6 Local event · SM Smart Minutes · FC Family Circle · DOC Documents · AD Assisted Desk · TK Tickets.

"Help" (opening G-03) is a secondary action on **every** screen and is not repeated below.

## Global

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| G-01 | Demo entry: choose who you are | Pick a role (Suresh, Asha, Meera, Rohan, Coordinator Priya, Provider Ramesh, Admin) | App launch | Continue as Suresh | Pick another role; Reset demo | H-01 (or role home) | All | P0 | X |
| G-02 | Sign in (simulated) | Show the sign-in pattern: mobile number, then a "demo code is filled in" note; never a PIN | G-01 (optional) | Continue | — | H-01 | — | P2 | X |
| G-03 | Help sheet | One place for human help | Top-bar Help on any screen | Talk to SeniorG now | Request a call-back; Hand over this request (shown when opened from a request); Report a problem; Pause | A-01 / A-03 / A-05 / G-06 | AD | P0 | C |
| G-04 | Notifications | Time-ordered updates (status changes, approvals, reminders) | Bell | Open the item | Mark all as read | Linked screen | All | P1 | C |
| G-05 | Prototype lens & demo controls | Show scope tags; trigger simulated events (provider arrives, adds work, cancels, no-show; event sold out; companion unavailable; time skip) | Hidden toggle (e.g. long-press logo) or a desktop side panel | Trigger next event | Toggle tags; Switch role; Reset demo | Current screen updates | All | P0 | X |
| G-06 | Pause: trusted contact | Stop and check before acting on a suspicious call | Home card; Help sheet | Call Asha (trusted contact) (simulated) | Read the 4-point scam checklist; Call the SeniorG desk; Watch "Spot a fake bank call" | Call screen (mock) / L-01 | Safety | P1 | C |

## Home and Services

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| H-01 | Home dashboard | What to know or do today | Tab | Tap the top attention card | Quick actions; agenda items; events; Smart Minute | Varies | All | P0 | C |
| S-01 | Services hub | All service categories with a booking-type badge | Tab; quick actions | Choose a category | Search services; "Not sure? Ask the desk" | S-02 / W-01 / T-01 / S-03 / S-04 | J1–J4 | P0 | C/S |
| S-02 | Home Repairs categories | AC, electrical, plumbing, appliances, carpentry, pest control, cleaning, other | S-01; H-01 tile | Choose AC repair | Other categories (open R-01 with that category) | R-01 | J1 | P0 | C |
| S-03 | Continue-with-partner template | Banking & Pension help, Tax & Professional help: what the partner does, what SeniorG does and does not do | S-01; D-04 | Continue with partner (simulated hand-off) | Ask the desk to help me prepare | Mock external page / A-02 | J5 | P1 | C |
| S-04 | Coming later | Health coordination: why it is not yet offered, with no false promise | S-01 | Tell me when available | Talk to the desk | S-01 | — | P2 | F |

## J1 Home repair

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| R-01 | AC repair: service detail | What is included, visit fee, how pricing works, what is not included | S-02; rebook | Book AC repair | See terms; Ask the desk | R-02 | J1 | P0 | C |
| R-02 | Describe the problem | Symptom chips (not cooling, water leak, noise, not starting, other), AC type, free text or voice note (mock) | R-01 | Next | Skip details | R-03 | J1 | P0 | C |
| R-03 | Add a photo (optional) | Mock photo picker | R-02 | Add photo / Skip | — | R-04 | J1 | P0 | C |
| R-04 | Date & time | Slot picker (morning / afternoon / evening); preferences pre-filled (language, visitor) | R-03 | Choose slot | Earliest available | R-05 (or R-15 if none) | J1 | P0 | C |
| R-05 | Your matched professional | Three-name card: SeniorG · CoolCare Services (delivering business) · Ramesh Patil (professional); why matched; rating; ID-check status | R-04 | Continue with Ramesh | See another option; Why this match? | R-06 | J1 | P0 | C |
| R-06 | Review & confirm | Visit fee ₹399 (illustrative), estimate range, "added work needs your approval", pay after completion, cancellation terms, who to contact | R-05 | Confirm booking | Edit; Get help with this | R-07 | J1 | P0 | C |
| R-07 | Booking confirmed | Summary, request ID, add to calendar | R-06 | Track request | Share with family (if permitted); Done | Q-02 | J1 | P0 | C |
| R-08 | Professional on the way | Live status; arrival code 4821 to check at the door; call Ramesh (mock) | Q-02 when status = PROVIDER_EN_ROUTE | I've checked the code | He hasn't arrived (opens R-16) | Q-02 (IN_PROGRESS) | J1 | P0 | C |
| R-09 | Approve added work | Ramesh found low gas; scope change + ₹1,800 + reason + photo; new total | Notification; Q-02 needs-action | Approve ₹1,800 | Decline; Call the desk to discuss | Q-02 IN_PROGRESS / R-10 | J1 | P0 | C |
| R-10 | Added work declined | Outcome: original job continues; what that means; no charge for the declined part | R-09 Decline | OK, continue | Get a second opinion via the desk | Q-02 | J1 | P0 | C |
| R-11 | Work completed: proof | Before/after photos, work notes, time in/out, parts used, final amount | Q-02 when status = COMPLETED | Confirm & pay | Something's not right (R-17) | R-12 | J1 | P0 | C |
| R-12 | Payment (simulated) | Shows amount; payment method placeholder "Demo payment"; no PIN field; note on the payment partner | R-11 | Pay ₹2,199 (demo) | Ask Rohan to pay (if payer permission exists) | R-13 | J1 | P0 | C |
| R-13 | Receipt | Itemised receipt; three names; 30-day workmanship terms [home repairs only] | R-12 | Done | Download (mock); Share | R-14 | J1 | P0 | C |
| R-14 | Rate & close | Rating; "Book Ramesh again next time"; request closes | R-13 | Close request | Skip rating | Q-02 (CLOSED) / H-01 | J1 | P0 | C |
| R-15 | No professional available | No match for the chosen slot | R-04 (demo control) | Choose another slot | Let the desk find someone (assisted) | R-04 / A-03 | J1 | P1 | C |
| R-16 | Professional late or no-show | 30 min past the slot: SeniorG apology, rematch offer, visit fee waived | R-08; demo control | Accept replacement (Sunil, 45 min) | Reschedule; Cancel free | Q-02 | J1 | P1 | C |
| R-17 | Report a problem / dispute | Reasons: partly done, poor work, damage, price dispute; photo; desired outcome | R-11; Q-02 | Submit | Talk to the desk | Q-02 (DISPUTED) | J1 | P1 | C |
| R-18 | Refund status | Refund amount, reason, stage (initiated → refunded, simulated) | Q-02 | OK | View case | Q-02 | J1 | P1 | C |
| R-19 | Reschedule or cancel | New slot or cancel; shows fee (free if more than 4 h before) | Q-02 | Confirm change | Keep booking | Q-02 | J1 | P1 | C |

## J2 / J3 Go With Me (shared flow with destination variants)

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| W-01 | Go With Me | Where do you need to go? Airport · Railway station · Hospital / medical appointment · Diagnostic centre · Bank · Government office · Other | S-01; H-01 tile; E-06 cross-link | Choose destination type | Ask the desk | W-02 | J2/J3 | P0 | C (manual) / S (UI) |
| W-02 | Where & when | Airport/station/hospital picker (fictional list); date; flight/train or appointment time; trip details (flight number optional, never verified) | W-01 | Next | — | W-03 | J2/J3 | P0 | S |
| W-03 | Pickup | Saved home address pre-filled; recommended pickup time calculated (airport: 3 h before departure; hospital: 45 min before, illustrative) | W-02 | Next | Change address | W-04 | J2/J3 | P0 | S |
| W-04 | Type of help | Variant list. Airport/station: cab only · companion only · cab + companion · companion + waiting · full assistance. Hospital: travel assistance · registration assistance · accompany me · wait with me · return journey · full visit assistance | W-03 | Select | Compare what's included | W-05 | J2/J3 | P0 | S |
| W-05 | Your needs | Luggage count; mobility notes (walking stick, slow pace, stairs); language; companion gender preference; pre-filled from profile | W-04 | Next | Edit profile defaults | W-06 | J2/J3 | P0 | S |
| W-06 | Price estimate | Base + waiting per hour + cab (if any); "final price confirmed by the desk before the trip" | W-05 | See matched companion | Change help type | W-07 (or W-13) | J2/J3 | P0 | S |
| W-07 | Your companion | Three-name card: SeniorG · fictional "Saath Companions" · Anita Sharma; languages; verified; trips completed | W-06 | Continue with Anita | Another option | W-08 | J2/J3 | P0 | S |
| W-08 | Review & confirm | Itinerary; what Anita will and will not do (safeguarding: no medical decisions, no handling of cash or cards, calls the desk or family if needed) | W-07 | Confirm | Edit; Get help | W-09 | J2/J3 | P0 | S |
| W-09 | Booking confirmed | Confirmation card (e.g. "Tomorrow · 4:30 PM · Airport assistance · Anita Sharma"); add to calendar; share with family | W-08 | Track | Done | Q-02 | J2/J3 | P0 | S |
| W-10 | Reminder (day before) | Notification and screen: pickup time, documents to carry (illustrative checklist), companion contact | G-04 / demo time skip | Looks good | Change time (W-14) | Q-02 | J2/J3 | P0 | S |
| W-11 | Live trip status | One screen with stage content: assigned → on the way → picked up → arrived (airport) / at hospital → visit complete → return journey → completed. Shows the trusted contact and that the desk can see the trip | Q-02 | Stage-specific (e.g. "I'm in the cab") | Call Anita (mock); Call the desk; Share live status with Meera (if permitted) | W-12 | J2/J3 | P0 | S |
| W-12 | Trip receipt & close | Time used, waiting hours, total; rate; book Anita again | W-11 completed | Pay (demo) & close | Report a problem | Q-02 CLOSED | J2/J3 | P0 | S |
| W-13 | Companion unavailable | No match or Anita cancels: desk is finding a replacement, with options | W-06; demo control | Let the desk arrange it | Change time; Cancel free | Q-02 (owner: desk) | J2/J3 | P1 | S |
| W-14 | Change time / cancel | Change pickup or appointment time; cancellation terms | Q-02; W-10 | Confirm change | Keep booking | Q-02 | J2/J3 | P1 | S |

## J4 Temporary House Help

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| T-01 | Temporary House Help | When your regular help is away: how it works, multi-day | S-01; H-01 tile | Get started | Ask the desk | T-02 | J4 | P0 | C (manual) / S (UI) |
| T-02 | What do you need? | Multi-select: cleaning, dishes, simple cooking; shows typical time per task | T-01 | Next | — | T-03 | J4 | P0 | S |
| T-03 | Schedule | Number of days (e.g. 10), hours per day, start date, preferred time window, skip Sundays toggle | T-02 | Next | — | T-04 | J4 | P0 | S |
| T-04 | Preferences | Cooking: vegetarian, less oil (pre-filled); language; household notes; who will be home | T-03 | Next | Edit defaults | T-05 | J4 | P0 | S |
| T-05 | Price | Per-day rate × days; total estimate; pay at the end for days actually served; skipped days not charged | T-04 | See matched helper | Change schedule | T-06 (or T-12) | J4 | P0 | S |
| T-06 | Your helper | Three-name card: SeniorG · fictional "HomeAssist Agency" · Lata More; backup helper named | T-05 | Continue | Another option | T-07 | J4 | P0 | S |
| T-07 | Review & confirm | Plan summary; who pays (Suresh, or Rohan as payer); house rules | T-06 | Confirm | Edit | T-08 | J4 | P0 | S |
| T-08 | Booking confirmed | 10-day plan created; daily check-ins explained | T-07 | View daily tracker | Done | T-09 | J4 | P0 | S |
| T-09 | Daily service tracker | Day list: upcoming / in progress / done / skipped / issue. Each day: check-in time, tasks done, member confirms | Q-02 | Confirm today's service | Report an issue today; Skip a day | Q-02 | J4 | P0 | S |
| T-10 | Today's issue | Helper absent today: backup offered; or skip the day (not charged) | T-09; demo control | Send backup (Sunita) | Skip today; Talk to the desk | T-09 | J4 | P1 | S |
| T-11 | Completion summary & payment | Days served 9 of 10 (1 skipped), total, demo payment, receipt, rate | T-09 after last day | Pay (demo) & close | Extend 3 days; Report a problem | Q-02 CLOSED | J4 | P0 | S |
| T-12 | Replacement unavailable | No backup today: honest message; desk will call by a stated time; no charge for the day | T-10; demo control | OK | Talk to the desk now | T-09 | J4 | P1 | S |

## J5 Dates & reminders

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| D-01 | Dates & reminders | List by urgency: due soon / upcoming / done; filters (pension, insurance, tax, bills, household) | HH-01; H-01 "See all" | Open a reminder | Add a reminder | D-02 / D-07 | J5 | P0 | C |
| D-02 | Life certificate | Status + date window (1–30 Nov; from 1 Oct if 80 or over) [C]; why it matters (pension continuity); three choices | H-01 attention card; D-01 | Choose: Do it myself / Explain what I need / Get assistance | Remind me later; Rule source | D-04 / D-03 / D-05 | J5 | P0 | C |
| D-03 | What do I need? | Plain checklist: pension details, Aadhaar-linked mobile, a phone with a camera for face authentication or a visit; ways to submit (online via Jeevan Pramaan, bank branch, doorstep banking) | D-02 | I'll do it myself | Get assistance | D-04 / D-05 | J5 | P0 | C |
| D-04 | Do it myself | Step guide; "Continue with partner: Jeevan Pramaan" (simulated external hand-off); then mark as done | D-02/D-03 | Continue with partner (demo) | Mark as done; Get assistance | D-06 | J5 | P0 | C |
| D-05 | Get assistance | Choose help: "Guide me on a call" or "Arrange a doorstep banking visit". The desk prepares it; doorstep banking is the bank's service (₹75 + GST per Bank of Baroda's page, as of Oct 2026) [C] | D-02 | Create request | Talk now | Q-02 (owner: desk) | J5/AD | P0 | C |
| D-06 | Mark as done | Confirmation; optional note or proof (e.g. "acknowledgement number noted"); next year's reminder is set | D-04; Q-02 | Done | Undo | D-01 | J5 | P1 | C |
| D-07 | Add a reminder | Manual: bill, FD maturity, policy renewal, warranty; repeat rule | D-01 | Save | — | D-01 | J5 | P1 | C |
| D-08 | Rule source | Source, applies to, year, verified on, reviewed by (v0.5) | D-02 link | Close | Report incorrect date | D-02 | J5 | P1 | C |

## J6 Explore and tickets

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| E-01 | Explore: near you | List and cards: theatre, music, talks, workshops, walks, wellness, pilgrimage and travel, hobby groups, retired-bankers activities, association events, volunteering, mentoring; badges | Tab; H-01 carousel | Open an event | Filters; Save | E-03 | J6 | P0 | C (association) / S |
| E-02 | Filters | Distance, date, time of day, category, price, accessibility (step-free, seating, toilets), "good for couples" | E-01 | Apply | Reset | E-01 | J6 | P1 | S |
| E-03 | Event detail | Fictional example: "Marathi play: *Navi Sakal* (fictional)", Sat 7:30 PM, Kalamandir Auditorium (fictional), 1.8 km, ₹450 onwards, accessibility, duration, language, booking badge | E-01 | Book for me + spouse | Book for myself; Ask the SeniorG desk; Save; Go With Me to this event | E-04 / E-13 | J6 | P0 | S |
| E-04 | Tickets & seats | Ticket count (1 or 2, spouse pre-selected); simple seat map with aisle and step-free seats highlighted | E-03 | Continue | — | E-05 (or E-10) | J6 | P0 | S |
| E-05 | Review & pay (simulated) | Seats, price, fees; cancellation policy; demo payment | E-04 | Pay ₹900 (demo) | Edit | E-06 | J6/TK | P0 | S |
| E-06 | Booking confirmed | Tickets; add to calendar (automatic for the household); invite spouse; directions | E-05 | Add to calendar ✓ | Invite Asha; Directions; Go With Me to this event | K-02 / E-07 / E-08 | J6 | P0 | S |
| E-07 | Invite spouse | Asha gets the ticket in her account (no external share needed) | E-06 | Send | — | E-06 | J6 | P1 | S |
| E-08 | Directions | Static map placeholder + address; "Get a ride with a companion" | E-06 | Open in maps (simulated) | Go With Me | W-01 | J6 | P1 | S |
| E-09 | Continue with partner | Interstitial: you are leaving SeniorG; the partner's terms, prices and refunds apply; SeniorG cannot track this booking | E-03 (partner event) | Continue (demo) | Stay | Mock partner page | TK | P0 | C |
| E-10 | Sold out / waitlist | No seats: join waitlist, similar events, ask the desk | E-04; demo control | Join waitlist | See similar | E-01 | J6 | P1 | S |
| E-11 | Event cancelled | Organiser cancelled: refund (simulated) and calendar item removed | Notification; demo control | OK | Find another event | K-02 | J6 | P1 | S |
| E-12 | Association event sign-up | Free RSVP for a chapter event (e.g. "Retired Bankers' Pune chapter: talk on digital safety", fictional) | E-01/E-03 | Sign up | Bring spouse | E-06 (variant) | J6 | P1 | C |
| E-13 | Ask the desk about this event | Desk request pre-filled with the event | E-03 | Send | — | A-04 | J6/AD | P1 | C |
| K-01 | My tickets | Upcoming and past tickets, with SeniorG vs partner source | Q-01 Tickets tab | Open ticket | — | K-02 | TK | P1 | S |
| K-02 | Ticket detail | Mock QR, seats, venue, policy, source badge, refund state | K-01; E-06 | Show at entry | Cancel (if allowed); Directions | K-01 | TK | P1 | S |

## Smart Minutes

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| L-01 | Smart Minutes player | Vertical full-screen video (mock poster + progress); title; duration; "Reviewed by SeniorG panel" badge; captions on | Explore tab; H-01 card; G-06 | Play / pause | Save; Next (swipe up / button); Captions; Info | Next video | SM | P0 | C/S |
| L-02 | Categories | Digital safety, fraud awareness, UPI, smartphone, WhatsApp, DigiLocker, banking, travel, health & fitness, hobbies, financial literacy | L-01 header; Explore | Pick a category | — | L-01 (filtered) | SM | P0 | S |
| L-03 | Video info | Source, reviewer, review date, last correction | L-01 | Close | Report a problem | L-05 | SM | P1 | C |
| L-04 | Saved | Saved videos | Explore → Saved | Play | Remove | L-01 | SM | P1 | S |
| L-05 | Report a problem | Reason chips (incorrect, outdated, unclear, other) | L-03 | Send | — | L-01 | SM | P2 | C |

## Requests

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| Q-01 | Requests | Segments: Needs your action · Active · Completed · Tickets; each card shows status, owner and next step | Tab | Open request | Filter | Q-02 | All | P0 | C |
| Q-02 | Request detail | Universal: status stepper, owner chip (You / SeniorG desk / provider), people (three names), price and approvals, proof, timeline, actions | Q-01; notifications; confirmations | Stage-specific | Get help with this (A-03); Reschedule; Cancel; Report a problem; Share with family | Varies | All | P0 | C |
| Q-03 | Request history | Full audit log: every event with time and actor ("Approved by Suresh", "Handed to desk", "Rematched by Priya") | Q-02 | Back | — | Q-02 | AD | P1 | C |

## Assisted Desk

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| A-01 | Talk to SeniorG | Desk hours (8 am–8 pm, v0.5 assumption), options: call now, call me back, message, hand over a request, report a problem; past conversations | G-03 | Call now (mock) | Message; Call-back; Hand over | A-04 / A-05 / A-03 | AD | P0 | C |
| A-02 | New request for the desk | "Tell us in your own words": text or voice note (mock); optional category | A-01; S-01 "Not sure?" | Send to desk | — | A-04 + new request in Q-01 | AD | P0 | C |
| A-03 | Hand over a request | Select the request (pre-selected from context); what the desk may do: find a provider, book, approve added work up to a limit you set (default: none) | Q-02; G-03; R-15; W-13 | Hand over | Keep doing it myself | Q-02 (owner: desk) | AD | P0 | C |
| A-04 | Desk conversation | Thread with coordinator Priya, linked to the request; status updates appear inline | A-01/A-02/A-03 | Reply | Call; View request | Q-02 | AD | P0 | C |
| A-05 | Call-back scheduled | Time slot confirmed; outside-hours promise | A-01 | Done | Change time | H-01 | AD | P1 | C |

## Household, Documents, Family

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| HH-01 | Household | Hub: members, dates & reminders, documents, family circle, trusted contacts, profile, payments & receipts | Tab | Open a section | — | Varies | — | P0 | C |
| HH-02 | Profile & preferences | Language, text size, mobility notes, visitor gender preference, diet, pickup address; "used to match services" | HH-01 | Save | — | HH-01 | — | P1 | C |
| HH-03 | Spouse & sharing | Asha's own account; what is shared between spouses vs private | HH-01 | Save | — | HH-01 | FC | P1 | C |
| HH-04 | Trusted contacts | Up to 2 contacts used by Pause | HH-01 | Add/edit | — | HH-01 | Safety | P1 | C |
| HH-05 | Payments & receipts | All simulated payments and receipts; who paid | HH-01 | Open receipt | — | R-13 etc. | — | P2 | C |
| DC-01 | Documents | Index by category: identity, pension, insurance, health, banking, property, tax, warranties, household; banner "SeniorG keeps an index, not your documents" | HH-01 | Open category | Add entry | DC-02 | DOC | P0 | C |
| DC-02 | Category list | Entries with expiry badges | DC-01 | Open entry | Add | DC-03 | DOC | P1 | C |
| DC-03 | Document entry | Name, category, reference (last 4 digits only), where stored ("Steel cupboard, blue file" / link), expiry/renewal, related reminder, notes, who can see it, get help | DC-02; D-02 cross-link | Open related reminder | Edit; Share with family (per item); Get help | D-02 / A-03 | DOC | P0 | C |
| DC-04 | Add / edit entry | Form; never stores passwords or full ID numbers | DC-01/02/03 | Save | — | DC-03 | DOC | P1 | C |
| F-01 | Family Circle | People (Meera: viewer; Rohan: payer); what each can see | HH-01 | Manage Meera | Invite someone | F-03 / F-02 | FC | P0 | C |
| F-02 | Invite family member | Name, relation, role (viewer / payer / emergency contact); invitation preview | F-01 | Send invite (mock) | — | F-01 | FC | P1 | C |
| F-03 | Permissions for Meera | Per area: request status (all / selected / none), reminders (selected), documents (selected items), emergency information, payments (no); shows the "Meera will see" preview | F-01 | Save | Remove access | F-01 | FC | P0 | C |
| F-04 | Family view (as Meera) | Shared cards only: "Mum & Dad: airport trip Thu, Anita assigned"; locked placeholders | Role switch → Meera | Open shared item | Ask Dad to share (sends a request, no access) | F-05 | FC | P0 | C |
| F-05 | Not shared | "Suresh hasn't shared this." No content leaks (no titles of private items) | F-04 | Ask to share | Back | F-04 | FC | P0 | C |
| F-06 | Payer view (as Rohan) | House-help payment due; amount and service summary only; no private notes or documents | Role switch → Rohan | Pay (demo) | View receipt | Receipt | FC/J4 | P1 | C |

## Back office

| ID | Screen | Purpose | Entry point | Primary action | Secondary actions | Next | Journey | Pri | Scope |
|---|---|---|---|---|---|---|---|---|---|
| P-01 | Provider: my jobs | Ramesh's job list | Role switch | Open job | — | P-02 | J1 | P1 | C |
| P-02 | Provider: job detail | Address, slot, problem, photos, member's relevant preferences only (language, visitor note); no documents or family | P-01 | Start trip | Call desk | P-03 | J1 | P1 | C |
| P-03 | Provider: arrival | Enter the member's arrival code | P-02 | Verify code | — | P-04/P-05 | J1 | P1 | C |
| P-04 | Provider: request added work | Scope, price, reason, photo | P-03 | Send for approval | — | Waits for member | J1 | P1 | C |
| P-05 | Provider: complete job | Photos, notes, parts, final amount | P-03/P-04 | Mark complete | — | P-01 | J1 | P1 | C |
| P-06 | Companion: trip steps | Anita updates stages (on the way, picked up, arrived, visit complete, return, done) | Role switch | Update stage | Call desk | — | J2/J3 | P1 | S |
| O-01 | Desk queue | Queues: handovers, needs a match, late providers, complaints, member call-backs; SLA timers | Role switch → Priya | Open item | Filter | O-02 | AD | P0 | C |
| O-02 | Request workspace | The same request record the member sees, plus member preferences, actions: rematch, message, call, approve within member's limit, add note, close | O-01 | Take ownership | Rematch; Message member; Escalate | Updates member's Q-02 | AD | P0 | C |
| O-03 | Complaint / dispute case | Evidence (photos, times, messages), outcome, refund decision | O-01 | Resolve | Escalate to grievance panel | O-01 | J1 | P1 | C |
| O-04 | Provider roster | Availability by category and locality (simple) | O-01 | — | — | — | — | P2 | C |
| O-05 | Content review queue (admin) | Smart Minutes awaiting review; reviewer, date | Role switch → Admin | Approve / reject | — | — | SM | P2 | C |
| O-06 | Reminder rules register (admin) | Rule, source, applies to, year, verified on, reviewer | Admin | Edit / verify | — | — | J5 | P2 | C |
| EV-01 | Event organiser: my listings | Read-only list, booking counts, accessibility fields | Role switch | — | — | — | J6 | P2 | S |

**Count:** 120 screens (P0: 70 · P1: 42 · P2: 8). The P0 set is the minimum for a credible demo.
