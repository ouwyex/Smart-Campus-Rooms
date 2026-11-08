# Test Results

**Project:** Smart Campus Room Availability Checker (final version)
**Date:** 2026-11-08
**Environment:** bolt.new (WebContainer), Node, Vitest 2.1.9, React Testing Library, jsdom
**Command:** `npm test` (runs `vitest run`)

## Summary

| Metric | Value |
|---|---|
| Test files | 3 passed / 3 total |
| Tests | 22 passed / 22 total |
| Failed | 0 |

## Full output

```
> vite-react-typescript-starter@0.0.0 test
> vitest run

 RUN  v2.1.9 /home/project

 ✓ src/__tests__/availability.test.ts (12 tests) 4ms
 ✓ src/__tests__/filters.test.ts (8 tests) 4ms
 ✓ src/__tests__/App.test.tsx (2 tests) 125ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Start at  18:04:21
   Duration  2.37s
```

## Coverage of requirements

| Requirement | Test file | What is checked |
|---|---|---|
| AC1 valid time | availability.test.ts | end before start rejected; invalid/empty time rejected |
| AC2 max 120 min | availability.test.ts | exactly 120 accepted, 121 rejected |
| AC3 blocked room | availability.test.ts | blocked room never available |
| AC4 overlap | availability.test.ts | overlap rejected; touching intervals accepted |
| AC5 immutability | availability.test.ts | bookings unchanged after a check |
| F1 capacity | filters.test.ts | capacity == attendees passes, one below fails |
| F2 equipment | filters.test.ts | all selected items required |
| F3 blocked | filters.test.ts | blocked room excluded/unavailable |
| F4 empty state | filters.test.ts, App.test.tsx | empty list; empty-state UI shown |
| F5 room switch | availability.test.ts, App.test.tsx | other room's bookings not used; result refreshed/cleared |
| Integration/UI | App.test.tsx | 2 tests rendering the full App |

## Notes

- Baseline (initial version): 0 tests existed.
- I re-ran `npm test` myself on 2026-11-08 and got the same result.
- `npm audit` reported 25 vulnerabilities in dev dependencies; not addressed (out of scope).
