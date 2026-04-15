import { jsPDF } from 'jspdf';
import { getLabels } from './resumeI18n';
import { makeCircularImage, addCircularAvatar, drawInitialsCircle } from './pdfAvatarHelper';
import { addPortfolioQR } from './resumeQR';
import { registerNotoSans, needsUnicodeFont } from './pdfFontLoader';

const C = {
  primary:  [37, 99, 235],
  black:    [0, 0, 0],
  dark:     [30, 30, 30],
  text:     [55, 65, 81],
  muted:    [107, 114, 128],
  link:     [37, 99, 235],
  line:     [209, 213, 219],
  white:    [255, 255, 255],
  headerBg: [37, 99, 235],
  lightBg:  [243, 244, 246],
};

const PW = 210, PH = 297;
const ML = 18, MR = 18, MT = 18, MB = 18;
const CW = PW - ML - MR;

export default async function generateResumeModern({ about, skills, experience, education, services, username }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const labels = getLabels(about?.language);
  const useNoto = needsUnicodeFont(about?.language);
  if (useNoto) await registerNotoSans(doc, about?.language);
  let y = 0;

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'helvetica', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) { doc.addPage(); drawHeaderStripe(); y = MT; }
  };

  // Colored header bar at top of each page
  const drawHeaderStripe = () => {
    doc.setFillColor(...C.headerBg);
    doc.rect(0, 0, PW, 3, 'F');
  };

  const sectionTitle = (title) => {
    checkPage(16);
    y += 4;
    setFont('bold', 11);
    doc.setTextColor(...C.primary);
    doc.text(title.toUpperCase(), ML, y);
    y += 2;
    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.6);
    doc.line(ML, y, ML + 28, y);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.15);
    doc.line(ML + 28, y, PW - MR, y);
    y += 6;
  };

  // ── PAGE 1 HEADER ──
  drawHeaderStripe();

  // Calculate header height based on content
  const headerH = 50;
  doc.setFillColor(...C.headerBg);
  doc.rect(0, 3, PW, headerH, 'F');

  // Avatar in header (right side, circular) if available
  const avatarDiam = 28;
  const avatarX = PW - MR - avatarDiam;
  const avatarY = 3 + (headerH - avatarDiam) / 2;
  const hasAvatar = about?.avatar && about.avatar.startsWith('data:image');

  if (hasAvatar) {
    try {
      const circImg = await makeCircularImage(about.avatar, 400);
      addCircularAvatar(doc, circImg, avatarX, avatarY, avatarDiam, C.white, 1.5);
    } catch {
      // fallback: skip avatar
    }
  }

  const textMaxW = hasAvatar ? PW - MR - avatarDiam - 8 - ML : PW - MR - ML;
  y = 18;

  // Name
  setFont('bold', 24);
  doc.setTextColor(...C.white);
  doc.text((about?.name || 'Resume'), ML, y);
  y += 8;

  // Title
  if (about?.title) {
    setFont('normal', 12);
    doc.setTextColor(200, 215, 255);
    doc.text(about.title, ML, y);
    y += 6;
  }

  // Contact in header
  const contactParts = [];
  if (about?.email) contactParts.push(about.email);
  if (about?.phone) contactParts.push(about.phone);
  if (about?.city && about?.country) contactParts.push(`${about.city}, ${about.country}`);

  if (contactParts.length) {
    setFont('normal', 8.5);
    doc.setTextColor(200, 215, 255);
    doc.text(contactParts.join('  •  '), ML, y);
    y += 4.5;
  }

  // Social links inside header
  const socialParts = [];
  if (about?.linkedin) {
    const url = about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`;
    const label = `linkedin.com/in/${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`;
    socialParts.push({ label, url });
  }
  if (about?.github) {
    const url = about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`;
    const label = `github.com/${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`;
    socialParts.push({ label, url });
  }

  if (socialParts.length) {
    setFont('normal', 8);
    let sx = ML;
    socialParts.forEach((item, i) => {
      if (i > 0) {
        doc.setTextColor(180, 200, 255);
        const sep = '   |   ';
        doc.text(sep, sx, y);
        sx += doc.getTextWidth(sep);
      }
      doc.setTextColor(...C.white);
      doc.textWithLink(item.label, sx, y, { url: item.url });
      sx += doc.getTextWidth(item.label);
    });
    y += 5;
  }

  y = 3 + headerH + 8; // Position after header block

  // ── PROFILE ──
  if (about?.bio) {
    sectionTitle(labels.summary);
    setFont('normal', 10);
    doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, CW);
    checkPage(lines.length * 4.5 + 4);
    doc.text(lines, ML, y);
    y += lines.length * 4.5 + 4;
  }

  // ── EXPERIENCE ──
  if (experience?.length) {
    sectionTitle(labels.experience);
    experience.forEach((exp, idx) => {
      checkPage(22);

      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(exp.title, ML, y);

      setFont('normal', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9.5);
      doc.setTextColor(...C.primary);
      doc.text(`${exp.company}${exp.location ? '  •  ' + exp.location : ''}`, ML, y);
      y += 5;

      if (exp.description) {
        setFont('normal', 9.5);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, CW - 5);
        checkPage(dl.length * 4.2 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            doc.text('–', ML + 1, y);
            doc.text(line, ML + 5, y);
          } else {
            doc.text(line, ML + 5, y);
          }
          y += 4.2;
        });
      }
      y += idx < experience.length - 1 ? 4 : 2;
    });
  }

  // ── EDUCATION ──
  if (education?.length) {
    sectionTitle(labels.education);
    education.forEach((edu, idx) => {
      checkPage(18);

      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(edu.degree, ML, y);

      setFont('normal', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9.5);
      doc.setTextColor(...C.primary);
      doc.text(edu.institution, ML, y);
      y += 5;

      if (edu.description) {
        setFont('normal', 9.5);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, CW - 5);
        checkPage(dl.length * 4.2 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            doc.text('–', ML + 1, y);
            doc.text(line, ML + 5, y);
          } else {
            doc.text(line, ML + 5, y);
          }
          y += 4.2;
        });
      }
      y += idx < education.length - 1 ? 4 : 2;
    });
  }

  // ── SKILLS — horizontal bars ──
  if (skills?.length) {
    sectionTitle(labels.skills);
    const barMaxW = 50;
    const barH = 3.5;
    const labelW = CW - barMaxW - 8;

    skills.forEach(s => {
      checkPage(8);
      setFont('normal', 9);
      doc.setTextColor(...C.dark);
      doc.text(s.name, ML, y + 2.5);

      // Background bar
      const barX = ML + labelW + 4;
      doc.setFillColor(...C.lightBg);
      doc.rect(barX, y, barMaxW, barH, 'F');

      // Filled bar (map level string to percentage)
      const levelMap = { Expert: 0.95, Intermediate: 0.65, Beginner: 0.35 };
      const pct = levelMap[s.level] || 0.65;
      const fillW = barMaxW * pct;
      doc.setFillColor(...C.primary);
      doc.rect(barX, y, fillW, barH, 'F');

      y += 7;
    });
    y += 2;
  }

  // ── SERVICES ──
  if (services?.length) {
    sectionTitle(labels.services);
    services.forEach((s, idx) => {
      checkPage(14);
      setFont('bold', 9.5);
      doc.setTextColor(...C.dark);
      doc.text('•', ML, y);
      doc.text(s.title, ML + 4, y);
      y += 4.5;

      if (s.description) {
        setFont('normal', 9.5);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(s.description, CW - 5);
        checkPage(dl.length * 4.2 + 4);
        doc.text(dl, ML + 4, y);
        y += dl.length * 4.2;
      }
      y += idx < services.length - 1 ? 3 : 1;
    });
  }

  // ── FOOTER ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    if (i > 1) drawHeaderStripe();
    setFont('normal', 7.5);
    doc.setTextColor(...C.muted);
    doc.text(`Page ${i} of ${pageCount}`, PW / 2, PH - 8, { align: 'center' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  await addPortfolioQR(doc, username, labels.scanPortfolio, PW, MR);
  return { doc, fileName: `${fileName}_resume.pdf` };
}
