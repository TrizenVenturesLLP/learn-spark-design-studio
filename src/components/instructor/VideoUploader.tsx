
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import { Progress } from '@/components/ui/progress';

interface VideoUploaderProps {
  dayNumber: number;
  onUploadComplete: (videoUrl: string) => void;
  existingVideoUrl?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  dayNumber,
  onUploadComplete,
  existingVideoUrl
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(existingVideoUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('video/mp4')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4 video file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 100MB)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Video file must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('dayNumber', dayNumber.toString());

    try {
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const totalLength = progressEvent.total || 0;
          if (totalLength > 0) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / totalLength);
            setUploadProgress(percentCompleted);
          }
        },
      });

      setIsUploading(false);
      
      // Handle the response
      if (response.data && response.data.videoUrl) {
        setVideoPreview(response.data.videoUrl);
        
        toast({
          title: "Upload successful",
          description: "Video has been uploaded successfully to cloud storage",
        });

        // Pass the URL back to parent component
        onUploadComplete(response.data.videoUrl);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Video for Day {dayNumber}
          <span className="text-red-500">*</span>
        </label>
        
        {!isUploading && (
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById(`video-upload-${dayNumber}`)?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {fileName ? "Change Video" : "Upload MP4 Video"}
            </Button>
            <input
              id={`video-upload-${dayNumber}`}
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileName && (
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {fileName}
              </span>
            )}
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Uploading: {uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {videoPreview && !isUploading && (
          <div className="mt-2">
            <video 
              src={videoPreview} 
              className="max-h-32 border rounded" 
              controls
            />
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Upload an MP4 video file (max 100MB). Videos are stored securely in cloud storage.
        </p>
      </div>
    </div>
  );
};
