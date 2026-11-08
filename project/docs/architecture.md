# Architecture

Room Availability Checker is a single-page React app with no backend. Domain rules live in plain TypeScript under `src/lib`, and React components only render and wire events.

## Before

The state before this refactor: `App.tsx` held state, validation, status banners and layout together, `Timeline` had its own status colours and position maths, and `Clock` had its own padding helper.

```mermaid
flowchart TD
  App["App.tsx: state, parsing, validation, banners, layout"]
  Avail["availability.ts: checkAvailability, parseHHMM, formatHHMM"]
  Timeline["Timeline.tsx: status colours, position maths repeated 3x"]
  Clock["Clock.tsx: own pad helper"]
  Rooms["rooms.ts: catalog"]
  Filters["filters.ts: filterRooms, parseAttendees"]

  App -->|"null and order checks"| App
  App --> Avail
  App --> Timeline
  App --> Clock
  App --> Filters
  App --> Rooms
  Timeline --> Avail
```

## After

`App.tsx` keeps only state and wiring. Each component has one job, and all validation, formatting, filtering and status styling sit in one module each.

```mermaid
flowchart TD
  App["App.tsx: state and wiring only"]

  subgraph Components["src/components"]
    Header["AppHeader"]
    Req["RequirementsFilter"]
    Sel["RoomSelector"]
    Card["RoomCard"]
    Empty["EmptyState"]
    Slot["SlotChecker"]
    Banner["ResultBanner"]
    TL["Timeline"]
    Clock["Clock"]
    Styles["statusStyles: STATUS_STYLES"]
    UI["uiClasses: CARD_CLASS, INPUT_CLASS"]
  end

  subgraph Lib["src/lib (pure TypeScript, no React)"]
    Avail["availability: checkSlot, formatHHMM, formatRange, types"]
    Filters["filters: filterRooms, parseAttendees, listEquipment"]
    Rooms["rooms: frozen ROOMS catalog"]
  end

  App --> Header
  App --> Req
  App --> Sel
  App --> Card
  App --> Empty
  App --> Slot
  App --> TL
  App --> Avail
  App --> Filters
  App --> Rooms

  Header --> Clock
  Slot --> Banner
  Banner --> Styles
  TL --> Styles
  Clock --> Avail
  TL --> Avail
  Card --> Avail
  Slot --> UI
  Req --> UI
  Sel --> UI
  Card --> UI
```

## Design decisions

1. **Domain logic is pure and separate from React.** `checkSlot`, `filterRooms` and `parseAttendees` take plain data and return plain data, with no hooks or DOM. They can be unit-tested directly in Node without rendering anything, which the component tree cannot offer.

2. **One validation entry point.** `checkSlot` in `src/lib/availability.ts` parses the times, checks their order and range, applies the blocked rule and detects overlaps, and returns the status, the message and the valid slot. The UI never re-checks these rules. Before this, the same rules were in three places (`checkAvailability`, `App.tsx`, `Timeline.tsx`), so they could drift apart.

3. **Status styling lives in one map keyed by one union type.** `AvailabilityStatus` is declared once, and `STATUS_STYLES` has an entry for every status. TypeScript refuses to compile if a status is added without a style, so the banner and timeline cannot disagree about colours.

4. **Results are derived, not stored.** The availability result is recalculated from the current room and times on each render. A result for one room cannot linger after the selection changes, which satisfies the stale-result requirement without any cache invalidation logic.

5. **The catalog is immutable by construction.** `ROOMS` is frozen and typed `readonly`, so booking data cannot be changed by accident, which keeps acceptance criterion AC5 enforced by the compiler and the runtime.
