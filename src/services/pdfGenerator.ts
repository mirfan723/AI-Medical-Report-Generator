import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DiagnosisData } from '../components/DiagnosisResult';

// Generate PDF from diagnosis data and extracted text
export const generatePDF = async (
  diagnosisData: DiagnosisData,
  extractedText: string,
  patientName: string = 'Patient'
): Promise<Blob> => {
  // Create a PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add header
  pdf.setFontSize(22);
  pdf.setTextColor(10, 110, 189); // Primary color
  pdf.text('MediDiagnose AI Report', 20, 20);
  
  // Add date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add patient info
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Patient: ${patientName}`, 20, 40);
  
  // Add diagnosis
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Diagnosis Results', 20, 55);
  
  
  
  
  // Treatment
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Recommended Treatment', 20, 90);
  
  // Add multiline treatment text
  const treatmentLines = pdf.splitTextToSize(diagnosisData.treatment, 170);
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  pdf.text(treatmentLines, 20, 100);
  
  // Calculate new Y position after treatment text
  let yPosition = 105 + (treatmentLines.length * 6);
  
  // Precautions
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Precautions & Next Steps', 20, yPosition);
  
  // Add precautions as bullet points
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  
  diagnosisData.precautions.forEach((precaution, index) => {
    pdf.text(`• ${precaution}`, 20, yPosition);
    yPosition += 8;
  });
  
  // Add page break if needed
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = 20;
  } else {
    yPosition += 15;
  }
  
  // Add extracted text section
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Extracted Text from Report', 20, yPosition);
  
  // Add the extracted text in a smaller font
  const textLines = pdf.splitTextToSize(extractedText, 170);
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text(textLines, 20, yPosition);
  
  // Add disclaimer at the bottom of the last page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    'DISCLAIMER: This AI-generated diagnosis is for informational purposes only and should not replace professional medical advice.',
    20, 
    285
  );
  
  // Return the PDF as a blob
  return pdf.output('blob');
};

// Generate PDF from an HTML element
export const generatePDFFromElement = async (element: HTMLElement): Promise<Blob> => {
  // Capture the element as canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true,
  });
  
  // Create a PDF from the canvas
  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  let position = 0;
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  // Add additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  // Return as blob
  return pdf.output('blob');
};