import { useEffect, useState } from 'react';
import { DAY_MINUTES, formatHHMM } from '@/lib/availability';

interface ClockProps {
  minutes: number;
  /** Optional live-ticking mode; when false shows the fixed minute value. */
  live?: boolean;
}

export default function Clock({ minutes, live = false }: ClockProps) {
  const [now, setNow] = useState(minutes);

  useEffect(() => {
    if (!live) {
      setNow(minutes);
      return;
    }
    const id = setInterval(() => {
      setNow((prev) => (prev + 1) % DAY_MINUTES);
    }, 1000);
    return () => clearInterval(id);
  }, [live, minutes]);

  return <span className="font-mono tabular-nums">{formatHHMM(now)}</span>;
}

