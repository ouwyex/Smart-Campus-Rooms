import type { AvailabilityStatus } from '@/lib/availability';
import { STATUS_STYLES } from '@/components/statusStyles';

interface ResultBannerProps {
  status: AvailabilityStatus;
  message: string;
}

export default function ResultBanner({ status, message }: ResultBannerProps) {
  const style = STATUS_STYLES[status];
  const Icon = style.icon;
  const frame = `flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${style.container}`;

  if (!style.title) {
    return (
      <div className={frame}>
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div role={style.role} className={frame}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <div className="font-semibold">{style.title}</div>
        <div className={style.detail}>{message}</div>
      </div>
    </div>
  );
}
