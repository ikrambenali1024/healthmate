// backend/data/plans.js

const plans = {

  "gain de poids": [
    // LUNDI
    { dayOffset: 0, type: "sport",     title: "Musculation haut du corps",     duration: 45 },
    { dayOffset: 0, type: "nutrition", title: "Repas riche en calories",        duration: 0  },
    // MARDI
    { dayOffset: 1, type: "sport",     title: "Cardio léger 15 min",           duration: 15 },
    { dayOffset: 1, type: "nutrition", title: "Collation protéinée",           duration: 0  },
    // MERCREDI
    { dayOffset: 2, type: "sport",     title: "Musculation bas du corps",      duration: 45 },
    { dayOffset: 2, type: "nutrition", title: "Repas riche en glucides",        duration: 0  },
    // JEUDI
    { dayOffset: 3, type: "mental",    title: "Repos actif — étirements",      duration: 20 },
    { dayOffset: 3, type: "nutrition", title: "3 repas + 2 collations",        duration: 0  },
    // VENDREDI
    { dayOffset: 4, type: "sport",     title: "Musculation full body",         duration: 50 },
    { dayOffset: 4, type: "nutrition", title: "Protéines post-séance",         duration: 0  },
    // SAMEDI
    { dayOffset: 5, type: "sport",     title: "Sport libre ou natation",       duration: 40 },
    { dayOffset: 5, type: "nutrition", title: "Repas plaisir calorique",       duration: 0  },
    // DIMANCHE
    { dayOffset: 6, type: "mental",    title: "Repos complet",                 duration: 0  },
    { dayOffset: 6, type: "general",   title: "Bilan poids et objectifs S+1",  duration: 0  },
  ],

  "perte de poids": [
    // LUNDI
    { dayOffset: 0, type: "sport",     title: "Cardio 30 min",                duration: 30 },
    { dayOffset: 0, type: "nutrition", title: "Repas faible en calories",     duration: 0  },
    // MARDI
    { dayOffset: 1, type: "sport",     title: "Marche rapide 20 min",         duration: 20 },
    { dayOffset: 1, type: "nutrition", title: "Boire 2L d'eau",               duration: 0  },
    // MERCREDI
    { dayOffset: 2, type: "sport",     title: "HIIT 20 min",                  duration: 20 },
    { dayOffset: 2, type: "nutrition", title: "Protéines et légumes",         duration: 0  },
    // JEUDI
    { dayOffset: 3, type: "mental",    title: "Repos actif — étirements",     duration: 15 },
    { dayOffset: 3, type: "nutrition", title: "Repas équilibré sans sucre",   duration: 0  },
    // VENDREDI
    { dayOffset: 4, type: "sport",     title: "Cardio 30 min",                duration: 30 },
    { dayOffset: 4, type: "nutrition", title: "Éviter le sucre et les graisses", duration: 0 },
    // SAMEDI
    { dayOffset: 5, type: "sport",     title: "Sport libre 45 min",           duration: 45 },
    { dayOffset: 5, type: "nutrition", title: "Repas plaisir équilibré",      duration: 0  },
    // DIMANCHE
    { dayOffset: 6, type: "mental",    title: "Méditation 10 min",            duration: 10 },
    { dayOffset: 6, type: "general",   title: "Bilan de la semaine",          duration: 0  },
  ],

  "bien-etre": [
    // LUNDI
    { dayOffset: 0, type: "mental",    title: "Yoga 20 min",                  duration: 20 },
    { dayOffset: 0, type: "nutrition", title: "Petit-déjeuner sain et varié", duration: 0  },
    // MARDI
    { dayOffset: 1, type: "mental",    title: "Méditation 15 min",            duration: 15 },
    { dayOffset: 1, type: "sport",     title: "Marche 30 min en nature",      duration: 30 },
    // MERCREDI
    { dayOffset: 2, type: "mental",    title: "Journaling — écrire ses pensées", duration: 15 },
    { dayOffset: 2, type: "nutrition", title: "Repas anti-stress",            duration: 0  },
    // JEUDI
    { dayOffset: 3, type: "sport",     title: "Natation ou vélo 30 min",      duration: 30 },
    { dayOffset: 3, type: "mental",    title: "Lecture 20 min",               duration: 20 },
    // VENDREDI
    { dayOffset: 4, type: "mental",    title: "Yoga 20 min",                  duration: 20 },
    { dayOffset: 4, type: "nutrition", title: "Tisane et repas léger",        duration: 0  },
    // SAMEDI
    { dayOffset: 5, type: "sport",     title: "Activité plaisir libre",       duration: 45 },
    { dayOffset: 5, type: "mental",    title: "Temps pour soi — déconnexion", duration: 0  },
    // DIMANCHE
    { dayOffset: 6, type: "mental",    title: "Méditation longue 30 min",     duration: 30 },
    { dayOffset: 6, type: "general",   title: "Bilan bien-être semaine",      duration: 0  },
  ]

};

module.exports = plans;