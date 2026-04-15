import { jsPDF } from 'jspdf';
import { getLabels } from './resumeI18n';
import { addPortfolioQR } from './resumeQR';
import { registerNotoSans, needsUnicodeFont } from './pdfFontLoader';

const C = {
  black:    [0, 0, 0],
  dark:     [24, 24, 27],
  text:     [63, 63, 70],
  muted:    [113, 113, 122],
  green:    [34, 197, 94],
  greenDk:  [22, 163, 74],
  link:     [22, 163, 74],
  line:     [212, 212, 216],
  lineDark: [161, 161, 170],
  white:    [255, 255, 255],
  codeBg:   [244, 244, 245],
  dotFill:  [34, 197, 94],
  dotEmpty: [212, 212, 216],
};

const PW = 210, PH = 297;
const ML = 18, MR = 18, MT = 18, MB = 18;
const CW = PW - ML - MR;

export default async function generateResumeTech({ about, skills, experience, education, services, username }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const labels = getLabels(about?.language);
  const useNoto = needsUnicodeFont(about?.language);
  if (useNoto) await registerNotoSans(doc, about?.language);
  let y = MT;

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'helvetica', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };

  const setMono = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'courier', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) { doc.addPage(); y = MT; }
  };

  const sectionTitle = (title) => {
    checkPage(16);
    y += 4;
    // Monospace header with code-style prefix
    setMono('bold', 10);
    doc.setTextColor(...C.greenDk);
    doc.text(`> ${title.toUpperCase()}`, ML, y);
    y += 2;
    // Dashed line
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([1.5, 1], 0);
    doc.line(ML, y, PW - MR, y);
    doc.setLineDashPattern([], 0);
    y += 6;
  };

  // ── HEADER ──
  // Top accent bar
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, PW, 2, 'F');
  doc.setFillColor(...C.green);
  doc.rect(0, 2, PW, 0.8, 'F');

  y = MT + 2;

  // Name
  setFont('bold', 22);
  doc.setTextColor(...C.dark);
  doc.text((about?.name || 'Resume'), ML, y);
  y += 7;

  // Title with code-style
  if (about?.title) {
    setMono('normal', 10);
    doc.setTextColor(...C.greenDk);
    doc.text(`// ${about.title}`, ML, y);
    y += 6;
  }

  // Contact as key-value pairs
  const contactItems = [];
  if (about?.email) contactItems.push({ key: 'email', val: about.email });
  if (about?.phone) contactItems.push({ key: 'phone', val: about.phone });
  if (about?.city && about?.country) contactItems.push({ key: 'location', val: `${about.city}, ${about.country}` });

  if (contactItems.length) {
    setMono('normal', 8);
    contactItems.forEach(item => {
      doc.setTextColor(...C.muted);
      doc.text(`${item.key}: `, ML, y);
      const keyW = doc.getTextWidth(`${item.key}: `);
      doc.setTextColor(...C.dark);
      doc.text(item.val, ML + keyW, y);
      y += 4;
    });
    y += 2;
  }

  // Social links
  if (about?.linkedin || about?.github) {
    setMono('normal', 8);
    if (about?.linkedin) {
      const url = about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`;
      const label = `linkedin.com/in/${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`;
      doc.setTextColor(...C.muted);
      doc.text('linkedin: ', ML, y);
      const kw = doc.getTextWidth('linkedin: ');
      doc.setTextColor(...C.link);
      doc.textWithLink(label, ML + kw, y, { url });
      y += 4;
    }
    if (about?.github) {
      const url = about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`;
      const label = `github.com/${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`;
      doc.setTextColor(...C.muted);
      doc.text('github: ', ML, y);
      const kw = doc.getTextWidth('github: ');
      doc.setTextColor(...C.link);
      doc.textWithLink(label, ML + kw, y, { url });
      y += 4;
    }
    y += 2;
  }

  // Divider
  doc.setDrawColor(...C.lineDark);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 4;

  // ── PROFILE ──
  if (about?.bio) {
    sectionTitle(labels.summary.toUpperCase());
    setFont('normal', 9.5);
    doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, CW);
    checkPage(lines.length * 4.3 + 4);
    doc.text(lines, ML, y);
    y += lines.length * 4.3 + 4;
  }

  // ── SKILLS — grouped with proficiency dots ──
  if (skills?.length) {
    sectionTitle(labels.skills.toUpperCase());

    const dotR = 1.2;
    const dotGap = 3.5;
    const maxDots = 5;
    const labelW = 55;

    skills.forEach(s => {
      checkPage(7);
      setFont('normal', 9);
      doc.setTextColor(...C.dark);
      doc.text(s.name, ML, y + 1);

      // Proficiency dots
      const levelMap = { Expert: 5, Advanced: 4, Intermediate: 3, Basic: 2, Beginner: 1 };
      const level = levelMap[s.level] || 3;
      const dotStartX = ML + labelW;
      for (let d = 0; d < maxDots; d++) {
        const dx = dotStartX + d * dotGap;
        if (d < level) {
          doc.setFillColor(...C.dotFill);
          doc.circle(dx, y, dotR, 'F');
        } else {
          doc.setDrawColor(...C.dotEmpty);
          doc.setLineWidth(0.3);
          doc.circle(dx, y, dotR, 'S');
        }
      }

      // Level label
      const levelLabels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
      setMono('normal', 7);
      doc.setTextColor(...C.muted);
      doc.text(levelLabels[Math.min(level, 5) - 1] || 'Intermediate', dotStartX + maxDots * dotGap + 2, y + 1);

      y += 6.5;
    });
    y += 2;
  }

  // ── EXPERIENCE ──
  if (experience?.length) {
    sectionTitle(labels.experience.toUpperCase());
    experience.forEach((exp, idx) => {
      checkPage(22);

      setFont('bold', 10);
      doc.setTextColor(...C.dark);
      doc.text(exp.title, ML, y);

      setMono('normal', 8);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9);
      doc.setTextColor(...C.greenDk);
      doc.text(`@ ${exp.company}${exp.location ? '  |  ' + exp.location : ''}`, ML, y);
      y += 5;

      if (exp.description) {
        setFont('normal', 9);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, CW - 6);
        checkPage(dl.length * 4 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            setMono('normal', 9);
            doc.setTextColor(...C.green);
            doc.text('>', ML + 1, y);
            setFont('normal', 9);
            doc.setTextColor(...C.text);
            doc.text(line, ML + 5, y);
          } else {
            doc.text(line, ML + 5, y);
          }
          y += 4;
        });
      }
      y += idx < experience.length - 1 ? 5 : 2;
    });
  }

  // ── EDUCATION ──
  if (education?.length) {
    sectionTitle(labels.education.toUpperCase());
    education.forEach((edu, idx) => {
      checkPage(18);

      setFont('bold', 10);
      doc.setTextColor(...C.dark);
      doc.text(edu.degree, ML, y);

      setMono('normal', 8);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9);
      doc.setTextColor(...C.greenDk);
      doc.text(`@ ${edu.institution}`, ML, y);
      y += 5;

      if (edu.description) {
        setFont('normal', 9);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, CW - 6);
        checkPage(dl.length * 4 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            setMono('normal', 9);
            doc.setTextColor(...C.green);
            doc.text('>', ML + 1, y);
            setFont('normal', 9);
            doc.setTextColor(...C.text);
            doc.text(line, ML + 5, y);
          } else {
            doc.text(line, ML + 5, y);
          }
          y += 4;
        });
      }
      y += idx < education.length - 1 ? 4 : 2;
    });
  }

  // ── SERVICES ──
  if (services?.length) {
    sectionTitle(labels.services.toUpperCase());
    services.forEach((s, idx) => {
      checkPage(14);
      setFont('bold', 9.5);
      doc.setTextColor(...C.dark);
      setMono('normal', 9);
      doc.setTextColor(...C.green);
      doc.text('$', ML, y);
      setFont('bold', 9.5);
      doc.setTextColor(...C.dark);
      doc.text(s.title, ML + 4, y);
      y += 4.5;

      if (s.description) {
        setFont('normal', 9);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(s.description, CW - 5);
        checkPage(dl.length * 4 + 4);
        doc.text(dl, ML + 4, y);
        y += dl.length * 4;
      }
      y += idx < services.length - 1 ? 3 : 1;
    });
  }

  // ── FOOTER ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setMono('normal', 7);
    doc.setTextColor(...C.muted);
    doc.text(`// page ${i} of ${pageCount}`, PW - MR, PH - 8, { align: 'right' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  await addPortfolioQR(doc, username, labels.scanPortfolio, PW, MR);
  return { doc, fileName: `${fileName}_resume.pdf` };
}
