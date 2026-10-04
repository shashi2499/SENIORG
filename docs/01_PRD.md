# Output 1: Product Requirements Document (Showcase Prototype)

## 1. Product purpose

**SeniorG is a trusted everyday-life service desk for independent retired professionals.** It helps capable retired people get things done, stay on top of important dates, find things to do near them and learn useful skills. A human coordinator is always within reach, and family is involved only on the member's terms.

Philosophy: **"I decide. You handle. My family knows what I choose them to know."**

The prototype has two jobs:

1. Let reviewers (the association, bank stakeholders, design partners and pilot members) experience the product as one coherent platform.
2. Make the operating model visible: matching, approvals, proof, a human desk and family permissions.

It is not a pilot build. The pilot scope remains the v0.5 release scope.

> **Naming note:** "BOB SENIORG" is used here as the project name. Under v0.5 the platform is **association-led, and banks are not partners or owners**. Discovery hypothesis H13 warns that a bank-branded service may inherit retirees' distrust of their former employer. The prototype UI therefore uses **"SeniorG"** as the product name. The final brand is an open decision. What "BOB" stands for in the final brand is not established in the source material.

## 2. The differentiation question (brief section 18)

> What makes SeniorG fundamentally different from combining Urban Company, MakeMyTrip, BookMyShow, a reminder app and YouTube?

**Short answer: those apps sell transactions. SeniorG keeps a household's context and takes responsibility across transactions.** Its value lies in what happens between and around bookings, which none of the single-category apps holds.

| Underlying advantage | What it means in practice | Why the five-app bundle cannot do it |
|---|---|---|
| **1. One household record** | Preferences such as language, mobility notes, preferred visitor gender, diet, spouse, pickup address, trusted contact and regular helpers are entered once and used in every booking. The escort match uses language; event filters use accessibility; the house-help brief uses diet | Each app holds a single-purpose profile, and nothing passes between them |
| **2. One request model and one history** | Every task, whether a repair, escort, reminder or event, is a request with a status, an owner, a price, approvals and proof, in one "My Requests" list | Five separate order histories, each with its own support desk and terms |
| **3. Shared accountability for coordination** | When a provider fails, SeniorG rematches, follows up and owns the complaint, within published category terms (v0.5 design rule 8; J3 failure table) | Marketplaces mediate disputes for their own vendors only; nobody owns a failure that spans two services, such as an escort and an appointment |
| **4. Assisted mode on the same record** | A member can start alone and tap "Help me with this". A coordinator continues the same request; nothing is re-entered | Help desks in consumer apps start a new ticket, usually through chat or an IVR, with no authority to complete the task |
| **5. Proactive calendar for this cohort** | Deadlines come from the member's profile (life certificate, IBA mediclaim window, Form 15H and others), each with an explanation and a next step, either self-serve or assisted | Generic reminder apps know nothing about a retiree's institutional calendar |
| **6. Permission-based family layer** | The retiree is the principal. Family see only what is shared, item by item, and a child can pay without seeing private details | Consumer apps share accounts or nothing at all; monitoring apps are built around the child, not the parent |
| **7. Distribution through a trusted community** | Members join through the retirees' association with their membership number. Events, mentoring and peer recommendations flow through chapters | Paid acquisition with no shared identity or peer trust |
| **8. Learning tied to real tasks** | Short, reviewed videos appear where they are needed, for example "spot a fake bank call" next to the trusted-contact button | Open video platforms mix reliable and unreliable content and are not tied to what the member is doing |

**Honest limits [B]:**

- None of these advantages comes from software alone. They depend on desk quality, provider vetting and association trust, which are operating capabilities. The prototype can show them but cannot prove them.
- Members may still call a good provider directly after the first job. v0.5 treats that as a measure to track, not something to block by contract.
- Ticketing and travel are better served by specialist apps. SeniorG should offer "Continue with partner" there, not compete.

**So the prototype must make advantages 1–4 visible in every hero journey:** stored preferences pre-filling forms, the same request timeline throughout, a visible "owner" of each request, and a help hand-off that keeps history.

## 3. Target users

| User | Description | Prototype role |
|---|---|---|
| **Primary: retired PSB couple** | About 60–75, financially independent, basic-to-intermediate smartphone users, children in another city or abroad [A: brief; C: discovery report, LASI data] | Member and spouse |
| Secondary: family member | An adult child in another city or abroad | Family (viewer or payer) |
| Secondary: family pensioner living alone | Highest-need sub-segment in the discovery hypotheses (H15). Same features as a one-person household | Shown as a one-person household option only |
| Operators | Desk coordinator, service provider or companion, event organiser, operations administrator | Back-office views |

Fictional seed persona (see `07`): **Suresh Kulkarni, 68**, retired Chief Manager at a public sector bank, and **Asha Kulkarni, 64**, a retired teacher, living in Kothrud, Pune. Their son **Rohan** lives in Bengaluru and their daughter **Meera** in Toronto. All are fictional.

## 4. Problems addressed (from the discovery report)

| Problem | Evidence tag | Where the prototype addresses it |
|---|---|---|
| Vetting and supervising strangers who come to the home; prices changing at the door | [A] survey Q4; [D] | J1 Home repair: verified three-name card, arrival code, approval for added work |
| Getting to appointments and the airport after stopping driving; needing a second adult | [A] survey Q7, Q9 | J2 Airport and J3 Hospital companion |
| The regular domestic help quits or is away | [D] (one of the "moments that matter") | J4 Temporary house help |
| The annual admin crunch: life certificate, mediclaim, tax | [C] Canara and PNB circulars; Jeevan Pramaan | J5 Life certificate reminder |
| Shrinking social circle; activities framed around frailty | [C] IRIS 5.0; [A] survey Q6, Q15 | J6 Explore near you; association events |
| Fraud targeting this cohort | [C] Pune cyber police data | Trusted-contact button; Smart Minutes on fraud |
| Children far away, wanting to help without taking over | [C] LASI; [D] | Family Circle |
| Booking is harder than the service; no human to reach | [D] | Assisted Desk |

## 5. Value proposition

- **For the member:** "I can handle my life. When I don't want to handle something myself, I know exactly where to go, and I stay in charge."
- **For the spouse:** an equal account, not a dependent profile.
- **For family:** reassurance, limited to what the parent chooses to share, without becoming the household's call centre.
- **For providers:** pre-qualified, well-described jobs, and members who are easier to serve because their needs are stated up front.
- **For the association:** a service that turns membership into everyday value.

## 6. Product principles (merged from v0.5 design rules and brief section 5)

1. **The member decides; others carry out.** Money, scope and anyone entering the home need the member's approval.
2. **A human is always one tap away.** A labelled "Help" control appears on every screen. No IVR mazes and no chatbot-only routes.
3. **Family is optional, and every permission is the member's choice.**
4. **Never ask for passwords, UPI PINs or OTPs.** Coordinators and providers never handle them.
5. **Every request has a visible status and a visible owner** (the member, the desk or a provider).
6. **Every completed service has proof:** who came, what was done, what was paid, and a receipt.
7. **The price or estimate is shown before commitment.** Added work needs explicit approval, recorded with who approved it.
8. **SeniorG owns coordination failures** within published, category-specific terms. A promise is shown only where an arrangement supports it.
9. **"Book through SeniorG" versus "Continue with partner"** is labelled on every listing.
10. **Not framed around frailty.** Plain, respectful language; no "elderly" stereotypes.
11. **Calm and premium:** spacious, readable and confidence-building.
12. **Grows with the member,** from convenience at 62 to accompaniment at 80, in the same account.
13. **Technology where it helps; a person where it doesn't.**

## 7. Service architecture

| # | Category (member-facing name) | Scope | Booking type | Implementation depth in prototype |
|---|---|---|---|---|
| 1 | **Home Repairs** (AC, electrical, plumbing, appliances, carpentry, pest control, cleaning) | [CORE] home repairs full transaction | Book through SeniorG | Deepest: J1 end to end, plus failure states |
| 2 | **Go With Me** (airport, railway station, hospital or medical appointment, diagnostic centre, bank, government office, other) | [CORE] as a desk-run manual process in the pilot; [SHOWCASE] for the self-serve booking UI and live trip status | Book through SeniorG | J2 and J3 share one flow with destination variants |
| 3 | **Temporary House Help** | [CORE] manual process "only where reliable supply exists"; [SHOWCASE] for the self-serve multi-day UI | Book through SeniorG | J4 multi-day with a daily tracker |
| 4 | **Reminders and Important Dates** | [CORE] verified reminders built from profile rules | Not a booking. Remind, explain, then self-serve, referral or assisted | J5 |
| 5 | **Documents** (index only) | [CORE] manual index of links and notes; Drive/DigiLocker integration [FUTURE] | Not a booking | Supporting flow |
| 6 | **Explore Near You** | [CORE] association events listing and sign-up; [SHOWCASE] broader local events | Association events: sign up through SeniorG; others: see Tickets | J6 |
| 7 | **Tickets** (films, theatre, music, events) | v0.5 = External referral [CORE as referral]; [SHOWCASE] for simulated native booking with seat selection | Both shown and clearly labelled | J6 booking leg and a supporting flow |
| 8 | **Smart Minutes** (verified learning) | [CORE] small reviewed library; [SHOWCASE] for the richer vertical feed | Not a booking | Supporting flow |
| 9 | **Assisted Desk** | [CORE] | — | Present in every journey; desk console |
| 10 | **Family Circle** | [CORE] spouse, helper and payer roles; [SHOWCASE] for richer family scenarios | — | Supporting flow and a family view |
| 11 | **Banking and Pension help** (doorstep banking, Jeevan Pramaan guidance) | [CORE] external referral | Continue with partner | One referral template screen |
| 12 | **Tax and Professional help** (ITR, Form 15H, wills) | [CORE] external referral | Continue with partner | Same referral template |
| 13 | **Travel assistance** | Merged into Go With Me (airport and station). Trip booking itself is not established in the source material | — | No separate category (simplification) |
| 14 | **Health-related coordination** (hospital-episode support, F9) | [FUTURE] | — | "Coming later" placeholder only |
| 15 | **"If one of us can't" readiness** (F10) | [FUTURE] | — | Not shown, or a placeholder at most |
| 16 | **Trusted-contact button** (F7) | [CORE]; bank alerts and OTP watch are [FUTURE] experiments | — | Global "Pause" sheet |

## 8. Core features for the prototype

| Feature | Prototype requirement | Scope |
|---|---|---|
| Household account | Member and spouse with separate logins (simulated by a role switcher); shared and private items | [CORE] |
| Home dashboard | Answers "What do I need to know or do today?" | [CORE] |
| Request engine | One request object for all bookable services: status, owner, price, approvals, proof, history | [CORE] |
| Suitability matching | Mock match using stored preferences; shows why a provider was matched ("Speaks Marathi · 4.8 · 12 jobs with members") | [CORE] logic; [SHOWCASE] richness |
| Three-name provider card | Platform, delivering business and visiting professional, with responsibilities (v0.5) | [CORE] |
| Price, approval and proof | Estimate before booking, added-work approval, completion photo and notes, simulated payment, receipt | [CORE] |
| Assisted Desk | Help from any screen; handover keeps history; desk console | [CORE] |
| Reminders | Rule-based reminders with source, year and verification date; explanations; three choices | [CORE] |
| Document index | Category, entry, where it is stored, related reminder, get help | [CORE] (manual index) |
| Explore and Tickets | Discover, inspect, decide, book, confirm, calendar | [CORE] association events; [SHOWCASE] others |
| Smart Minutes | Vertical feed, categories, save, verified badge, report a problem | [CORE] small library; [SHOWCASE] feed polish |
| Family Circle | Per-person, per-area permissions; family view; locked states | [CORE] |
| Trusted-contact "Pause" | Call trusted contact; scam checklist | [CORE] |
| Prototype lens and demo controls | Scope tags and simulated event triggers | Prototype-only tooling |

## 9. Prototype scope summary

**In the prototype:** the six hero journeys (J1–J6); supporting flows for Smart Minutes, Family Circle, Documents, Assisted Desk and Tickets; member, spouse and family views; a desk console; a provider job page (simple); and an event-organiser and admin view (read-only, P2).

**Not in the prototype:** real payments, UPI, OTP, bank or pension actions, ticketing, airline or rail APIs, maps, hospital systems, authentication, open video uploads and production partner systems.

## 10. Future scope (not built, not claimed)

Hospital-episode coordination (F9); "if one of us can't" readiness (F10); bank payment-limit alerts and OTP watch (experiments); Google Drive and DigiLocker integration; in-app checkout for external tickets; bill fetching through Bharat BillPay; diagnostics, pharmacy and home health; investment guidance; home digital-help visits; and real partner integrations of any kind.

## 11. Open decisions carried from v0.5 (not resolved here)

- Final brand name (see the naming note in section 1).
- The accountable data owner. This must be named before any pilot data is collected.
- The platform's exposure cap per booking for guarantees.
- The payment partner. Not established in the source material.
