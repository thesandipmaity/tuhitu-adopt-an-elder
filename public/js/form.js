// ============================================================
// TuHiTu Cares — Adopt an Elder | Form workflows
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const siteHelpers = window.TuHiTuSite || {};
  const prefersReducedMotion = Boolean(siteHelpers.prefersReducedMotion);
  const openModal = siteHelpers.openModal || ((modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    $('.modal-dialog', modal)?.focus();
  });

  const googleSheetEndpoint =
    window.TU_HITU_GOOGLE_SHEET_ENDPOINT ||
    document.body?.dataset.googleSheetEndpoint ||
    'https://script.google.com/macros/s/AKfycbwuk83vLsulxLkysULOug1-ehCk1vIqCttClIPyWx664-ePbQQtUr6MpBVqioJqzRoq1A/exec';

  const sendToGoogleSheet = async (payload) => {
  if (
    !googleSheetEndpoint ||
    googleSheetEndpoint === 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
  ) {
      return false;
    }

    try {
      await fetch(googleSheetEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'content-type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      return true;
    } catch {
      return false;
    }
  };

  const toPlainObject = (value) => (
    value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  );

  const buildGoogleSheetPayload = (payload, overrides = {}) => ({
    ...payload,
    ...toPlainObject(payload.details),
    ...overrides,
  });

  const saveToGoogleSheetOrThrow = async (payload) => {
    const savedToGoogleSheet = await sendToGoogleSheet(payload);
    if (!savedToGoogleSheet) {
      throw new Error('We could not save your request right now.');
    }
  };

  /* ---------- Role-specific involvement form ---------- */
  const actionModal = $('#actionModal');
  const actionForm = $('#actionForm');
  const actionModalEyebrow = $('#actionModalEyebrow');
  const actionModalTitle = $('#actionModalTitle');
  const actionModalIntro = $('#actionModalIntro');
  const submissionType = $('#submissionType');
  const submissionStatus = $('#submissionStatus');
  const actionSubmit = $('#actionSubmit');

  const formConfigs = {
    volunteer: {
      type: 'volunteer',
      eyebrow: 'Companion With TuHiTu Cares',
      title: 'Become a Companion',
      intro: 'Share your preferred schedule, language and location. Matching begins only after verification and safeguarding checks.',
      organisation: false,
      availability: true,
      donation: false,
      submit: 'Submit Companion Request',
    },
    sponsor: {
      type: 'sponsor',
      eyebrow: 'Sponsor a Programme',
      title: 'Become a Sponsor',
      intro: 'Tell us about your organisation and the geography or community you would like to support.',
      organisation: true,
      availability: false,
      donation: false,
      submit: 'Submit Sponsorship Enquiry',
    },
    partner: {
      type: 'partner',
      eyebrow: 'Partner With TuHiTu Cares',
      title: 'Register Your Organisation',
      intro: 'Care homes, community centres and NGOs can register their interest in offering elders free companionship support.',
      organisation: true,
      availability: false,
      donation: false,
      submit: 'Submit Partner Request',
    },
    donation: {
      type: 'donation',
      eyebrow: 'Support TuHiTu Cares',
      title: 'Express Your Donation Interest',
      intro: 'Choose a contribution preference. We never collect card or bank details on this form; our team will share secure next steps.',
      organisation: false,
      availability: false,
      donation: true,
      submit: 'Request Secure Donation Details',
    },
    'monthly-donation': {
      type: 'donation',
      eyebrow: 'Monthly Giving',
      title: 'Set Up Monthly Giving',
      intro: 'Tell us how you would like to help each month. We never collect card or bank details on this form.',
      organisation: false,
      availability: false,
      donation: true,
      monthly: true,
      submit: 'Request Monthly Giving Details',
    },
  };

  const organisationField = $('#organisationField');
  const availabilityField = $('#availabilityField');
  const donationAmountField = $('#donationAmountField');
  const donationCurrencyField = $('#donationCurrencyField');
  const donationFrequencyField = $('#donationFrequencyField');
  const organisationInput = $('#organisation');
  const availabilityInput = $('#availability');
  const donationAmountInput = $('#donationAmount');
  const donationCurrencyInput = $('#donationCurrency');
  const donationFrequencyInput = $('#donationFrequency');

  const clearFormErrors = () => {
    $$('.field-error', actionForm || document).forEach((error) => {
      error.textContent = '';
    });
    $$('input, select, textarea', actionForm || document).forEach((input) => {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
    });
    if (submissionStatus) {
      submissionStatus.textContent = '';
      submissionStatus.className = 'submission-status';
    }
  };

  const configureActionForm = (configKey) => {
    const config = formConfigs[configKey] || formConfigs.volunteer;
    actionForm?.reset();
    clearFormErrors();

    if (submissionType) submissionType.value = config.type;
    if (actionModalEyebrow) actionModalEyebrow.textContent = config.eyebrow;
    if (actionModalTitle) actionModalTitle.textContent = config.title;
    if (actionModalIntro) actionModalIntro.textContent = config.intro;
    if (actionSubmit) {
      const label = $('span', actionSubmit);
      if (label) label.textContent = config.submit;
    }

    if (organisationField) organisationField.hidden = !config.organisation;
    if (availabilityField) availabilityField.hidden = !config.availability;
    if (donationAmountField) donationAmountField.hidden = !config.donation;
    if (donationCurrencyField) donationCurrencyField.hidden = !config.donation;
    if (donationFrequencyField) donationFrequencyField.hidden = !config.donation;
    if (organisationInput) organisationInput.required = config.organisation;
    if (availabilityInput) availabilityInput.required = config.availability;
    if (donationCurrencyInput) donationCurrencyInput.required = config.donation;
    if (donationFrequencyInput) donationFrequencyInput.required = config.donation;
    if (donationAmountInput) donationAmountInput.disabled = !config.donation;
    if (donationCurrencyInput) donationCurrencyInput.disabled = !config.donation;
    if (donationFrequencyInput) donationFrequencyInput.disabled = !config.donation;
    if (config.monthly && donationFrequencyInput) donationFrequencyInput.value = 'monthly';

    openModal(actionModal);
    window.setTimeout(() => $('#fullName')?.focus(), prefersReducedMotion ? 0 : 180);
  };

  $$('[data-form-type]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      configureActionForm(trigger.dataset.formType);
    });
  });

  const fieldError = (name) => $(`[data-error-for="${name}"]`, actionForm || document);
  const setFieldError = (input, message) => {
    input.classList.toggle('invalid', Boolean(message));
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    const error = fieldError(input.name);
    if (error) error.textContent = message;
    return !message;
  };

  const validateField = (input) => {
    if (input.closest('[hidden]')) return true;
    if (input.type === 'checkbox') {
      return setFieldError(input, input.required && !input.checked ? 'Please confirm that we may contact you.' : '');
    }

    const value = input.value.trim();
    if (input.required && !value) return setFieldError(input, 'This field is required.');
    if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return setFieldError(input, 'Enter a valid email address.');
    }
    if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 7) {
      return setFieldError(input, 'Enter a valid phone or WhatsApp number.');
    }
    return setFieldError(input, '');
  };

  $$('input, select, textarea', actionForm || document).forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  actionForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFormErrors();

    const inputs = $$('input, select, textarea', actionForm);
    const valid = inputs.map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = $('.invalid', actionForm);
      firstInvalid?.focus();
      if (submissionStatus) {
        submissionStatus.textContent = 'Please review the highlighted fields.';
        submissionStatus.className = 'submission-status error';
      }
      return;
    }

    const formData = new FormData(actionForm);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = $('#consent')?.checked === true;
    payload.sourceUrl = window.location.href.split('#')[0];
    payload.language = $('#langSelect')?.value || 'en';
    payload.details = {};
    if (payload.submissionType === 'donation' && typeof payload.donationCurrency === 'string') {
      payload.details.donationCurrency = payload.donationCurrency;
    }
    delete payload.donationCurrency;

    const originalLabel = $('span', actionSubmit)?.textContent || 'Submit Request';
    actionSubmit.disabled = true;
    if ($('span', actionSubmit)) $('span', actionSubmit).textContent = 'Submitting…';
    if (submissionStatus) {
      submissionStatus.textContent = 'Securely saving your request…';
      submissionStatus.className = 'submission-status';
    }

    try {
      await saveToGoogleSheetOrThrow(buildGoogleSheetPayload(payload, {
        sheetKey: payload.submissionType || 'general-enquiry',
      }));
      actionForm.reset();
      if (submissionStatus) {
        submissionStatus.textContent = 'Thank you — your request has been received.';
        submissionStatus.className = 'submission-status success';
      }
    } catch (error) {
      if (submissionStatus) {
        submissionStatus.textContent = `${error.message || 'Something went wrong.'} Please try again or email connect@tuhitu.org.`;
        submissionStatus.className = 'submission-status error';
      }
    } finally {
      actionSubmit.disabled = false;
      if ($('span', actionSubmit)) $('span', actionSubmit).textContent = originalLabel;
    }
  });

  /* ---------- Elder registration modal ---------- */
  const elderRegistrationModal = $('#elderRegistrationModal');
  const elderRegistrationForm = $('#elderRegistrationForm');
  const elderRegistrationStatus = $('#elderRegistrationStatus');
  const elderRegistrationSubmit = $('#elderRegistrationSubmit');
  const elderCitySelect = $('#elderCity');
  const elderOtherCityField = $('#elderOtherCityField');
  const elderOtherCityInput = $('#elderOtherCity');

  const clearElderRegistrationErrors = () => {
    $$('.field-error', elderRegistrationForm || document).forEach((error) => {
      error.textContent = '';
    });
    $$('input, select, textarea', elderRegistrationForm || document).forEach((input) => {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
    });
    if (elderRegistrationStatus) {
      elderRegistrationStatus.textContent = '';
      elderRegistrationStatus.className = 'submission-status';
    }
  };

  const syncOtherCityField = () => {
    const showOtherCity = elderCitySelect?.value === 'Other';
    if (elderOtherCityField) elderOtherCityField.hidden = !showOtherCity;
    if (elderOtherCityInput) {
      elderOtherCityInput.required = showOtherCity;
      if (!showOtherCity) {
        elderOtherCityInput.value = '';
        elderOtherCityInput.classList.remove('invalid');
        elderOtherCityInput.removeAttribute('aria-invalid');
      }
    }
  };

  const openElderRegistrationForm = () => {
    elderRegistrationForm?.reset();
    clearElderRegistrationErrors();
    syncOtherCityField();
    openModal(elderRegistrationModal);
    window.setTimeout(() => $('input[name="registrationFor"]', elderRegistrationForm)?.focus(), prefersReducedMotion ? 0 : 180);
  };

  const elderRegistrationError = (name) => $(`[data-error-for="${name}"]`, elderRegistrationForm || document);
  const setElderRegistrationError = (input, message, key = input.name) => {
    if (input) {
      input.classList.toggle('invalid', Boolean(message));
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
    const error = elderRegistrationError(key);
    if (error) error.textContent = message;
    return !message;
  };

  const validateElderRegistrationField = (input) => {
    if (!input || input.type === 'hidden' || input.closest('[hidden]')) return true;

    if (input.type === 'radio') {
      const group = $$(`input[name="${input.name}"]`, elderRegistrationForm);
      const checked = group.some((item) => item.checked);
      group.forEach((item) => {
        item.classList.toggle('invalid', !checked);
        if (!checked) item.setAttribute('aria-invalid', 'true');
        else item.removeAttribute('aria-invalid');
      });
      const error = elderRegistrationError(input.name);
      if (error) error.textContent = checked ? '' : 'Please choose one option.';
      return checked;
    }

    if (input.type === 'checkbox') {
      return setElderRegistrationError(
        input,
        input.required && !input.checked ? 'Please confirm that we may contact you.' : '',
      );
    }

    const value = input.value.trim();
    if (input.required && !value) return setElderRegistrationError(input, 'This field is required.');
    if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 7) {
      return setElderRegistrationError(input, 'Enter a valid phone or WhatsApp number.');
    }
    if (input.name === 'age' && value) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue) || numericValue < 1 || numericValue > 120) {
        return setElderRegistrationError(input, 'Enter a valid age.');
      }
    }
    return setElderRegistrationError(input, '');
  };

  $$('[data-elder-registration-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      if (!elderRegistrationModal || window.location.pathname !== '/') return;
      event.preventDefault();
      openElderRegistrationForm();
    });
  });

  elderCitySelect?.addEventListener('change', () => {
    syncOtherCityField();
    validateElderRegistrationField(elderCitySelect);
    if (!elderOtherCityField?.hidden) elderOtherCityInput?.focus();
  });

  $$('input, select, textarea', elderRegistrationForm || document).forEach((input) => {
    const eventName = input.type === 'radio' || input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener('blur', () => validateElderRegistrationField(input));
    input.addEventListener(eventName, () => {
      if (input.name === 'registrationFor') {
        $$('input[name="registrationFor"]', elderRegistrationForm).forEach((radio) => validateElderRegistrationField(radio));
        return;
      }
      if (input.getAttribute('aria-invalid') === 'true' || input.type === 'checkbox' || input.tagName === 'SELECT') {
        validateElderRegistrationField(input);
      }
    });
  });

  elderRegistrationForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearElderRegistrationErrors();
    syncOtherCityField();

    const registrationInputs = $$('input, select, textarea', elderRegistrationForm);
    const valid = registrationInputs.map(validateElderRegistrationField).every(Boolean);
    if (!valid) {
      const firstInvalid = $('.invalid', elderRegistrationForm) || $('input[aria-invalid="true"], select[aria-invalid="true"]', elderRegistrationForm);
      firstInvalid?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
      window.setTimeout(() => firstInvalid?.focus(), prefersReducedMotion ? 0 : 280);
      if (elderRegistrationStatus) {
        elderRegistrationStatus.textContent = 'Please review the highlighted fields.';
        elderRegistrationStatus.className = 'submission-status error';
      }
      return;
    }

    const formData = new FormData(elderRegistrationForm);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = $('#elderRegistrationConsent')?.checked === true;
    payload.sourceUrl = window.location.href.split('#')[0];
    payload.language = $('#langSelect')?.value || 'en';
    if (payload.city === 'Other' && typeof payload.otherCity === 'string' && payload.otherCity.trim()) {
      payload.city = payload.otherCity.trim();
    }

    const label = $('span', elderRegistrationSubmit)?.textContent || 'Submit Registration';
    elderRegistrationSubmit.disabled = true;
    if ($('span', elderRegistrationSubmit)) $('span', elderRegistrationSubmit).textContent = 'Submitting…';
    if (elderRegistrationStatus) {
      elderRegistrationStatus.textContent = 'Securely saving your registration…';
      elderRegistrationStatus.className = 'submission-status';
    }

    try {
      await saveToGoogleSheetOrThrow({
        ...payload,
        sheetKey: 'elder-registration',
      });
      elderRegistrationForm.reset();
      syncOtherCityField();
      if (elderRegistrationStatus) {
        elderRegistrationStatus.textContent = 'Thank you — your registration has been received.';
        elderRegistrationStatus.className = 'submission-status success';
      }
    } catch (error) {
      if (elderRegistrationStatus) {
        elderRegistrationStatus.textContent = `${error.message || 'Something went wrong.'} Please try again or email connect@tuhitu.org.`;
        elderRegistrationStatus.className = 'submission-status error';
      }
    } finally {
      elderRegistrationSubmit.disabled = false;
      if ($('span', elderRegistrationSubmit)) $('span', elderRegistrationSubmit).textContent = label;
    }
  });

  const requestedAction = new URLSearchParams(window.location.search).get('action');
  if (requestedAction) {
    if (requestedAction === 'elder-registration' && elderRegistrationModal) {
      openElderRegistrationForm();
    } else if (formConfigs[requestedAction] && actionModal) {
      configureActionForm(requestedAction);
    }

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('action');
    window.history.replaceState({}, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
  }

  /* ---------- Focused donation gateway checkout ---------- */
  const checkoutForm = $('#donationCheckoutForm');
  if (checkoutForm) {
    const checkoutStatus = $('#checkoutStatus');
    const checkoutSubmit = $('#checkoutSubmit');
    const currencySelect = $('#checkoutCurrency');
    const customAmountField = $('#customAmountField');
    const customAmountInput = $('#customDonationAmount');
    const customCurrencySymbol = $('#customCurrencySymbol');
    const amountOptions = $$('input[name="donationAmount"]', checkoutForm);

    const currencyPresets = {
      INR: { symbol: '₹', amounts: [500, 1000, 2000, 5000], minimum: 100 },
      USD: { symbol: '$', amounts: [10, 25, 50, 100], minimum: 5 },
      AED: { symbol: 'AED ', amounts: [25, 50, 100, 250], minimum: 10 },
      GBP: { symbol: '£', amounts: [10, 25, 50, 100], minimum: 5 },
      EUR: { symbol: '€', amounts: [10, 25, 50, 100], minimum: 5 },
      CAD: { symbol: 'CA$', amounts: [15, 30, 60, 120], minimum: 5 },
      AUD: { symbol: 'A$', amounts: [15, 30, 60, 120], minimum: 5 },
    };

    const formatAmountOption = (amount, symbol) => `${symbol}${Number(amount).toLocaleString('en-US')}`;
    const selectedPreset = () => $('input[name="donationAmount"]:checked', checkoutForm);

    const updateCustomVisibility = () => {
      const customSelected = selectedPreset()?.value === 'custom';
      customAmountField.hidden = !customSelected;
      customAmountInput.required = customSelected;
      if (customSelected) window.setTimeout(() => customAmountInput.focus(), prefersReducedMotion ? 0 : 120);
    };

    const updateCurrencyPresets = () => {
      const config = currencyPresets[currencySelect.value] || currencyPresets.INR;
      amountOptions.slice(0, 4).forEach((input, index) => {
        const amount = config.amounts[index];
        input.value = String(amount);
        const label = input.nextElementSibling;
        if (label) label.textContent = formatAmountOption(amount, config.symbol);
      });
      customCurrencySymbol.textContent = config.symbol;
      customAmountInput.min = String(config.minimum);
      if (Number(customAmountInput.value) < config.minimum) customAmountInput.value = '';
    };

    amountOptions.forEach((input) => input.addEventListener('change', updateCustomVisibility));
    currencySelect.addEventListener('change', updateCurrencyPresets);
    updateCurrencyPresets();
    updateCustomVisibility();

    const checkoutError = (name) => $(`[data-checkout-error="${name}"]`, checkoutForm);
    const setCheckoutError = (input, message) => {
      input.classList.toggle('invalid', Boolean(message));
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      const target = checkoutError(input.name);
      if (target) target.textContent = message;
      return !message;
    };

    const validateCheckoutInput = (input) => {
      if (input.type === 'hidden' || input.closest('[hidden]')) return true;
      if (input.type === 'checkbox') return setCheckoutError(input, input.required && !input.checked ? 'Please accept the donation and privacy terms.' : '');
      const value = input.value.trim();
      if (input.required && !value) return setCheckoutError(input, 'This field is required.');
      if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setCheckoutError(input, 'Enter a valid email address.');
      if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 7) return setCheckoutError(input, 'Enter a valid phone or WhatsApp number.');
      if (input === customAmountInput && !customAmountField.hidden && Number(value) < Number(input.min)) return setCheckoutError(input, `Enter at least ${customCurrencySymbol.textContent}${input.min}.`);
      return setCheckoutError(input, '');
    };

    $$('input, select', checkoutForm).forEach((input) => {
      input.addEventListener('blur', () => validateCheckoutInput(input));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateCheckoutInput(input);
      });
    });

    const paymentParams = new URLSearchParams(window.location.search);
    const paymentState = paymentParams.get('payment');
    const paymentReference = paymentParams.get('reference')?.slice(0, 40);
    if (paymentState === 'cancelled' && checkoutStatus) {
      checkoutStatus.textContent = `Payment was cancelled. No charge was made; you can try again when ready.${paymentReference ? ` Reference: ${paymentReference}.` : ''}`;
      checkoutStatus.className = 'submission-status error';
    } else if (paymentState === 'return' && checkoutStatus) {
      checkoutStatus.textContent = `Thank you. Payment confirmation is being reconciled with the gateway.${paymentReference ? ` Reference: ${paymentReference}.` : ' Keep your reference for support.'}`;
      checkoutStatus.className = 'submission-status success';
    }

    checkoutForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      $$('[data-checkout-error]', checkoutForm).forEach((error) => { error.textContent = ''; });
      const inputs = $$('input, select', checkoutForm);
      const valid = inputs.map(validateCheckoutInput).every(Boolean);
      if (!valid) {
        $('.invalid', checkoutForm)?.focus();
        checkoutStatus.textContent = 'Please review the highlighted fields.';
        checkoutStatus.className = 'submission-status error';
        return;
      }

      const formData = new FormData(checkoutForm);
      const selectedAmount = selectedPreset()?.value;
      const amount = selectedAmount === 'custom' ? customAmountInput.value : selectedAmount;
      const payload = {
        submissionType: 'donation',
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        language: $('#langSelect')?.value || 'en',
        donationCurrency: formData.get('donationCurrency'),
        donationFrequency: formData.get('donationFrequency'),
        donationAmount: selectedAmount,
        customDonationAmount: selectedAmount === 'custom' ? amount : '',
        consent: $('#checkoutConsent')?.checked === true,
        website: formData.get('website'),
        sourceUrl: window.location.href.split('#')[0],
      };

      const label = $('span', checkoutSubmit)?.textContent || 'Proceed to Secure Payment';
      checkoutSubmit.disabled = true;
      if ($('span', checkoutSubmit)) $('span', checkoutSubmit).textContent = 'Starting secure checkout…';
      checkoutStatus.textContent = 'Saving your payment request to Google Sheet…';
      checkoutStatus.className = 'submission-status';

      try {
        await saveToGoogleSheetOrThrow({
          ...payload,
          sheetKey: 'donation-payment',
          gatewayReady: false,
          gatewayStatus: 'sheet_saved_only',
        });
        checkoutForm.reset();
        updateCurrencyPresets();
        updateCustomVisibility();
        checkoutStatus.textContent = 'Thank you — your payment request has been saved. No online payment was started.';
        checkoutStatus.className = 'submission-status success';
      } catch (error) {
        checkoutStatus.textContent = `${error.message || 'Something went wrong.'} Please try again or email connect@tuhitu.org.`;
        checkoutStatus.className = 'submission-status error';
      } finally {
        checkoutSubmit.disabled = false;
        if ($('span', checkoutSubmit)) $('span', checkoutSubmit).textContent = label;
      }
    });
  }

  /* ---------- Dedicated sponsor and partner enquiry forms ---------- */
  const detailKeys = [
    'contactRole',
    'interestArea',
    'supportRange',
    'targetGeography',
    'preferredTimeline',
    'organisationType',
    'elderCount',
    'engagementModel',
    'donationCurrency',
    'licenceStatus',
    'safeguardingReadiness',
    'consentReadiness',
  ];

  $$('[data-prospect-form]').forEach((form) => {
    const status = $('[data-form-status]', form);
    const submitButton = $('[data-submit-button]', form);
    const getError = (name) => $(`[data-error-for="${name}"]`, form);

    const setProspectFieldError = (input, message) => {
      input.classList.toggle('invalid', Boolean(message));
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      const error = getError(input.name);
      if (error) error.textContent = message;
      return !message;
    };

    const validateProspectField = (input) => {
      if (input.type === 'hidden' || input.closest('[hidden]')) return true;
      if (input.type === 'checkbox') {
        return setProspectFieldError(
          input,
          input.required && !input.checked ? 'Please confirm that we may contact you.' : '',
        );
      }

      const value = input.value.trim();
      if (input.required && !value) return setProspectFieldError(input, 'This field is required.');
      if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return setProspectFieldError(input, 'Enter a valid email address.');
      }
      if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 7) {
        return setProspectFieldError(input, 'Enter a valid phone or WhatsApp number.');
      }
      return setProspectFieldError(input, '');
    };

    $$('input, select, textarea', form).forEach((input) => {
      input.addEventListener('blur', () => validateProspectField(input));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateProspectField(input);
      });
      input.addEventListener('change', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateProspectField(input);
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      $$('.field-error', form).forEach((error) => {
        error.textContent = '';
      });

      const inputs = $$('input, select, textarea', form);
      const valid = inputs.map(validateProspectField).every(Boolean);
      if (!valid) {
        const firstInvalid = $('.invalid', form);
        firstInvalid?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
        window.setTimeout(() => firstInvalid?.focus(), prefersReducedMotion ? 0 : 280);
        if (status) {
          status.textContent = 'Please review the highlighted fields.';
          status.className = 'submission-status error';
        }
        return;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.consent = $('input[name="consent"]', form)?.checked === true;
      payload.sourceUrl = window.location.href.split('#')[0];
      payload.language = $('#langSelect')?.value || 'en';
      payload.details = {};

      detailKeys.forEach((key) => {
        if (typeof payload[key] === 'string' && payload[key].trim()) {
          payload.details[key] = payload[key].trim();
        }
        delete payload[key];
      });

      const googleSheetPayload = {
        ...payload,
        ...payload.details,
      };

      const label = $('span', submitButton)?.textContent || 'Submit Enquiry';
      submitButton.disabled = true;
      if ($('span', submitButton)) $('span', submitButton).textContent = 'Submitting…';
      if (status) {
        status.textContent = 'Securely saving your enquiry…';
        status.className = 'submission-status';
      }

      try {
        await saveToGoogleSheetOrThrow({
          ...googleSheetPayload,
          sheetKey: payload.submissionType || 'prospect-form',
        });
        form.reset();
        if (status) {
          status.textContent = 'Thank you — your enquiry has been received.';
          status.className = 'submission-status success';
        }
      } catch (error) {
        if (status) {
          status.textContent = `${error.message || 'Something went wrong.'} Please try again or email connect@tuhitu.org.`;
          status.className = 'submission-status error';
        }
      } finally {
        submitButton.disabled = false;
        if ($('span', submitButton)) $('span', submitButton).textContent = label;
      }
    });
  });

  /* ---------- Newsletter backend submission ---------- */
  const newsletterForm = $('#newsletterForm');
  const newsletterMessage = $('#formMsg');

  newsletterForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailInput = $('#nlEmail');
    const submitButton = $('button[type="submit"]', newsletterForm);

    newsletterMessage.className = 'form-msg show';
    if (!emailInput.checkValidity()) {
      newsletterMessage.textContent = 'Please enter a valid email address.';
      newsletterMessage.classList.add('error');
      emailInput.focus();
      return;
    }

    const originalButton = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>Signing Up…';
    newsletterMessage.textContent = 'Saving your subscription…';
    newsletterMessage.classList.remove('error');

    try {
      const saved = await sendToGoogleSheet({
        sheetKey: 'newsletter',
        email: emailInput.value.trim(),
        website: newsletterForm.elements.website.value,
        language: $('#langSelect')?.value || 'en',
        sourceUrl: window.location.href.split('#')[0],
      });
      if (!saved) throw new Error('We could not save your subscription.');
      newsletterForm.reset();
      newsletterMessage.textContent = 'Thank you — you’re on the quarterly update list.';
    } catch (error) {
      newsletterMessage.textContent = `${error.message || 'Something went wrong.'} Please try again.`;
      newsletterMessage.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButton;
    }
  });
});
