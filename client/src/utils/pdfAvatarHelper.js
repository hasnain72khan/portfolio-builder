/**
 * Create a circular-cropped version of an image using Canvas.
 * Returns a base64 PNG data URL with circular mask applied.
 */
export function makeCircularImage(dataUrl, size = 300) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Draw circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw image centered and covering the circle
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Add a circular avatar to a jsPDF document.
 * Draws a border circle, then the circular-cropped image on top.
 *
 * @param {jsPDF} doc - jsPDF instance
 * @param {string} circularDataUrl - already-circular PNG data URL from makeCircularImage
 * @param {number} x - top-left X position
 * @param {number} y - top-left Y position
 * @param {number} diameter - diameter in mm
 * @param {number[]} borderColor - RGB array for border ring
 * @param {number} borderWidth - border width in mm
 */
export function addCircularAvatar(doc, circularDataUrl, x, y, diameter, borderColor = [255, 255, 255], borderWidth = 1.5) {
  const cx = x + diameter / 2;
  const cy = y + diameter / 2;
  const r = diameter / 2;

  // Draw border circle
  if (borderWidth > 0) {
    doc.setFillColor(...borderColor);
    doc.circle(cx, cy, r + borderWidth, 'F');
  }

  // Draw the pre-cropped circular image
  doc.addImage(circularDataUrl, 'PNG', x, y, diameter, diameter);
}

/**
 * Draw initials in a colored circle (fallback when no avatar).
 */
export function drawInitialsCircle(doc, initials, cx, cy, radius, bgColor, textColor = [255, 255, 255], fontSize = 16) {
  doc.setFillColor(...bgColor);
  doc.circle(cx, cy, radius, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(...textColor);
  doc.text(initials, cx, cy + fontSize * 0.13, { align: 'center' });
}
