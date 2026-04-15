/**
 * Font loader for jsPDF.
 * Noto Sans supports Turkish and other Latin-extended characters.
 * 
 * Non-Latin scripts (Arabic, Urdu, Hindi, Chinese, Japanese, Korean, Russian)
 * should use DOCX format — Word handles all scripts natively.
 */

const cache = {};

async function loadFont(url) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font load failed: ${url}`);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  cache[url] = btoa(bin);
  return cache[url];
}

export async function registerNotoSans(doc) {
  try {
    const [regular, bold] = await Promise.all([
      loadFont('/NotoSans-Regular.ttf'),
      loadFont('/NotoSans-Bold.ttf'),
    ]);
    doc.addFileToVFS('NotoSans-Regular.ttf', regular);
    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    doc.addFileToVFS('NotoSans-Bold.ttf', bold);
    doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');
    return true;
  } catch (err) {
    console.warn('Font load failed:', err);
    return false;
  }
}

/** Turkish needs Noto Sans for ş, ğ, ı, ö, ü, ç */
export function needsUnicodeFont(lang) {
  return lang === 'tr';
}

/** Non-Latin languages that should use DOCX instead of PDF */
export function needsDOCX(lang) {
  return ['ar', 'ur', 'hi', 'zh', 'ja', 'ko', 'ru'].includes(lang);
}
