
import { supabase } from '../lib/supabase';

// Upload a file to Supabase storage with proper naming convention
export async function uploadFile(
  file: File, 
  bucket: string, 
  pondokId: string, 
  pondokName: string,
  periodeId: string
): Promise<string | null> {
  if (!file) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = bucket === 'rab' 
    ? `rab/rab-${periodeId}-${pondokId}-${pondokName.replace(/\s+/g, '-')}.${fileExt}`
    : `lpj/lpj-${periodeId}-${pondokId}-${pondokName.replace(/\s+/g, '-')}.${fileExt}`;
  
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Set to true to overwrite if file exists
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

// Download a file from Supabase storage
export async function downloadFile(bucket: string, filePath: string): Promise<void> {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .download(filePath);
  
  if (error) {
    console.error("Error downloading file:", error);
    throw new Error(`Error downloading file: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('File not found');
  }
  
  // Create a download link and trigger it
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filePath.split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

// Create a helper to extract path from URL
export function extractPathFromUrl(url: string): string {
  // Example URL: https://some-domain.com/storage/v1/object/public/bucket-name/file-path
  const parts = url.split('/');
  // Get the bucket name and everything after it
  const bucketIndex = parts.findIndex(part => part === 'public') + 1;
  return parts.slice(bucketIndex).join('/');
}
