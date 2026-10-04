# Output 10: Prototype Acceptance Criteria

The prototype is accepted only when every **Must** criterion passes in a fresh session (after "Reset demo") on a 360 × 800 mobile viewport **and** a 1280 px desktop viewport.

## A. Hero journeys (Must)

| ID | Criterion | How to verify |
|---|---|---|
| AC-J1 | From H-01, a reviewer can book AC repair, see the matched three-name card and estimate, confirm, advance to "on the way" and "arrived", receive and **approve** added work, see completion proof, pay (demo), see the receipt and close. The request then shows `CLOSED` in Requests → Completed | Walk J1 in `04`; check that Q-01 updates |
| AC-J1b | The same journey with **Decline**: the final amount excludes the declined item and history records "Declined by Suresh" | Check R-10, R-13 and Q-03 |
| AC-J2 | Airport assistance can be configured (destination, date, time, pickup, help type, needs, language, preference), matched, confirmed and advanced through every stage to `CLOSED` with a receipt | Walk J2 |
| AC-J3 | Hospital companion uses the same flow with hospital-specific help types and stages (`AT_VENUE`, `VISIT_COMPLETE`, `RETURN_JOURNEY`). No screen asks for or stores medical information | Walk J3; inspect forms |
| AC-J4 | A 10-day house-help plan is created; the daily tracker shows each day; demo controls produce one backup day and one skipped day; the final bill counts only days served; Rohan can pay as payer | Walk J4; check the amount (9 × daily rate) |
| AC-J5 | The life-certificate card appears on H-01 before the window opens; the detail shows why it matters, the date window and the rule source; all three choices work. "Get assistance" creates a desk request that can be advanced to closed, and the reminder becomes `DONE` with next year's reminder created | Walk J5 (all three branches) |
| AC-J6 | An event can be found from H-01 or Explore, inspected (accessibility visible before paying), booked for two people, confirmed, added to the household calendar and shown to the spouse in her account. A **partner** listing shows the interstitial and no tracking promise | Walk J6 and the partner variant |

## B. Platform behaviour (Must)

| ID | Criterion |
|---|---|
| AC-NAV | Five-tab navigation (desktop sidebar) works from every top-level screen. Back always returns to the previous screen. No screen is a dead end: each has a primary action or a clear exit |
| AC-STATE | Every status change is visible in three places: the request detail stepper, the Requests list card and the notification list. States persist across tab switches and screen refreshes within the session until "Reset demo" |
| AC-HIST | Q-03 shows every transition with its time and actor, including approvals and owner changes |
| AC-HANDOVER | From any in-progress request, "Help → Hand over" moves the owner to the desk **without losing any entered field**. The desk console shows the same record; the desk's actions appear in the member's timeline; the member can take the request back |
| AC-FAMILY | As Meera, only items Suresh shared are visible. Opening Documents shows the "Not shared" state with no leaked titles or counts. Changing a permission as Suresh changes Meera's view immediately. As Rohan, only payment summaries addressed to him are visible |
| AC-PERM | The provider view shows only the assigned job and relevant preferences. The coordinator cannot see the document index |
| AC-REM | Reminders show their source, year and verified date; can be snoozed and marked done; and link to related documents |
| AC-SM | Smart Minutes plays (simulated), can be saved, moved to the next video with a button and filtered by category; every video shows the reviewed badge and info |
| AC-FAIL | Using G-05 demo controls, a reviewer can produce each of the following and see a coherent screen and an outcome: provider unavailable, provider cancels, no-show, added-work decline, partial work or dispute with refund, reschedule, cancel, family lacks permission, coordinator takeover, event sold out, event cancelled, companion unavailable, house-help backup unavailable, payment failed |
| AC-BADGE | Every service and event shows its booking-type badge (Through SeniorG / Partner / Association). Partner flows never show SeniorG refund or tracking promises |
| AC-SCOPE | With the Prototype lens on, every screen shows its CORE / SHOWCASE / FUTURE tag, consistent with `03` |
| AC-SAFE | No screen in any role contains a password, UPI PIN or OTP input. Every simulated payment, call, map and partner hand-off carries a "Demo" marker |

## C. Experience quality (Must)

| ID | Criterion |
|---|---|
| AC-A11Y | Body text is at least 18 px at Standard size; Large and Extra large settings reflow without truncating primary actions; touch targets are at least 48 px; text contrast meets AA (body aims for AAA); status never relies on colour alone |
| AC-HELP | "Help" is visible and labelled in the top bar of every member screen, and reachable within one tap |
| AC-COPY | No patronising or stereotyped wording (see the `09` voice table); failure messages say what happened, what SeniorG is doing, by when, and the choices |
| AC-COHERENT | A first-time reviewer can describe SeniorG as "one service desk", not "several mini-apps", after the demo (check in the 8–12 member test) |

## D. Should (not blocking)

- Desktop layouts for all P0 member screens; desk console usable at 1280 px.
- P2 screens: event organiser listings, admin content queue, rules register.
- Railway-station variant of J2.
- Undo for non-payment actions.

## E. Test scenarios before showing the prototype to pilot members (from v0.5)

- [ ] A provider declines or does not arrive
- [ ] A member rejects an added charge
- [ ] A child pays but cannot see private information
- [ ] A coordinator takes over without losing the request history
- [ ] Work is partly completed, or disputed
- [ ] A refund is needed after payment
