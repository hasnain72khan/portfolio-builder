import { addQRToDoc } from './generateQR';

/**
 * Add a QR code at the BOTTOM-LEFT of the LAST page.
 * Placed above the footer text so it never overlaps "Page X of Y".
 */
export async function addPortfolioQR(doc, username, scanLabel = 'Scan for Portfolio', pageWidth = 210, marginRight = 18) {
  if (!username) return;

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/portfolio/${username}`;
  const qrSize = 25;
  const x = 12; // bottom-left corner
  const y = 297 - 35; // more gap above footer

  doc.setPage(doc.getNumberOfPages());

  let qrAdded = false;
  try {
    qrAdded = await addQRToDoc(doc, url, x, y, qrSize);
  } catch { /* skip */ }

  if (qrAdded) {
    doc.link(x, y, qrSize, qrSize, { url });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text(scanLabel, x + qrSize / 2, y - 4, { align: 'center' });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 200);
    doc.textWithLink(scanLabel, x, y + 4, { url });
  }
}
