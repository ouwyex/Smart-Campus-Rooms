import { AlertTriangle, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import type { AvailabilityStatus } from '@/lib/availability';

interface StatusStyle {
  icon: LucideIcon;
  title?: string;
  role?: 'status' | 'alert';
  container: string;
  detail: string;
  swatch: string;
}

export const STATUS_STYLES: Record<AvailabilityStatus, StatusStyle> = {
  available: {
    icon: CheckCircle2,
    title: 'Available',
    role: 'status',
    container: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    detail: 'text-emerald-700',
    swatch: 'bg-emerald-400/70 ring-emerald-300',
  },
  unavailable: {
    icon: XCircle,
    title: 'Unavailable',
    role: 'status',
    container: 'border-rose-200 bg-rose-50 text-rose-800',
    detail: 'text-rose-700',
    swatch: 'bg-rose-400/70 ring-rose-300',
  },
  invalid: {
    icon: AlertTriangle,
    title: "Couldn't check this slot",
    role: 'alert',
    container: 'border-amber-200 bg-amber-50 text-amber-800',
    detail: 'text-amber-700',
    swatch: 'bg-amber-400/70 ring-amber-300',
  },
  incomplete: {
    icon: AlertTriangle,
    container: 'border-amber-200 bg-amber-50 text-amber-800',
    detail: '',
    swatch: 'bg-amber-400/70 ring-amber-300',
  },
};
