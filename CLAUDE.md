# SENIORG — CLAUDE CODE PROJECT INSTRUCTIONS

## 1. PROJECT

Build the BOB SENIORG showcase prototype.

This is an interactive product prototype, NOT production software.

The objective is to demonstrate the complete SeniorG experience through realistic mock data and working state transitions.

---

## 2. SOURCE HIERARCHY

The approved implementation specification is contained in `/docs`.

Read ALL files in `/docs` before coding.

The documents are:

- 00_README.md
- 01_PRD.md
- 02_INFORMATION_ARCHITECTURE.md
- 03_SCREEN_INVENTORY.md
- 04_HERO_JOURNEYS.md
- 05_SUPPORTING_JOURNEYS.md
- 06_ROLES_PERMISSIONS.md
- 07_MOCK_DATA_MODEL.md
- 08_STATE_MODEL.md
- 09_DESIGN_BRIEF.md
- 10_ACCEPTANCE_CRITERIA.md
- 11_DEMO_SCRIPT.md
- 12_REVIEW_AND_FINAL_STRUCTURE.md

Do NOT use older v0.4 material.

Do NOT invent product requirements that contradict these documents.

BOB SENIORG v0.5 remains the authoritative product vision.

---

## 3. PRODUCT

SeniorG is:

"A trusted everyday-life service desk for independent retired professionals."

It is NOT an elderly-care application.

The experience should make the user feel:

- capable
- independent
- respected
- in control
- supported when needed

Core philosophy:

"I decide. You handle. My family knows what I choose them to know."

---

## 4. CORE IMPLEMENTATION RULES

1. Every hero journey must work end to end.
2. Do not create decorative screens with dead ends.
3. State changes must persist during the session.
4. The same request record must retain its history when handed to the SeniorG desk.
5. Family permissions must affect what family members can see.
6. Each spouse is an independent account.
7. Never request passwords, OTPs or UPI PINs.
8. Payments are simulated.
9. External partner integrations are simulated.
10. Real banking, healthcare, airline and ticketing APIs are NOT required.
11. Use realistic fictional/demo data.
12. Never imply fictional providers are real SeniorG partners.

---

## 5. SIX HERO JOURNEYS

### J1 — AC / HOME REPAIR

REQUESTED
→ MATCHED
→ CONFIRMED
→ PROVIDER ARRIVING
→ ADDITIONAL WORK
→ APPROVED / DECLINED
→ IN PROGRESS
→ COMPLETED
→ PAID
→ CLOSED

### J2 — AIRPORT / RAILWAY ASSISTANCE

REQUESTED
→ MATCHED
→ CONFIRMED
→ ON THE WAY
→ PICKED UP
→ ARRIVED
→ COMPLETED
→ CLOSED

### J3 — HOSPITAL COMPANION

REQUESTED
→ MATCHED
→ CONFIRMED
→ COMPANION ARRIVING
→ AT VENUE
→ VISIT COMPLETE
→ RETURN JOURNEY
→ CLOSED

Do not turn this into a medical-care workflow.

### J4 — TEMPORARY HOUSE HELP

REQUESTED
→ MATCHED
→ CONFIRMED
→ ACTIVE
→ DAILY SERVICE
→ COMPLETED
→ CLOSED

### J5 — LIFE CERTIFICATE

UPCOMING
→ DUE SOON
→ EXPLAINED
→ SELF-SERVE / ASSISTED
→ COMPLETED

### J6 — LOCAL EVENT

DISCOVERED
→ SELECTED
→ TICKETS
→ CONFIRMED
→ CALENDAR

---

## 6. DESIGN

The approved Claude Design canvas is the visual reference.

Do not redesign the product unnecessarily.

Visual principles:

- ivory background
- deep ink text
- green primary actions
- restrained marigold
- serif screen titles where specified
- accessible contrast
- minimum readable text size
- status = icon + words, never colour alone
- one primary action per screen
- premium
- calm
- modern
- non-patronising

---

## 7. NAVIGATION

Use the approved five-tab structure:

HOME
SERVICES
EXPLORE
REQUESTS
HOUSEHOLD

Help / Assisted Desk must remain easily accessible.

---

## 8. REQUEST RECORD

Build a reusable request-detail component.

It must consistently communicate:

1. What
2. Status
3. Owner
4. Provider/person
5. Price/payment state
6. Timeline/history
7. Next action
8. Help

Use this model for:

- AC repair
- Airport assistance
- Hospital companion
- Temporary house help

---

## 9. ASSISTED DESK

This is a core differentiator.

When:

Member request
→ Help
→ Hand over

the SAME request must become:

Owner = SeniorG Desk

without losing:

- request ID
- entered information
- history
- provider information
- payment information
- previous status

The desk sees the same request.

The member sees the same request.

The interface should clearly communicate:

"Your request has been handed to SeniorG."

---

## 10. FAMILY

Family access is permission-based.

The member remains the principal user.

A family member can only see information explicitly shared.

Spouse accounts are independent.

Do not allow Suresh to silently control Asha's private requests.

---

## 11. DEMO DATA

Use fictional/demo identities.

Avoid real company names unless explicitly required by the approved documents.

Preferred demo identities include:

- SeniorG Verified AC Services
- SeniorG Companion Network
- SeniorG Home Support
- Pune Theatre — Demo
- Demo Hospital, Kothrud

Prices must be clearly marked:

"Illustrative demo price"

Never imply these are actual SeniorG tariffs.

---

## 12. PROTOTYPE SCOPE

Do NOT implement:

- real UPI
- real payment gateway
- real banking APIs
- real OTP
- real healthcare integrations
- real airline integrations
- real ticketing APIs
- production authentication
- real provider APIs

Simulate these interactions convincingly.

---

## 13. TECHNICAL DIRECTION

Preferred stack:

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide icons

Keep dependencies minimal.

Use mock data initially.

Build reusable components.

Do not over-engineer.

---

## 14. RESPONSIVE

Primary viewport:

360 × 800

Also support:

1280px desktop

Mobile is the primary experience.

Desktop should become an appropriate workspace rather than simply stretching the mobile UI.

---

## 15. QUALITY GATE

Before declaring the prototype complete:

1. Run the application.
2. Test all six hero journeys.
3. Test Back navigation.
4. Test state persistence.
5. Test Assisted Desk handover.
6. Test Family permissions.
7. Test independent spouse account.
8. Test additional-work approval.
9. Test failure states.
10. Test responsive layout.
11. Check console errors.
12. Check dead buttons/links.
13. Check unresolved placeholders.
14. Check mock-data consistency.
15. Compare implementation against `/docs/10_ACCEPTANCE_CRITERIA.md`.

---

## 16. WORKING METHOD

Do NOT build the entire application blindly in one step.

First inspect all `/docs` files.

Then provide:

1. Technical architecture
2. Component architecture
3. Application routing
4. Mock-data architecture
5. State-management approach
6. Hero-journey implementation plan
7. Desktop/mobile strategy
8. Testing strategy
9. Development sequence

Identify contradictions or missing implementation information before coding.

Do not invent requirements to fill gaps.

After the plan is approved, implement incrementally.

After every major milestone:

- run the application
- test the relevant journey
- fix errors
- continue

Do not replace working functionality unnecessarily.

---

## 17. FINAL OBJECTIVE

The finished prototype should allow a reviewer to experience:

AC repair
→ Airport assistance
→ Hospital companion
→ Temporary house help
→ Life certificate assistance
→ Local activity booking
→ Smart Minutes
→ Family Circle
→ Assisted Desk

without critical dead ends.

The prototype should communicate:

"SeniorG helps me manage independent retired life without taking control away from me."