import React, { useCallback, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Button from './Button';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileWithPreview {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  key?: string;
}

interface UploaderProps {
  onUploadSuccess?: (file: File, key: string) => void;
  onUploadError?: (file: File, error: string) => void;
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  label?: string;
  className?: string;
}

const Uploader = ({
  onUploadSuccess,
  onUploadError,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = ['image/*', 'application/zip', 'text/plain', 'application/x-mql'],
  label = 'Drag & drop files here or click to browse',
  className,
}: UploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: FileWithPreview[] = [];
    let validFilesCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check file type
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.split('/*')[0]);
        }
        return file.type === type;
      })) {
        setError(`File type not allowed: ${file.name}`);
        continue;
      }

      // Check file size
      if (file.size > maxFileSize) {
        setError(`File too large (max ${maxFileSize / 1024 / 1024}MB): ${file.name}`);
        continue;
      }

      // Check max files limit
      if (files.length + validFilesCount >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }

      validFilesCount++;
      
      const fileWithPreview: FileWithPreview = {
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: 'pending',
        progress: 0,
      };
      
      newFiles.push(fileWithPreview);
    }

    if (newFiles.length > 0) {
      // Get File objects from the new files
      const fileObjects = newFiles.map(f => f.file);
      
      setFiles(prevFiles => {
        // Create the updated file list
        const updatedFiles = [...prevFiles, ...newFiles];
        // Pass only File objects to onFilesChange
        onFilesChange?.(updatedFiles.map(f => f.file));
        return updatedFiles;
      });
      
      setError(null);
    }
  }, [acceptedFileTypes, maxFileSize, maxFiles, files.length, onFilesChange]);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Start upload process
  const startUpload = useCallback(async (fileWithPreview: FileWithPreview) => {
    const { file } = fileWithPreview;
    
    try {
      // Step 1: Get presigned URL from backend
      const presignResponse = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const presignData = await presignResponse.json();
      const { url, key } = presignData;

      // Update file status to uploading
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.file === file ? { ...f, status: 'uploading', key } : f
        )
      );

      // Step 2: Upload file to presigned URL
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles(prevFiles =>
            prevFiles.map(f =>
              f.file === file ? { ...f, progress } : f
            )
          );
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Update file status to success
          setFiles(prevFiles =>
            prevFiles.map(f =>
              f.file === file ? { ...f, status: 'success', progress: 100 } : f
            )
          );
          onUploadSuccess?.(file, key);
          
          // Notify backend about completed upload
          fetch('/api/upload/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key, originalName: file.name }),
          });
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.send(file);
    } catch (err) {
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.file === file ? { ...f, status: 'error', progress: 0 } : f
        )
      );
      onUploadError?.(file, (err as Error).message);
    }
  }, [onUploadError, onUploadSuccess]);

  // Start upload for all pending files
  const uploadAllFiles = useCallback(() => {
    files
      .filter(file => file.status === 'pending')
      .forEach(startUpload);
  }, [files, startUpload]);

  // Remove file from list
  const removeFile = useCallback((fileToRemove: File) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.file !== fileToRemove);
      // Pass only File objects to onFilesChange
      onFilesChange?.(newFiles.map(f => f.file));
      return newFiles;
    });
    
    // Revoke object URLs for previews
    const file = files.find(f => f.file === fileToRemove);
    if (file && file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  }, [files, onFilesChange]);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const hasPendingFiles = files.some(file => file.status === 'pending');
  const isUploading = files.some(file => file.status === 'uploading');

  return (
    <div className={clsx('w-full', className)}>
      {/* File drop area */}
      <div
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          files.length > 0 && 'mb-4'
        )}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        tabIndex={0}
        role="button"
        aria-label="File upload area"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold text-gray-900">
          {label}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {acceptedFileTypes.join(', ')} up to {maxFileSize / 1024 / 1024}MB
        </p>
      </div>

      {/* Upload button */}
      {hasPendingFiles && !isUploading && (
        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={uploadAllFiles}
          >
            Upload Files
          </Button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {files.map((file, index) => (
              <li 
                key={`${file.file.name}-${index}`}
                className="group relative rounded-md border border-gray-200 p-4"
              >
                {/* Preview */}
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="h-24 w-full object-contain"
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                  />
                ) : (
                  <div className="flex h-24 items-center justify-center bg-gray-50">
                    <span className="text-xs font-medium text-gray-500">
                      {file.file.name}
                    </span>
                  </div>
                )}

                {/* File info */}
                <div className="mt-2 flex justify-between">
                  <span className="truncate text-xs text-gray-500">
                    {file.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(file.file.size / 1024).toFixed(1)}KB
                  </span>
                </div>

                {/* Progress */}
                {file.status === 'uploading' && (
                  <div className="mt-1 h-2 w-full rounded bg-gray-200">
                    <div
                      className="h-full rounded bg-blue-500"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Status badges */}
                {file.status === 'pending' && (
                  <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Pending
                  </span>
                )}
                {file.status === 'success' && (
                  <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Uploaded
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Error
                  </span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  className="absolute -right-2 -top-2 rounded-full bg-gray-200 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.file);
                  }}
                  aria-label={`Remove ${file.file.name}`}
                >
                  <XMarkIcon className="h-4 w-4 text-gray-600" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Uploader;
