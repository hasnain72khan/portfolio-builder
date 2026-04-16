/**
 * Compress an image (base64 data URL) using Canvas.
 * Resizes to maxSize and converts to JPEG with quality setting.
 * @param {string} dataUrl - base64 image data URL
 * @param {number} maxSize - max width/height in pixels (default 400)
 * @param {number} quality - JPEG quality 0-1 (default 0.75)
 * @returns {Promise<string>} compressed base64 data URL
 */
export function compressImage(dataUrl, maxSize = 400, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if larger than maxSize
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round(height * (maxSize / width));
          width = maxSize;
        } else {
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Output as JPEG for smaller size (PNG avatars can be 2-5MB, JPEG ~50-100KB)
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl); // fallback to original
    img.src = dataUrl;
  });
}
