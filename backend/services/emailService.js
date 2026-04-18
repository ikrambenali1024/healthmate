// backend/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── Template HTML email ────────────────────────────────────────────────────
function buildEmailHTML({ firstName, subject, headline, body, cta, ctaUrl }) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F6F7FB;font-family:'Segoe UI',system-ui,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7FB;padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#E8648A,#C44B72);border-radius:16px 16px 0 0;padding:32px 36px;text-align:center;">
          
<div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;">
  <span style="color:#fff;font-size:26px;font-weight:800;line-height:44px;font-family:'Segoe UI',sans-serif;">H</span>
</div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">HealthMate</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Ton coach santé personnel</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:36px 36px 28px;">
          <p style="margin:0 0 6px;font-size:13px;color:#C0C0C0;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">
            Bonjour ${firstName}
          </p>
          <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#1a1a1a;line-height:1.3;">
            ${headline}
          </h2>
          <div style="font-size:15px;color:#444;line-height:1.75;">
            ${body}
          </div>
          ${cta ? `
          <div style="margin-top:28px;text-align:center;">
            <a href="${ctaUrl || 'http://localhost:3000/dashboard'}"
               style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#E8648A,#C44B72);color:#fff;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.02em;box-shadow:0 4px 16px rgba(232,100,138,0.3);">
              ${cta}
            </a>
          </div>` : ''}
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#FAFAFA;border-radius:0 0 16px 16px;padding:20px 36px;border-top:1px solid #F0F0F0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#BBBBBB;line-height:1.6;">
            Tu reçois cet email car tu es inscrit(e) sur HealthMate.<br/>
            <a href="${ctaUrl || 'http://localhost:3000'}" style="color:#E8648A;text-decoration:none;">Se désabonner</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ── Emails spécifiques ─────────────────────────────────────────────────────

// 1. Rappel activités du jour
async function sendActivityReminder(user, activities) {
  const activityList = activities.map(a =>
    `<li style="padding:6px 0;border-bottom:1px solid #F5F5F5;color:#444;">
       <strong style="color:#E8648A;">${a.type.toUpperCase()}</strong> — ${a.title}
       ${a.duration ? `<span style="color:#aaa;font-size:13px;"> (${a.duration} min)</span>` : ''}
     </li>`
  ).join('');

  const body = `
    <p>Tu as <strong>${activities.length} activité${activities.length > 1 ? 's' : ''}</strong> prévue${activities.length > 1 ? 's' : ''} aujourd'hui dans ton plan HealthMate :</p>
    <ul style="padding:0;margin:16px 0;list-style:none;">
      ${activityList}
    </ul>
    <p style="margin-top:16px;">Chaque petite action compte. Tu es capable d'accomplir tout cela aujourd'hui !</p>
  `;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      user.email,
    subject: '📋 Tes activités du jour — HealthMate',
    html:    buildEmailHTML({
      firstName: user.firstName || 'Utilisateur',
      subject:   'Tes activités du jour',
      headline:  'Voici ton programme pour aujourd\'hui',
      body,
      cta:    'Voir mon plan',
      ctaUrl: 'http://localhost:3000/dashboard'
    })
  });
}

