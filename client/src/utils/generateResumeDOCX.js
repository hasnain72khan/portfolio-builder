import { getNativeLabels } from './resumeI18n';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generate a DOCX resume using raw Office Open XML.
 * No external dependencies — creates a valid .docx from scratch.
 * Supports RTL (Arabic, Urdu) and all Unicode scripts.
 */

const RTL_LANGS = ['ar', 'ur'];

const escXml = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function heading(text, level = 1, rtl = false) {
  const size = level === 1 ? 48 : level === 2 ? 28 : 24;
  const bold = level <= 2;
  const bidi = rtl ? '<w:bidi/>' : '';
  const rtlRun = rtl ? '<w:rtl/>' : '';
  return `<w:p><w:pPr>${level === 1 ? '<w:jc w:val="center"/>' : ''}${bidi}<w:spacing w:after="80"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${size}"/><w:szCs w:val="${size}"/>${bold ? '<w:b/><w:bCs/>' : ''}<w:color w:val="222222"/>${rtlRun}</w:rPr>
    <w:t>${escXml(text)}</w:t></w:r></w:p>`;
}

function para(text, { bold = false, italic = false, size = 22, color = '444444', center = false, spacing = 60, rtl = false } = {}) {
  if (!text) return '';
  const bidi = rtl ? '<w:bidi/>' : '';
  const rtlRun = rtl ? '<w:rtl/>' : '';
  const jc = center ? '<w:jc w:val="center"/>' : (rtl ? '<w:jc w:val="right"/>' : '');
  return `<w:p><w:pPr>${jc}${bidi}<w:spacing w:after="${spacing}"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${size}"/><w:szCs w:val="${size}"/>
    ${bold ? '<w:b/><w:bCs/>' : ''}${italic ? '<w:i/><w:iCs/>' : ''}
    <w:color w:val="${color}"/>${rtlRun}</w:rPr>
    <w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:p>`;
}

function hrLine() {
  return `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="CCCCCC"/></w:pBdr><w:spacing w:after="120"/></w:pPr></w:p>`;
}

function sectionTitle(title, rtl = false) {
  const bidi = rtl ? '<w:bidi/>' : '';
  const rtlRun = rtl ? '<w:rtl/>' : '';
  return `<w:p><w:pPr>${bidi}<w:spacing w:before="200" w:after="40"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="222222"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/><w:color w:val="222222"/><w:caps/>${rtlRun}</w:rPr>
    <w:t>${escXml(title)}</w:t></w:r></w:p>`;
}

function bullet(text, { size = 21, color = '444444', rtl = false } = {}) {
  const bidi = rtl ? '<w:bidi/>' : '';
  const rtlRun = rtl ? '<w:rtl/>' : '';
  return `<w:p><w:pPr>${bidi}<w:spacing w:after="40"/><w:ind w:left="360" w:hanging="180"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:color w:val="${color}"/>${rtlRun}</w:rPr>
    <w:t xml:space="preserve">• ${escXml(text)}</w:t></w:r></w:p>`;
}

function twoCol(left, right, { leftBold = true, rightSize = 18, rightColor = '777777' } = {}) {
  return `<w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="9360"/></w:tabs><w:spacing w:after="40"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/>${leftBold ? '<w:b/><w:bCs/>' : ''}<w:color w:val="222222"/></w:rPr>
    <w:t xml:space="preserve">${escXml(left)}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${rightSize}"/><w:szCs w:val="${rightSize}"/><w:color w:val="${rightColor}"/></w:rPr>
    <w:tab/><w:t>${escXml(right)}</w:t></w:r></w:p>`;
}

