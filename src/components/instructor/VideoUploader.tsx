
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";

interface VideoUploaderProps {
  courseId: string;
  onUploadComplete: (fileUrl: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ courseId, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.includes('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (200MB max)
      if (file.size > 200 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 200MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseId || !token) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('courseId', courseId);
    
    try {
      const response = await axios.post('/api/videos/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });
      
      if (response.data && response.data.fileUrl) {
        toast({
          title: "Upload complete",
          description: "Video was uploaded successfully",
        });
        onUploadComplete(response.data.fileUrl);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
          disabled={uploading}
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Video
        </Button>
        <span className="text-sm text-muted-foreground truncate max-w-[250px]">
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
      </div>
      
      {selectedFile && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            <span>Type: {selectedFile.type}</span>
          </div>
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      )}
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center">{uploadProgress}% completed</p>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
