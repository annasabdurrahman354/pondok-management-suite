
export type NotificationType = 'pondok' | 'rab' | 'lpj';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
}
