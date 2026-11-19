// logic.js — fonctions "pures" (sans DOM) : faciles à tester et à expliquer.
// Chaque fonction reçoit des données et retourne un résultat, sans rien modifier.

const CATEGORIES = ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autre'];

// Vérifie les données d'une dépense. Retourne un message d'erreur, ou null si tout est OK.
function validateExpense({ title, amount, category, date }) {
  if (!title || title.trim().length < 2) return 'Le titre doit contenir au moins 2 caractères.';
  if (!(Number(amount) > 0)) return 'Le montant doit être supérieur à 0.';
  if (!CATEGORIES.includes(category)) return 'Catégorie invalide.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return 'Date invalide.';
  return null;
}

// Filtre par catégorie et/ou par mois ("YYYY-MM"). Une valeur vide = pas de filtre.
function filterExpenses(expenses, { category = '', month = '' } = {}) {
  return expenses.filter(e =>
    (!category || e.category === category) &&
    (!month || e.date.startsWith(month))
  );
}

// Somme de toutes les dépenses.
function total(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

// Somme par catégorie : { Alimentation: 120, Transport: 40, ... }
function totalByCategory(expenses) {
  const result = {};
  for (const e of expenses) {
    result[e.category] = (result[e.category] || 0) + Number(e.amount);
  }
  return result;
}

// Convertit la liste en texte CSV (ouvrable dans Excel).
function toCSV(expenses) {
  const escape = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = ['Date,Titre,Catégorie,Montant'];
  for (const e of expenses) {
    lines.push([e.date, escape(e.title), e.category, e.amount].join(','));
  }
  return lines.join('\n');
}

// Permet d'utiliser ce fichier dans le navigateur ET dans Node (pour les tests).
if (typeof module !== 'undefined') {
  module.exports = { CATEGORIES, validateExpense, filterExpenses, total, totalByCategory, toCSV };
}
