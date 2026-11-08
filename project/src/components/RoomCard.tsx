import { Building2, CalendarClock, Lock, Unlock } from 'lucide-react';
import { formatRange } from '@/lib/availability';
import type { Room } from '@/lib/rooms';
import { CARD_CLASS } from '@/components/uiClasses';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <section className={`${CARD_CLASS} mb-6 overflow-hidden`}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">{room.name}</div>
            <div className="text-sm text-slate-500">
              {[`Capacity ${room.capacity}`, ...room.equipment].join(' · ')}
            </div>
          </div>
        </div>

        <span
          className={`flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-sm font-medium sm:self-auto ${
            room.blocked
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          {room.blocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          {room.blocked ? 'Room blocked' : 'Room open'}
        </span>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <CalendarClock className="h-4 w-4" />
          Existing bookings today
        </div>
        {room.bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings recorded.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {room.bookings.map((b) => (
              <li
                key={b.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-100 px-2.5 py-1 text-sm font-medium text-indigo-700"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {formatRange(b.start, b.end)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