export default async function generateResumeDOCX({ about, skills, experience, education, services, username }) {
  const labels = getNativeLabels(about?.language);
  const rtl = RTL_LANGS.includes(about?.language);
  let body = '';

  // Header — always centered
  body += heading(about?.name || 'Resume', 1, rtl);
  if (about?.title) body += para(about.title, { center: true, color: '777777', size: 24, spacing: 40, rtl });

  // Contact — always LTR (emails, phones)
  const contact = [];
  if (about?.phone) contact.push(about.phone);
  if (about?.email) contact.push(about.email);
  if (about?.city && about?.country) contact.push(`${about.city}, ${about.country}`);
  if (contact.length) body += para(contact.join('  |  '), { center: true, size: 19, color: '666666', spacing: 40 });

  const social = [];
  if (about?.linkedin) social.push(`LinkedIn: ${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`);
  if (about?.github) social.push(`GitHub: ${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`);
  if (social.length) body += para(social.join('  |  '), { center: true, size: 18, color: '0066CC', spacing: 60 });

  body += hrLine();

  // Professional Summary
  if (about?.bio) {
    body += sectionTitle(labels.summary, rtl);
    body += para(about.bio, { size: 21, spacing: 100, rtl });
  }

  // Experience
  if (experience?.length) {
    body += sectionTitle(labels.experience, rtl);
    experience.forEach(exp => {
      body += twoCol(exp.title, `${exp.startDate} – ${exp.endDate || 'Present'}`);
      body += para(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, { italic: true, size: 21, color: '555555', spacing: 40 });
      if (exp.description) body += bullet(exp.description, { rtl });
      body += para('', { spacing: 60 });
    });
  }

  // Education
  if (education?.length) {
    body += sectionTitle(labels.education, rtl);
    education.forEach(edu => {
      body += twoCol(edu.degree, `${edu.startDate} – ${edu.endDate || 'Present'}`);
      body += para(edu.institution, { italic: true, size: 21, color: '555555', spacing: 40 });
      if (edu.description) body += bullet(edu.description, { rtl });
      body += para('', { spacing: 60 });
    });
  }

  // Skills
  if (skills?.length) {
    body += sectionTitle(labels.skills);
    const skillNames = skills.map(s => s.name);
    // Group into rows of 4
    for (let i = 0; i < skillNames.length; i += 4) {
      const row = skillNames.slice(i, i + 4).join('  •  ');
      body += para(row, { size: 21, spacing: 30 });
    }
    body += para('', { spacing: 60 });
  }

  // Services
  if (services?.length) {
    body += sectionTitle(labels.services, rtl);
    services.forEach(s => {
      body += bullet(s.title + (s.description ? ` — ${s.description}` : ''), { rtl });
    });
  }

  // Portfolio QR code at bottom
  const portfolioUrl = username ? `${window.location.origin}/portfolio/${username}` : '';
  const scanText = labels.scanPortfolio || 'Scan for Portfolio';
  let qrPngBytes = null;

  if (portfolioUrl) {
    // Fetch QR as base64 from backend
    try {
      const res = await fetch(`${API}/qr?text=${encodeURIComponent(portfolioUrl)}`);
      if (res.ok) {
        const { dataUrl } = await res.json();
        if (dataUrl) {
          // Convert base64 data URL to raw bytes
          const b64 = dataUrl.split(',')[1];
          const bin = atob(b64);
          qrPngBytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) qrPngBytes[i] = bin.charCodeAt(i);
        }
      }
    } catch { /* skip QR */ }

    body += `<w:p><w:pPr><w:spacing w:before="400" w:after="0"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="DDDDDD"/></w:pBdr></w:pPr></w:p>`;
    body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="160"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="16"/><w:szCs w:val="16"/><w:color w:val="999999"/></w:rPr>
      <w:t xml:space="preserve">${escXml(scanText)}</w:t></w:r></w:p>`;

    if (qrPngBytes) {
      // Inline QR image (1 inch = 914400 EMU)
      const sz = 914400;
      body += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr>
        <w:r><w:drawing>
          <wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
                     distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="${sz}" cy="${sz}"/>
            <wp:docPr id="1" name="QR Code"/>
            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:nvPicPr><pic:cNvPr id="1" name="qr.png"/><pic:cNvPicPr/></pic:nvPicPr>
                  <pic:blipFill><a:blip r:embed="rIdQR"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
                  <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${sz}" cy="${sz}"/></a:xfrm>
                    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing></w:r></w:p>`;
    }
  }

  // Build the DOCX XML
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const relsEntries = [];
  if (qrPngBytes) relsEntries.push(`<Relationship Id="rIdQR" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/qr.png"/>`);

  const wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${relsEntries.join('\n  ')}
</Relationships>`;

  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/>
    </w:sectPr>
    ${body}
  </w:body>
</w:document>`;

  // Build files map (text files + binary QR image)
  const textFiles = { '[Content_Types].xml': contentTypes, '_rels/.rels': rels, 'word/_rels/document.xml.rels': wordRels, 'word/document.xml': document };
  const binaryFiles = {};
  if (qrPngBytes) binaryFiles['word/media/qr.png'] = qrPngBytes;

  buildAndDownloadDocx(
    textFiles, binaryFiles,
    `${(about?.name || 'resume').replace(/\s+/g, '_').toLowerCase()}_resume.docx`
  );
}

async function buildAndDownloadDocx(textFiles, binaryFiles, filename) {
  const encoder = new TextEncoder();
  const entries = [];
  const centralDir = [];
  let offset = 0;

  const addFile = (path, data) => {
    const pathBytes = encoder.encode(path);
    const header = new Uint8Array(30 + pathBytes.length);
    const hv = new DataView(header.buffer);
    hv.setUint32(0, 0x04034b50, true);
    hv.setUint16(4, 20, true);
    hv.setUint16(8, 0, true);
    hv.setUint32(14, crc32(data), true);
    hv.setUint32(18, data.length, true);
    hv.setUint32(22, data.length, true);
    hv.setUint16(26, pathBytes.length, true);
    header.set(pathBytes, 30);

    const cdEntry = new Uint8Array(46 + pathBytes.length);
    const cv = new DataView(cdEntry.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint32(16, crc32(data), true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, pathBytes.length, true);
    cv.setUint32(42, offset, true);
    cdEntry.set(pathBytes, 46);

    entries.push(header, data);
    centralDir.push(cdEntry);
    offset += header.length + data.length;
  };

  // Add text files
  for (const [path, content] of Object.entries(textFiles)) {
    addFile(path, encoder.encode(content));
  }

  // Add binary files (QR image)
  for (const [path, data] of Object.entries(binaryFiles)) {
    addFile(path, data);
  }

  const cdOffset = offset;
  let cdSize = 0;
  centralDir.forEach(e => (cdSize += e.length));

  // End of central directory
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, centralDir.length, true);
  ev.setUint16(10, centralDir.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, cdOffset, true);
  ev.setUint16(20, 0, true);

  const blob = new Blob([...entries, ...centralDir, eocd], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// CRC32 implementation
function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
