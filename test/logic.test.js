// Lancer avec : node test/logic.test.js
const assert = require('node:assert');
const { validateExpense, filterExpenses, total, totalByCategory, toCSV } = require('../logic');

const data = [
  { title: 'Pain', amount: 10, category: 'Alimentation', date: '2026-05-02' },
  { title: 'Bus', amount: 6, category: 'Transport', date: '2026-05-03' },
  { title: 'Cinéma', amount: 50, category: 'Loisirs', date: '2026-06-01' },
];

assert.strictEqual(validateExpense({ title: 'A', amount: 5, category: 'Autre', date: '2026-05-01' }), 'Le titre doit contenir au moins 2 caractères.');
assert.strictEqual(validateExpense({ title: 'Café', amount: 0, category: 'Autre', date: '2026-05-01' }), 'Le montant doit être supérieur à 0.');
assert.strictEqual(validateExpense({ title: 'Café', amount: 5, category: 'Autre', date: '2026-05-01' }), null);

assert.strictEqual(filterExpenses(data, { month: '2026-05' }).length, 2);
assert.strictEqual(filterExpenses(data, { category: 'Loisirs' }).length, 1);
assert.strictEqual(filterExpenses(data).length, 3);

assert.strictEqual(total(data), 66);
assert.deepStrictEqual(totalByCategory(data), { Alimentation: 10, Transport: 6, Loisirs: 50 });
assert.ok(toCSV(data).startsWith('Date,Titre,Catégorie,Montant\n2026-05-02,"Pain"'));

console.log('✅ Tous les tests passent');
