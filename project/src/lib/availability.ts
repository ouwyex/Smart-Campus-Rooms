export type Minutes = number;

export interface Booking {
  start: Minutes;
  end: Minutes;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'invalid';

export interface AvailabilityResult {
  status: AvailabilityStatus;
  message: string;
}

export interface AvailabilityInput {
  start: Minutes;
  end: Minutes;
  now: Minutes;
  blocked: boolean;
  bookings: Booking[];
}

const MAX_DURATION = 120;
const DAY_END = 1440;

function intervalsOverlap(a: Booking, b: Pick<Booking, 'start' | 'end'>): boolean {
  return a.start < b.end && b.start < a.end;
}

export function checkAvailability(input: AvailabilityInput): AvailabilityResult {
  const { start, end, now, blocked, bookings } = input;

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { status: 'invalid', message: 'Please enter valid times.' };
  }

  if (start < 0 || start >= DAY_END) {
    return {
      status: 'invalid',
      message: 'Start time must be between 00:00 and 23:59.',
    };
  }

  if (end <= 0 || end > DAY_END) {
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
      message: `Maximum duration is 120 minutes (you entered ${duration} minutes).`,
    };
  }

  if (blocked) {
    return {
      status: 'unavailable',
      message: 'This room is currently blocked and cannot be booked.',
    };
  }

  const request = { start, end };
  const conflict = bookings.find((b) => intervalsOverlap(b, request));
  if (conflict) {
    return {
      status: 'unavailable',
      message: `Overlaps with existing booking ${formatHHMM(conflict.start)}–${formatHHMM(conflict.end)}.`,
    };
  }

  return {
    status: 'available',
    message: 'This time slot is available.',
  };
}

export function formatHHMM(minutes: Minutes): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function parseHHMM(value: string): Minutes | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
