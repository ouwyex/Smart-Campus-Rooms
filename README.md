# Smart Campus Room Availability Checker
 
Software Engineering, Assignment #04: AI-assisted software evolution, refactoring and quality improvement.
 
**Author:** <Surname Name>
**AI assistant used:** bolt.new (model: <model shown in the interface>)
**Repository:** <GitHub link, optional>
**Commits:** initial `<hash>`, final `<hash>` (or: the initial version is described in `docs/01-codebase-analysis.md`)
 
## What it does
 
A small prototype that checks whether a fictional campus room is free for a requested time slot. It uses fictional data only. There is no login, payment, live API or database.
 
The original prototype handled a single room. This version adds:
 
- A catalog of 4 fictional rooms. Each has an ID, name, capacity, equipment list, blocked status and its own bookings.
- Filtering by number of attendees and required equipment.
- A room selector that lists only rooms matching the requirements.
- An empty state when no room matches.
- A refreshed or cleared availability result when the selected room changes.
The "current time" is fixed in the code (`NOW = 09:00`) so results are reproducible.
 
## Requirements covered
 
**Original acceptance criteria (preserved)**
 
| ID | Rule |
|---|---|
| AC1 | Valid time: end must be after start; invalid or empty input is rejected |
| AC2 | Maximum booking length is 120 minutes (120 accepted, 121 rejected) |
| AC3 | A blocked room is never reported as available |
| AC4 | Overlapping intervals conflict; touching intervals do not |
| AC5 | Booking data is immutable |
| AC6 | Clear, responsive feedback on mobile and desktop |
 
**New filtering rules**
 
| ID | Rule |
|---|---|
| F1 | Room capacity must be greater than or equal to the requested attendees |
| F2 | Room must contain ALL selected equipment items |
| F3 | A blocked room cannot be reported as available |
| F4 | A clear empty state is shown when no rooms match |
| F5 | Changing the selected room refreshes the availability result |
 
## Tech stack
 
React, TypeScript, Vite, Tailwind CSS, lucide-react. Tests use Vitest, React Testing Library and jsdom.
 
## Setup, run and test
 
Requires Node.js 18 or newer.
 
```bash
npm install        # install dependencies
npm run dev        # start the dev server (Vite prints the local URL)
npm run build      # type-check and production build
npm test           # run all automated tests once (vitest run)
```
 
## Project structure
 
Check this against your final file tree before submitting.
 
```
src/
  App.tsx                 state and wiring only
  main.tsx                entry point
  lib/
    availability.ts       time parsing, validation, overlap rules, checkAvailability
    rooms.ts              fictional room catalog (frozen data)
    filters.ts            pure filterRooms function (F1, F2)
  components/
    AppHeader, RoomSelector, RoomCard, RequirementsFilter,
    SlotChecker, ResultBanner, EmptyState, Timeline, Clock
    statusStyles.ts       single status-to-style map
    uiClasses.ts          shared class constants
  __tests__/
    availability.test.ts  AC1-AC5 and per-room booking rules (12 tests)
    filters.test.ts       F1-F4 (8 tests)
    App.test.tsx          UI integration tests (2 tests)
docs/
  01-codebase-analysis.md maintainability risks, plan, duplication list
  architecture.md         before/after diagrams and design decisions
ai-evidence/              AI use record and prompts
screenshots/              demonstration screenshots
tests/RESULTS.md          recorded test command and output
REPORT.md                 quality comparison and AI reflection
```
 
## Test results
 
`npm test` ran 22 tests in 3 files. All 22 passed. The full output is in `tests/RESULTS.md`.
 
## Known limitations
 
- Rooms and bookings are hard-coded fictional data.
- The UI cannot enter 24:00 as an end time, although `checkAvailability` accepts values up to 1440 minutes.
- UI tests run in jsdom, not in a real browser.
- `npm audit` reports 25 vulnerabilities in development dependencies. They were not addressed.
