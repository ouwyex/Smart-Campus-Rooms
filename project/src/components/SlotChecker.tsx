import { Clock as ClockIcon } from 'lucide-react';
import { formatHHMM, MAX_DURATION, type Minutes, type SlotCheck } from '@/lib/availability';
import ResultBanner from '@/components/ResultBanner';
import { CARD_CLASS, INPUT_CLASS } from '@/components/uiClasses';

interface SlotCheckerProps {
  now: Minutes;
  startRaw: string;
  endRaw: string;
  disabled: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  result: SlotCheck | null;
}

export default function SlotChecker({
  now,
  startRaw,
  endRaw,
  disabled,
  onStartChange,
  onEndChange,
  result,
}: SlotCheckerProps) {
  return (
    <section className={`${CARD_CLASS} mb-6 p-5`}>
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
        <ClockIcon className="h-5 w-5 text-indigo-600" />
        Check a time slot
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Start time</span>
          <input
            type="time"
            value={startRaw}
            disabled={disabled}
            onChange={(e) => onStartChange(e.target.value)}
            className={INPUT_CLASS}
          />
          <span className="mt-1 block text-xs text-slate-400">
            Must be after {formatHHMM(now)}
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">End time</span>
          <input
            type="time"
            value={endRaw}
            disabled={disabled}
            onChange={(e) => onEndChange(e.target.value)}
            className={INPUT_CLASS}
          />
          <span className="mt-1 block text-xs text-slate-400">
            Max {MAX_DURATION} minutes after start
          </span>
        </label>
      </div>

      <div className="mt-5">
        {result ? (
          <ResultBanner status={result.status} message={result.message} />
        ) : (
          <p className="text-sm text-slate-500">
            Choose a room that matches your filters to check a time slot.
          </p>
        )}
      </div>
    </section>
  );
}
