(function () {
  var tabs = document.querySelectorAll('.calculator-tab');
  var panels = document.querySelectorAll('[data-calculator-panel]');
  var rupee = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  function value(form, name) {
    return Number(form.elements[name] && form.elements[name].value) || 0;
  }

  function money(amount) {
    return rupee.format(Math.max(0, amount || 0));
  }

  function setText(form, key, text) {
    var node = form.querySelector('[data-result="' + key + '"]');
    if (node) node.textContent = text;
  }

  function calculateSip(form) {
    var monthly = value(form, 'monthly');
    var rate = value(form, 'rate') / 100 / 12;
    var months = value(form, 'years') * 12;
    var invested = monthly * months;
    var maturity = rate ? monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)) : invested;
    setText(form, 'maturity', money(maturity));
    setText(form, 'invested', 'Invested: ' + money(invested));
    setText(form, 'gain', 'Estimated gain: ' + money(maturity - invested));
  }

  function calculateLumpsum(form) {
    var principal = value(form, 'principal');
    var rate = value(form, 'rate') / 100;
    var years = value(form, 'years');
    var maturity = principal * Math.pow(1 + rate, years);
    setText(form, 'maturity', money(maturity));
    setText(form, 'invested', 'Invested: ' + money(principal));
    setText(form, 'gain', 'Estimated gain: ' + money(maturity - principal));
  }

  function calculateEmi(form) {
    var principal = value(form, 'principal');
    var rate = value(form, 'rate') / 100 / 12;
    var months = value(form, 'years') * 12;
    var emi = rate ? principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1) : principal / months;
    var total = emi * months;
    setText(form, 'emi', money(emi));
    setText(form, 'total', 'Total payment: ' + money(total));
    setText(form, 'interest', 'Total interest: ' + money(total - principal));
  }

  function calculateRetirement(form) {
    var expense = value(form, 'expense');
    var yearsToRetire = value(form, 'yearsToRetire');
    var retirementYears = value(form, 'retirementYears');
    var inflation = value(form, 'inflation') / 100;
    var futureMonthlyExpense = expense * Math.pow(1 + inflation, yearsToRetire);
    var corpus = futureMonthlyExpense * 12 * retirementYears;
    setText(form, 'corpus', money(corpus));
    setText(form, 'futureExpense', 'Future monthly expense: ' + money(futureMonthlyExpense));
  }

  function calculateGoal(form) {
    var target = value(form, 'target');
    var rate = value(form, 'rate') / 100 / 12;
    var months = value(form, 'years') * 12;
    var monthly = rate ? target / (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)) : target / months;
    setText(form, 'monthly', money(monthly));
    setText(form, 'target', 'Target: ' + money(target));
  }

  function calculate(form) {
    var type = form.getAttribute('data-calculator-panel');
    if (type === 'sip') calculateSip(form);
    if (type === 'lumpsum') calculateLumpsum(form);
    if (type === 'emi') calculateEmi(form);
    if (type === 'retirement') calculateRetirement(form);
    if (type === 'goal') calculateGoal(form);
  }

  function clampToInput(input) {
    var value = Number(input.value) || 0;
    var min = input.min === '' ? -Infinity : Number(input.min);
    var max = input.max === '' ? Infinity : Number(input.max);
    return Math.min(Math.max(value, min), max);
  }

  function syncPairedInput(input) {
    var targetName = input.getAttribute('data-sync');
    if (!targetName || !input.form || !input.form.elements[targetName]) return;
    var target = input.form.elements[targetName];
    input.value = clampToInput(input);
    target.value = input.value;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-calculator');
      tabs.forEach(function (item) { item.classList.toggle('active', item === tab); });
      panels.forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-calculator-panel') === target); });
    });
  });

  panels.forEach(function (panel) {
    panel.addEventListener('input', function (event) {
      syncPairedInput(event.target);
      calculate(panel);
    });
    panel.addEventListener('submit', function (event) { event.preventDefault(); calculate(panel); });
    calculate(panel);
  });
})();