// 2. Encouragement quotidien + conseil santé
const ENCOURAGEMENTS = [
  {
    headline: 'Chaque jour est une nouvelle opportunité',
    body: `<p>La régularité est la clé du succès. Même les petits efforts accumulés créent de grandes transformations.</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Commence ta journée par 5 minutes d'étirements pour activer ton corps et clarifier ton esprit.</p>`,
  },
  {
    headline: 'Tu progresses, même quand tu ne le vois pas',
    body: `<p>Le corps s'adapte en silence. Chaque séance, chaque repas équilibré, chaque bonne nuit de sommeil te rapproche de ton objectif.</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Bois un grand verre d'eau dès le réveil — cela améliore ton énergie et ton métabolisme toute la journée.</p>`,
  },
  {
    headline: 'La motivation vient en faisant',
    body: `<p>N'attends pas de te sentir motivé(e) pour commencer. Lance-toi, et la motivation suivra naturellement.</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Fais une courte marche de 10 minutes après chaque repas — c'est excellent pour la digestion et la glycémie.</p>`,
  },
  {
    headline: 'Ton futur toi te remerciera',
    body: `<p>Les habitudes d'aujourd'hui façonnent la santé de demain. Chaque choix positif est un investissement dans ton bien-être.</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Essaie de te coucher 30 minutes plus tôt ce soir — le sommeil est le meilleur complément de ta performance.</p>`,
  },
  {
    headline: 'Sois fier(e) de ta constance',
    body: `<p>Peu importe la vitesse, tu avances. C'est bien plus important que la perfection.</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Prends 2 minutes pour noter 3 choses positives de ta journée — la gratitude réduit le stress et booste la motivation.</p>`,
  },
  {
    headline: 'Un pas à la fois, chaque jour',
    body: `<p>Les grandes transformations ne se font pas du jour au lendemain. C'est la somme de petits efforts quotidiens qui change tout.</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Prépare tes affaires de sport ce soir pour demain matin — supprimer les frictions facilite le passage à l'action.</p>`,
  },
  {
    headline: 'Prends soin de toi, tu le mérites',
    body: `<p>Investir dans ta santé, c'est le plus beau cadeau que tu puisses te faire. Continue sur cette lancée !</p>
           <p style="margin-top:12px;"><strong style="color:#E8648A;">Conseil du jour :</strong> Ajoute une portion de légumes supplémentaire à ton prochain repas — simple, rapide et très bénéfique.</p>`,
  },
];

async function sendDailyEncouragement(user) {
  const day  = new Date().getDay(); // 0-6
  const msg  = ENCOURAGEMENTS[day % ENCOURAGEMENTS.length];

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      user.email,
    subject: '💪 Ton encouragement du jour — HealthMate',
    html:    buildEmailHTML({
      firstName: user.firstName || 'Utilisateur',
      subject:   'Encouragement du jour',
      headline:  msg.headline,
      body:      msg.body,
      cta:    'Voir mon tableau de bord',
      ctaUrl: 'http://localhost:3000/dashboard'
    })
  });
}

// 3. Bilan de fin de semaine
async function sendWeeklySummary(user, stats) {
  const { total, completed, completionRate } = stats;
  const medal = completionRate >= 80 ? '🥇 Excellent travail !' : completionRate >= 50 ? 'Bon effort cette semaine !' : 'Continue, tu peux faire mieux !';

  const body = `
    <p>Voici ton bilan de la semaine :</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">
      <tr style="background:#FFF4F7;">
        <td style="padding:14px 18px;font-size:14px;color:#888;font-weight:600;">Activités totales</td>
        <td style="padding:14px 18px;font-size:18px;font-weight:700;color:#E8648A;text-align:right;">${total}</td>
      </tr>
      <tr>
        <td style="padding:14px 18px;font-size:14px;color:#888;font-weight:600;">Activités complétées</td>
        <td style="padding:14px 18px;font-size:18px;font-weight:700;color:#1a1a1a;text-align:right;">${completed}</td>
      </tr>
      <tr style="background:#FFF4F7;">
        <td style="padding:14px 18px;font-size:14px;color:#888;font-weight:600;">Taux de réussite</td>
        <td style="padding:14px 18px;font-size:18px;font-weight:700;color:#E8648A;text-align:right;">${completionRate}%</td>
      </tr>
    </table>
    <p style="font-size:15px;font-weight:700;color:#1a1a1a;">${medal}</p>
    <p style="margin-top:10px;">Un nouveau plan t'attend la semaine prochaine. Reste régulier(e), c'est le secret de la réussite !</p>
  `;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      user.email,
    subject: '📊 Ton bilan de la semaine — HealthMate',
    html:    buildEmailHTML({
      firstName: user.firstName || 'Utilisateur',
      subject:   'Bilan de la semaine',
      headline:  'Ta semaine en un coup d\'oeil',
      body,
      cta:    'Voir mon nouveau plan',
      ctaUrl: 'http://localhost:3000/dashboard'
    })
  });
}

module.exports = {
  sendActivityReminder,
  sendDailyEncouragement,
  sendWeeklySummary
};