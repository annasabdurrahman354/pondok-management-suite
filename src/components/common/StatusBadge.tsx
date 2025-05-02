
import { StatusType, STATUS_LABELS } from '@/types/rab.types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "status-badge",
        {
          "status-diajukan": status === "diajukan",
          "status-revisi": status === "revisi",
          "status-diterima": status === "diterima"
        },
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
