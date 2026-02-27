import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateProfessionalInvoice = (order: any) => {
  const doc = new jsPDF();
  const SELLER_STATE_CODE = "06"; // Haryana
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ==========================================
  // 1. PREMIUM BRAND HEADER (Top Left)
  // ==========================================
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 62, 72); // Nandani Theme Color (Maroon)
  doc.text("NANDANI COLLECTION", 14, 22);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Premium Ethnic Wear & Suits", 14, 28);
  
  doc.setTextColor(60, 60, 60);
  doc.text("613, Gali No 24, Jyoti Park, Gurugram, Haryana - 122001", 14, 33);
  doc.setFont("helvetica", "bold");
  doc.text("GSTIN: 06IXKPP7341Q1ZG", 14, 38); 
  doc.setFont("helvetica", "normal");
  

  // ==========================================
  // 2. INVOICE METADATA (Top Right)
  // ==========================================
  const safeOrderId = order?.id ? String(order.id).slice(-6).toUpperCase() : Math.floor(Math.random() * 1000000);
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 62, 72);
  doc.text("TAX INVOICE", pageWidth - 14, 22, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`Invoice No: ${order?.invoice_no || '#NC-' + safeOrderId}`, pageWidth - 14, 30, { align: "right" });
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 35, { align: "right" });
  doc.text(`Place of Supply: ${order?.shipping_state_code || "HARYANA"}`, pageWidth - 14, 40, { align: "right" });

  // Divider Line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 48, pageWidth - 14, 48);

  // ==========================================
  // 3. BUYER DETAILS (Clean Section)
  // ==========================================
  doc.setFillColor(250, 250, 250);
  doc.rect(14, 53, 182, 28, "F"); 

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Billed & Shipped To:", 18, 60);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`${order?.customer_name || order?.full_name || "Customer Name"}`, 18, 66);
  
  const splitAddress = doc.splitTextToSize(`${order?.shipping_address || order?.address || "Address Not Provided"}`, 170);
  doc.text(splitAddress, 18, 71);
  

  // ==========================================
  // 4. ITEM LOGIC & TABLE DATA
  // ==========================================
  let totalTaxableValue = 0;
  let totalIGST = 0;
  let totalCGST = 0;
  let totalSGST = 0;

  const items = order?.items || [];
  const tableRows: any[] = items.map((item: any, index: number) => {
    let hsn = "5208"; 
    let gstRate = 5;

    const safePrice = Number(item.price) || 0;
    const safeQty = Number(item.quantity) || 1;
    const category = (item.category || "").toLowerCase();
    
    if (category.includes('saree')) {
      hsn = "5407";
      gstRate = 5;
    } else if (category.includes('kurti')) {
      hsn = "6204";
      gstRate = safePrice >= 2500 ? 18 : 5;
    }

    const taxableValue = safePrice * safeQty;
    const taxAmount = (taxableValue * gstRate) / 100;
    totalTaxableValue += taxableValue;
    
    const customerStateCode = order?.shipping_state_code ? String(order.shipping_state_code).substring(0, 2) : "06";
    
    if (customerStateCode === SELLER_STATE_CODE) {
      totalCGST += taxAmount / 2;
      totalSGST += taxAmount / 2;
    } else {
      totalIGST += taxAmount;
    }

    const productName = String(item.name || item.product_name || "PRODUCT");

    return [
      index + 1,
      productName.toUpperCase(),
      hsn,
      safeQty,
      safePrice.toFixed(2),
      "Pcs",
      taxableValue.toFixed(2)
    ];
  });

  // ==========================================
  // 5. MERGING GST CALCULATION INTO THE TABLE
  // ==========================================
  const netTotal = totalTaxableValue + totalIGST + totalCGST + totalSGST;
  const roundOff = Math.round(netTotal) - netTotal;

  // Adding Totals directly into the table rows for a seamless corporate look
  tableRows.push([
    { content: "Taxable Value:", colSpan: 6, styles: { halign: "right", fontStyle: "bold", textColor: 40 } },
    { content: totalTaxableValue.toFixed(2), styles: { halign: "right", fontStyle: "bold", textColor: 40 } }
  ]);

  if (totalIGST > 0) {
    tableRows.push([
      { content: "IGST Amount:", colSpan: 6, styles: { halign: "right", textColor: 80 } },
      { content: totalIGST.toFixed(2), styles: { halign: "right", textColor: 80 } }
    ]);
  } else {
    tableRows.push([
      { content: "CGST Amount:", colSpan: 6, styles: { halign: "right", textColor: 80 } },
      { content: totalCGST.toFixed(2), styles: { halign: "right", textColor: 80 } }
    ]);
    tableRows.push([
      { content: "SGST Amount:", colSpan: 6, styles: { halign: "right", textColor: 80 } },
      { content: totalSGST.toFixed(2), styles: { halign: "right", textColor: 80 } }
    ]);
  }

  tableRows.push([
    { content: "Round Off:", colSpan: 6, styles: { halign: "right", textColor: 80 } },
    { content: roundOff.toFixed(2), styles: { halign: "right", textColor: 80 } }
  ]);

  tableRows.push([
    { content: "GRAND TOTAL:", colSpan: 6, styles: { halign: "right", fontStyle: "bold", fontSize: 10, textColor: [139, 62, 72] } },
    { content: `INR ${Math.round(netTotal).toFixed(2)}`, styles: { halign: "right", fontStyle: "bold", fontSize: 10, textColor: [139, 62, 72] } }
  ]);

  // Draw the Integrated Table
  autoTable(doc, {
    startY: 86,
    head: [["Sl No.", "Description of Goods", "HSN/SAC", "Qty", "Rate", "Per", "Amount"]],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [139, 62, 72], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, textColor: 50, cellPadding: 3 },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'center' },
      6: { halign: 'right' }
    }
  });

  // ==========================================
  // 6. TERMS & CONDITIONS (Below Table)
  // ==========================================
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Terms & Conditions:", 14, finalY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("1. Goods once sold will not be taken back or exchanged.", 14, finalY + 5);
  doc.text("2. All disputes are subject to Gurugram Jurisdiction only.", 14, finalY + 10);
  doc.text("3. Wash care instructions must be strictly followed.", 14, finalY + 15);

  // ==========================================
  // 7. SIGNATURE (Placed perfectly above footer)
  // ==========================================
  const signatureY = pageHeight - 38; // Moved up from the footer line
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("For NANDANI COLLECTION", pageWidth - 14, signatureY, { align: "right" });
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("( Authorized Signatory )", pageWidth - 14, signatureY + 12, { align: "right" });

  // ==========================================
  // 8. CLEAN FOOTER (Without Emojis)
  // ==========================================
  const footerLineY = pageHeight - 20;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, footerLineY, pageWidth - 14, footerLineY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  
  // Left aligned contact details
  doc.text("Phone: +91 81685 98702  |  +91 94667 79991", 14, footerLineY + 6);
  doc.text("Email: nandani.collection05@gmail.com", 14, footerLineY + 11);
  doc.text("Instagram: @nandani_collections", 14, footerLineY + 16);

  // Center aligned computer generated note
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("This is a computer generated invoice and does not require a physical signature.", pageWidth / 2, footerLineY + 16, { align: "center" });

  // ==========================================
  // SAVE FILE
  // ==========================================
  doc.save(`Invoice_${order?.invoice_no || 'NC_' + safeOrderId}.pdf`);
};