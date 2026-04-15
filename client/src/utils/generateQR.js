/**
 * QR Code — fetches from backend, caches aggressively.
 */
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cache = {};

export async function addQRToDoc(doc, url, x, y, size = 14) {
  try {
    let dataUrl = cache[url];
    if (!dataUrl) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000); // 3s max
      const res = await fetch(`${API}/qr?text=${encodeURIComponent(url)}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return false;
      const json = await res.json();
      dataUrl = json.dataUrl;
      if (dataUrl) cache[url] = dataUrl;
    }
    if (dataUrl) {
      doc.addImage(dataUrl, 'PNG', x, y, size, size);
      return true;
    }
  } catch { /* timeout or error — skip QR silently */ }
  return false;
}
