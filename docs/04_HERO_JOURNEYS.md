# Output 4: Six Hero Journeys, End to End

Every journey follows **ENTRY → INTERACTION → STATE CHANGE → OUTCOME**. States are those defined in `08_STATE_MODEL.md`. "Demo control" means a reviewer-triggered event from G-05, which stands in for something a provider, coordinator or the passage of time would do.

Every journey shows the three things that set SeniorG apart (see `01` §2): **preferences filled in from the household record**, **one request timeline**, and **a visible owner and a route to help**.

---

## J1 Home repair: AC not cooling [CORE]

**Persona:** Suresh, Tuesday 9:10 am. It is 34 °C (illustrative) and the bedroom AC is blowing warm air.

| # | Screen | Member action | State change (request `REQ-1042`) | Other actor / system |
|---|---|---|---|---|
| 1 | H-01 | Taps the "Home Repairs" tile | — | — |
| 2 | S-02 | Chooses "AC repair" | — | — |
| 3 | R-01 | Reads what is included: visit fee ₹399 (illustrative), estimate range, "added work needs your approval"; taps Book | `DRAFT` created | — |
| 4 | R-02 | Picks "Not cooling" and "Split AC, bedroom"; adds the note "Makes a clicking sound" | — | — |
| 5 | R-03 | Adds a photo of the indoor unit (mock) | — | — |
| 6 | R-04 | Chooses today, 11:00–13:00. Language (Marathi/Hindi) and "prefer male visitor: no preference" are pre-filled from the profile | `DRAFT → REQUESTED` | Mock matching runs |
| 7 | R-05 | Sees the three-name card: **SeniorG** (coordinates and owns complaints) · **CoolCare Services** (fictional; delivers and invoices) · **Ramesh Patil** (visits). "Why matched: speaks Marathi · 4.8★ · 31 jobs with members · ID checked" | `REQUESTED → MATCHED` | — |
| 8 | R-06 | Reviews: visit fee ₹399; likely total ₹399–₹2,500; pay after completion; free cancellation until 4 h before; taps Confirm | `MATCHED → CONFIRMED` | Notification to Ramesh (P-01) |
| 9 | R-07 | Sees the confirmation; taps Track | — | Agenda item added to H-01 |
| 10 | Q-02 | Sees the status stepper, owner "Ramesh (CoolCare) · coordinated by SeniorG" and the timeline | — | **Demo control:** "Provider sets out" |
| 11 | R-08 | Sees "Ramesh is on the way · about 20 min" and arrival code **4821** | `CONFIRMED → PROVIDER_EN_ROUTE` | **Demo control:** "Provider arrives"; Ramesh enters the code (P-03) |
| 12 | Q-02 | Sees "Ramesh has arrived · code verified 11:24" | `PROVIDER_EN_ROUTE → IN_PROGRESS` | — |
| 13 | R-09 | A notification arrives: "Approve added work?" Low refrigerant; gas top-up ₹1,800; reason, photo, new total ₹2,199. Suresh taps **Approve** | `IN_PROGRESS → AWAITING_APPROVAL → IN_PROGRESS`; additional work `PENDING → APPROVED`, logged "Approved by Suresh, 11:41" | Ramesh continues (P-04) |
| 14 | R-11 | Sees "Work completed": before/after photos, notes, parts, time in/out, final amount ₹2,199 | `IN_PROGRESS → COMPLETED` (awaiting member confirmation) | **Demo control:** "Provider completes" |
| 15 | R-11 | Taps Confirm & pay | Payment `DUE` | — |
| 16 | R-12 | Pays ₹2,199 with the demo payment (no PIN field; "Demo" marker) | Payment `DUE → PAID_SIMULATED`; request `COMPLETED → PAID` | — |
| 17 | R-13 | Sees the itemised receipt with the three names and "30-day workmanship cover (home repairs)" | — | Receipt stored in HH-05 |
| 18 | R-14 | Rates 5★ and ticks "Book Ramesh again next time"; closes | `PAID → CLOSED` | Ramesh saved as a preferred professional |

**Outcome:** the AC is fixed, Suresh approved the added cost himself, the proof and receipt are stored, the request is closed, and Ramesh can be rebooked.

**Branches (all reachable through demo controls):**

| Branch | Trigger | Screens | States |
|---|---|---|---|
| Member declines added work | Step 13 "Decline" | R-10 → Q-02 | Additional work `DECLINED`; request back to `IN_PROGRESS`; the final bill covers only the original scope |
| No professional for the slot | Step 6 | R-15 → choose another slot, or hand over to the desk (A-03) | `REQUESTED → NO_PROVIDER_FOUND → REQUESTED` (or owner = desk) |
| Professional cancels | After step 8 | Notification → Q-02 "Finding a replacement" | `CONFIRMED → REMATCHING → MATCHED → CONFIRMED` |
| Professional does not arrive | Step 11: 30 min past the slot | R-16 → accept replacement, reschedule or cancel free | `PROVIDER_EN_ROUTE → PROVIDER_LATE → REMATCHING`; visit fee waived |
| Partly done or poor work | Step 14 "Something's not right" | R-17 → O-03 → R-18 | `COMPLETED → DISPUTED → RESOLVED`; payment `PARTIAL` or `REFUND_PENDING → REFUNDED` |
| Member reschedules or cancels | Q-02 action | R-19 | `CONFIRMED → RESCHEDULED → CONFIRMED`, or `CANCELLED` |
| Member gets confused | Any step: Help → Hand over | A-03 → A-04 | Owner `SELF → DESK`; same `REQ-1042` (see AD flow) |

---

## J2 Airport assistance: Asha flies to Bengaluru [SHOWCASE UI over a CORE manual process]

**Persona:** Asha is visiting Rohan in Bengaluru on Sunday 11 October, the day after the theatre. The flight leaves Pune at 7:40 PM (fictional flight details). Suresh has a chapter meeting, so Asha wants a companion as far as check-in. She books on Wednesday.

| # | Screen | Member action | State change (`REQ-1043`) | Other actor / system |
|---|---|---|---|---|
| 1 | H-01 | Asha (her own login) taps "Go With Me" | — | — |
| 2 | W-01 | Chooses "Airport" | `DRAFT` | — |
| 3 | W-02 | Chooses Pune Airport, Sunday 11 Oct, departure 7:40 PM, flight number (optional, not verified) | — | — |
| 4 | W-03 | Home address is pre-filled; suggested pickup 4:30 PM ("about 3 h before departure"; illustrative rule) | — | — |
| 5 | W-04 | Chooses **Cab + companion** (other options: cab only · companion only · companion + waiting · full assistance) | — | — |
| 6 | W-05 | One suitcase and one cabin bag; "walks comfortably, prefers no stairs"; language Marathi; prefers a woman companion (all pre-filled from the profile and editable) | `DRAFT → REQUESTED` | — |
| 7 | W-06 | Estimate ₹1,450: cab ₹650 + companion ₹800 (illustrative); "final price confirmed by the desk before the trip" | — | — |
| 8 | W-07 | Three-name card: SeniorG · Saath Companions (fictional) · **Anita Sharma**: speaks Marathi, Hindi and English · 4.9★ · 58 trips · verified | `REQUESTED → MATCHED` | — |
| 9 | W-08 | Reads what Anita will and will not do (helps with luggage and check-in queue; no handling of cash or cards; contacts the desk if plans change); taps Confirm | `MATCHED → CONFIRMED` | — |
| 10 | W-09 | Sees the confirmation card: "Sun 11 Oct · 4:30 PM · Airport assistance · Pune → Pune Airport · Anita Sharma · Confirmed". Shares the status with Rohan (he has status permission) | — | Rohan's family view updates |
| 11 | W-10 | **Demo control: time skip to Saturday evening.** Reminder: pickup 4:30 PM, carry ID and booking (illustrative), Anita's contact | `CONFIRMED` (reminder sent) | — |
| 12 | W-11 | **Demo control: Sunday.** Stages advance: "Anita assigned (cab KA-XX fictional)" → "On the way · 10 min" → Asha taps "I'm in the cab" → "Arrived at departures 5:35 PM" → Anita marks "Checked in · Asha at security" | `CONFIRMED → COMPANION_EN_ROUTE → PICKED_UP → ARRIVED → COMPLETED` | Anita's updates (P-06); Rohan sees "Arrived at airport" |
| 13 | W-12 | Receipt ₹1,450 (no waiting used); pays (demo); rates; "Book Anita again" | `COMPLETED → PAID → CLOSED` | — |

**Outcome:** Asha travelled with a known, verified companion. Her family saw only what she shared, and the request closed with a receipt.

**Branches:** companion unavailable (W-13; `MATCHED → REMATCHING`, the desk takes over and Asha is told by when) · change pickup time (W-14; `RESCHEDULED`) · cancel (free more than 12 h before; illustrative) · flight delayed (Asha taps "My flight is delayed" in W-11 → waiting time is added only with her approval, through an AWAITING_APPROVAL step like J1) · railway variant: same flow with the station picker and platform-assistance wording.

---

## J3 Hospital companion: Suresh's follow-up appointment [SHOWCASE UI over a CORE manual process]

**This is accompaniment and coordination, not medical care.** The companion does not interpret medical advice, make medical decisions or handle payments on the member's behalf.

**Persona:** Suresh has a follow-up at City Care Hospital, Erandwane (fictional), on Monday 12 October at 10:30 AM. Asha is in Bengaluru.

| # | Screen | Member action | State change (`REQ-1046`) | Other actor / system |
|---|---|---|---|---|
| 1 | H-01 → W-01 | Suresh taps Go With Me, then "Hospital / medical appointment" | `DRAFT` | — |
| 2 | W-02 | Chooses the hospital (fictional list), Monday, appointment 10:30 AM, department (free text, optional) | — | — |
| 3 | W-03 | Pickup at home 9:45 AM (suggested) | — | — |
| 4 | W-04 | Chooses **full visit assistance**: travel + registration help + accompany me + wait with me + return. Each item has a one-line description | — | — |
| 5 | W-05 | Language Marathi; mobility "uses a walking stick on long corridors"; companion preference: none | `DRAFT → REQUESTED` | — |
| 6 | W-06 | Estimate ₹1,900 for up to 4 h, plus ₹250 per extra hour (illustrative) | — | — |
| 7 | W-07 | Companion **Vikram Joshi** · Saath Companions (fictional) · 4.8★ | `REQUESTED → MATCHED` | — |
| 8 | W-08 | Reviews the safeguarding note; confirms | `MATCHED → CONFIRMED` | — |
| 9 | W-10 | **Demo control: Sunday evening.** Reminder: carry previous reports and the insurance card (illustrative checklist; no medical advice) | — | — |
| 10 | W-11 | Monday stages: "Vikram on the way" → "Picked up 9:47" → **"At hospital · registration in progress"** → "Waiting to be seen" → **"Visit complete"** → "Return journey" → "Home 13:10" | `CONFIRMED → COMPANION_EN_ROUTE → PICKED_UP → AT_VENUE → VISIT_COMPLETE → RETURN_JOURNEY → COMPLETED` | Vikram's updates (P-06). Meera sees "At hospital" and "Home safely" only, because Suresh shared status for this request alone |
| 11 | W-12 | Time used 3 h 25 min → ₹1,900; pays (demo); closes | `COMPLETED → PAID → CLOSED` | — |

**Outcome:** Suresh attended his appointment with help at every step, kept control of his medical information (nothing medical is recorded), and his daughter had reassurance at the level he chose.

**Branches:** appointment rescheduled by the hospital (W-14; `RESCHEDULED`) · the visit runs over 4 h (an AWAITING_APPROVAL prompt for extra hours, which Suresh approves on his phone or tells Vikram to approve; the approval is logged with who gave it) · companion unavailable on the morning (W-13; the desk rematches or offers a cab only, with a price difference shown) · Suresh hands the booking to the desk mid-way (AD flow).

---

## J4 Temporary house help: the regular cook is away for 10 days [SHOWCASE UI over a CORE manual process]

**Persona:** The Kulkarnis' regular help, Shanta (fictional), is visiting her village from 8 to 17 October.

