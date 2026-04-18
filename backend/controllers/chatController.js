// backend/controllers/chatController.js
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Tu es MindMate, un assistant bienveillant et empathique spécialisé dans la santé mentale et le bien-être, intégré dans l'application HealthMate.

Ton rôle :
- Écouter activement l'utilisateur et lui offrir un espace safe pour s'exprimer
- Poser des questions douces pour mieux comprendre son état émotionnel
- Proposer des techniques de gestion du stress, de l'anxiété et des émotions (respiration, mindfulness, journaling...)
- Encourager et motiver sans jamais juger
- Rappeler doucement de consulter un professionnel si la situation est sérieuse

Règles importantes :
- Toujours répondre en français
- Être chaleureux, humain et empathique
- Ne jamais poser de diagnostic médical
- Si l'utilisateur exprime des pensées suicidaires, fournir immédiatement le numéro d'aide 3114
- Garder des réponses concises (3-5 phrases max)
- Ne parler que de santé mentale et bien-être`;

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages invalides' });
    }

    // Groq utilise le même format qu'OpenAI — très simple !
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // gratuit et très performant
      messages: formattedMessages,
      max_tokens: 1024,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.json({ success: true, message: reply });

  } catch (error) {
    console.error('Erreur chatbot Groq:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};