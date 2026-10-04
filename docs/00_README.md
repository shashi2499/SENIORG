# BOB SENIORG: Product and UX Blueprint for the Showcase Prototype

**Version:** Blueprint 1.0, 3 October 2026
**For:** Claude Design (visual system and screens), then Claude Code (interactive prototype)
**Status:** Planning only. No code yet.

---

## 1. Source hierarchy

| Rank | Source | Use |
|---|---|---|
| 1 | **BOB SENIORG Platform: Feature and Journey Vision v0.5 (frozen)** | Authoritative product vision and pilot scope. v0.4 and earlier are superseded and are not used. |
| 2 | **PRODUCT_BRIEF.md (October 2026)** | Expanded showcase-prototype direction |
| 3 | **Silver Economy Pain-Point Discovery report and handoff note (2 Oct 2026)** | Evidence, personas, pain points, hypotheses |

When the brief goes beyond v0.5's pilot scope, the feature is tagged **SHOWCASE** or **FUTURE**. It is never presented as an approved pilot capability.

## 2. Scope tags used in every file

| Tag | Meaning | Source |
|---|---|---|
| **[CORE]** | Part of the v0.5 first release: "Build now", or a "Manual process" that the pilot runs through the desk | v0.5 release scope table |
| **[SHOWCASE]** | Shown in the prototype to explore direction. Not approved for the pilot, or approved only as a manual desk process while the prototype shows a self-serve version | PRODUCT_BRIEF.md |
| **[FUTURE]** | Not in scope. May appear only as a clearly labelled "Coming later" placeholder | v0.5 "Later"; brief section 22 |

**Not established in source material** marks any fact, figure or name that the sources do not support. Every price, person, venue, hospital and provider name in the mock data is fictional and illustrative.

## 3. File index

| File | Output |
|---|---|
| `01_PRD.md` | Output 1: final PRD, including the differentiation answer (brief section 18) |
| `02_INFORMATION_ARCHITECTURE.md` | Output 2: navigation, sections, screen hierarchy, home dashboard |
| `03_SCREEN_INVENTORY.md` | Output 3: complete screen inventory (120 screens, each with an ID) |
| `04_HERO_JOURNEYS.md` | Output 4: six hero journeys, screen by screen, with state changes and failure branches |
| `05_SUPPORTING_JOURNEYS.md` | Output 5: Smart Minutes, Family Circle, Documents, Assisted Desk, Tickets |
| `06_ROLES_PERMISSIONS.md` | Output 6: role and permission matrix |
| `07_MOCK_DATA_MODEL.md` | Output 7: entities, fields and the fictional seed household |
| `08_STATE_MODEL.md` | Output 8: state machines, payment states, failure and edge cases |
| `09_DESIGN_BRIEF.md` | Output 9: UX principles and design-system brief for Claude Design |
| `10_ACCEPTANCE_CRITERIA.md` | Output 10: prototype acceptance criteria (testable) |
| `11_DEMO_SCRIPT.md` | Output 11: 10-minute demo script |
| `12_REVIEW_AND_FINAL_STRUCTURE.md` | Consistency review and the recommended final prototype structure |

## 4. How Claude Design and Claude Code should use this

1. **Claude Design:** start with `09_DESIGN_BRIEF.md`, then `02` and `03`. Design all P0 screens first, then P1. Every screen ID in `03` should map to one frame.
2. **Claude Code:** build from `07` (data), `08` (states) and `04`/`05` (flows). Use `10` as the definition of done. Stack: React, Vite, TypeScript, Tailwind, Lucide icons and mock data. No backend. State is kept in memory, with an optional local save for the session and a "Reset demo" control.
3. **Both:** the prototype must include a **Prototype lens** (screen G-05). It shows the CORE / SHOWCASE / FUTURE tag on each screen and gives demo controls to advance simulated events, such as "provider arrives" or "provider cancels".

## 5. What is simulated (never real)

Payments and UPI, OTP and sign-in, bank and pension actions, Jeevan Pramaan, doorstep banking, ticketing, airline and rail data, maps, hospital systems, provider apps, notifications and calls. All of these are mock screens. Every simulated payment or external hand-off shows a small "Demo" marker. No screen ever asks for a password, UPI PIN or OTP.
