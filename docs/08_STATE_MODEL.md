# Output 8: State Model, Failure States and Edge Cases

Three independent dimensions are tracked on every service request, and should never be merged into one status:

1. **Request status:** where the job is.
2. **Owner:** `SELF` or `DESK` (who is driving it). Changing owner never resets status or history.
3. **Payment status:** `NOT_DUE → DUE → PAID_SIMULATED`, plus `PARTIAL`, `REFUND_PENDING` and `REFUNDED`.

Every transition appends a `HistoryEvent { at, actorId, action, from, to }`, which is shown in Q-03.

## 1. Shared states (all bookable services)

| State | Meaning | Member-facing label |
|---|---|---|
| `DRAFT` | Being filled in | "Not sent yet" |
| `REQUESTED` | Submitted; matching | "Finding the right person" |
| `NO_PROVIDER_FOUND` | No match for the slot | "No one is free then" |
| `MATCHED` | Provider proposed, member not yet confirmed | "Ready for you to confirm" |
| `CONFIRMED` | Booked | "Confirmed" |
| `REMATCHING` | Provider cancelled, declined or was late; finding a replacement | "Finding a replacement" |
| `RESCHEDULED` | Time changed (transient → `CONFIRMED`) | "New time confirmed" |
| `AWAITING_APPROVAL` | Added work or extra time needs the member's decision | "Needs your approval" |
| `COMPLETED` | Provider has marked the job done; awaiting the member's confirmation and payment | "Done: please check" |
| `PAID` | Payment simulated | "Paid" |
| `CLOSED` | Finished and rated | "Closed" |
| `CANCELLED` | Cancelled by the member or SeniorG | "Cancelled" |
| `DISPUTED` | Member reported a problem | "We're looking into it" |
| `RESOLVED` | Dispute closed (with refund, revisit or no change) → `CLOSED` | "Resolved" |

## 2. J1 Home repair

```
DRAFT → REQUESTED → MATCHED → CONFIRMED → PROVIDER_EN_ROUTE → IN_PROGRESS
      ⇄ AWAITING_APPROVAL (added work: APPROVED → back to IN_PROGRESS; DECLINED → back to IN_PROGRESS, original scope)
      → COMPLETED → PAID → CLOSED

REQUESTED → NO_PROVIDER_FOUND → (new slot) REQUESTED | (handover) owner=DESK
CONFIRMED → REMATCHING → MATCHED → CONFIRMED            (provider cancels)
PROVIDER_EN_ROUTE → PROVIDER_LATE → REMATCHING | CONFIRMED (new time) | CANCELLED (free)
CONFIRMED → RESCHEDULED → CONFIRMED;  CONFIRMED → CANCELLED
COMPLETED → DISPUTED → RESOLVED → CLOSED
```

New states beyond the brief: `PROVIDER_EN_ROUTE` (the brief calls this "provider arriving"), `PROVIDER_LATE`, `NO_PROVIDER_FOUND`, `REMATCHING`, `RESCHEDULED`, `DISPUTED`, `RESOLVED`, `CANCELLED`.

## 3. J2 Airport / station and J3 Hospital companion (one machine, with stage variants)

```
DRAFT → REQUESTED → MATCHED → CONFIRMED → COMPANION_EN_ROUTE → PICKED_UP
   Airport/station: → ARRIVED → COMPLETED
   Hospital:        → AT_VENUE → VISIT_COMPLETE → RETURN_JOURNEY → COMPLETED
                       (if return is not booked: VISIT_COMPLETE → COMPLETED)
COMPLETED → PAID → CLOSED

Any stage after CONFIRMED ⇄ AWAITING_APPROVAL (extra waiting hours; flight delay)
MATCHED/CONFIRMED → REMATCHING (companion unavailable) → MATCHED | owner=DESK
CONFIRMED → RESCHEDULED → CONFIRMED;  CONFIRMED → CANCELLED
```

## 4. J4 Temporary house help (request plus a per-day sub-state)

```
Request: DRAFT → REQUESTED → MATCHED → CONFIRMED → ACTIVE → COMPLETED → PAID → CLOSED
         ACTIVE → (extend) ACTIVE with new days;  ACTIVE → (end early) COMPLETED
         REQUESTED → NO_PROVIDER_FOUND → owner=DESK
Day:     SCHEDULED → CHECKED_IN → DONE (confirmed by member)
         SCHEDULED → ISSUE → BACKUP_ASSIGNED → CHECKED_IN → DONE
         SCHEDULED → ISSUE → UNRESOLVED (not charged)
         SCHEDULED → SKIPPED (member choice; not charged)
Payment: at COMPLETED, amount = DONE days × daily rate
```

## 5. J5 Reminder

```
UPCOMING → DUE_SOON (30 days before window; illustrative) → EXPLAINED (viewed)
EXPLAINED → IN_PROGRESS_SELF → DONE
EXPLAINED → ASSISTED (creates a desk request) → DONE (when the linked request closes)
DUE_SOON/EXPLAINED → SNOOZED (≤ 7 days) → DUE_SOON
any open state → OVERDUE (deadline passed or ≤ 5 days left: the desk calls)
DONE → next year's UPCOMING created
```

