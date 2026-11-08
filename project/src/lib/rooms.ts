import type { Booking } from '@/lib/availability';

export interface Room {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly equipment: readonly string[];
  readonly blocked: boolean;
  readonly bookings: readonly Booking[];
}

function freezeRoom(room: Room): Room {
  return Object.freeze({
    ...room,
    equipment: Object.freeze([...room.equipment]),
    bookings: Object.freeze(room.bookings.map((b) => Object.freeze({ ...b }))),
  });
}

export const ROOMS: readonly Room[] = Object.freeze(
  [
    {
      id: 'a-204',
      name: 'Room A-204',
      capacity: 20,
      equipment: ['projector', 'whiteboard'],
      blocked: false,
      bookings: [{ id: 'bk-a204-1', start: 600, end: 660 }], // 10:00–11:00
    },
    {
      id: 'b-101',
      name: 'Seminar B-101',
      capacity: 8,
      equipment: ['whiteboard', 'video-conference'],
      blocked: false,
      bookings: [{ id: 'bk-b101-1', start: 780, end: 870 }], // 13:00–14:30
    },
    {
      id: 'c-310',
      name: 'Lecture Hall C-310',
      capacity: 60,
      equipment: ['projector', 'video-conference'],
      blocked: true,
      bookings: [],
    },
    {
      id: 'd-112',
      name: 'Computer Lab D-112',
      capacity: 40,
      equipment: ['computers', 'projector'],
      blocked: false,
      bookings: [
        { id: 'bk-d112-1', start: 660, end: 750 }, // 11:00–12:30
        { id: 'bk-d112-2', start: 900, end: 960 }, // 15:00–16:00
      ],
    },
  ].map(freezeRoom),
);
