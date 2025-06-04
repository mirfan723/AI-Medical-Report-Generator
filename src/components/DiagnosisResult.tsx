import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2 } from 'lucide-react';
import { cn } from '../utils/helpers';

export interface DiagnosisData {
  disease: string;
  treatment: string;
  precautions: string[];
  severity: 'low' | 'moderate' | 'high';
  additionalInfo?: string;
}

interface DiagnosisResultProps {
  diagnosisData: DiagnosisData;
  extractedText: string;
  onDownloadPDF: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosisData,
  extractedText,
  onDownloadPDF,
}) => {
  const severityColor = {
    low: 'text-green-500',
    moderate: 'text-amber-500',
    high: 'text-red-500',
  }[diagnosisData.severity];

  const severityBg = {
    low: 'bg-green-50',
    moderate: 'bg-amber-50',
    high: 'bg-red-50',
  }[diagnosisData.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="card mb-6">
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Medical Analysis Report</h3>
            <div className="flex space-x-2">
              <button 
                onClick={onDownloadPDF}
                className="btn btn-outline text-xs sm:text-sm flex items-center"
              >
                <Download size={16} className="mr-1" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button className="btn btn-outline text-xs sm:text-sm flex items-center">
                <Share2 size={16} className="mr-1" />
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="prose max-w-none">
                <div className="mb-8">
                  <h4 className="text-xl font-medium text-gray-900 mb-4">SOAP Assessment</h4>
                  <div className="whitespace-pre-line text-gray-700">
                    {diagnosisData.treatment}
                  </div>
                </div>

                {diagnosisData.additionalInfo && (
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">
                      Additional Notes
                    </h5>
                    <p className="text-gray-700">{diagnosisData.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-lg font-medium text-gray-900 mb-4">
                  Key Recommendations
                </h5>
                <ul className="space-y-3">
                  {diagnosisData.precautions.map((precaution, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-primary-100 h-6 w-6 text-primary-800 text-sm font-medium mr-2 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{precaution}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:px-6 sm:py-4 rounded-t-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Original Report Text</h3>
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50 rounded-b-lg">
          <div className="bg-white p-4 rounded border border-gray-200 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {extractedText}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiagnosisResult;