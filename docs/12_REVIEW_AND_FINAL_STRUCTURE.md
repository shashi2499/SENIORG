# Consistency Review and Recommended Final Prototype Structure

## 1. Consistency check

| # | Finding | Type | Resolution in this blueprint |
|---|---|---|---|
| 1 | **"BOB SENIORG" vs v0.5 governance.** v0.5 makes the association the lead and says banks are not partners. Discovery hypothesis H13 suggests an employer-branded service may inherit distrust | Contradiction (brand) | The UI uses "SeniorG"; "BOB SENIORG" remains the project name; the final brand is an open decision (`01` §1). What "BOB" stands for is not established in the source material |
| 2 | **Native ticket booking** (brief §6.7, J6) vs v0.5, where tickets are an "External referral" | Scope conflict | Simulated native booking is tagged [SHOWCASE] with a "Demo" marker; the partner path and association sign-up are both demonstrated as [CORE] (`05` SJ-5) |
| 3 | **Self-serve booking for escorts and house help** vs v0.5, where these are a "Manual process" run by the desk | Scope conflict | Tagged "[SHOWCASE] UI over a [CORE] manual process". Prices say "final price confirmed by the desk". The demo script's closing scene explains the difference |
| 4 | Brief principle 9 ("SeniorG should own coordination failures") vs v0.5 (guarantees only where arrangements support them; warranty for home repairs only; exposure cap to be set) | Contradiction | Restated as "SeniorG owns coordination failures within published, category-specific terms" (`01` §6). The 30-day workmanship cover appears only on home-repair receipts |
| 5 | The prompt says "every completed service should have proof"; the brief says "where relevant" | Wording conflict | Proof is defined by type: repairs = photos, notes and times; escorts = stage timestamps; house help = daily check-ins; tickets = the ticket; reminders = the member's own "marked done" note (SeniorG cannot verify a bank submission) |
| 6 | **Duplicate service categories** in brief §16: Travel Assistance vs Go With Me (airport/station); Documents & Assistance vs Household → Documents; Renewals & Reminders vs Household → Dates | Duplication | Travel assistance is merged into Go With Me; Documents and Reminders live in Household and are reachable from Home. Banking & Pension and Tax & Professional help use one referral template (S-03). Health coordination is a [FUTURE] placeholder only |
| 7 | **Six tabs plus a floating Help button** in the candidate navigation | Usability | Five tabs (Home, Services, Explore, Requests, Household) and a labelled Help button in the top bar; Learn moved into Explore (`02` §1) |
| 8 | **States missing from the brief's machines:** no provider found, rematching, provider late, rescheduled, cancelled, awaiting approval (escorts too), disputed, resolved, seat hold expired, waitlisted, partner hand-off, per-day house-help states, overdue and snoozed reminders | Missing states | Added in `08` §1–6; payment and owner tracked as separate dimensions |
| 9 | **Hospital "registration assistance"** could drift into handling medical or insurance decisions | Safeguarding | The W-08 safeguarding note says the companion makes no medical decisions and handles no cash or cards. No medical fields in any form (AC-J3) |
| 10 | "Payment visibility where appropriate" in Family Circle was undefined | Unclear permission | Defined as the **payer** role (Rohan) and a separate "Payments" permission area (`06`) |
| 11 | **Life-certificate dates** come from a 2024 secondary article; the IBA mediclaim deadline example is for 2025–26 | Unsupported for 2026 | The rule register (O-06, D-08) shows source, year and verified date; mediclaim dates are labelled illustrative. Verify against 2026 circulars before any pilot use |
| 12 | The **doorstep-banking charge** (₹75 + GST) is Bank of Baroda's published charge; other banks may differ | Partial support | D-05 attributes it to Bank of Baroda's page "as of Oct 2026"; for other banks the charge is not established in the source material |
| 13 | **Fictional names may match real businesses** (e.g. CoolCare, Saath Companions, HomeAssist, Kalamandir) | Risk | Claude Design and Claude Code should check that placeholder names don't match a real business in Pune or Mumbai, or switch to obviously placeholder names. All are marked fictional in `07` |
| 14 | **Joining and onboarding** (v0.5 J1, joining with the association membership number) is not among the brief's hero journeys | Missing journey | Deliberately out of the demo: the household starts already set up. G-02 shows the sign-in pattern only. Recommend adding a 3-screen joining flow in a later iteration |
| 15 | Languages: a "modern Indian" feel and Marathi-speaking personas, but translated content is not established | Unsupported | English UI; fonts chosen with Devanagari support; a language selector is not shown, to avoid a false promise |
| 16 | Desk hours (8 am–8 pm) come from a v0.5 working assumption, not a decision | Assumption | Shown as such; the out-of-hours state is in `08` §8 |
| 17 | The calendar, dates and events must line up across journeys (an earlier draft had Asha in Bengaluru during the Saturday theatre booking) | Continuity | Fixed: theatre on Sat 10 Oct, Asha flies on Sun 11 Oct, Suresh's hospital visit on Mon 12 Oct while Asha is away, house help 8–17 Oct |
| 18 | The Prototype lens and demo controls could confuse member testers | Risk | Hidden by default; on for stakeholder demos; off for member usability tests |

