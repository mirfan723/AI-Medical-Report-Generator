import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import DiagnosisResult, { DiagnosisData } from '../components/DiagnosisResult';
import { generatePDF } from '../services/pdfGenerator';
import { downloadFile } from '../utils/helpers';

interface DiagnosisResultData {
  diagnosisData: DiagnosisData;
  extractedText: string;
  timestamp: string;
}

const ResultsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<DiagnosisResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Attempt to load result data from session storage
    try {
      const storedData = sessionStorage.getItem('diagnosisResult');
      
      if (!storedData) {
        setError('No diagnosis data found. Please perform a new diagnosis.');
        setIsLoading(false);
        return;
      }
      
      const parsedData = JSON.parse(storedData) as DiagnosisResultData;
      setResultData(parsedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading diagnosis data:', err);
      setError('Failed to load diagnosis data. Please try again.');
      setIsLoading(false);
    }
  }, [id]);
  
  const handleDownloadPDF = async () => {
    if (!resultData) return;
    
    try {
      // Generate PDF
      const pdfBlob = await generatePDF(
        resultData.diagnosisData,
        resultData.extractedText,
        'Patient Report'
      );
      
      // Download the PDF
      downloadFile(pdfBlob, `diagnosis-report-${id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const handleNewDiagnosis = () => {
    navigate('/diagnosis');
  };
  
  if (isLoading) {
    return (
      <div className="container-md py-12 flex justify-center items-center">
        <div className="loading"></div>
      </div>
    );
  }
  
  if (error || !resultData) {
    return (
      <div className="container-sm py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-6 border-2 border-red-200 max-w-lg mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Diagnosis Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'Unable to load diagnosis results'}</p>
            <button 
              onClick={handleNewDiagnosis} 
              className="btn btn-primary"
            >
              Start New Diagnosis
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container-lg py-12" ref={resultRef}>
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Your Diagnosis Results
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600"
        >
          AI-generated diagnosis based on your medical report
        </motion.p>
      </div>
      
      <DiagnosisResult
        diagnosisData={resultData.diagnosisData}
        extractedText={resultData.extractedText}
        onDownloadPDF={handleDownloadPDF}
      />
      
      <div className="mt-10 flex justify-center">
        <button 
          onClick={handleNewDiagnosis}
          className="btn btn-outline"
        >
          Start New Diagnosis
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center text-gray-500 text-sm max-w-2xl mx-auto"
      >
        <p className="mb-2">
          <strong>Disclaimer:</strong> This AI-generated diagnosis is provided for informational
          purposes only and should not replace professional medical advice, diagnosis, or treatment.
        </p>
        <p>
          Always consult with a qualified healthcare provider regarding any medical conditions
          or treatment options. The information provided by this tool is not a substitute for
          professional medical advice.
        </p>
      </motion.div>
    </div>
  );
};

export default ResultsPage;