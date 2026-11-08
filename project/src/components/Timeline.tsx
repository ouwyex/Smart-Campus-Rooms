import { formatHHMM, type Booking, type Minutes } from '@/lib/availability';

interface TimelineProps {
  now: Minutes;
  bookings: Booking[];
  pending?: { start: Minutes; end: Minutes } | null;
  pendingStatus?: 'available' | 'unavailable' | 'invalid';
}

const DAY_START = 0;
const DAY_END = 1440;
const HOUR_HEIGHT = 56; // px per hour

export default function Timeline({ now, bookings, pending, pendingStatus }: TimelineProps) {
  const hours: number[] = [];
  for (let h = 0; h <= 24; h++) hours.push(h * 60);

  const nowPct = ((now - DAY_START) / (DAY_END - DAY_START)) * 100;

  const pendingColor =
    pendingStatus === 'available'
      ? 'bg-emerald-400/70 ring-emerald-300'
      : pendingStatus === 'unavailable'
        ? 'bg-rose-400/70 ring-rose-300'
        : 'bg-amber-400/70 ring-amber-300';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Today's timeline</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${pendingColor}`} /> Your slot
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <div style={{ height: 24 * HOUR_HEIGHT }} className="relative">
          {/* hour grid lines */}
          {hours.map((m) => {
            const top = ((m - DAY_START) / (DAY_END - DAY_START)) * 24 * HOUR_HEIGHT;
            return (
              <div
                key={m}
                className="absolute left-0 right-0 border-t border-slate-200/70"
                style={{ top }}
              >
                <span className="absolute left-1 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                  {formatHHMM(m)}
                </span>
              </div>
            );
          })}

          {/* existing bookings */}
          {bookings.map((b, i) => {
            const top = ((b.start - DAY_START) / (DAY_END - DAY_START)) * 24 * HOUR_HEIGHT;
            const height = ((b.end - b.start) / (DAY_END - DAY_START)) * 24 * HOUR_HEIGHT;
            return (
              <div
                key={i}
                className="absolute left-10 right-3 rounded-md bg-indigo-500/85 px-2 py-1 text-[10px] font-medium text-white shadow-sm"
                style={{ top, height }}
              >
                {formatHHMM(b.start)}–{formatHHMM(b.end)}
              </div>
            );
          })}

          {/* pending slot */}
          {pending && pending.end > pending.start && (
            <div
              className={`absolute left-10 right-3 rounded-md ring-2 ${pendingColor}`}
              style={{
                top: ((pending.start - DAY_START) / (DAY_END - DAY_START)) * 24 * HOUR_HEIGHT,
                height: ((pending.end - pending.start) / (DAY_END - DAY_START)) * 24 * HOUR_HEIGHT,
              }}
            />
          )}

          {/* now line */}
          <div
            className="absolute left-0 right-0 z-10 flex items-center"
            style={{ top: `${nowPct}%` }}
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
