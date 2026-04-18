import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CONTENT = [
  { icon: '🌟', tag: 'Citation du jour', quote: '"La santé est la plus grande des richesses."', author: '— Virgile', tip: "Commence ta journée par 5 minutes d'étirements pour activer ton corps et ton esprit." },
  { icon: '💪', tag: 'Motivation du jour', quote: '"La régularité est la clé du succès."', author: '— Anonyme', tip: "Bois un grand verre d'eau dès le réveil — cela améliore ton énergie toute la journée." },
  { icon: '🌿', tag: 'Bien-être du jour', quote: '"Prends soin de ton corps, c\'est le seul endroit où tu dois vivre."', author: '— Jim Rohn', tip: "Fais une courte marche de 10 minutes après chaque repas — excellent pour la digestion." },
  { icon: '🧘', tag: 'Sérénité du jour', quote: '"La paix vient de l\'intérieur. Ne la cherche pas à l\'extérieur."', author: '— Bouddha', tip: "Prends 2 minutes pour noter 3 choses positives de ta journée — la gratitude réduit le stress." },
  { icon: '🔥', tag: 'Énergie du jour', quote: '"La motivation vient en faisant, pas en attendant."', author: '— Anonyme', tip: "Prépare tes affaires de sport ce soir — supprimer les frictions facilite le passage à l'action." },
  { icon: '❤️', tag: 'Amour de soi', quote: '"Tu es capable de bien plus que tu ne le crois."', author: '— Anonyme', tip: "Dors 30 minutes de plus ce soir — le sommeil est le meilleur complément de ta performance." },
  { icon: '☀️', tag: 'Nouveau départ', quote: '"Chaque matin est une nouvelle chance de faire mieux."', author: '— Anonyme', tip: "Ajoute une portion de légumes supplémentaire à ton prochain repas — simple et très bénéfique." },
];

export default function DailyGift({ onClose }) {
  const [opened, setOpened] = useState(false);
  const [bouncing, setBouncing] = useState(true);
  const content = CONTENT[new Date().getDay() % CONTENT.length];

  useEffect(() => {
    const t = setTimeout(() => setBouncing(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(232,100,138,0.15)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {!opened ? (
        /* ── Cadeau fermé ── */
        <div style={{ textAlign: 'center' }}>
          <div
            onClick={() => setOpened(true)}
            style={{
              cursor: 'pointer',
              animation: bouncing ? 'giftFloat 2.5s ease-in-out infinite' : 'none',
              display: 'inline-block', transition: 'transform 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '100px', lineHeight: 1 }}>🎁</div>
          </div>
          <p style={{
            marginTop: '20px', color: '#C44B72', fontWeight: 700,
            fontSize: '16px', animation: 'giftPulse 2s ease-in-out infinite'
          }}>
            Tu as un cadeau du jour ! Clique pour l'ouvrir ✨
          </p>
          <style>{`
            @keyframes giftFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
            @keyframes giftPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
          `}</style>
        </div>
      ) : (
        /* ── Cadeau ouvert ── */
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '36px 32px',
          maxWidth: '380px', width: '90%', textAlign: 'center',
          position: 'relative', animation: 'popIn 0.35s cubic-bezier(.34,1.56,.64,1)'
        }}>
          <style>{`@keyframes popIn { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }`}</style>

          {/* Bouton X */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '14px', right: '16px',
            background: 'none', border: 'none', fontSize: '20px',
            color: '#ccc', cursor: 'pointer', fontWeight: 700,
            lineHeight: 1, transition: 'color 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#E8648A'}
            onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
          >✕</button>

          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{content.icon}</div>

          <span style={{
            display: 'inline-block', background: '#FFE4EC', color: '#C44B72',
            fontSize: '11px', fontWeight: 700, padding: '3px 14px',
            borderRadius: '99px', marginBottom: '16px', letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>{content.tag}</span>

          <p style={{
            fontSize: '17px', fontWeight: 700, color: '#1a1a1a',
            lineHeight: 1.55, marginBottom: '8px'
          }}>{content.quote}</p>

          <p style={{ fontSize: '13px', color: '#E8648A', fontWeight: 600, marginBottom: '20px' }}>
            {content.author}
          </p>

          <div style={{
            background: '#FFF0F4', borderRadius: '14px', padding: '14px 18px',
            fontSize: '13px', color: '#555', lineHeight: 1.6,
            marginBottom: '24px', textAlign: 'left'
          }}>
            <strong style={{ color: '#E8648A' }}>💡 Conseil du jour : </strong>
            {content.tip}
          </div>

          <button onClick={onClose} style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #E8648A, #C44B72)',
            color: '#fff', border: 'none', borderRadius: '14px',
            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            transition: 'opacity 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Accéder à mon dashboard ✨
          </button>
        </div>
      )}
    </div>
  );
}