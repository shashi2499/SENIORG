# Output 7: Mock Data Model (minimum for an interactive prototype)

**Simplifications (deliberate):**

- **USER, SPOUSE and FAMILY MEMBER** become one `Person` entity with a `role`.
- **BOOKING and BOOKING STATUS** merge into `ServiceRequest`: the request *is* the booking once confirmed, and its status history replaces a separate status entity. Only tickets need their own `TicketBooking`, because they are not service requests.
- Payment is a small sub-object on the request or ticket, not an entity of its own.

All data is fictional. Store it in typed mock-data modules. Keep one in-memory store (for example React context plus a reducer), with an optional session save and a "Reset demo" control.

## 1. Entities and fields

### Household
| Field | Type | Example |
|---|---|---|
| id | string | `HH-01` |
| name | string | "Kulkarni household" |
| address | string | "Flat 4, Sahyog Society, Kothrud, Pune" (fictional) |
| city | enum | `Pune` \| `Mumbai` |
| associationChapter | string | "Pune chapter (fictional)" |
| memberIds | string[] | `["P-SURESH","P-ASHA"]` |
| trustedContactIds | string[] | `["P-ASHA","P-ROHAN"]` |

### Person
| Field | Type | Notes |
|---|---|---|
| id | string | `P-SURESH` |
| name | string | |
| role | enum | `MEMBER` \| `SPOUSE` \| `FAMILY_VIEWER` \| `FAMILY_PAYER` \| `COORDINATOR` \| `PROVIDER` \| `ORGANISER` \| `ADMIN` |
| householdId | string? | members and family only |
| relation | string? | "Daughter" |
| city | string? | "Toronto" |
| age | number? | members only (drives reminder rules, e.g. 80 or over) |
| membershipNo | string? | members; fictional |
| preferences | object | `{ languages: ["Marathi","Hindi"], textSize: "large", visitorGender: "any", mobilityNote: "walking stick on long corridors", diet: "vegetarian, less oil" }` |
| permissions | Permission[] | family only |

### Permission (family)
| Field | Type | Example |
|---|---|---|
| grantedTo | personId | `P-MEERA` |
| grantedBy | personId | `P-SURESH` |
| area | enum | `REQUEST_STATUS` \| `REMINDERS` \| `DOCUMENTS` \| `EMERGENCY_INFO` \| `PAYMENTS` |
| scope | enum | `NONE` \| `SELECTED` \| `ALL` |
| itemIds | string[] | ids when scope is `SELECTED` |

### Provider
| Field | Type | Example |
|---|---|---|
| id | string | `PR-RAMESH` |
| name | string | "Ramesh Patil" |
| business | string | "CoolCare Services" (fictional delivering business) |
| businessAddress, customerCare | string | fictional (shown on the three-name card; v0.5 requirement) |
| type | enum | `REPAIR` \| `COMPANION` \| `HOUSE_HELP` |
| skills | string[] | `["AC","Refrigerator"]` |
| languages | string[] | |
| rating, jobsWithMembers | number | 4.8, 31 |
| idChecked | boolean | true |
| available | boolean | toggled by demo controls |
| photo | string | neutral avatar or initials (no stock photos of "elderly helpers") |

### Service (catalogue)
| Field | Type | Example |
|---|---|---|
| id | string | `SV-AC` |
| category | enum | `HOME_REPAIR` \| `GO_WITH_ME` \| `HOUSE_HELP` \| `REFERRAL` \| `FUTURE` |
| name | string | "AC repair" |
| bookingType | enum | `THROUGH_SENIORG` \| `PARTNER` \| `ASSOCIATION` |
| scopeTag | enum | `CORE` \| `SHOWCASE` \| `FUTURE` |
| variants | Variant[] | e.g. Go With Me help types `{ id, label, includes[], basePrice, perHour? }` |
| visitFee, estimateRange | number, [number,number] | 399, [399, 2500] (illustrative) |
| terms | string[] | cancellation, warranty (home repairs only) |

### ServiceRequest (includes booking)
| Field | Type | Notes |
|---|---|---|
| id | string | `REQ-1042` |
| householdId, createdBy | string | |
| serviceId, variantId | string | |
| category | enum | as Service |
| status | enum | see `08_STATE_MODEL.md` |
| owner | enum | `SELF` \| `DESK` |
| handoverScope | object? | `{ canMatch, canBook, approvalLimit }` |
| details | object | journey-specific: problem, photos, destination, pickup, appointmentTime, luggage, helpTypes, days[], taskList… |
| schedule | object | `{ date, slot }` or `{ start, days, hoursPerDay }` |
| providerId, backupProviderId | string? | |
| arrivalCode | string? | `4821` |
| price | object | `{ estimate, agreed, additional, final }` |
| additionalWork | AdditionalWork[] | |
| dailyLog | DayEntry[]? | house help only: `{ date, status, checkIn, note }` |
| tripStage | enum? | Go With Me only |
| proof | object? | `{ photos[], notes, timeIn, timeOut, parts[] }` |
| payment | Payment | |
| sharedWith | personId[] | per-request family share |
| rating | number? | |
| history | HistoryEvent[] | `{ at, actorId, action, from?, to?, note? }` (drives Q-03) |
| linkedReminderId, linkedEventId | string? | |

### AdditionalWork
| Field | Type | Example |
|---|---|---|
| id | string | `AW-1` |
| description | string | "Refrigerant top-up" |
| reason, photo | string | |
| amount | number | 1800 |
| status | enum | `PENDING` \| `APPROVED` \| `DECLINED` |
| decidedBy, decidedAt | string | `P-SURESH`, timestamp |

