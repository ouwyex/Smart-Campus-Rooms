import {
  DAY_MINUTES,
  formatHHMM,
  formatRange,
  type AvailabilityStatus,
  type Booking,
  type Minutes,
  type Slot,
} from '@/lib/availability';
import { STATUS_STYLES } from '@/components/statusStyles';

interface TimelineProps {
  now: Minutes;
  bookings: readonly Booking[];
  pending: Slot | null;
  pendingStatus: AvailabilityStatus;
}

const HOUR_HEIGHT = 56; // px per hour
const TIMELINE_HEIGHT = 24 * HOUR_HEIGHT;
const HOUR_MARKS = Array.from({ length: 25 }, (_, h) => h * 60);

function minutesToPx(minutes: Minutes): number {
  return (minutes / DAY_MINUTES) * TIMELINE_HEIGHT;
}

export default function Timeline({ now, bookings, pending, pendingStatus }: TimelineProps) {
  const swatch = STATUS_STYLES[pendingStatus].swatch;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Today's timeline</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${swatch}`} /> Your slot
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <div style={{ height: TIMELINE_HEIGHT }} className="relative">
          {HOUR_MARKS.map((m) => (
            <div
              key={m}
              className="absolute left-0 right-0 border-t border-slate-200/70"
              style={{ top: minutesToPx(m) }}
            >
              <span className="absolute left-1 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                {formatHHMM(m)}
              </span>
            </div>
          ))}

          {bookings.map((b) => (
            <div
              key={b.id}
              className="absolute left-10 right-3 rounded-md bg-indigo-500/85 px-2 py-1 text-[10px] font-medium text-white shadow-sm"
              style={{ top: minutesToPx(b.start), height: minutesToPx(b.end - b.start) }}
            >
              {formatRange(b.start, b.end)}
            </div>
          ))}

          {pending && (
            <div
              className={`absolute left-10 right-3 rounded-md ring-2 ${swatch}`}
              style={{
                top: minutesToPx(pending.start),
                height: minutesToPx(pending.end - pending.start),
              }}
            />
          )}

          <div
            className="absolute left-0 right-0 z-10 flex items-center"
            style={{ top: minutesToPx(now) }}
          >
            <div className="h-2 w-2 -ml-1 rounded-full bg-rose-500 shadow" />
            <div className="h-px flex-1 bg-rose-500" />
            <span className="mr-1 rounded bg-rose-500 px-1 text-[9px] font-semibold text-white">
              NOW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