## 6. J6 Activity and tickets

```
Event (UI):   DISCOVERED → SELECTED
Ticket:       SEATS_HELD (10 min) → CONFIRMED → IN_CALENDAR → ATTENDED
              SEATS_HELD → EXPIRED (hold lapsed)
              SELECTED → SOLD_OUT → WAITLISTED
              CONFIRMED/IN_CALENDAR → CANCELLED_BY_MEMBER → REFUND_PENDING → REFUNDED
              CONFIRMED/IN_CALENDAR → CANCELLED_BY_ORGANISER → REFUND_PENDING → REFUNDED
Partner path: SELECTED → HANDED_TO_PARTNER (no further tracking; optional manual calendar item)
Association:  SELECTED → SIGNED_UP → IN_CALENDAR → ATTENDED
```

## 7. Other machines

| Object | States |
|---|---|
| Owner | `SELF ⇄ DESK` (each switch logged with the handover scope) |
| Additional work | `PENDING → APPROVED` \| `DECLINED` (records decidedBy and decidedAt) |
| Payment | `NOT_DUE → DUE → PAID_SIMULATED`; `DUE → PARTIAL`; `PAID_SIMULATED → REFUND_PENDING → REFUNDED` |
| Family permission request | `REQUESTED → GRANTED` \| `DECLINED` |
| Desk conversation | `OPEN → WAITING_ON_MEMBER` \| `WAITING_ON_DESK → CLOSED` |
| Learning video (per viewer) | `UNWATCHED → PLAYING → WATCHED`; `saved` flag |
| Notification | `UNREAD → READ` |

## 8. Failure and edge cases: UX handling

| Case | Trigger (demo control) | Member sees | Who owns the fix | Resulting state |
|---|---|---|---|---|
| Provider unavailable | No match for the slot | R-15: other slots; "Let the desk find someone" | Member or desk | `NO_PROVIDER_FOUND` |
| Provider cancels | Provider withdraws | Notification "Ramesh can't make it. We're finding a replacement, same price"; time by which they will hear | SeniorG | `REMATCHING` |
| Provider doesn't arrive | 30 min past the slot | R-16: apology; replacement or reschedule; visit fee waived | SeniorG | `PROVIDER_LATE → REMATCHING` |
| Additional charge | Provider raises added work | R-09: scope, reason, photo, amount, new total | Member decides | `AWAITING_APPROVAL` |
| Member rejects added work | Decline | R-10: what happens now, no charge for the declined part, option of a second opinion | Member | Additional work `DECLINED` |
| Partial work | Member reports | R-17 → pay only for completed items; the rest rescheduled or cancelled | SeniorG desk | `DISPUTED`; payment `PARTIAL` |
| Disputed work | Member reports poor work | R-17 → O-03 case, free revisit or refund (home-repair terms) | SeniorG desk | `DISPUTED → RESOLVED` |
| Refund | Dispute resolved, or organiser cancels | R-18 / K-02: amount, reason, stage | SeniorG | `REFUND_PENDING → REFUNDED` |
| Member changes appointment | Reschedule | R-19 / W-14: new slot; any fee shown before confirming | Member | `RESCHEDULED → CONFIRMED` |
| Member cancels | Cancel | Fee or free stated before confirming | Member | `CANCELLED` |
| Family member lacks permission | Meera opens Documents | F-05: "Not shared" with no hints; "Ask to share" | Member decides | Permission request `REQUESTED` |
| Coordinator takeover | Member hands over, or the desk flags a stuck request | Owner chip changes; history kept; member can take it back | Desk | Owner `DESK` |
| Event sold out | Seats gone | E-10: waitlist, similar events | Member | `SOLD_OUT → WAITLISTED` |
| Activity cancelled | Organiser cancels | E-11: refund and calendar removal | SeniorG / organiser | `CANCELLED_BY_ORGANISER` |
| Companion unavailable | No match, or companion cancels | W-13: desk arranging; time by which they will hear; option of a cab only | SeniorG desk | `REMATCHING` |
| House-help replacement unavailable | Helper absent and no backup | T-12: day not charged; desk call by a stated time | SeniorG desk | Day `UNRESOLVED` |
| Seat hold expires | 10 min without paying | "Your seats were released"; start again | Member | `EXPIRED` |
| Payment fails (simulated) | Demo control | "Payment didn't go through. Nothing was charged." Retry, or ask the payer | Member | Payment stays `DUE` |
| Desk closed (outside 8 am–8 pm) | Time skip | "We'll call you back by 8:30 am" + Pause still works | Desk | Call-back scheduled |
| Reminder date reported wrong | D-08 report | "Thanks. Our team checks dates before changing them." | Admin | Rule under review |

**Copy rule for failures:** say what happened, what SeniorG is doing, by when, and what the member can choose. Never blame the member. Never use "Oops".
