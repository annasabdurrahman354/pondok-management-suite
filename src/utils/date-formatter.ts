
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Format a date to "dd MMM yyyy" in Indonesian
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMMM yyyy', { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format a date to "dd MMM yyyy HH:mm" in Indonesian
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMMM yyyy HH:mm', { locale: id });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return dateString;
  }
};

// Convert periode ID (YYYYMM) to readable format
export const formatPeriodeId = (periodeId: string): string => {
  try {
    const year = periodeId.substring(0, 4);
    const month = parseInt(periodeId.substring(4, 6)) - 1; // 0-indexed months
    const date = new Date(parseInt(year), month, 1);
    return format(date, 'MMMM yyyy', { locale: id });
  } catch (error) {
    console.error('Error formatting periode ID:', error);
    return periodeId;
  }
};

// Convert month number to Indonesian month name
export const getMonthName = (month: number): string => {
  const date = new Date(2000, month - 1, 1);
  return format(date, 'MMMM', { locale: id });
};

// Check if a date is within a range
export const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
  try {
    const currentTime = date.getTime();
    const start = parseISO(startDate).getTime();
    const end = parseISO(endDate).getTime();
    return currentTime >= start && currentTime <= end;
  } catch (error) {
    console.error('Error checking date range:', error);
    return false;
  }
};
