
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Format date and time
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
}

// Format date only
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    return format(date, 'dd MMMM yyyy', { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
}

// Format time only
export function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    return format(date, 'HH:mm', { locale: id });
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateStr;
  }
}

// Format to relative time (e.g. "2 hours ago")
export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  
  try {
    const date = parseISO(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'baru saja';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam yang lalu`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} hari yang lalu`;
    } else {
      return formatDate(dateStr);
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateStr;
  }
}
