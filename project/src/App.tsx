import { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Clock as ClockIcon,
  CalendarClock,
} from 'lucide-react';
import {
  checkAvailability,
  formatHHMM,
  parseHHMM,
  type AvailabilityInput,
  type Booking,
  type Minutes,
} from '@/lib/availability';
import Clock from '@/components/Clock';
import Timeline from '@/components/Timeline';

const NOW: Minutes = 540; // 09:00
const ROOM = 'Room A-204';
const DEFAULT_BOOKINGS: Booking[] = [{ start: 600, end: 660 }]; // 10:00–11:00

export default function App() {
  const [blocked, setBlocked] = useState(false);
  const [bookings] = useState<Booking[]>(DEFAULT_BOOKINGS);

  const [startRaw, setStartRaw] = useState('11:00');
  const [endRaw, setEndRaw] = useState('12:00');

  const startMin = parseHHMM(startRaw);
  const endMin = parseHHMM(endRaw);

  const result = useMemo(() => {
    if (startMin === null || endMin === null) return null;
    const input: AvailabilityInput = {
      start: startMin,
      end: endMin,
      now: NOW,
      blocked,
      bookings,
    };
    return checkAvailability(input);
  }, [startMin, endMin, blocked, bookings]);

  const pendingSlot =
    startMin !== null && endMin !== null && endMin > startMin
      ? { start: startMin, end: endMin }
      : null;

  const cardBase =
    'rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
              <Building2 className="h-3.5 w-3.5" />
              Smart Campus
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Room Availability Checker
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Check whether a time slot is free. No booking is created.
            </p>
          </div>
          <div className="hidden shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm sm:block">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Current time
            </div>
            <div className="text-2xl font-bold text-slate-900">
              <Clock minutes={NOW} />
            </div>
          </div>
        </header>

        {/* Room card */}
        <section className={`${cardBase} mb-6 overflow-hidden`}>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">{ROOM}</div>
                <div className="text-sm text-slate-500">
                  Capacity 30 · Lecture block, 2nd floor
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBlocked((b) => !b)}
              role="switch"
              aria-checked={blocked}
              className={`group flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-sm font-medium transition-colors sm:self-auto ${
                blocked
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {blocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              {blocked ? 'Room blocked' : 'Room open'}
              <span
                className={`ml-1 inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                  blocked ? 'bg-rose-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    blocked ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Existing bookings */}
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <CalendarClock className="h-4 w-4" />
              Existing bookings today
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings recorded.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {bookings.map((b, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-100 px-2.5 py-1 text-sm font-medium text-indigo-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {formatHHMM(b.start)}–{formatHHMM(b.end)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Input + result */}
        <section className={`${cardBase} mb-6 p-5`}>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            <ClockIcon className="h-5 w-5 text-indigo-600" />
            Check a time slot
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">
                Start time
              </span>
              <input
                type="time"
                value={startRaw}
                onChange={(e) => setStartRaw(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <span className="mt-1 block text-xs text-slate-400">
                Must be after {formatHHMM(NOW)}
              </span>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">
                End time
              </span>
              <input
                type="time"
                value={endRaw}
                onChange={(e) => setEndRaw(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <span className="mt-1 block text-xs text-slate-400">
                Max 120 minutes after start
              </span>
            </label>
          </div>

          {/* Result */}
          <div className="mt-5">
            <ResultBanner
              status={result?.status}
              message={result?.message ?? ''}
              invalid={startMin === null || endMin === null}
            />
          </div>
        </section>

        {/* Timeline */}
        <Timeline
          now={NOW}
          bookings={bookings}
          pending={pendingSlot}
          pendingStatus={result?.status}
        />

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional data for demonstration. This tool checks availability only —
          it does not create, save, or confirm any booking.
        </footer>
      </div>
    </div>
  );
}

interface ResultBannerProps {
  status?: 'available' | 'unavailable' | 'invalid';
  message: string;
  invalid: boolean;
}

function ResultBanner({ status, message, invalid }: ResultBannerProps) {
  if (invalid || !status) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <span>Enter both times in HH:MM format to check availability.</span>
      </div>
    );
  }

  if (status === 'available') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold">Available</div>
          <div className="text-emerald-700">{message}</div>
        </div>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
      >
        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold">Unavailable</div>
          <div className="text-rose-700">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <div className="font-semibold">Couldn't check this slot</div>
        <div className="text-amber-700">{message}</div>
      </div>
    </div>
  );
}
