// utils/exportPdf.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportDashboardToPDF = async (elementId: string, filename: string = 'vendor-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Add temporary class to ensure full rendering
    element.classList.add('pdf-export-mode');

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true, 
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  } finally {
    element.classList.remove('pdf-export-mode');
  }
};