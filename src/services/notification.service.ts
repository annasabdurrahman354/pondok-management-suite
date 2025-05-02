
import { supabase } from '../lib/supabase';
import { Notification, NotificationType } from '../types/notification.types';

export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifikasi')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  
  return data || [];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifikasi')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) {
    console.error("Error fetching unread notification count:", error);
    return 0;
  }
  
  return count || 0;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifikasi')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
  
  return true;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifikasi')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
  
  return true;
}

export async function createNotification(
  userId: string,
  message: string,
  type: NotificationType,
  entityId?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('notifikasi')
    .insert({
      user_id: userId,
      message,
      type,
      entity_id: entityId || null,
      is_read: false
    });
  
  if (error) {
    console.error("Error creating notification:", error);
    return false;
  }
  
  return true;
}
