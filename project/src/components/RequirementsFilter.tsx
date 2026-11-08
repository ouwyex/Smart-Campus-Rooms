import { Filter, Users } from 'lucide-react';
import { CARD_CLASS, INPUT_CLASS } from '@/components/uiClasses';

interface RequirementsFilterProps {
  attendeesRaw: string;
  attendeesValid: boolean;
  onAttendeesChange: (value: string) => void;
  equipmentOptions: readonly string[];
  selectedEquipment: readonly string[];
  onToggleEquipment: (item: string) => void;
  canClear: boolean;
  onClear: () => void;
}

export default function RequirementsFilter({
  attendeesRaw,
  attendeesValid,
  onAttendeesChange,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
  canClear,
  onClear,
}: RequirementsFilterProps) {
  return (
    <section className={`${CARD_CLASS} mb-6 border-slate-200 p-5`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <Filter className="h-5 w-5 text-indigo-600" />
          Find a room
        </h2>
        {canClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[12rem_1fr]">
        <label className="block">
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Users className="h-4 w-4" />
            Attendees
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={attendeesRaw}
            onChange={(e) => onAttendeesChange(e.target.value)}
            aria-invalid={!attendeesValid}
            className={`${INPUT_CLASS} aria-[invalid=true]:border-rose-400`}
          />
          {!attendeesValid && (
            <span className="mt-1 block text-xs text-rose-600">Enter at least 1 attendee.</span>
          )}
        </label>

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-slate-600">Equipment needed</legend>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((item) => {
              const checked = selectedEquipment.includes(item);
              return (
                <label
                  key={item}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    checked
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleEquipment(item)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                  />
                  <span className="capitalize">{item.replace(/-/g, ' ')}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
