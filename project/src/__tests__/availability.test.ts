import { describe, expect, it } from 'vitest';
import { checkSlot, type Booking, type SlotInput } from '@/lib/availability';
import { ROOMS } from '@/lib/rooms';

const NOW = 480; // 08:00
const BOOKING: Booking = { id: 'test-1', start: 600, end: 660 }; // 10:00–11:00

function input(overrides: Partial<SlotInput>): SlotInput {
  return {
    startRaw: '09:00',
    endRaw: '10:00',
    now: NOW,
    blocked: false,
    bookings: [],
    ...overrides,
  };
}

describe('AC1: valid times', () => {
  it('rejects an end time before the start time', () => {
    const result = checkSlot(input({ startRaw: '11:00', endRaw: '10:00' }));
    expect(result.status).toBe('invalid');
    expect(result.message).toBe('End must be after start.');
    expect(result.slot).toBeNull();
  });

  it('rejects an empty or unparsable time as incomplete', () => {
    expect(checkSlot(input({ startRaw: '' })).status).toBe('incomplete');
    expect(checkSlot(input({ endRaw: 'abc' })).status).toBe('incomplete');
    expect(checkSlot(input({ endRaw: '25:00' })).status).toBe('incomplete');
  });
});

describe('AC2: maximum duration of 120 minutes', () => {
  it('accepts exactly 120 minutes', () => {
    const result = checkSlot(input({ startRaw: '13:00', endRaw: '15:00' }));
    expect(result.status).toBe('available');
  });

  it('rejects 121 minutes', () => {
    const result = checkSlot(input({ startRaw: '13:00', endRaw: '15:01' }));
    expect(result.status).toBe('invalid');
    expect(result.message).toContain('Maximum duration is 120 minutes');
  });
});

describe('AC3: blocked room', () => {
  it('never reports a blocked room as available', () => {
    const result = checkSlot(input({ startRaw: '13:00', endRaw: '14:00', blocked: true }));
    expect(result.status).toBe('unavailable');
    expect(result.status).not.toBe('available');
  });
});

describe('AC4: overlap rules', () => {
  it('rejects an interval that overlaps an existing booking', () => {
    const result = checkSlot(
      input({ startRaw: '10:30', endRaw: '11:30', bookings: [BOOKING] }),
    );
    expect(result.status).toBe('unavailable');
  });

  it('accepts an interval that ends exactly when a booking starts', () => {
    const result = checkSlot(
      input({ startRaw: '09:30', endRaw: '10:00', bookings: [BOOKING] }),
    );
    expect(result.status).toBe('available');
  });

  it('accepts an interval that starts exactly when a booking ends', () => {
    const result = checkSlot(
      input({ startRaw: '11:00', endRaw: '12:00', bookings: [BOOKING] }),
    );
    expect(result.status).toBe('available');
  });
});

describe('AC5: immutable booking data', () => {
  const room = ROOMS[0];

  it('leaves bookings unchanged after a check', () => {
    const before = JSON.stringify(room.bookings);
    checkSlot(input({ startRaw: '10:30', endRaw: '11:30', bookings: room.bookings }));
    expect(JSON.stringify(room.bookings)).toBe(before);
  });

  it('rejects attempts to mutate the frozen booking data', () => {
    const booking = room.bookings[0] as { start: number };
    expect(Object.isFrozen(room.bookings)).toBe(true);
    expect(() => {
      booking.start = 0;
    }).toThrow(TypeError);
    expect(room.bookings[0].start).toBe(600);
  });
});

describe('F5: availability uses only the selected room bookings', () => {
  const roomA = ROOMS.find((r) => r.id === 'a-204')!;
  const roomB = ROOMS.find((r) => r.id === 'b-101')!;
  const slot = { startRaw: '13:00', endRaw: '14:00' };

  it('ignores another room bookings for the same time slot', () => {
    expect(roomB.bookings.length).toBeGreaterThan(0);
    const resultA = checkSlot(input({ ...slot, bookings: roomA.bookings }));
    expect(resultA.status).toBe('available');
  });

  it('uses the bookings of the room it is given', () => {
    const resultB = checkSlot(input({ ...slot, bookings: roomB.bookings }));
    expect(resultB.status).toBe('unavailable');
  });
});
