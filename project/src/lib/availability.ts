export type Minutes = number;

export interface Booking {
  readonly id: string;
  readonly start: Minutes;
  readonly end: Minutes;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'invalid' | 'incomplete';

export interface Slot {
  readonly start: Minutes;
  readonly end: Minutes;
}

export interface SlotInput {
  startRaw: string;
  endRaw: string;
  now: Minutes;
  blocked: boolean;
  bookings: readonly Booking[];
}

export interface SlotCheck {
  status: AvailabilityStatus;
  message: string;
  slot: Slot | null;
}

export const MAX_DURATION = 120;
export const DAY_MINUTES = 1440;

function intervalsOverlap(a: Slot, b: Slot): boolean {
  return a.start < b.end && b.start < a.end;
}

function evaluate(
  request: Slot,
  input: Pick<SlotInput, 'now' | 'blocked' | 'bookings'>,
): Pick<SlotCheck, 'status' | 'message'> {
  const { start, end } = request;
  const { now, blocked, bookings } = input;

  if (start < 0 || start >= DAY_MINUTES) {
    return {
      status: 'invalid',
      message: 'Start time must be between 00:00 and 23:59.',
    };
  }

  if (end <= 0 || end > DAY_MINUTES) {
    return {
      status: 'invalid',
      message: 'End time must be after 00:00 and up to 24:00.',
    };
  }

  if (end <= start) {
    return {
      status: 'invalid',
      message: 'End must be after start.',
    };
  }

  if (start <= now) {
    return {
      status: 'invalid',
      message: `Start must be strictly after the current time (${formatHHMM(now)}).`,
    };
  }

  const duration = end - start;
  if (duration > MAX_DURATION) {
    return {
      status: 'invalid',
      message: `Maximum duration is ${MAX_DURATION} minutes (you entered ${duration} minutes).`,
    };
  }

  if (blocked) {
    return {
      status: 'unavailable',
      message: 'This room is currently blocked and cannot be booked.',
    };
  }

  const conflict = bookings.find((b) => intervalsOverlap(b, request));
  if (conflict) {
    return {
      status: 'unavailable',
      message: `Overlaps with existing booking ${formatRange(conflict.start, conflict.end)}.`,
    };
  }

  return {
    status: 'available',
    message: 'This time slot is available.',
  };
}

export function checkSlot(input: SlotInput): SlotCheck {
  const start = parseHHMM(input.startRaw);
  const end = parseHHMM(input.endRaw);

  if (start === null || end === null) {
    return {
      status: 'incomplete',
      message: 'Enter both times in HH:MM format to check availability.',
      slot: null,
    };
  }

  const slot = end > start ? { start, end } : null;
  return { ...evaluate({ start, end }, input), slot };
}

export function formatHHMM(minutes: Minutes): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatRange(start: Minutes, end: Minutes): string {
  return `${formatHHMM(start)}–${formatHHMM(end)}`;
}

function parseHHMM(value: string): Minutes | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
