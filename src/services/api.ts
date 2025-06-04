import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:5000/api';

// API client with defaults
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interface for PDF processing response
export interface PDFResponse {
  raw_text: string;
  processed_text: string;
  success: boolean;
  error?: string;
}


// Interface for OCR response
export interface OCRResponse {
  text: string;
  success: boolean;
  error?: string;
}

// Interface for Diagnosis response
export interface DiagnosisResponse {
  disease: string;
  confidence: number;
  treatment: string;
  precautions: string[];
  severity: 'low' | 'moderate' | 'high';
  additionalInfo?: string;
  success: boolean;
  error?: string;
}

// Service for handling OCR
export const ocrService = {
  // Process image and extract text
  processImage: async (file: File): Promise<OCRResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('OCR processing error:', error);
      return {
        text: '',
        success: false,
        error: 'Failed to process the image. Please try again.',
      };
    }
  },
};

// Service for handling diagnosis
export const diagnosisService = {
  // Get diagnosis from text
  getDiagnosis: async (text: string): Promise<DiagnosisResponse> => {
    try {
      const response = await apiClient.post('/diagnosis', { text });
      return response.data;
    } catch (error) {
      console.error('Diagnosis error:', error);
      return {
        disease: '',
        confidence: 0,
        treatment: '',
        precautions: [],
        severity: 'low',
        success: false,
        error: 'Failed to get diagnosis. Please try again.',
      };
    }
  },
};

// Service for handling PDF generation
export const pdfService = {
  // Generate PDF from diagnosis data
  generatePDF: async (diagnosisData: any, extractedText: string): Promise<Blob> => {
    try {
      const response = await apiClient.post('/generate-pdf', 
        { diagnosisData, extractedText },
        { responseType: 'blob' }
      );
      
      return response.data;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  },
};
// Service for handling PDF processing
export const pdfProcessingService = {
  // Process PDF and extract text
  processPDF: async (file: File): Promise<PDFResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/process-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('PDF processing error:', error);
      return {
        raw_text: '',
        processed_text: '',
        success: false,
        error: 'Failed to process the PDF. Please try again.',
      };
    }
  },
};
