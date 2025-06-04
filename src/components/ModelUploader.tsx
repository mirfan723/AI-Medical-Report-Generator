import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/helpers';

const ModelUploader: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.name.endsWith('.zip')) {
      setErrorMessage('Please upload a ZIP file containing your model');
      setUploadStatus('error');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setErrorMessage('File size exceeds 100MB limit');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload-model', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploadStatus('error');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
    disabled: uploadStatus === 'uploading',
  });

  const renderIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
      default:
        return <Upload className="h-12 w-12 text-primary-500" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-primary-400 bg-primary-50" : "border-gray-300",
          uploadStatus === 'uploading' && "opacity-50 cursor-not-allowed"
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center py-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            {renderIcon()}
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">
            {uploadStatus === 'success' ? 'Model Uploaded Successfully' :
             uploadStatus === 'error' ? 'Upload Failed' :
             uploadStatus === 'uploading' ? 'Uploading Model...' :
             'Upload Your Model'}
          </h3>
          
          {uploadStatus === 'error' && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          
          {uploadStatus === 'idle' && (
            <>
              <p className="text-gray-500 text-sm mb-4">
                Drop your model ZIP file here or click to browse
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Maximum file size: 100MB</p>
                <p>Supported format: ZIP</p>
              </div>
            </>
          )}
          
          {uploadStatus === 'success' && (
            <p className="text-green-500 text-sm mb-4">
              Your model is ready to use for diagnoses
            </p>
          )}

          {uploadStatus === 'uploading' && (
            <div className="w-full max-w-xs mx-auto mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {uploadStatus === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 text-sm text-gray-600"
        >
          You can now use the diagnosis feature with your custom model
        </motion.p>
      )}
    </div>
  );
};

export default ModelUploader;