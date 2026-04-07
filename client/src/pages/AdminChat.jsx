import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import socket from '../socket';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const bottomRef               = useRef(null);
  const navigate                = useNavigate();

  useEffect(() => {
    socket.on('history', (history) => setMessages(history));
    socket.on('new:message', (msg) => setMessages(prev => [...prev, msg]));
    return () => {
      socket.off('history');
      socket.off('new:message');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = () => {
    if (!text.trim()) return;
    socket.emit('admin:message', { text: text.trim() });
    setText('');
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0f13' }}>

      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="text-lg font-bold text-white tracking-tight">Live Chat</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" /> Live
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <p className="text-slate-600 text-sm text-center mt-16">No messages yet. Waiting for visitors...</p>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.from === 'admin' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[11px] text-slate-500 mb-1 px-1">
              {msg.from === 'admin' ? 'You' : msg.name} · {formatTime(msg.time)}
            </span>
            <div
              className="px-4 py-2.5 rounded-2xl text-sm max-w-[70%]"
              style={{
                background: msg.from === 'admin'
                  ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                  : 'rgba(255,255,255,0.07)',
                color: msg.from === 'admin' ? '#fff' : '#e2e8f0',
                border: msg.from === 'visitor' ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div
        className="px-6 py-4 max-w-3xl w-full mx-auto"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type your reply..."
            className="flex-1 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendReply()}
          />
          <button
            onClick={sendReply}
            className="px-5 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Send size={16} /> Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
