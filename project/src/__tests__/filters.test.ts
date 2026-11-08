import { describe, expect, it } from 'vitest';
import { checkSlot } from '@/lib/availability';
import { filterRooms, listEquipment, parseAttendees } from '@/lib/filters';
import { ROOMS } from '@/lib/rooms';

function roomById(id: string) {
  const room = ROOMS.find((r) => r.id === id);
  if (!room) throw new Error(`missing room ${id}`);
  return room;
}

describe('F1: capacity', () => {
  const a204 = roomById('a-204'); // capacity 20

  it('passes when capacity equals the attendee count', () => {
    const ids = filterRooms(ROOMS, { attendees: a204.capacity, equipment: [] }).map((r) => r.id);
    expect(ids).toContain(a204.id);
  });

  it('fails when attendees are one above capacity', () => {
    const ids = filterRooms(ROOMS, { attendees: a204.capacity + 1, equipment: [] }).map(
      (r) => r.id,
    );
    expect(ids).not.toContain(a204.id);
  });
});

describe('F2: equipment', () => {
  const a204 = roomById('a-204'); // projector, whiteboard

  it('passes when the room has all selected equipment', () => {
    const ids = filterRooms(ROOMS, {
      attendees: 1,
      equipment: ['projector', 'whiteboard'],
    }).map((r) => r.id);
    expect(ids).toContain(a204.id);
  });

  it('fails when the room is missing one selected item', () => {
    const ids = filterRooms(ROOMS, {
      attendees: 1,
      equipment: ['projector', 'computers'],
    }).map((r) => r.id);
    expect(ids).not.toContain(a204.id);
  });
});

describe('F3: blocked room is never available', () => {
  it('keeps a blocked room in the matching list but reports it unavailable', () => {
    const blocked = roomById('c-310');
    const matches = filterRooms(ROOMS, { attendees: 30, equipment: ['projector'] });
    expect(matches.map((r) => r.id)).toContain(blocked.id);

    const result = checkSlot({
      startRaw: '13:00',
      endRaw: '14:00',
      now: 480,
      blocked: blocked.blocked,
      bookings: blocked.bookings,
    });
    expect(result.status).toBe('unavailable');
  });
});

describe('F4: no matches', () => {
  it('returns an empty list when filters match nothing', () => {
    expect(filterRooms(ROOMS, { attendees: 500, equipment: [] })).toEqual([]);
    expect(
      filterRooms(ROOMS, { attendees: 1, equipment: ['computers', 'video-conference'] }),
    ).toEqual([]);
  });
});

describe('filter helpers', () => {
  it('lists each equipment item once, sorted', () => {
    const items = listEquipment(ROOMS);
    expect(new Set(items).size).toBe(items.length);
    expect(items).toEqual([...items].sort());
  });

  it('parses attendee input, rejecting empty, zero and non-numeric values', () => {
    expect(parseAttendees('12')).toBe(12);
    expect(parseAttendees(' 3 ')).toBe(3);
    expect(parseAttendees('')).toBeNull();
    expect(parseAttendees('0')).toBeNull();
    expect(parseAttendees('-2')).toBeNull();
    expect(parseAttendees('2.5')).toBeNull();
  });
});
