// script.js — partie "interface" : lit le formulaire, met à jour la page.
// Les calculs sont dans logic.js ; ici on s'occupe du DOM et de localStorage.

const $ = id => document.getElementById(id);
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let chart = null;

function save() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Remplit les listes déroulantes de catégories
function initCategories() {
  for (const c of CATEGORIES) {
    $('category').add(new Option(c, c));
    $('filter-category').add(new Option(c, c));
  }
  $('date').value = new Date().toISOString().slice(0, 10);
  $('budget').value = localStorage.getItem('budget') || '';
}

// Dessine le tableau. On utilise textContent (jamais innerHTML avec du texte saisi)
// pour éviter les failles XSS.
function renderList(visible) {
  const tbody = $('list');
  tbody.innerHTML = '';
  for (const e of visible) {
    const tr = document.createElement('tr');
    for (const value of [e.date, e.title, e.category, e.amount.toFixed(2) + ' DH']) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    }
    const tdBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.className = 'del';
    btn.textContent = '✕';
    btn.title = 'Supprimer';
    btn.addEventListener('click', () => removeExpense(e.id));
    tdBtn.appendChild(btn);
    tr.appendChild(tdBtn);
    tbody.appendChild(tr);
  }
  $('empty').hidden = visible.length > 0;
}

function renderChart(visible) {
  const byCat = totalByCategory(visible);
  const data = { labels: Object.keys(byCat), datasets: [{ data: Object.values(byCat) }] };
  if (chart) {
    chart.data = data;
    chart.update();
  } else {
    chart = new Chart($('chart'), { type: 'doughnut', data });
  }
}

// Alerte si le total du mois en cours dépasse le budget
function renderBudget() {
  const budget = Number($('budget').value);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const spent = total(filterExpenses(expenses, { month: thisMonth }));
  const box = $('budget-alert');
  box.hidden = !(budget > 0 && spent > budget);
  box.textContent = `⚠️ Budget dépassé ce mois-ci : ${spent.toFixed(2)} DH sur ${budget} DH.`;
}

// Fonction principale : recalcule et redessine tout
function render() {
  const visible = filterExpenses(expenses, {
    category: $('filter-category').value,
    month: $('filter-month').value,
  });
  $('total').textContent = total(visible).toFixed(2) + ' DH';
  renderList(visible);
  renderChart(visible);
  renderBudget();
}

function removeExpense(id) {
  if (!confirm('Supprimer cette dépense ?')) return;
  expenses = expenses.filter(e => e.id !== id);
  save();
  render();
}

$('expense-form').addEventListener('submit', event => {
  event.preventDefault();
  const expense = {
    title: $('title').value,
    amount: $('amount').value,
    category: $('category').value,
    date: $('date').value,
  };
  const error = validateExpense(expense);
  $('form-error').textContent = error || '';
  if (error) return;
  expenses.push({ id: Date.now(), ...expense, title: expense.title.trim(), amount: Number(expense.amount) });
  save();
  event.target.reset();
  $('date').value = new Date().toISOString().slice(0, 10);
  render();
});

$('filter-category').addEventListener('change', render);
$('filter-month').addEventListener('change', render);
$('budget').addEventListener('input', () => {
  localStorage.setItem('budget', $('budget').value);
  renderBudget();
});

$('export-btn').addEventListener('click', () => {
  const visible = filterExpenses(expenses, {
    category: $('filter-category').value,
    month: $('filter-month').value,
  });
  const blob = new Blob(['\uFEFF' + toCSV(visible)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'depenses.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('clear-btn').addEventListener('click', () => {
  if (!confirm('Supprimer toutes les dépenses ?')) return;
  expenses = [];
  save();
  render();
});

initCategories();
render();
