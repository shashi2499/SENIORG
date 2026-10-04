# Output 6: Roles and Permissions

The prototype uses a **role switcher** (G-01, G-05) instead of real sign-in. Every role sees only what this matrix allows, and screens enforce it visibly (locked states, never silent omissions that confuse a reviewer).

## 1. Role summaries

| Role | Fictional seed | Can see | Can do | Cannot see | Permission needed |
|---|---|---|---|---|---|
| **Member** (principal) | Suresh Kulkarni | Own requests, shared household items, own private items, reminders, documents index, family settings, receipts | Book, approve or decline added work, pay, hand over to the desk, take back from the desk, set family permissions, set trusted contacts, rate | The spouse's private items | Household membership (association membership number) |
| **Spouse** (equal member) | Asha Kulkarni | Same as Member for shared items plus her own private items | Same as Member, for herself and shared requests | Suresh's private items | Joined to the household by Suresh, accepted by Asha. Equal rights, not a dependant |
| **Family: viewer** | Meera (daughter, Toronto) | Only items and areas shared with her: selected request status, selected reminders, selected documents (by item), emergency information | View; ask the member to share more; receive status notifications for shared items | Prices and payments (unless granted), notes, unshared requests, documents, other family members' settings | Invitation from a member; per-area grants; revocable |
| **Family: payer** | Rohan (son, Bengaluru) | Payment requests addressed to him: service name, dates, amount, receipt | Pay (demo); view his receipts | Request details beyond the payment summary, notes, documents, reminders | Payer grant per service or request |
| **Desk coordinator** | Priya (SeniorG desk) | Requests handed over or flagged (unfilled, late, disputes); the member's service preferences needed for matching; desk conversations | Match or rematch providers, message and call (mock), book on the member's behalf **when the handover allows it**, approve added work **only within a limit the member set (default: none)**, open and resolve complaints, add notes | Documents index; family settings; requests the member has not handed over or that are not flagged; payment instruments | Coordinator role + per-request handover scope |
| **Service provider / companion** | Ramesh Patil (CoolCare, fictional); Anita Sharma, Vikram Joshi (Saath Companions, fictional); Lata More (HomeAssist, fictional) | Assigned jobs only: address, slot, task, photos, relevant preferences (language, visitor note, mobility note for companions) | Accept or decline, start trip, verify arrival code, request added work, update trip stages, mark complete with proof | Other requests, documents, family, reminders, payment details, member's phone number after job closes (masked calls; simulated) | Verified provider; assignment |
| **Event / activity provider** | Kalamandir Auditorium (fictional) | Own listings, booking counts | Edit listing fields, including accessibility (read-only in prototype) | Member identities beyond booking name and seat | Organiser account (P2) |
| **Operations / admin** | SeniorG ops (fictional) | Queues, provider roster, reminder rules register, content review queue, aggregate metrics | Approve content, verify rules, suspend providers | Members' document index and private notes | Admin role |

## 2. Permission matrix (C = create, R = read, U = update, A = approve, — = no access)

| Object | Member | Spouse | Family viewer | Family payer | Coordinator | Provider | Admin |
|---|---|---|---|---|---|---|---|
| Own service request | CRU A | R (if shared) | R status (if shared) | R payment summary (if payer) | RU (if handed over or flagged) | R (if assigned) | R (aggregate, audit) |
| Added-work approval | A | A (own or shared requests) | — | — | A only within the member's limit | C (request it) | — |
| Payment (simulated) | C | C | — | C (if payer) | — | — | R (audit) |
| Reminders | CRU | CRU (shared) | R (selected) | — | R (if linked to a handover) | — | RU rules only |
| Document index | CRU | CRU (shared) | R (selected items) | — | — | — | — |
| Family permissions | CRU | CRU (own) | — | — | — | — | — |
| Desk conversation | CR | CR (own) | — | — | CR | — | R (audit) |
| Provider job record | R (three-name card, proof) | R | — | — | RU | RU (own) | RU |
| Event bookings and tickets | CRU | CRU | R (if shared) | — | R (if asked) | — | — |
| Smart Minutes | R, save, report | R, save, report | — | — | — | — | CRU, approve |
| Audit history (Q-03) | R | R (shared) | — | — | R | — | R |

## 3. Non-negotiable rules the prototype must demonstrate

1. **No credentials anywhere.** No screen for any role contains a password, UPI PIN or OTP field. Sign-in is simulated by the role switcher.
2. **Every approval records who gave it** (member, spouse or coordinator within its limit), the time and the amount.
3. **Family sees nothing by default** and cannot infer hidden items (F-05 shows no titles or counts).
4. **Handover scope is explicit** and can be withdrawn by the member at any time.
5. **Provider access ends when the job ends.** Their job page becomes a read-only summary without the address.