### Payment (sub-object)
| Field | Type | Notes |
|---|---|---|
| status | enum | `NOT_DUE` \| `DUE` \| `PAID_SIMULATED` \| `PARTIAL` \| `REFUND_PENDING` \| `REFUNDED` |
| amount, refundAmount | number | |
| payerId | personId | e.g. Rohan for house help |
| method | string | always "Demo payment" |

### Reminder
| Field | Type | Example |
|---|---|---|
| id | string | `RMD-LC-2026` |
| title | string | "Life certificate" |
| category | enum | `PENSION` \| `INSURANCE` \| `TAX` \| `BILL` \| `PROPERTY` \| `DEPOSIT` \| `ASSOCIATION` \| `WARRANTY` |
| ownerId | personId | `P-SURESH` |
| windowStart, dueDate | date | 2026-11-01, 2026-11-30 |
| status | enum | see state model |
| whyItMatters, whatYouNeed | string, string[] | |
| options | enum[] | `SELF`, `EXPLAIN`, `ASSIST` |
| partnerLink | string? | label only, e.g. "Jeevan Pramaan" (simulated) |
| rule | object | `{ source, appliesTo, year, verifiedOn, reviewedBy }` (v0.5) |
| linkedDocumentId, linkedRequestId | string? | |
| sharedWith | personId[] | |

### Document (index entry)
| Field | Type | Example |
|---|---|---|
| id | string | `DOC-INS-01` |
| name, category | string, enum | "IBA group mediclaim policy 2025–26", `INSURANCE` |
| refLast4 | string? | "4417" |
| storedWhere | string | "Blue file, steel cupboard" |
| expiryOrRenewal | date? | |
| linkedReminderId | string? | |
| notes | string? | |
| visibleTo | personId[] | |

### Event
| Field | Type | Example |
|---|---|---|
| id | string | `EV-THEATRE-01` |
| title, category, language | string | "Navi Sakal" (fictional), `THEATRE`, Marathi |
| organiser, venue | string | fictional |
| dateTime, durationMin | datetime, number | Sat 19:30, 135 |
| distanceKm | number | 1.8 |
| priceFrom, priceTo | number | 450, 900 |
| accessibility | object | `{ stepFree, lift, accessibleToilet, aisleSeats }` |
| bookingType | enum | `THROUGH_SENIORG` \| `PARTNER` \| `ASSOCIATION` |
| scopeTag | enum | |
| seatsLeft | number | toggled by demo controls (sold out) |
| status | enum | `ON_SALE` \| `SOLD_OUT` \| `CANCELLED` |
| seatMap | simple grid | rows A–J, aisle flags |

### TicketBooking
| Field | Type | Notes |
|---|---|---|
| id | string | `TKT-2207` |
| eventId, bookedBy | string | |
| attendees | personId[] | Suresh, Asha |
| seats | string[] | `["G7","G8"]` |
| status | enum | `SEATS_HELD` \| `CONFIRMED` \| `IN_CALENDAR` \| `ATTENDED` \| `CANCELLED_BY_MEMBER` \| `CANCELLED_BY_ORGANISER` |
| payment | Payment | |
| source | enum | `SENIORG_DEMO` \| `PARTNER` \| `ASSOCIATION` |

### LearningVideo
| Field | Type | Example |
|---|---|---|
| id, title, category | string | "How to spot a fake bank call", `DIGITAL_SAFETY` |
| durationSec | number | 75 |
| poster | string | mock still |
| source, reviewedBy, reviewedOn | string | fictional panel; date |
| captions | boolean | true |
| saved, watched | boolean | per viewer |

### Notification
| Field | Type | Example |
|---|---|---|
| id, recipientId | string | |
| type | enum | `STATUS` \| `APPROVAL_NEEDED` \| `REMINDER` \| `FAMILY_REQUEST` \| `DESK_MESSAGE` \| `EVENT_CHANGE` |
| text | string | "Approve added work: ₹1,800" |
| link | screen id + entity id | `R-09`, `REQ-1042` |
| read | boolean | |

### DeskConversation (small)
| Field | Type |
|---|---|
| id, requestId?, memberId, coordinatorId | string |
| messages | `{ at, fromId, text }[]` |

## 2. Seed data (one consistent story; all fictional)

| Entity | Seed |
|---|---|
| Household | Kulkarni household, Kothrud, Pune; Pune chapter |
| People | Suresh (68, member), Asha (64, spouse), Meera (daughter, Toronto, viewer), Rohan (son, Bengaluru, payer), Priya (coordinator), Admin |
| Providers | Ramesh Patil (CoolCare, AC); Sunil Rao (CoolCare, backup); Anita Sharma, Vikram Joshi (Saath Companions); Lata More, Sunita Pawar (HomeAssist) |
| Requests at demo start | REQ-1039 Plumbing (closed last month; shows history). All hero requests (REQ-1042 to 1046) are created live in the demo |
| Reminders | Life certificate (Suresh, due soon) · Mediclaim renewal options (illustrative date) · Form 15H (April) · Electricity bill (monthly, 18th) · FD maturity (fictional bank, Dec) · Property tax (illustrative) · Chapter AGM (association) |
| Documents | 8–10 entries across categories, including the mediclaim policy, pension payment order, AC warranty (created in J1) and property tax receipt |
| Events | Marathi play (SeniorG demo booking) · Multiplex film (partner) · Chapter talk on digital safety (association, free) · Morning heritage walk · Classical music evening · Volunteering: reading to children at a library (fictional) |
| Videos | 8 titles (see `05`) |

**Dates:** demo "today" is **Tuesday 6 October 2026**. Simulated time skips are controlled from G-05.

**Prices:** every amount is illustrative and not established in the source material. Label prices "Example price" in the Prototype lens.
