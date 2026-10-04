# Output 5: Supporting Journeys

## SJ-1 Smart Minutes [CORE small reviewed library · SHOWCASE vertical feed]

**Entry:** the H-01 "Smart Minute for you" card, Explore → Smart Minutes, or contextual links (G-06 Pause → "Spot a fake bank call").

| # | Screen | Action | State |
|---|---|---|---|
| 1 | L-01 | Opens "How to spot a fake bank call" (75 s). It autoplays muted with captions on; a large tap target plays with sound | Video `UNWATCHED → PLAYING` |
| 2 | L-01 | Watches to the end. A slim progress bar is shown; no autoplay countdown pressure | `PLAYING → WATCHED` (≥ 90 % watched) |
| 3 | L-01 | Taps **Save** (bookmark) | `saved = true` → appears in L-04 |
| 4 | L-01 | Swipes up, or taps the large **Next** button, for "Never share these 3 things on UPI" | Next video |
| 5 | L-02 | Taps the category chip "Digital safety" → feed filtered | Filter state |
| 6 | L-03 | Opens info: "Source: Retirees' association digital-safety panel (fictional) · Reviewed by SeniorG content panel · 12 Sep 2026 · No corrections" | — |
| 7 | L-05 | (optional) Reports "Outdated" → "Thanks, the panel will review it within 7 days" | Report `SUBMITTED` |

**Seed videos (fictional titles, mock posters, no real footage needed):** "How to spot a fake bank call" · "Never share these 3 things on UPI" · "How to use DigiLocker" · "Simple stretching after 60" · "WhatsApp: block and report a number" · "Making text bigger on your phone" · "What is a life certificate?" · "Packing for a short trip".

**Design rules:** the feed is curated, so there are no comments, likes counts or open uploads. Every video shows the reviewed badge. A Next button is always available, so swipe gestures are never required. Captions are on by default.

---

## SJ-2 Family Circle [CORE]

**Story:** Suresh shares the status of his travel and hospital trips with Meera (Toronto) but not his documents. Rohan (Bengaluru) is a payer for house help only.

| # | Who | Screen | Action | Result |
|---|---|---|---|---|
| 1 | Suresh | HH-01 → F-01 | Opens Family Circle and sees Meera (viewer) and Rohan (payer) | — |
| 2 | Suresh | F-03 | For Meera: Request status = **Selected requests only**; Reminders = **Life certificate, Mediclaim**; Documents = **None**; Emergency information = **Yes**; Payments = **No**. The preview shows "Meera will see: …" | Permission saved; logged |
| 3 | Suresh | Q-02 (REQ-1046 hospital) | Toggles "Share with Meera" on this request | Share added for this request |
| 4 | Meera | (role switch) F-04 | Sees cards: "Dad · hospital visit Monday · Vikram (companion) · At hospital 10:12" and "Life certificate · Done". No prices, no notes, no medical details (none are stored) | — |
| 5 | Meera | F-04 → tries "Documents" | **F-05:** "Dad hasn't shared documents." No titles, counts or hints | Access denied (no data leaks) |
| 6 | Meera | F-05 | Taps "Ask Dad to share" | Suresh receives "Meera asked to see Documents → Review", which he can decline |
| 7 | Rohan | (role switch) F-06 | Sees "House help for Mum & Dad · 9 days served · ₹5,850 due", pays (demo) and sees the receipt. Cannot see requests that aren't shared with him, documents or notes | Payment `PAID_SIMULATED`, payer = Rohan |
| 8 | Suresh | F-03 | Removes Meera's access to "Selected requests" | Her view updates at once; the past shared items disappear |

**Rules:** the member is the principal; family are delegates. Nothing is shared by default, not even with a child who lives in the same home. Every permission is per area, with a per-item override, and can be withdrawn at any time. A family member can never approve added work or change a booking unless granted "book and approve" (a P2 role, not demonstrated by default).

---

## SJ-3 Documents [CORE: index only]

