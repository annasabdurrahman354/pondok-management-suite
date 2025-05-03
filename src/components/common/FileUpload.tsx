
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, File, Upload, Trash2, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { uploadFile, downloadFile } from '@/services/storage.service';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  bucketName: 'rab' | 'lpj';
  pondokId: string;
  pondokName: string;
  periodeId: string;
  onFileUploaded: (url: string) => void;
  existingFileUrl?: string | null;
  disabled?: boolean;
}

const FileUpload = ({
  bucketName,
  pondokId,
  pondokName,
  periodeId,
  onFileUploaded,
  existingFileUrl,
  disabled = false
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      setError(null);
      
      const url = await uploadFile(
        file,
        bucketName,
        pondokId,
        pondokName,
        periodeId
      );
      
      if (url) {
        onFileUploaded(url);
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      }
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Error uploading file');
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!existingFileUrl) return;
    
    try {
      // Extract the path from the URL
      const pathParts = existingFileUrl.split('/');
      const bucketIndex = pathParts.findIndex(part => part === bucketName);
      
      if (bucketIndex >= 0) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        await downloadFile(bucketName, filePath);
      } else {
        // If we can't determine the path from URL, try to download directly
        window.open(existingFileUrl, '_blank');
      }
    } catch (err: any) {
      console.error('Error downloading file:', err);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-2">
        {existingFileUrl ? (
          <div className="flex items-center justify-between p-2 border rounded-md bg-slate-50">
            <div className="flex items-center">
              <File className="h-5 w-5 mr-2 text-blue-600" />
              <span className="text-sm">Document uploaded</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={disabled}
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
              {!disabled && (
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Replace
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      disabled={uploading || disabled}
                    />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              disabled={uploading || disabled}
              className="w-full h-20 flex flex-col items-center justify-center border-dashed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mb-1" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-1" />
                  <span>Select file to upload</span>
                </>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                disabled={uploading || disabled}
              />
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-muted-foreground">
        Supported files: PDF, Word, Excel, Images
      </p>
    </div>
  );
};

export default FileUpload;
