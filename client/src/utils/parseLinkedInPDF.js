/**
 * Parse a LinkedIn PDF export and extract structured resume data.
 * LinkedIn PDFs have a consistent format:
 * - Name at top
 * - Title/headline
 * - Contact info
 * - Summary
 * - Experience section
 * - Education section
 * - Skills section
 *
 * Uses jsPDF's text extraction or raw text input.
 */

const SECTION_HEADERS = [
  'experience', 'education', 'skills', 'summary', 'about',
  'licenses & certifications', 'certifications', 'volunteer',
  'projects', 'languages', 'honors & awards', 'publications',
  'courses', 'organizations', 'recommendations',
];

function isSectionHeader(line) {
  return SECTION_HEADERS.includes(line.toLowerCase().trim());
}

function parseDate(str) {
  if (!str) return '';
  // "Jan 2020" or "2020" or "Present"
  const cleaned = str.trim();
  if (cleaned.toLowerCase() === 'present') return 'Present';
  return cleaned;
}

function parseDateRange(text) {
  // "Jan 2020 - Present" or "2018 - 2022" or "Jan 2020 - Dec 2023"
  const match = text.match(/(.+?)\s*[-–]\s*(.+)/);
  if (match) return { startDate: parseDate(match[1]), endDate: parseDate(match[2]) };
  return { startDate: parseDate(text), endDate: '' };
}

export function parseLinkedInText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 3) return null;

  const result = {
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    bio: '',
    experience: [],
    education: [],
    skills: [],
  };

  // First non-empty line is usually the name
  result.name = lines[0] || '';

  // Second line is usually the headline/title
  if (lines[1] && !isSectionHeader(lines[1])) {
    result.title = lines[1];
  }

  // Find location (usually "City, Country" pattern near top)
  for (let i = 2; i < Math.min(lines.length, 8); i++) {
    if (/^[A-Z][a-z]+,\s*[A-Z]/.test(lines[i]) && !isSectionHeader(lines[i])) {
      result.location = lines[i];
      break;
    }
  }

  // Find sections
  let currentSection = 'header';
  let sectionLines = {};
  let i = 2;

  while (i < lines.length) {
    const line = lines[i];
    if (isSectionHeader(line)) {
      currentSection = line.toLowerCase().trim();
      if (currentSection === 'about') currentSection = 'summary';
      sectionLines[currentSection] = [];
    } else if (sectionLines[currentSection]) {
      sectionLines[currentSection].push(line);
    }
    i++;
  }

  // Parse Summary
  if (sectionLines['summary']) {
    result.bio = sectionLines['summary'].join(' ').trim();
  }

  // Parse Experience
  if (sectionLines['experience']) {
    const expLines = sectionLines['experience'];
    let j = 0;
    while (j < expLines.length) {
      const titleLine = expLines[j];
      // Skip if it looks like a date range or company
      if (!titleLine) { j++; continue; }

      const exp = { title: titleLine, company: '', startDate: '', endDate: '', location: '', description: '' };

      // Next line might be company or "Company · Full-time"
      if (j + 1 < expLines.length) {
        const next = expLines[j + 1];
        if (next.includes('·')) {
          exp.company = next.split('·')[0].trim();
          j++;
        } else if (!next.match(/\d{4}/) && !isSectionHeader(next)) {
          exp.company = next;
          j++;
        }
      }

      // Look for date range
      if (j + 1 < expLines.length) {
        const dateLine = expLines[j + 1];
        if (dateLine && dateLine.match(/\d{4}/)) {
          const { startDate, endDate } = parseDateRange(dateLine);
          exp.startDate = startDate;
          exp.endDate = endDate;
          j++;
        }
      }

      // Look for location
      if (j + 1 < expLines.length) {
        const locLine = expLines[j + 1];
        if (locLine && /^[A-Z][a-z]+/.test(locLine) && !locLine.match(/\d{4}/) && locLine.length < 60) {
          exp.location = locLine;
          j++;
        }
      }

      // Collect description lines until next entry or section
      const descParts = [];
      while (j + 1 < expLines.length) {
        const nextLine = expLines[j + 1];
        // Stop if it looks like a new job title (short, capitalized, no period)
        if (nextLine.length < 60 && /^[A-Z]/.test(nextLine) && !nextLine.endsWith('.') && !nextLine.includes('·')) break;
        if (isSectionHeader(nextLine)) break;
        descParts.push(nextLine);
        j++;
      }
      exp.description = descParts.join(' ').trim();

      if (exp.title) result.experience.push(exp);
      j++;
    }
  }

  // Parse Education
  if (sectionLines['education']) {
    const eduLines = sectionLines['education'];
    let j = 0;
    while (j < eduLines.length) {
      const edu = { institution: eduLines[j] || '', degree: '', startDate: '', endDate: '', description: '' };

      if (j + 1 < eduLines.length && !eduLines[j + 1].match(/^\d{4}/)) {
        edu.degree = eduLines[j + 1];
        j++;
      }

      if (j + 1 < eduLines.length && eduLines[j + 1].match(/\d{4}/)) {
        const { startDate, endDate } = parseDateRange(eduLines[j + 1]);
        edu.startDate = startDate;
        edu.endDate = endDate;
        j++;
      }

      if (edu.institution) result.education.push(edu);
      j++;
    }
  }

  // Parse Skills
  if (sectionLines['skills']) {
    sectionLines['skills'].forEach(line => {
      // LinkedIn skills are usually one per line, sometimes with endorsement count
      const cleaned = line.replace(/\d+\s*(endorsement|recommendation)s?/i, '').trim();
      if (cleaned && cleaned.length < 50) {
        result.skills.push({ name: cleaned, category: 'General', level: 'Intermediate' });
      }
    });
  }

  // Extract email from anywhere in text
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) result.email = emailMatch[0];

  // Extract phone
  const phoneMatch = rawText.match(/[\+]?[\d\s\-\(\)]{10,}/);
  if (phoneMatch) result.phone = phoneMatch[0].trim();

  // Extract LinkedIn URL
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[\w-]+/);
  if (linkedinMatch) result.linkedin = linkedinMatch[0];

  return result;
}