| # | Screen | Member action | State change (`REQ-1044`) | Other actor / system |
|---|---|---|---|---|
| 1 | H-01 → T-01 | Asha taps "House Help" and reads "When your regular help is away" | `DRAFT` | — |
| 2 | T-02 | Chooses cleaning + dishes + simple cooking | — | — |
| 3 | T-03 | 10 days from Thursday 8 Oct; 3 h a day; 8–11 am; Sundays included | — | — |
| 4 | T-04 | Vegetarian, less oil, no onion or garlic on Tuesdays (pre-filled); language Marathi | `DRAFT → REQUESTED` | — |
| 5 | T-05 | ₹650 a day × 10 = ₹6,500 estimate (illustrative); pay at the end for days actually served | — | — |
| 6 | T-06 | Helper **Lata More** · HomeAssist Agency (fictional); backup Sunita | `REQUESTED → MATCHED` | — |
| 7 | T-07 | Payer: Rohan (he has payer permission). Asha confirms | `MATCHED → CONFIRMED` | Rohan is notified "Payment will be due at the end" (F-06) |
| 8 | T-08 | Sees the 10-day plan | — | — |
| 9 | T-09 | **Demo control: day 1.** Lata checks in at 8:02, whoever is home (Asha or Suresh) confirms "Day 1 done" | `CONFIRMED → ACTIVE`; day 1 `SCHEDULED → CHECKED_IN → DONE` | — |
| 10 | T-09 / T-10 | **Demo control: day 4, helper absent.** Suresh (Asha is now in Bengaluru) is offered backup Sunita at 9:00 and accepts | Day 4 `ISSUE → BACKUP_ASSIGNED → DONE` | Desk console shows the event |
| 11 | T-09 | **Demo control: day 7.** Suresh skips the day (lunch with chapter friends) | Day 7 `SKIPPED` (not charged) | — |
| 12 | T-11 | **Demo control: day 10.** Summary: 9 days served, 1 skipped, ₹5,850. Rohan pays from his account (F-06); Asha sees "Paid by Rohan" | `ACTIVE → COMPLETED → PAID → CLOSED` | — |

**Outcome:** a multi-day service ran under one request, with a status for each day, an absence absorbed by a backup, a skipped day not charged, and payment by a family member without access to private details.

**Branches:** no helper available at the start (`NO_PROVIDER_FOUND`, desk takes over, honest "We'll call you by 6 PM") · backup also unavailable (T-12; day `ISSUE → UNRESOLVED`, not charged, desk call) · extend by 3 days (T-11 → new days appended; same request) · end early (remaining days cancelled, not charged).

---

## J5 Life certificate reminder [CORE]

**Persona:** Suresh (68, pensioner). Today is 6 October; his window is 1–30 November [C: Outlook Money; pensioners 80 or over can start 1 October].

| # | Screen | Member action | State change (reminder `RMD-LC-2026`) | Other actor / system |
|---|---|---|---|---|
| 1 | H-01 | The "Needs your attention" card reads: "Life certificate · window opens 1 Nov · 26 days" | Reminder `UPCOMING → DUE_SOON` (triggered 30 days ahead; illustrative) | Rule from O-06 (source, year, verified date) |
| 2 | D-02 | Opens it. **Why it matters:** "Your pension continues only if a life certificate reaches the bank each year." The date window and "Source · verified on … · reviewed by …" (D-08) are shown | `DUE_SOON → EXPLAINED` (once viewed) | — |
| 3 | D-02 | Three choices: **I'll do it myself** · **Explain what I need** · **Get assistance** | — | — |
| 4a | D-03 | "Explain what I need": a plain checklist and the three ways to submit (online through Jeevan Pramaan with face authentication; at the bank branch; through doorstep banking) | — | — |
| 4b | D-04 | "I'll do it myself": step guide → "Continue with partner: Jeevan Pramaan" (simulated hand-off) → back in SeniorG, "Mark as done" (D-06) with an optional acknowledgement-number note | `EXPLAINED → IN_PROGRESS_SELF → DONE` | Next year's reminder created |
| 4c | D-05 | "Get assistance": chooses **Arrange a doorstep banking visit**. The note explains that this is the bank's own service; Bank of Baroda's page lists ₹75 + GST per service (October 2026) and SeniorG helps you book it. Taps "Create request" | `EXPLAINED → ASSISTED`; request `REQ-1045` created (owner: desk, category: reminder help) | Desk console O-01 shows a new item |
| 5c | A-04 | Priya (coordinator) messages: "I've raised a doorstep banking request for 3 Nov, morning. You'll get the bank's service code by SMS; check that it matches the agent's" (mock) | `REQ-1045: REQUESTED → CONFIRMED` (external partner, referral type) | **Demo control:** "Desk confirms" |
| 6c | Q-02 | **Demo control: 3 Nov.** Status "Visit done" → Suresh taps "Certificate submitted" | `REQ-1045 → COMPLETED → CLOSED`; reminder `ASSISTED → DONE` | Next year's reminder created |

