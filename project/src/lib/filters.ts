import type { Room } from '@/lib/rooms';

export interface RoomFilter {
  attendees: number;
  equipment: readonly string[];
}

export function filterRooms(rooms: readonly Room[], filter: RoomFilter): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= filter.attendees &&
      filter.equipment.every((item) => room.equipment.includes(item)),
  );
}

export function listEquipment(rooms: readonly Room[]): string[] {
  return [...new Set(rooms.flatMap((room) => room.equipment))].sort();
}

export function parseAttendees(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const count = Number(trimmed);
  return count >= 1 ? count : null;
}
