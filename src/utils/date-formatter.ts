
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) {
    return "-";
  }
  
  return format(date, "d MMMM yyyy", { locale: id });
}

export function formatDateTimeShort(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) {
    return "-";
  }
  
  return format(date, "d MMM yyyy HH:mm", { locale: id });
}

export function formatMonth(month: number): string {
  const date = new Date();
  date.setMonth(month - 1);
  
  return format(date, "MMMM", { locale: id });
}

export function formatPeriodeId(periodeId: string): string {
  const year = periodeId.substring(0, 4);
  const month = periodeId.substring(4);
  
  return `${formatMonth(parseInt(month))} ${year}`;
}
