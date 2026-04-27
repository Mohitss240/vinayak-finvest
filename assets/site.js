/**
 * Inquiry button scroll-to behavior.
 * When Inquiry Now is clicked on the contact page, scroll to the form.
 */
(function () {
  var inquiryLinks = document.querySelectorAll('a[href="contact.html"]');
  inquiryLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var currentPath = window.location.pathname;
      if (currentPath.includes('contact.html')) {
        var formSection = document.getElementById('inquiry-form-section');
        if (formSection) {
          event.preventDefault();
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.setTimeout(function () {
            formSection.focus();
          }, 500);
        }
      }
    });
  });
})();

/**
 * Contact form behavior for Vinayak Finvest.
 * Shows a progress bar from 0 to 100% on submit,
 * posts the data through a hidden iframe, and redirects to the home page.
 */
(function () {
  var leadForm = document.querySelector('.contact-form');
  var submitButton = document.getElementById('lead-submit');
  var formStatus = document.getElementById('form-status');
  var emailInput = document.getElementById('email');
  var phoneInput = document.getElementById('phone');
  var replyToEmail = document.getElementById('replyToEmail');
  var submissionId = document.getElementById('submissionId');
  var submittedAt = document.getElementById('submittedAt');
  var progressWrapper = document.getElementById('form-progress');
  var progressFill = document.getElementById('progress-fill');
  var progressLabel = document.getElementById('progress-label');

  if (!leadForm) return;

  function showStatus(message) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.add('is-show', 'is-error');
  }

  function setProgress(value) {
    if (!progressFill || !progressLabel) return;
    progressFill.style.width = value + '%';
    progressFill.setAttribute('aria-valuenow', value);
    progressLabel.textContent = value + '%';
  }

  function startProgress(onComplete) {
    var progressOverlay = document.getElementById('progress-overlay');
    if (progressOverlay) {
      progressOverlay.classList.add('is-active');
    }

    if (leadForm) {
      leadForm.classList.add('is-submitting');
    }

    var progress = 0;
    setProgress(progress);

    var timer = window.setInterval(function () {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        setProgress(progress);
        window.clearInterval(timer);
        window.setTimeout(onComplete, 800);
      } else {
        setProgress(progress);
      }
    }, 120);
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

    if (emailInput && replyToEmail) {
      replyToEmail.value = emailInput.value.trim();
    }

    if (submissionId) {
      submissionId.value = 'VF-' + Date.now().toString(36).toUpperCase();
    }

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

    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    leadForm.target = 'submission-frame';
    leadForm.submit();

    startProgress(function () {
      window.location.href = 'index.html';
    });
  });
})();
