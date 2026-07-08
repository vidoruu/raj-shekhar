document.addEventListener('DOMContentLoaded', () => {

  // Dynamic pretty URLs fallback for local testing (file:/// protocol)
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && 
          !href.startsWith('http') && 
          !href.startsWith('https') && 
          !href.startsWith('tel:') && 
          !href.startsWith('mailto:') && 
          !href.startsWith('#')) {
        
        const parts = href.split('#');
        let path = parts[0];
        const hash = parts[1] ? '#' + parts[1] : '';
        
        if (path && !path.includes('.')) {
          a.setAttribute('href', path + '.html' + hash);
        }
      }
    });
  }

  // ==========================================================================
  // SELECTORS & CONFIGURATION
  // ==========================================================================
  const ASTRO_PHONE = "919909912345"; // WhatsApp format (without + symbol)
  
  // Hero Lead Form Elements
  const heroForm = document.getElementById('hero-lead-form');
  const nameInput = document.getElementById('form-name');
  const phoneInput = document.getElementById('form-phone');
  const serviceSelect = document.getElementById('form-service');
  const msgInput = document.getElementById('form-message');
  const honeypotInput = document.getElementById('honeypot');
  const heroSubmitBtn = document.getElementById('btn-lead-submit');

  // Secondary Contact Form Elements
  const secondaryForm = document.getElementById('contact-query-form');
  const secNameInput = document.getElementById('secondary-name');
  const secPhoneInput = document.getElementById('secondary-phone');
  const secServiceSelect = document.getElementById('secondary-service');
  const secMsgInput = document.getElementById('secondary-message');
  const secHoneypotInput = document.getElementById('honeypot-secondary');
  const secSubmitBtn = document.getElementById('btn-query-submit');

  // Success Modal Elements
  const successModal = document.getElementById('lead-success-modal');
  const modalCloseBtn = document.getElementById('btn-modal-close');
  const modalWaLink = successModal.querySelector('.modal-actions a');
  const modalBodyText = document.getElementById('modal-body-text');

  // Validation Rules
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number validation (10 digits starting with 6, 7, 8, or 9)

  // ==========================================================================
  // ACCESSIBILITY & MODAL TRIGGERS
  // ==========================================================================
  let lastActiveElement = null;

  function showModal(title, body, customWaText) {
    lastActiveElement = document.activeElement;
    
    // Set custom body text if provided
    if (body) {
      modalBodyText.textContent = body;
    }
    
    // Set customized WhatsApp text link
    if (customWaText) {
      const encodedMsg = encodeURIComponent(customWaText);
      modalWaLink.href = `https://wa.me/${ASTRO_PHONE}?text=${encodedMsg}`;
    }

    successModal.classList.add('active');
    modalCloseBtn.focus();
    
    // Add escape key handler to close modal
    document.addEventListener('keydown', handleEscapeKey);
  }

  function closeModal() {
    successModal.classList.remove('active');
    document.removeEventListener('keydown', handleEscapeKey);
    
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  modalCloseBtn.addEventListener('click', closeModal);
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });

  // ==========================================================================
  // FORM VALIDATION & SUBMISSION WORKFLOW
  // ==========================================================================
  
  // Field validator helper
  function validateField(inputElement, errorElement, validationFn, errorMessage) {
    const value = inputElement.value.trim();
    const isValid = validationFn(value);
    
    if (!isValid) {
      inputElement.classList.add('invalid-field');
      errorElement.textContent = errorMessage;
      return false;
    } else {
      inputElement.classList.remove('invalid-field');
      errorElement.textContent = '';
      return true;
    }
  }

  // Clear error on input
  function clearErrorOnInput(inputElement, errorElement) {
    inputElement.addEventListener('input', () => {
      if (inputElement.classList.contains('invalid-field')) {
        inputElement.classList.remove('invalid-field');
        errorElement.textContent = '';
      }
    });
  }

  // Set up validation events for a field
  function setupValidation(inputElement, errorElement, validationFn, errorMessage) {
    // Validate on blur
    inputElement.addEventListener('blur', () => {
      validateField(inputElement, errorElement, validationFn, errorMessage);
    });
    // Clear on input
    clearErrorOnInput(inputElement, errorElement);
  }

  /* ---------------- Hero Lead Form Setup ---------------- */
  if (heroForm) {
    // Validation functions
    const isNameValid = (val) => val.length >= 2;
    const isPhoneValid = (val) => phoneRegex.test(val.replace(/\s+/g, ''));
    const isServiceValid = (val) => val !== "";

    // Error element selectors
    const nameErr = document.getElementById('name-error');
    const phoneErr = document.getElementById('phone-error');
    const serviceErr = document.getElementById('service-error');

    // Register blur and input event handlers
    setupValidation(nameInput, nameErr, isNameValid, 'Name must be at least 2 characters.');
    setupValidation(phoneInput, phoneErr, isPhoneValid, 'Enter a valid 10-digit mobile number.');
    setupValidation(serviceSelect, serviceErr, isServiceValid, 'Please select a problem area.');

    // Submit Handler
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check Honeypot for spam
      if (honeypotInput.value !== '') {
        console.warn('Spam submission blocked via honeypot.');
        // Silently fail and act like it succeeded to fool bots
        showModal("Request Submitted", "Pranam. Thank you. Your inquiry is recorded.", "Spam check.");
        heroForm.reset();
        return;
      }

      // Trigger all validations
      const nameOk = validateField(nameInput, nameErr, isNameValid, 'Name must be at least 2 characters.');
      const phoneOk = validateField(phoneInput, phoneErr, isPhoneValid, 'Enter a valid 10-digit mobile number.');
      const serviceOk = validateField(serviceSelect, serviceErr, isServiceValid, 'Please select a problem area.');

      if (nameOk && phoneOk && serviceOk) {
        // Disable button to prevent double-posts
        heroSubmitBtn.disabled = true;
        heroSubmitBtn.textContent = "Registering Consultation...";

        // Simulate form sending
        setTimeout(() => {
          const userName = nameInput.value.trim();
          const userPhone = phoneInput.value.trim();
          const userSec = serviceSelect.value;
          const userDetails = msgInput.value.trim();

          // Construct customized performance marketing WhatsApp text
          const personalMsg = `Pranam Raj Shekhar ji. My name is ${userName}. I want to consult you regarding my "${userSec}" problem. Mobile: ${userPhone}. details: ${userDetails}. Please guide me.`;
          
          showModal(
            "Consultation Scheduled!",
            `Pranam ${userName}. Your private consultation request regarding "${userSec}" has been registered successfully. Raj Shekhar will call you shortly.`,
            personalMsg
          );

          // Reset Form and Button state
          heroForm.reset();
          heroSubmitBtn.disabled = false;
          heroSubmitBtn.innerHTML = '<span>Connect Now for Solution</span><span class="submit-arrow">&rarr;</span>';
        }, 600);
      } else {
        // Focus first invalid element
        if (!nameOk) nameInput.focus();
        else if (!phoneOk) phoneInput.focus();
        else if (!serviceOk) serviceSelect.focus();
      }
    });
  }

  /* ---------------- Secondary Query Form Setup ---------------- */
  if (secondaryForm) {
    const isNameValid = (val) => val.length >= 2;
    const isPhoneValid = (val) => phoneRegex.test(val.replace(/\s+/g, ''));
    const isServiceValid = (val) => val !== "";
    const isMsgValid = (val) => val.length >= 10;

    const nameErr = document.getElementById('sec-name-error');
    const phoneErr = document.getElementById('sec-phone-error');
    const serviceErr = document.getElementById('sec-service-error');
    const msgErr = document.getElementById('sec-message-error');

    setupValidation(secNameInput, nameErr, isNameValid, 'Name must be at least 2 characters.');
    setupValidation(secPhoneInput, phoneErr, isPhoneValid, 'Enter a valid 10-digit mobile number.');
    setupValidation(secServiceSelect, serviceErr, isServiceValid, 'Please select a problem category.');
    setupValidation(secMsgInput, msgErr, isMsgValid, 'Please explain your situation (min 10 characters).');

    secondaryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (secHoneypotInput.value !== '') {
        showModal();
        secondaryForm.reset();
        return;
      }

      const nameOk = validateField(secNameInput, nameErr, isNameValid, 'Name must be at least 2 characters.');
      const phoneOk = validateField(secPhoneInput, phoneErr, isPhoneValid, 'Enter a valid 10-digit mobile number.');
      const serviceOk = validateField(secServiceSelect, serviceErr, isServiceValid, 'Please select a problem category.');
      const msgOk = validateField(secMsgInput, msgErr, isMsgValid, 'Please explain your situation.');

      if (nameOk && phoneOk && serviceOk && msgOk) {
        secSubmitBtn.disabled = true;
        secSubmitBtn.textContent = "Submitting Inquiry...";

        setTimeout(() => {
          const userName = secNameInput.value.trim();
          const userPhone = secPhoneInput.value.trim();
          const userSec = secServiceSelect.value;
          const userDetails = secMsgInput.value.trim();

          const personalMsg = `Pranam Raj Shekhar ji. My name is ${userName}. I want to consult you regarding my "${userSec}" problem. Mobile: ${userPhone}. details: ${userDetails}. Please guide me.`;

          showModal(
            "Query Registered Successfully!",
            `Pranam ${userName}. Your query regarding "${userSec}" has been delivered. Raj Shekhar will review your birth-charts and call you.`,
            personalMsg
          );

          secondaryForm.reset();
          secSubmitBtn.disabled = false;
          secSubmitBtn.textContent = "Send Message to Raj Shekhar";
        }, 600);
      } else {
        if (!nameOk) secNameInput.focus();
        else if (!phoneOk) secPhoneInput.focus();
        else if (!serviceOk) secServiceSelect.focus();
        else if (!msgOk) secMsgInput.focus();
      }
    });
  }

  // ==========================================================================
  // INTERACTIVE BEHAVIORS & ENHANCEMENTS
  // ==========================================================================

  // Automatically update footer copyright year dynamically (fallback if not 2026)
  const copyrightElem = document.querySelector('.footer-bottom p');
  if (copyrightElem) {
    const currentYear = new Date().getFullYear();
    copyrightElem.innerHTML = `&copy; ${currentYear} Raj Shekhar. All Rights Reserved. Designed with spiritual integrity.`;
  }
});