## 2. Simplifications adopted

1. **One Go With Me flow** serves airport, railway, hospital and other destinations through variant data (saves about 14 screens).
2. **One request-detail screen (Q-02)** with stage-specific panels, instead of a separate tracker per service.
3. **Booking merged into ServiceRequest**; payment is a sub-object; one `Person` entity covers member, spouse and family.
4. **Learn sits inside Explore**; **More becomes Household**.
5. **Back-office kept thin:** desk console (P0), provider job page (P1), admin and organiser (P2, read-only).

## 3. Opportunities to cut further, if time is short

- Drop all P2 screens (8).
- Drop the railway variant, E-02 filters and E-07/E-08 (keep the buttons, with a toast saying "Demo").
- Show the provider side only through demo controls rather than P-01–P-06.

---

## RECOMMENDED FINAL PROTOTYPE STRUCTURE

### Navigation

**Mobile bottom tabs / desktop sidebar:** Home · Services · Explore · Requests · Household
**Top bar on every screen:** a labelled **Help** button (Assisted Desk) and notifications
**Reviewer tooling:** role switcher and Prototype lens with demo controls (hidden by default)

```
Home ─ Needs your attention · Today & upcoming · Quick actions · Near you · Smart Minute · Your circle
Services ─ Home Repairs [CORE] · Go With Me [SHOWCASE UI / CORE manual] · Temporary House Help [SHOWCASE UI / CORE manual]
         · Banking & Pension help [CORE referral] · Tax & Professional help [CORE referral] · Coming later: Health coordination [FUTURE]
Explore ─ Near you (events [SHOWCASE], association events [CORE], partner listings [CORE referral]) · Smart Minutes [CORE/SHOWCASE] · Saved
Requests ─ Needs your action · Active · Completed · Tickets  →  Request detail (stepper, owner, three names, price, proof, history)
Household ─ Dates & reminders [CORE] · Documents (index) [CORE] · Family Circle [CORE] · Trusted contacts [CORE]
          · Profile & preferences · Payments & receipts
Help ─ Talk now · Call me back · Message · Hand over a request · Report a problem · Pause (trusted contact)
Back office (role switch) ─ Desk console [CORE] · Provider/companion job page [CORE/SHOWCASE] · Admin & organiser [P2]
```

### Hero journeys (all must complete end to end)

| # | Journey | Scope | Key screens | Signature moment |
|---|---|---|---|---|
| J1 | Home repair: AC | CORE | S-02 → R-01…R-14 | Approving added work, with the approval on record |
| J2 | Airport / station assistance | SHOWCASE UI / CORE manual | W-01…W-12 | Companion card and live trip stages |
| J3 | Hospital companion | SHOWCASE UI / CORE manual | W-01…W-12 (hospital variant) | Accompaniment without medical data; family sees chosen status |
| J4 | Temporary house help (10 days) | SHOWCASE UI / CORE manual | T-01…T-11 | Daily tracker; backup day; payer pays |
| J5 | Life certificate | CORE | H-01 → D-02…D-06 / A-04 | Raised early, explained, three ways to act |
| J6 | Local event for two | CORE association / SHOWCASE tickets | E-01 → E-03…E-06; E-09 | Accessibility checked before paying; partner honesty |

### Supporting journeys

| Journey | Scope | Key screens |
|---|---|---|
| Assisted Desk handover | CORE | G-03 → A-03 → O-02 → Q-02/Q-03 |
| Family Circle | CORE | F-01 → F-03 → F-04/F-05; F-06 payer |
| Documents | CORE (index) | DC-01 → DC-03 → D-02 / A-03 |
| Smart Minutes | CORE / SHOWCASE | L-01, L-02, L-03, L-04 |
| Tickets | CORE referral / SHOWCASE native | E-05 → K-01/K-02; E-09 |
| Pause (trusted contact) | CORE | G-06 → L-01 |

### Build order for Claude Code (suggested)

1. App shell, navigation, Help sheet, role switcher, store and seed data, Prototype lens.
2. Request engine (Q-01, Q-02, Q-03, state transitions, demo controls) → J1 in full.
3. Go With Me shared flow → J2 and J3.
4. J5 reminders + Assisted Desk + desk console (handover).
5. J6 Explore + tickets + partner interstitial.
6. J4 house help with daily tracker.
7. Family Circle views, Documents, Smart Minutes.
8. Failure states via demo controls; accessibility pass; desktop layouts.

**Definition of done:** every Must criterion in `10_ACCEPTANCE_CRITERIA.md` passes.
