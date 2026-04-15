import { useState, useEffect } from 'react';
import { X, FileDown, Download, Eye, AlertCircle } from 'lucide-react';
import axios from 'axios';
import generateResumePDF from '../utils/generateResumePDF';
import generateResumeTwoCol from '../utils/generateResumeTwoCol';
import generateResumeModern from '../utils/generateResumeModern';
import generateResumeCreative from '../utils/generateResumeCreative';
import generateResumeExecutive from '../utils/generateResumeExecutive';
import generateResumeTech from '../utils/generateResumeTech';
import generateResumeMinimal from '../utils/generateResumeMinimal';
import generateResumeDOCX from '../utils/generateResumeDOCX';
import { needsDOCX } from '../utils/pdfFontLoader';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ur', label: 'Urdu' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ru', label: 'Russian' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
];

async function translateData(data, lang) {
  // Translation now happens in PublicPortfolio on page load — this is a no-op fallback
  return data;
}

const previews = {
  classic: (
    <div className="w-full h-full bg-white rounded-sm p-1.5 flex flex-col items-center">
      <div className="w-10 h-1 bg-gray-800 rounded-full mb-0.5" />
      <div className="w-7 h-0.5 bg-gray-300 rounded-full mb-1" />
      <div className="w-full h-px bg-gray-300 mb-1" />
      <div className="w-full space-y-0.5">{[1,2,3].map(i=><div key={i} className="flex gap-1"><div className="w-1 h-0.5 bg-gray-400 rounded-full mt-0.5 flex-shrink-0"/><div className="flex-1 h-0.5 bg-gray-200 rounded-full"/></div>)}</div>
    </div>
  ),
  twocol: (
    <div className="w-full h-full rounded-sm flex overflow-hidden">
      <div className="w-[35%] h-full bg-gray-800 p-1 flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-violet-500 mb-0.5" />
        <div className="w-5 h-0.5 bg-gray-500 rounded-full mb-0.5" />
        <div className="w-4 h-0.5 bg-gray-600 rounded-full" />
      </div>
      <div className="flex-1 bg-white p-1 space-y-0.5">
        <div className="w-8 h-0.5 bg-gray-800 rounded-full" />
        <div className="w-full h-px bg-gray-200" />
        <div className="w-full h-0.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  ),
  modern: (
    <div className="w-full h-full bg-white rounded-sm flex flex-col overflow-hidden">
      <div className="w-full h-4 bg-blue-600 p-0.5 pl-1">
        <div className="w-6 h-0.5 bg-white/80 rounded-full mb-0.5" />
        <div className="w-4 h-0.5 bg-blue-200 rounded-full" />
      </div>
      <div className="p-1 space-y-0.5 flex-1">
        <div className="w-5 h-0.5 bg-blue-600 rounded-full" />
        <div className="w-full h-0.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  ),
  creative: (
    <div className="w-full h-full rounded-sm flex overflow-hidden">
      <div className="w-[30%] h-full bg-purple-50 border-l-2 border-purple-500 p-1 flex flex-col">
        <div className="w-4 h-0.5 bg-purple-700 rounded-full mb-0.5" />
        <div className="w-3 h-0.5 bg-purple-300 rounded-full mb-1" />
        <div className="flex flex-wrap gap-0.5">{[1,2,3].map(i=><div key={i} className="w-2 h-1 bg-purple-100 border border-purple-200 rounded-sm"/>)}</div>
      </div>
      <div className="flex-1 bg-white p-1 space-y-0.5">
        <div className="w-6 h-0.5 bg-purple-700 rounded-full" />
        <div className="w-full h-0.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  ),
  executive: (
    <div className="w-full h-full bg-white rounded-sm p-1.5 flex flex-col items-center">
      <div className="w-full h-px bg-gray-400 mb-0.5" />
      <div className="w-8 h-1 bg-gray-900 rounded-full mb-0.5" />
      <div className="w-5 h-0.5 bg-gray-400 rounded-full mb-0.5" />
      <div className="w-full h-px bg-gray-400 mb-1" />
      <div className="w-full h-0.5 bg-gray-200 rounded-full" />
    </div>
  ),
  tech: (
    <div className="w-full h-full bg-white rounded-sm flex flex-col overflow-hidden">
      <div className="w-full h-0.5 bg-gray-900" />
      <div className="w-full h-px bg-green-500" />
      <div className="p-1 space-y-0.5 flex-1">
        <div className="w-7 h-0.5 bg-gray-900 rounded-full" />
        <div className="w-5 h-0.5 bg-green-600 rounded-full" />
        <div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(i=><div key={i} className={`w-1 h-1 rounded-full ${i<=3?'bg-green-500':'bg-gray-200'}`}/>)}</div>
      </div>
    </div>
  ),
  minimal: (
    <div className="w-full h-full bg-white rounded-sm p-2 flex flex-col">
      <div className="w-8 h-1.5 bg-gray-900 rounded-full mb-1" />
      <div className="w-5 h-0.5 bg-gray-300 rounded-full mb-1.5" />
      <div className="w-full h-px bg-gray-200 mb-1.5" />
      <div className="w-3 h-0.5 bg-gray-400 rounded-full mb-0.5" />
      <div className="w-full h-0.5 bg-gray-200 rounded-full" />
    </div>
  ),
};

const templates = [
  { key: 'classic', name: 'Classic', generate: generateResumePDF },
  { key: 'twocol', name: 'Two Column', generate: generateResumeTwoCol },
  { key: 'modern', name: 'Modern', generate: generateResumeModern },
  { key: 'creative', name: 'Creative', generate: generateResumeCreative },
  { key: 'executive', name: 'Executive', generate: generateResumeExecutive },
  { key: 'tech', name: 'Tech', generate: generateResumeTech },
  { key: 'minimal', name: 'Minimal', generate: generateResumeMinimal },
];

const ResumeModal = ({ open, onClose, data, isTranslating }) => {
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(null);
  const busy = !!loading || isTranslating;

  const lang = data?.about?.language || 'en';
  const forceDOCX = needsDOCX(lang);
  const effectiveFormat = forceDOCX ? 'docx' : format;

  // Pre-cache fonts/QR when modal opens
  useEffect(() => {
    if (!open || !data) return;
    if (lang === 'tr') {
      fetch('/NotoSans-Regular.ttf').catch(() => {});
      fetch('/NotoSans-Bold.ttf').catch(() => {});
    }
    if (data.username) fetch(`${API}/qr?text=${encodeURIComponent(window.location.origin + '/portfolio/' + data.username)}`).catch(() => {});
  }, [open]);

  if (!open) return null;

  const handleAction = async (template, action) => {
    const key = template?.key || 'docx';
    setLoading(key + '-' + action);

    let previewWin = null;
    if (action === 'preview') {
      previewWin = window.open('', '_blank');
      if (previewWin) previewWin.document.write('<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:#fff;font-family:sans-serif"><p>Generating resume...</p></body></html>');
    }

    try {
      // Data is already translated (done on page load)
      if (effectiveFormat === 'docx') {
        await generateResumeDOCX(data);
      } else {
        const result = await template.generate(data);
        if (result?.doc) {
          if (action === 'preview' && previewWin) {
            previewWin.location.href = URL.createObjectURL(result.doc.output('blob'));
          } else {
            result.doc.save(result.fileName);
          }
        }
      }
    } catch (err) {
      console.error('Resume action failed:', err);
      if (previewWin) previewWin.document.write('<p style="color:red">Failed. Try again.</p>');
    }
    setLoading(null);
    if (action === 'download') onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="rounded-2xl w-full max-w-3xl overflow-hidden animate-slide-up"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-heading)' }}>Download Resume</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Choose a template and format</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <X size={18} />
          </button>
        </div>

        {/* Controls row */}
        <div className="px-5 pt-4 flex flex-wrap items-center gap-4">
          {!forceDOCX ? (
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
              {[{ id: 'pdf', label: 'PDF' }, { id: 'docx', label: 'DOCX' }].map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  className="px-5 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: format === f.id ? 'rgba(var(--brand-rgb), 0.2)' : 'transparent',
                    color: format === f.id ? 'var(--color-brand)' : 'var(--color-text-muted)',
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
              <AlertCircle size={14} />
              <span>{LANGUAGES.find(l => l.code === lang)?.label} uses DOCX format — Word handles all scripts perfectly</span>
            </div>
          )}
          {lang !== 'en' && !forceDOCX && (
            <span className="text-[10px]" style={{ color: 'var(--color-brand)' }}>
              Auto-translating to {LANGUAGES.find(l => l.code === lang)?.label || lang}
            </span>
          )}
        </div>

        {/* Translating indicator */}
        {isTranslating && (
          <div className="mx-5 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(var(--brand-rgb), 0.08)', border: '1px solid rgba(var(--brand-rgb), 0.15)', color: 'var(--color-brand)' }}>
            <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
            Translating resume to {LANGUAGES.find(l => l.code === lang)?.label || lang}...
          </div>
        )}

        {/* Templates or DOCX download */}
        {effectiveFormat === 'pdf' ? (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto">
            {templates.map(t => (
              <div key={t.key}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div className="w-full aspect-[3/4] rounded-md overflow-hidden shadow-sm"
                  style={{ border: '1px solid var(--glass-border)' }}>
                  {previews[t.key]}
                </div>
                <p className="text-xs font-semibold" style={{ color: 'var(--color-heading)' }}>{t.name}</p>
                <div className="flex items-center gap-2 w-full">
                  <button onClick={() => handleAction(t, 'preview')} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-40"
                    style={{ background: 'var(--glass-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.3)'; e.currentTarget.style.color = 'var(--color-brand)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
                    {loading === t.key + '-preview' ? <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <><Eye size={12} /> Preview</>}
                  </button>
                  <button onClick={() => handleAction(t, 'download')} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-white transition-all disabled:opacity-40"
                    style={{ background: 'var(--color-brand)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    {loading === t.key + '-download' ? <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><Download size={12} /> Save</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <button onClick={() => handleAction(null, 'download')} disabled={busy}
              className="w-full flex items-center gap-4 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
              <div className="w-14 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                {loading === 'docx-download'
                  ? <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                  : <FileDown size={24} className="text-blue-400" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>Download as Word Document</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  ATS-optimized .docx — supports all languages natively.
                </p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
