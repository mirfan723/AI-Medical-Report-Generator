import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  step?: number;
  totalSteps?: number;
}

const steps = [
  "Uploading medical report",
  "Extracting text with OCR",
  "Processing medical data",
  "Analyzing with AI model",
  "Generating diagnosis report"
];

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Processing your medical report",
  step = 0,
  totalSteps = 5
}) => {
  const currentStep = step > 0 ? step : null;
  const displayedSteps = currentStep ? steps.slice(0, totalSteps) : steps;
  
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <Loader2 className="h-12 w-12 text-primary-500" />
      </motion.div>
      
      <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
      
      {currentStep ? (
        <div className="w-full mt-6">
          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {`Step ${currentStep} of ${totalSteps}: ${displayedSteps[currentStep - 1]}`}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-6 space-y-4">
          {displayedSteps.map((stepText, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  delay: index * 0.4 
                }
              }}
              className="flex items-center"
            >
              <div className="h-2 w-2 rounded-full bg-primary-400 mr-3" />
              <p className="text-sm text-gray-600">{stepText}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingState;