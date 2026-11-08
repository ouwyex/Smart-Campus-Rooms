import { Building2 } from 'lucide-react';
import type { Minutes } from '@/lib/availability';
import Clock from '@/components/Clock';

interface AppHeaderProps {
  now: Minutes;
}

export default function AppHeader({ now }: AppHeaderProps) {
  return (
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
          <Clock minutes={now} />
        </div>
      </div>
    </header>
  );
}
