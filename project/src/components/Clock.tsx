import { useEffect, useState } from 'react';

interface ClockProps {
  minutes: number;
  /** Optional live-ticking mode; when false shows the fixed minute value. */
  live?: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function Clock({ minutes, live = false }: ClockProps) {
  const [now, setNow] = useState(minutes);

  useEffect(() => {
    if (!live) {
      setNow(minutes);
      return;
    }
    const id = setInterval(() => {
      setNow((prev) => (prev + 1) % 1440);
    }, 1000);
    return () => clearInterval(id);
  }, [live, minutes]);

  const h = Math.floor(now / 60);
  const m = now % 60;

  return (
    <span className="font-mono tabular-nums">
      {pad(h)}:{pad(m)}
    </span>
  );
}
