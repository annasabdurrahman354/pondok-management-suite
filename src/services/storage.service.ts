
import { supabase } from '../lib/supabase';

// Upload a file to Supabase storage
export async function uploadFile(file: File, bucket: string, folder: string): Promise<string | null> {
  const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
  
  if (!data?.path) {
    return null;
  }
  
  // Get public URL for the file
  const { data: urlData } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Delete a file from Supabase storage
export async function deleteFile(path: string, bucket: string): Promise<boolean> {
  // Extract just the file path without the base URL
  const filePath = path.split('/').slice(-2).join('/');
  
  const { error } = await supabase
    .storage
    .from(bucket)
    .remove([filePath]);
  
  if (error) {
    console.error("Error deleting file:", error);
    return false;
  }
  
  return true;
}
