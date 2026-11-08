import { useMemo, useState } from 'react';
import { checkSlot, type Minutes } from '@/lib/availability';
import { filterRooms, listEquipment, parseAttendees } from '@/lib/filters';
import { ROOMS } from '@/lib/rooms';
import AppHeader from '@/components/AppHeader';
import EmptyState from '@/components/EmptyState';
import RequirementsFilter from '@/components/RequirementsFilter';
import RoomCard from '@/components/RoomCard';
import RoomSelector from '@/components/RoomSelector';
import SlotChecker from '@/components/SlotChecker';
import Timeline from '@/components/Timeline';

const NOW: Minutes = 540; // 09:00
const DEFAULT_ATTENDEES = '1';
const EQUIPMENT_OPTIONS = listEquipment(ROOMS);

export default function App() {
  const [attendeesRaw, setAttendeesRaw] = useState(DEFAULT_ATTENDEES);
  const [equipment, setEquipment] = useState<readonly string[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [startRaw, setStartRaw] = useState('11:00');
  const [endRaw, setEndRaw] = useState('12:00');

  const attendees = parseAttendees(attendeesRaw);
  const matchingRooms = useMemo(
    () => filterRooms(ROOMS, { attendees: attendees ?? 0, equipment }),
    [attendees, equipment],
  );
  // The selection is only a preference: if it no longer matches, the first matching room is shown.
  const room = matchingRooms.find((r) => r.id === selectedRoomId) ?? matchingRooms[0] ?? null;

  // Derived from the current room and times on every render, so it can never show another room's result.
  const result = useMemo(
    () =>
      room &&
      checkSlot({ startRaw, endRaw, now: NOW, blocked: room.blocked, bookings: room.bookings }),
    [startRaw, endRaw, room],
  );

  const canClear = attendeesRaw !== DEFAULT_ATTENDEES || equipment.length > 0;

  const clearFilters = () => {
    setAttendeesRaw(DEFAULT_ATTENDEES);
    setEquipment([]);
  };

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <AppHeader now={NOW} />

        <RequirementsFilter
          attendeesRaw={attendeesRaw}
          attendeesValid={attendees !== null}
          onAttendeesChange={setAttendeesRaw}
          equipmentOptions={EQUIPMENT_OPTIONS}
          selectedEquipment={equipment}
          onToggleEquipment={toggleEquipment}
          canClear={canClear}
          onClear={clearFilters}
        />

        {room ? (
          <>
            <RoomSelector
              rooms={matchingRooms}
              value={room.id}
              onChange={setSelectedRoomId}
            />
            <RoomCard room={room} />
          </>
        ) : (
          <EmptyState
            title="No rooms match these filters"
            message="Try fewer attendees or fewer equipment requirements to see available rooms."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        )}

        <SlotChecker
          now={NOW}
          startRaw={startRaw}
          endRaw={endRaw}
          disabled={room === null}
          onStartChange={setStartRaw}
          onEndChange={setEndRaw}
          result={result}
        />

        {room && result && (
          <Timeline
            now={NOW}
            bookings={room.bookings}
            pending={result.slot}
            pendingStatus={result.status}
          />
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional data for demonstration. This tool checks availability only —
          it does not create, save, or confirm any booking.
        </footer>
      </div>
    </div>
  );
}