**Outcome:** a deadline the member might have missed was raised early, explained plainly, and completed in the member's chosen way, with the household record updated.

**Proactive design notes:** the card appears before the window opens, not on the deadline. The household's pension document entry (DC-03) links here. Meera may see "Life certificate: done" only if Suresh shares reminders with her.

**Branches:** "Remind me later" (snooze up to 7 days, `DUE_SOON` remains) · window closing (`OVERDUE` at 5 days left; the desk calls, per the failure handling in v0.5's renewal-season journey) · the member reports a wrong date (D-08 "Report incorrect date" → admin review; v0.5 rule).

---

## J6 Local event: Marathi play on Saturday [CORE for association events; SHOWCASE for native ticketing]

**Persona:** Suresh and Asha, Wednesday evening.

| # | Screen | Member action | State change (`TKT-2207`) | Other actor / system |
|---|---|---|---|---|
| 1 | H-01 | "Near you this week" carousel → card "Marathi play · Sat 7:30 PM · 1.8 km · ₹450 onwards" | Event `DISCOVERED` (UI state) | — |
| 2 | E-01 | (Alternative entry: Explore tab with filters "This weekend", "Theatre", "Step-free") | — | — |
| 3 | E-03 | Event detail: *Navi Sakal* (fictional), Kalamandir Auditorium (fictional), 2 h 15 min with an interval, Marathi, accessibility (step-free entry, lift to balcony, accessible toilet, aisle seats), price ₹450–₹900. Badge: **Book through SeniorG (demo)** | `SELECTED` | — |
| 4 | E-03 | Taps **Book for me + spouse** (alternatives: Book for myself · Ask the SeniorG desk) | — | — |
| 5 | E-04 | Seat map: 2 seats pre-selected together, aisle, rows F–H highlighted "easy access" | `SEATS_HELD` (10-minute hold) | — |
| 6 | E-05 | Review: 2 × ₹450 = ₹900; no convenience fee shown (illustrative); cancellation policy; pays with the demo payment | `SEATS_HELD → CONFIRMED`; payment `PAID_SIMULATED` | — |
| 7 | E-06 | Confirmation: tickets (K-02), **added to the household calendar** automatically, "Invite Asha" (E-07) → Asha's account shows the ticket, "Directions" (E-08), "Go With Me to this event" | `CONFIRMED → IN_CALENDAR` | H-01 agenda shows "Sat 7:30 PM Theatre ×2" |
| 8 | K-02 | (Saturday) Shows the mock QR at entry | `IN_CALENDAR → ATTENDED` (demo control) | — |

**Outcome:** discovery, decision, booking and confirmation done in under two minutes, for two people, with accessibility checked before paying.

**"Continue with partner" variant (must also be demonstrated):** a film at a multiplex (fictional listing) carries the **Partner** badge. E-03 → "Continue with partner" → E-09 interstitial: "You're leaving SeniorG. Prices, refunds and changes are handled by the partner. SeniorG can't track this booking. You can add it to your calendar manually." → mock partner page → back → "Add to calendar" (manual).

**Association event variant:** "Digital safety talk · Retired Bankers' Pune chapter (fictional) · free" → E-12 Sign up (+ spouse) → confirmed → calendar. This is the [CORE] path in v0.5.

**Branches:** sold out during seat selection (E-10 → waitlist, similar events) · organiser cancels (E-11; ticket `CANCELLED_BY_ORGANISER → REFUND_PENDING → REFUNDED`; calendar item removed; notification) · member cancels (allowed until 24 h before, per the policy shown; illustrative).
