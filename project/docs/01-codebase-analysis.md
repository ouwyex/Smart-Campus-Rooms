# Codebase Analysis (Task 1)

**Tool:** bolt.new, **Date:** 2026-11-08
**Scope:** analysis only, no code edited. Output of Prompt 1 (see `ai-evidence/prompts.md`).

## 1. Maintainability risks

**Risk 1: Single-room state is hardwired in App.tsx, which blocks the room catalog.**
- `src/App.tsx` L24-29: `ROOM`, `DEFAULT_BOOKINGS`, `blocked` and `bookings` are global, and `bookings` has no setter.
- L92 and L94 hardcode the room name and "Capacity 30".
- Impact: `blocked` is one toggle for the whole page, so blocking one room would block every room. The result memo (L37-47) has no room dimension. Capacity and equipment have nowhere to live, and the "refresh when the room changes" feature has no selected-room concept to react to.

**Risk 2: Validation and rules are split across three files, and the limits are duplicated.**
- `src/lib/availability.ts` L23 and L65-69: the 120-minute limit is a constant, but the message repeats "120" as literal text.
- `src/App.tsx` L188: "Max 120 minutes" is a third copy of the limit.
- `src/App.tsx` L49-52 and `src/components/Timeline.tsx` L75 repeat the `end > start` check that `availability.ts` L51 already performs.
- `src/App.tsx` L38, L50 and L198 repeat the null-parsing check.
- Impact: changing the limit or adding a filter rule requires edits in 3+ places, and they can drift apart.

**Risk 3: The status-to-style mapping is copied, and the status type is declared three times.**
- `src/App.tsx` L226-278 (`ResultBanner`): three near-identical banner blocks.
- `src/components/Timeline.tsx` L20-25: status-to-colour mapping, separate from the banner styles.
- The status union is written in `availability.ts` L8, `App.tsx` L221 and `Timeline.tsx` L7.
- Impact: adding a result state such as "partially available" touches every copy. The planned empty state will need a fourth variant.

**Additional risks worth tracking:**
- Booking keys use array indexes (`App.tsx` L142, `Timeline.tsx` L65). Once lists are filtered, React will reuse the wrong DOM nodes; use a stable booking id.
- The time-to-pixel formula is repeated at `Timeline.tsx` L45, L61-62 and L79-80.
- `Clock.tsx`: the `live` prop is never used, and the 1440 wrap and `pad` duplicate `formatHHMM`.
- `Booking` in `availability.ts` L3-6 is not `readonly`, so AC5 (immutable booking data) is not enforced by the types.
- Functional gap: the UI cannot enter 24:00 (`parseHHMM` rejects hour 24), but `checkAvailability` accepts `end` up to 1440. That branch is unreachable from the UI, and the rule is not documented.
- Project-rule conflict: indigo is used throughout (header badge, icons, booking chips, timeline). Project instructions forbid indigo/violet unless requested.

## 2. Prioritized improvement plan (one small step each)

1. **Lock down the data model.** Mark `Booking` `readonly` and freeze `DEFAULT_BOOKINGS`. This covers AC5 with no behavior change.
2. **Centralize constants.** Export `MAX_DURATION` and `DAY_MINUTES` from `availability.ts`, and use them in the UI text and Timeline. Keep the 24:00 decision explicit.
3. **Single validation entry point.** Move the "is this slot usable" logic (parse + order + range) into `availability.ts`. Remove the duplicate checks in `App.tsx` L49-52 and `Timeline.tsx` L75. Timeline should receive only a valid pending slot.
4. **Create a room catalog file.** Add `src/lib/rooms.ts` with `Room` (id, name, capacity, equipment, blocked, bookings). Keep `App.tsx` on a `selectedRoomId` and derive `blocked` and `bookings` from it. Each room's blocked state becomes independent.
5. **Pure filter functions.** Add `filterRooms` in `lib` for capacity (>=) and equipment (every selected item must be present). Keep the empty-state UI as a separate, small component.
6. **Unify status styling.** One `STATUS_STYLES` map used by `ResultBanner` and Timeline, and a single `ResultBanner` driven by that config.
7. **Stable keys and a pixel helper.** Use booking ids as keys and extract `minutesToPx` for Timeline.
8. **Clean up Clock.** Remove the unused `live` branch if it's not needed, and reuse `formatHHMM`.
9. **Palette change.** Replace indigo with an approved palette in a separate change so it stays reviewable.

## 3. Duplicated validation and rendering locations (baseline: 17)

**Validation and parsing (9):**
1. `availability.ts` `checkAvailability`, L33-63 (NaN, range, order, past-start checks)
2. `availability.ts` L23 and L69 (120 limit, constant plus literal message)
3. `App.tsx` `App`, L38, L50, L198 (null checks)
4. `App.tsx` `App`, L49-52 (end > start)
5. `Timeline.tsx` `Timeline`, L75 (end > start)
6. `App.tsx` L188 (literal "120 minutes" text)
7. `App.tsx` L173 (`formatHHMM(NOW)` in hint text, a second source of the start rule)
8. `Clock.tsx` L9-10 vs `availability.ts` `formatHHMM` L95-99 (padding logic)
9. `availability.ts` L24 vs `Timeline.tsx` L10-11 (day-end constants)

**Rendering (8):**
1. `App.tsx` `ResultBanner`, L226-278 (three banner blocks)
2. `Timeline.tsx` L20-25 (status-to-colour mapping, same concept as the banners)
3. `App.tsx` L139-149 vs `Timeline.tsx` L60-72 (booking list rendering)
4. `App.tsx` L146 vs `Timeline.tsx` L69 (booking range label "HH-HH")
5. `App.tsx` L85 vs `Timeline.tsx` L28 (card base classes)
6. `Timeline.tsx` L45, L61-62, L79-80 (time-to-pixel formula, three copies)
7. `Timeline.tsx` L66 vs L77 (booking and pending block positioning classes)
8. Status union type in `availability.ts` L8, `App.tsx` L221, `Timeline.tsx` L7

No test files existed in the project, so none of the above was covered by automated checks.

## 4. Human review of the analysis

- **Rejected:** step 9 (palette change). It is unrelated to AC1-AC6 and F1-F5.
- **Kept as documented limitation:** the 24:00 behavior.
- **Optional, not required:** step 8 (Clock cleanup).
- **Note on line references:** they refer to the code before any edits (the initial version). They were produced by the assistant and are used as pointers into that version; line numbers no longer match after the refactor.
