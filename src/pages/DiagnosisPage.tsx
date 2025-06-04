import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import ModelUploader from '../components/ModelUploader';
import LoadingState from '../components/LoadingState';
import { ocrService, diagnosisService, pdfProcessingService } from '../services/api';

interface ProcessingError {
  message: string;
  details?: string;
}

const DiagnosisPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [showModelUpload, setShowModelUpload] = useState(false);
  
  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      setProcessingStep(1);
      
      let extractedText = '';
      
      // Check if the file is a PDF or an image
      if (file.type === 'application/pdf') {
        // Process PDF file
        const pdfResult = await pdfProcessingService.processPDF(file);
        
        if (!pdfResult.success) {
          throw new Error(pdfResult.error || 'PDF processing failed');
        }
        
        extractedText = pdfResult.processed_text || pdfResult.raw_text;
      } else {
        // Process image file
        const ocrResult = await ocrService.processImage(file);
        
        if (!ocrResult.success) {
          throw new Error(ocrResult.error || 'OCR processing failed');
        }
        
        extractedText = ocrResult.text;
      }
      
      setProcessingStep(2);
      
      const diagnosisResult = await diagnosisService.getDiagnosis(extractedText);
      
      if (!diagnosisResult.success) {
        throw new Error(diagnosisResult.error || 'Diagnosis processing failed');
      }
      
      setProcessingStep(3);
      
      const diagnosisId = Date.now().toString();
      
      sessionStorage.setItem('diagnosisResult', JSON.stringify({
        diagnosisData: diagnosisResult,
        extractedText: extractedText,
        timestamp: new Date().toISOString(),
        fileType: file.type,
      }));
      
      navigate(`/results/${diagnosisId}`);
      
    } catch (err) {
      console.error('Processing error:', err);
      setError({
        message: 'An error occurred during processing',
        details: err instanceof Error ? err.message : 'Unknown error',
      });
      setIsProcessing(false);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    setIsProcessing(false);
    setProcessingStep(0);
  };
  
  return (
    <div className="container-md py-12">
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Upload Your Medical Report
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Our AI will analyze your report and provide a detailed diagnosis and treatment plan
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => setShowModelUpload(!showModelUpload)}
          className="mt-4 text-primary-500 hover:text-primary-600 text-sm font-medium"
        >
          {showModelUpload ? 'Hide Model Upload' : 'Upload Custom Model'}
        </motion.button>
      </div>
      
      <div className="max-w-xl mx-auto">
        {showModelUpload && (
          <div className="mb-8">
            <ModelUploader />
          </div>
        )}
        
        {isProcessing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-6"
          >
            <LoadingState step={processingStep} totalSteps={3} />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-6 border-2 border-red-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{error.message}</h3>
              {error.details && (
                <p className="text-gray-600 mb-4">{error.details}</p>
              )}
              <button 
                onClick={handleRetry} 
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UploadArea 
              onFileSelected={processFile}
              isProcessing={isProcessing}
            />
            
            <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How To Get The Best Results</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  Ensure your medical report image is clear and well-lit
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  Capture the entire report in the frame
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  Make sure text is readable and not cut off
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  Include all relevant sections of the report
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>For PDF uploads, ensure the document contains searchable text (not just scanned images)</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisPage;