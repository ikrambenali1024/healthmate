import { useState, useRef, useEffect } from 'react';

const API = 'http://localhost:5000/api/chat';

const SUGGESTIONS = [
  "Je me sens anxieux aujourd'hui",
  "J'ai du mal à dormir",
  "Je me sens débordé par le stress",
  "Je veux apprendre à méditer",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis MindMate 🌿 Ton espace safe pour parler de ton bien-être mental. Comment tu te sens aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      }
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "Désolé, je rencontre un problème technique. Réessaie dans un moment 🙏"
      }]);
    }
    setLoading(false);
  };
   const clearChat = () => {
    setMessages([{
    role: 'assistant',
    content: "Bonjour ! Je suis MindMate 🌿 Ton espace safe pour parler de ton bien-être mental. Comment tu te sens aujourd'hui ?"
  }]);
  setInput('');
};
  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #E8648A, #C44B72)',
          border: 'none', cursor: 'pointer', fontSize: '26px',
          boxShadow: '0 4px 20px rgba(232,100,138,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '🧠'}
      </button>

      {/* Fenêtre chat */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px', zIndex: 999,
          width: '360px', height: '520px',
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          border: '1.5px solid #FFE4EC', overflow: 'hidden'
        }}>

          {/* Header */}
<div style={{
  background: 'linear-gradient(135deg, #E8648A, #C44B72)',
  padding: '16px 20px', color: '#fff'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{
      width: '38px', height: '38px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px'
    }}>🌿</div>
    <div>
      <div style={{ fontWeight: 700, fontSize: '15px' }}>MindMate</div>
      <div style={{ fontSize: '11px', opacity: 0.8 }}>Ton assistant bien-être mental</div>
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* ← BOUTON EFFACER */}
      <button
        onClick={clearChat}
        title="Effacer la conversation"
        style={{
          background: 'rgba(255,255,255,0.2)', border: 'none',
          borderRadius: '8px', color: '#fff', cursor: 'pointer',
          fontSize: '12px', fontWeight: 600, padding: '4px 10px'
        }}
      >
        🗑️ Effacer
      </button>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
    </div>
  </div>
</div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #E8648A, #C44B72)'
                    : '#F6F7FB',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  fontSize: '13.5px', lineHeight: '1.5'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px', borderRadius: '18px 18px 18px 4px',
                  background: '#F6F7FB', color: '#999', fontSize: '13px'
                }}>
                  MindMate écrit...
                </div>
              </div>
            )}

            {/* Suggestions (seulement au début) */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} style={{
                    padding: '8px 12px', borderRadius: '12px',
                    border: '1.5px solid #E8648A', background: 'transparent',
                    color: '#E8648A', fontSize: '12px', cursor: 'pointer',
                    textAlign: 'left', transition: 'background 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF0F4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #F0F0F0',
            display: 'flex', gap: '8px', alignItems: 'center'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Écris ce que tu ressens..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '999px',
                border: '1.5px solid #E8648A', outline: 'none',
                fontSize: '13px', color: '#333'
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, #E8648A, #C44B72)' : '#eee',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}