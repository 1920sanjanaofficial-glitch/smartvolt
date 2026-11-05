import { jsPDF } from 'jspdf';
import { Invoice } from '../types';

export function generateClientPdfInvoice(invoice: Invoice): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = '#0f172a';
  const accentColor = '#0284c7';
  const textColor = '#334155';
  const lightBg = '#f8fafc';

  // 1. Header Box
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#ffffff');
  doc.setFontSize(18);
  doc.text('SMARTVOLT ELECTRICALS & ENERGY', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#94a3b8');
  doc.text('Smart Battery Storage, Inverters & Industrial Electrical Equipment', 14, 21);
  doc.text('GSTIN: 27AABCS1429B1Z8 | HSN: 8507 | support@smartvolt.in | +91 98200 12345', 14, 26);

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor('#38bdf8');
  doc.text('TAX INVOICE', 196, 15, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#cbd5e1');
  doc.text(`ORIGINAL FOR RECIPIENT`, 196, 21, { align: 'right' });

  // 2. Metadata Cards
  let y = 42;
  doc.setFillColor(lightBg);
  doc.roundedRect(14, y, 90, 30, 2, 2, 'F');
  doc.roundedRect(108, y, 88, 30, 2, 2, 'F');

  // Customer Card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor);
  doc.text('BILLED TO (CUSTOMER):', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textColor);
  doc.text(invoice.customerName, 18, y + 12);
  doc.text(`Phone: ${invoice.customerPhone}`, 18, y + 17);
  const splitAddress = doc.splitTextToSize(invoice.deliveryAddress, 82);
  doc.text(splitAddress.slice(0, 2), 18, y + 22);

  // Invoice Details Card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor);
  doc.text('INVOICE & ORDER DETAILS:', 112, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textColor);
  doc.text(`Invoice No: ${invoice.id}`, 112, y + 12);
  doc.text(`Order Number: ${invoice.orderNumber}`, 112, y + 17);
  doc.text(`Date: ${invoice.invoiceDate}`, 112, y + 22);
  doc.text(`Payment: ${invoice.paymentMethod.toUpperCase()} (${invoice.paymentStatus.toUpperCase()})`, 112, y + 27);

  // 3. Table Header
  y = 80;
  doc.setFillColor('#0f172a');
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor('#ffffff');
  doc.text('#', 17, y + 5.5);
  doc.text('PRODUCT DESCRIPTION & SPECS', 25, y + 5.5);
  doc.text('WARRANTY', 115, y + 5.5);
  doc.text('QTY', 140, y + 5.5);
  doc.text('RATE (₹)', 160, y + 5.5, { align: 'right' });
  doc.text('AMOUNT (₹)', 192, y + 5.5, { align: 'right' });

  // 4. Table Rows
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  invoice.items.forEach((item, index) => {
    const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.setFillColor(rowBg);
    doc.rect(14, y, 182, 10, 'F');
    doc.setDrawColor('#e2e8f0');
    doc.line(14, y + 10, 196, y + 10);

    doc.setTextColor(primaryColor);
    doc.text(String(index + 1), 17, y + 6);
    
    // Product title & electrical spec
    doc.setFont('helvetica', 'bold');
    const safeTitle = item.productName.length > 42 ? item.productName.substring(0, 42) + '...' : item.productName;
    doc.text(safeTitle, 25, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#64748b');
    doc.setFontSize(7);
    doc.text(`Rating: ${item.voltageStr || 'N/A'} | ${item.wattageStr || 'N/A'} | HSN: 8507`, 25, y + 8);

    doc.setFontSize(8);
    doc.setTextColor(textColor);
    doc.text(`${item.warrantyMonths} Months`, 115, y + 6);
    doc.text(String(item.quantity), 142, y + 6);
    doc.text(item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 160, y + 6, { align: 'right' });
    
    const lineTotal = item.unitPrice * item.quantity;
    doc.text(lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 192, y + 6, { align: 'right' });

    y += 10;
  });

  // 5. Summary / Tax Section
  y += 6;
  const summaryX = 125;
  const valX = 192;
  doc.setFontSize(8.5);

  const writeSummaryLine = (label: string, value: string, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(isBold ? primaryColor : textColor);
    doc.text(label, summaryX, y);
    doc.text(value, valX, y, { align: 'right' });
    y += 5.5;
  };

  writeSummaryLine('Subtotal:', `₹ ${invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  writeSummaryLine('CGST (9.0%):', `₹ ${invoice.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  writeSummaryLine('SGST (9.0%):', `₹ ${invoice.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  writeSummaryLine('Delivery Charges:', `₹ ${invoice.deliveryCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  if (invoice.discountAmount > 0) {
    writeSummaryLine('Discount Applied:', `- ₹ ${invoice.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  }

  doc.setDrawColor('#0f172a');
  doc.setLineWidth(0.4);
  doc.line(summaryX, y, 196, y);
  y += 3;

  doc.setFontSize(10.5);
  writeSummaryLine('Total Amount Paid:', `₹ ${invoice.finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, true);

  // 6. Security & Verification QR Box
  const qrBoxY = 160;
  doc.setFillColor('#f1f5f9');
  doc.roundedRect(14, qrBoxY, 95, 32, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor);
  doc.text('ELECTRICAL COMPLIANCE & VERIFICATION', 18, qrBoxY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textColor);
  doc.text('• Certified safe battery and power equipment.', 18, qrBoxY + 12);
  doc.text('• Warranty covers manufacturing defects and capacity loss.', 18, qrBoxY + 17);
  doc.text('• Digital verification token: ' + invoice.transactionId.substring(0, 16), 18, qrBoxY + 22);
  doc.text('• Scan QR on physical box or visit smartvolt.in/verify', 18, qrBoxY + 27);

  // 7. Footer Notice
  doc.setFontSize(7);
  doc.setTextColor('#94a3b8');
  doc.text('This is a computer-authorized digital tax invoice generated by SmartVolt Billing System. No signature required.', 105, 282, { align: 'center' });

  // Save / Trigger Download
  doc.save(`Invoice_${invoice.orderNumber}.pdf`);
}