| # | Screen | Action | Result |
|---|---|---|---|
| 1 | DC-01 | Opens Documents. Banner: "SeniorG keeps an index so you know what you have and where it is. Your documents stay with you." | — |
| 2 | DC-02 | Chooses **Insurance** → "IBA group mediclaim policy 2025–26" (fictional entry) with an orange "Renewal due" badge | — |
| 3 | DC-03 | Entry: policy name; reference ending ••4417; where stored: "Blue file, steel cupboard" and "Email from the bank, 21 Oct 2025"; renewal date; **related reminder** "Mediclaim renewal options"; notes; visible to: "Suresh, Asha" | — |
| 4 | DC-03 → D-02 | Taps the related reminder → opens the reminder with the three choices | Cross-link works |
| 5 | DC-03 → A-03 | "Get help with this" → desk request pre-filled "Help with mediclaim renewal options" | Request created, owner = desk |
| 6 | DC-04 | Adds "AC warranty, CoolCare, valid to Mar 2027" and links it to the completed REQ-1042 | Entry saved; appears in Warranties |

**Rules:** no passwords, no full ID numbers (last 4 digits at most) and no file upload in the prototype. [FUTURE: Drive/DigiLocker link.] Sharing with family happens per item, through Family Circle.

---

## SJ-4 Assisted Desk: self-serve to assisted handover [CORE]

**Story:** Suresh starts booking the hospital companion himself, is unsure which help type covers waiting during tests, and hands it over.

| # | Who | Screen | Action | State |
|---|---|---|---|---|
| 1 | Suresh | W-04 | Is unsure between "wait with me" and "full visit assistance" | Request `DRAFT`, owner `SELF` |
| 2 | Suresh | Top bar → G-03 | Taps **Help**. The sheet shows "Hand over this request (Hospital companion · Monday)" pre-selected | — |
| 3 | Suresh | A-03 | Chooses what the desk may do: "Choose the right option and book it" ✓; "Approve price changes" ✗ (no limit). Adds a voice note: "Tests may take long" | Owner `SELF → DESK`; history entry "Handed to SeniorG desk by Suresh 18:02"; all fields kept |
| 4 | Priya (desk) | O-01 → O-02 | Sees the handover at the top of the queue, with the same record (hospital, date, pickup, preferences, note). Selects full visit assistance and matches Vikram | Request `REQUESTED → MATCHED` (actor: Priya) |
| 5 | Priya | O-02 | Because Suresh did not authorise price approval, sends the quote for his approval | `AWAITING_APPROVAL` |
| 6 | Suresh | Notification → Q-02 | Sees "Priya chose full visit assistance · ₹1,900 · Approve?" and approves | `CONFIRMED`; logged "Approved by Suresh" |
| 7 | Suresh | Q-02 | The owner chip now reads "Managed by SeniorG desk (Priya)". He can take it back ("I'll manage this myself") | Owner can return to `SELF` |
| 8 | Suresh | Q-03 | History shows every step with its actor | — |

**Other desk entry points:** a new request in the member's own words (A-02); report a problem (R-17); call-back (A-05); asking about an event (E-13); a reminder (D-05).

---

## SJ-5 Tickets [CORE as referral · SHOWCASE native booking]

| Path | Screens | What the member is told |
|---|---|---|
| **Book through SeniorG (demo)** | E-03 → E-04 → E-05 → E-06 → K-01/K-02 | "Booked through SeniorG (demo). Seats held, refund if the organiser cancels, help from the desk." |
| **Continue with partner** | E-03 → E-09 interstitial → mock partner page → back → optional manual "Add to calendar" | "The partner's prices, refunds and changes apply. SeniorG cannot see or change this booking." |
| **Association event (free)** | E-03 → E-12 → confirmation | "Your chapter organises this. Sign-up only; no ticket." |

**K-02 ticket detail:** mock QR, seats, venue, date, source badge (SeniorG / Partner / Association), refund status, Directions and Go With Me.

**Required states:** `SEATS_HELD`, `CONFIRMED`, `CANCELLED_BY_MEMBER`, `CANCELLED_BY_ORGANISER`, `REFUND_PENDING`, `REFUNDED`, `ATTENDED`.
