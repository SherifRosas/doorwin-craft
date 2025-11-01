import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const invoiceId = params.id;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // Header
  drawText('Invoice (KSA Stub)', 50, 800, 18);
  drawText(`Invoice ID: ${invoiceId}`, 50, 780);

  // Seller (example placeholders)
  drawText('Seller:', 50, 750, 14);
  drawText('DoorWin Craft LLC', 50, 735);
  drawText('VAT: 1234567890', 50, 720);

  // Buyer (placeholder)
  drawText('Buyer:', 320, 750, 14);
  drawText('Customer Name', 320, 735);
  drawText('VAT: N/A', 320, 720);

  // Amounts
  drawText('Amount (SAR): 100.00', 50, 690, 14);
  drawText('VAT (15%): 15.00', 50, 675);
  drawText('Total (SAR): 115.00', 50, 660, 14);

  // Footer
  drawText('This is a stub invoice for testing purposes only.', 50, 630);

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoiceId}.pdf"`
    }
  });
}





