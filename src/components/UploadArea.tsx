import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, FileText, Image, FileIcon } from 'lucide-react';
import { cn } from '../utils/helpers';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelected, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isProcessing) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelected(file);
      
      // Determine file type
      const isPdf = file.type === 'application/pdf';
      setFileType(isPdf ? 'pdf' : 'image');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelected, isProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    setFileType(null);
  };

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: isDragActive || isProcessing ? 1 : 1.01 }}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-primary-400 bg-primary-50" : "border-gray-300",
          isProcessing ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        {selectedFile && preview ? (
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mb-4">
                {fileType === 'image' ? (
                  <img
                    src={preview}
                    alt="Report preview"
                    className="max-h-64 max-w-full mx-auto rounded-md object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 w-full bg-gray-100 rounded-md">
                    <FileIcon size={64} className="text-red-500 mb-2" />
                    <p className="text-gray-800 font-medium">PDF Document</p>
                  </div>
                )}
                {!isProcessing && (
                  <button
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                    disabled={isProcessing}
                  >
                    <X size={18} className="text-gray-600" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              animate={{ y: isDragActive ? -5 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="mb-4 rounded-full bg-primary-50 p-4"
            >
              {isDragActive ? (
                <Image className="h-10 w-10 text-primary-500" />
              ) : (
                <Upload className="h-10 w-10 text-primary-500" />
              )}
            </motion.div>
            <p className="mb-2 text-lg font-semibold text-gray-700">
              {isDragActive ? "Drop your report here" : "Upload Medical Report"}
            </p>
            <p className="mb-4 text-sm text-gray-500">
              {isDragActive
                ? "We'll analyze it right away"
                : "Drag and drop your report image or PDF, or click to browse"}
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
                <FileText size={14} className="mr-1" />
                JPG
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
                <FileText size={14} className="mr-1" />
                PNG
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
                <FileText size={14} className="mr-1" />
                TIFF
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
                <FileIcon size={14} className="mr-1" />
                PDF
              </span>
            </div>
          </div>
        )}
      </motion.div>
      {selectedFile && !isProcessing && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex justify-center"
        >
          <button 
            className="btn btn-primary"
            onClick={() => onFileSelected(selectedFile)}
          >
            Process Report
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UploadArea;