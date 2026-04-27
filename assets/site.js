(function () {
  var leadForm = document.querySelector('.contact-form');
  var submitButton = document.getElementById('lead-submit');
  var formStatus = document.getElementById('form-status');
  var emailInput = document.getElementById('email');
  var phoneInput = document.getElementById('phone');
  var replyToEmail = document.getElementById('replyToEmail');
  var submissionId = document.getElementById('submissionId');
  var submittedAt = document.getElementById('submittedAt');

  if (!leadForm) return;

  function showStatus(message) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.add('is-show', 'is-error');
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      phoneInput.setCustomValidity('');
    });
  }

  leadForm.addEventListener('submit', function (event) {
    leadForm.classList.add('was-validated');

    if (phoneInput) {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (!/^[6-9][0-9]{9}$/.test(phoneInput.value)) {
        phoneInput.setCustomValidity('Enter a valid 10-digit Indian mobile number.');
      } else {
        phoneInput.setCustomValidity('');
      }
    }

    if (emailInput && replyToEmail) replyToEmail.value = emailInput.value.trim();
    if (submissionId) submissionId.value = 'VF-' + Date.now().toString(36).toUpperCase();
    if (submittedAt) {
      submittedAt.value = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        hour12: true
      });
    }

    if (!leadForm.checkValidity()) {
      event.preventDefault();
      showStatus('Please complete the highlighted fields correctly.');
      leadForm.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }
  });
})();
