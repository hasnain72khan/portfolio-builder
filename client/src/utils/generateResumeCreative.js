import { jsPDF } from 'jspdf';
import { getLabels } from './resumeI18n';
import { makeCircularImage, addCircularAvatar } from './pdfAvatarHelper';
import { addPortfolioQR } from './resumeQR';
import { registerNotoSans, needsUnicodeFont } from './pdfFontLoader';

const C = {
  accent:   [168, 85, 247],
  accentDk: [126, 34, 206],
  black:    [0, 0, 0],
  dark:     [30, 30, 30],
  text:     [55, 65, 81],
  muted:    [107, 114, 128],
  link:     [126, 34, 206],
  line:     [209, 213, 219],
  white:    [255, 255, 255],
  sidebarBg:[248, 240, 255],
  tagBg:    [243, 232, 255],
  tagBorder:[216, 180, 254],
  dotBg:    [233, 213, 255],
};

const PW = 210, PH = 297;
const SIDE_W = 54;
const SL = 8, SR = 6;
const SW = SIDE_W - SL - SR;
const MAIN_L = SIDE_W + 10, MAIN_R = 14;
const MAIN_W = PW - MAIN_L - MAIN_R;
const MT = 16, MB = 16;

export default async function generateResumeCreative({ about, skills, experience, education, services, username }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const labels = getLabels(about?.language);
  const useNoto = needsUnicodeFont(about?.language);
  if (useNoto) await registerNotoSans(doc, about?.language);

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'helvetica', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };

  const drawSidebar = () => {
    doc.setFillColor(...C.sidebarBg);
    doc.rect(0, 0, SIDE_W, PH, 'F');
    // Accent strip on left edge
    doc.setFillColor(...C.accent);
    doc.rect(0, 0, 3, PH, 'F');
  };

  drawSidebar();

  // ══════════════════════════════════════════════════════════
  //  SIDEBAR
  // ══════════════════════════════════════════════════════════
  let sy = MT + 4;

  // Avatar — circular photo if available
  if (about?.avatar && about.avatar.startsWith('data:image')) {
    try {
      const avatarDiam = 24;
      const circImg = await makeCircularImage(about.avatar, 400);
      addCircularAvatar(doc, circImg, SL, sy - 2, avatarDiam, C.accentDk, 1);
      sy += avatarDiam + 4;
    } catch {
      // skip if image fails
    }
  }

  // Name
  setFont('bold', 13);
  doc.setTextColor(...C.accentDk);
  const nameLines = doc.splitTextToSize(about?.name || '', SW);
  nameLines.forEach(line => {
    doc.text(line, SL, sy);
    sy += 5.5;
  });
  sy += 1;

  // Title
  if (about?.title) {
    setFont('normal', 8.5);
    doc.setTextColor(...C.text);
    const titleLines = doc.splitTextToSize(about.title, SW);
    titleLines.forEach(line => {
      doc.text(line, SL, sy);
      sy += 4;
    });
    sy += 4;
  }

  const sideDivider = () => {
    doc.setDrawColor(...C.tagBorder);
    doc.setLineWidth(0.3);
    doc.line(SL, sy, SIDE_W - SR, sy);
    sy += 6;
  };

  const sideSection = (title) => {
    setFont('bold', 8.5);
    doc.setTextColor(...C.accentDk);
    doc.text(title.toUpperCase(), SL, sy);
    sy += 5;
  };

  // Contact
  sideDivider();
  sideSection(labels.contact);

  const contactItems = [];
  if (about?.email) contactItems.push(about.email);
  if (about?.phone) contactItems.push(about.phone);
  if (about?.city && about?.country) contactItems.push(`${about.city}, ${about.country}`);

  setFont('normal', 7.5);
  doc.setTextColor(...C.text);
  contactItems.forEach(item => {
    const lines = doc.splitTextToSize(item, SW);
    lines.forEach(line => { doc.text(line, SL, sy); sy += 3.6; });
    sy += 1.5;
  });

  // Links
  if (about?.linkedin || about?.github) {
    sy += 2;
    sideSection(labels.links);
    setFont('normal', 7.5);

    if (about?.linkedin) {
      const url = about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`;
      const label = `linkedin.com/in/${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`;
      doc.setTextColor(...C.link);
      const ll = doc.splitTextToSize(label, SW);
      ll.forEach(line => { doc.textWithLink(line, SL, sy, { url }); sy += 3.6; });
      sy += 1.5;
    }
    if (about?.github) {
      const url = about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`;
      const label = `github.com/${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`;
      doc.setTextColor(...C.link);
      const ll = doc.splitTextToSize(label, SW);
      ll.forEach(line => { doc.textWithLink(line, SL, sy, { url }); sy += 3.6; });
      sy += 1.5;
    }
  }

  // Skills as tags
  if (skills?.length) {
    sy += 2;
    sideDivider();
    sideSection(labels.skills);

    let tagX = SL;
    const tagH = 5.5;
    const tagPad = 2.5;
    const tagGap = 2;
    const tagRowGap = 2;

    setFont('normal', 7);
    skills.forEach(s => {
      const tw = doc.getTextWidth(s.name) + tagPad * 2;
      if (tagX + tw > SIDE_W - SR) {
        tagX = SL;
        sy += tagH + tagRowGap;
      }
      if (sy > PH - MB - 8) return;

      // Tag background
      doc.setFillColor(...C.tagBg);
      doc.setDrawColor(...C.tagBorder);
      doc.setLineWidth(0.2);
      doc.rect(tagX, sy - 3.8, tw, tagH, 'FD');

      doc.setTextColor(...C.accentDk);
      doc.text(s.name, tagX + tagPad, sy);
      tagX += tw + tagGap;
    });
    sy += tagH + 4;
  }

  // Services in sidebar
  if (services?.length && sy < PH - MB - 25) {
    sideDivider();
    sideSection(labels.services);
    setFont('normal', 7.5);
    doc.setTextColor(...C.text);
    services.forEach(s => {
      if (sy > PH - MB - 5) return;
      const indent = SL + 3;
      const stLines = doc.splitTextToSize(s.title, SW - 3);
      doc.text('•', SL, sy);
      stLines.forEach((line, li) => {
        if (sy > PH - MB - 5) return;
        doc.text(line, indent, sy);
        sy += 3.8;
      });
      sy += 0.5;
    });
  }

  // ══════════════════════════════════════════════════════════
  //  MAIN CONTENT
  // ══════════════════════════════════════════════════════════
  let y = MT;

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) { doc.addPage(); drawSidebar(); y = MT; }
  };

  const mainSection = (title) => {
    checkPage(16);
    y += 3;
    setFont('bold', 11.5);
    doc.setTextColor(...C.accentDk);
    doc.text(title.toUpperCase(), MAIN_L, y);
    y += 2;
    doc.setDrawColor(...C.accent);
    doc.setLineWidth(0.5);
    doc.line(MAIN_L, y, MAIN_L + 22, y);
    y += 6;
  };

  // Timeline dot helper
  const timelineDot = (yPos) => {
    doc.setFillColor(...C.accent);
    doc.circle(MAIN_L - 4, yPos - 1, 1.5, 'F');
    doc.setDrawColor(...C.dotBg);
    doc.setLineWidth(0.3);
    doc.circle(MAIN_L - 4, yPos - 1, 2.5, 'S');
  };

  // Profile
  if (about?.bio) {
    mainSection(labels.summary);
    setFont('normal', 9.5);
    doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, MAIN_W);
    checkPage(lines.length * 4.3 + 4);
    doc.text(lines, MAIN_L, y);
    y += lines.length * 4.3 + 4;
  }

  // Experience with timeline
  if (experience?.length) {
    mainSection(labels.experience);

    experience.forEach((exp, idx) => {
      checkPage(22);
      timelineDot(y);

      // Timeline line
      if (idx < experience.length - 1) {
        doc.setDrawColor(...C.dotBg);
        doc.setLineWidth(0.4);
        doc.line(MAIN_L - 4, y + 1, MAIN_L - 4, y + 20);
      }

      setFont('bold', 10);
      doc.setTextColor(...C.dark);
      doc.text(exp.title, MAIN_L, y);

      setFont('normal', 8.5);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, PW - MAIN_R, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9);
      doc.setTextColor(...C.accent);
      doc.text(`${exp.company}${exp.location ? '  •  ' + exp.location : ''}`, MAIN_L, y);
      y += 5;

      if (exp.description) {
        setFont('normal', 9);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, MAIN_W - 4);
        checkPage(dl.length * 4 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) { doc.text('–', MAIN_L, y); doc.text(line, MAIN_L + 4, y); }
          else { doc.text(line, MAIN_L + 4, y); }
          y += 4;
        });
      }
      y += idx < experience.length - 1 ? 5 : 2;
    });
  }

  // Education with timeline
  if (education?.length) {
    mainSection(labels.education);

    education.forEach((edu, idx) => {
      checkPage(18);
      timelineDot(y);

      if (idx < education.length - 1) {
        doc.setDrawColor(...C.dotBg);
        doc.setLineWidth(0.4);
        doc.line(MAIN_L - 4, y + 1, MAIN_L - 4, y + 16);
      }

      setFont('bold', 10);
      doc.setTextColor(...C.dark);
      doc.text(edu.degree, MAIN_L, y);

      setFont('normal', 8.5);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, PW - MAIN_R, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9);
      doc.setTextColor(...C.accent);
      doc.text(edu.institution, MAIN_L, y);
      y += 5;

      if (edu.description) {
        setFont('normal', 9);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, MAIN_W - 4);
        checkPage(dl.length * 4 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) { doc.text('–', MAIN_L, y); doc.text(line, MAIN_L + 4, y); }
          else { doc.text(line, MAIN_L + 4, y); }
          y += 4;
        });
      }
      y += idx < education.length - 1 ? 5 : 2;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont('normal', 7.5);
    doc.setTextColor(...C.muted);
    doc.text(`Page ${i} of ${pageCount}`, PW - MAIN_R, PH - 8, { align: 'right' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  await addPortfolioQR(doc, username, labels.scanPortfolio, PW, MAIN_R);
  return { doc, fileName: `${fileName}_resume.pdf` };
}
