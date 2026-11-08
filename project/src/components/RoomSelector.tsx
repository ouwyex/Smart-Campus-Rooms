import type { Room } from '@/lib/rooms';
import { INPUT_CLASS } from '@/components/uiClasses';

interface RoomSelectorProps {
  rooms: readonly Room[];
  value: string;
  onChange: (roomId: string) => void;
}

export default function RoomSelector({ rooms, value, onChange }: RoomSelectorProps) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-medium text-slate-600">Room</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLASS} sm:max-w-sm`}
      >
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </label>
  );
}
