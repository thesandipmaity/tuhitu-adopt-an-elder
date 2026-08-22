// ============================================================
// TuHiTu Club — Adopt an Elder | Site interactions
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Shared toast ---------- */
  const toast = $('#toast');
  const toastMsg = $('#toastMsg');
  let toastTimer;

  const showToast = (message) => {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
  };

  /* ---------- Non-blocking homepage service launch notice ---------- */
  if (window.location.pathname === '/') {
    const launchNotice = document.createElement('aside');
    launchNotice.className = 'launch-notice';
    launchNotice.setAttribute('role', 'region');
    launchNotice.setAttribute('aria-label', 'TuHiTu Club service launch');
    launchNotice.innerHTML = `
      <button class="launch-notice-close" type="button" aria-label="Dismiss service launch notice">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span class="launch-label">Launching 21 August 2026</span>
      <p>Service begins on 21 August 2026. Registrations are open now.</p>
      <a href="/volunteer">Register as a companion <i class="fa-solid fa-arrow-right"></i></a>
    `;
    document.body.appendChild(launchNotice);

    let launchNoticeDismissed = false;
    try {
      launchNoticeDismissed = window.sessionStorage.getItem('tuhitu-launch-notice-dismissed') === 'true';
    } catch {
      launchNoticeDismissed = false;
    }

    if (!launchNoticeDismissed) {
      window.setTimeout(() => launchNotice.classList.add('show'), prefersReducedMotion ? 0 : 900);
    }

    $('.launch-notice-close', launchNotice)?.addEventListener('click', () => {
      launchNotice.classList.remove('show');
      try {
        window.sessionStorage.setItem('tuhitu-launch-notice-dismissed', 'true');
      } catch {
        // The notice still dismisses when storage is unavailable.
      }
    });
  }

  /* ---------- Sticky header and back to top ---------- */
  const header = $('#siteHeader');
  const backToTop = $('#backToTop');

  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
    backToTop?.classList.toggle('show', window.scrollY > 500);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile navigation ---------- */
  const navToggle = $('#navToggle');
  const mainNav = $('#mainNav');
  const navBackdrop = $('#navBackdrop');

  const closeNav = () => {
    mainNav?.classList.remove('open');
    $$('.nav-dropdown.open').forEach((dropdown) => {
      dropdown.classList.remove('open');
      $('.nav-dropdown-trigger', dropdown)?.setAttribute('aria-expanded', 'false');
    });
    navBackdrop?.classList.remove('show');
    navToggle?.setAttribute('aria-expanded', 'false');
    if (navToggle) navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };

  const openNav = () => {
    mainNav?.classList.add('open');
    navBackdrop?.classList.add('show');
    navToggle?.setAttribute('aria-expanded', 'true');
    if (navToggle) navToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  };

  navToggle?.addEventListener('click', () => {
    if (mainNav?.classList.contains('open')) closeNav();
    else openNav();
  });
  navBackdrop?.addEventListener('click', closeNav);
  $$('a', mainNav || document.createElement('nav')).forEach((link) => link.addEventListener('click', closeNav));

  /* ---------- Accessible About disclosure ---------- */
  $$('.nav-dropdown').forEach((dropdown) => {
    const trigger = $('.nav-dropdown-trigger', dropdown);
    const menu = $('.nav-dropdown-menu', dropdown);
    if (!trigger || !menu) return;

    const setDropdown = (open) => {
      dropdown.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      setDropdown(!dropdown.classList.contains('open'));
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setDropdown(true);
        $('a', menu)?.focus();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setDropdown(false);
      }
    });

    dropdown.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setDropdown(false);
      trigger.focus();
    });

    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) setDropdown(false);
    });
  });

  /* ---------- Active navigation state ---------- */
  const navLinks = $$('a[href^="#"]', mainNav || document.createElement('nav'));
  const sections = navLinks
    .map((link) => $(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = () => {
    let currentId = sections[0]?.id || null;
    const scrollPosition = window.scrollY + 140;
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal animation ---------- */
  const revealElements = $$('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('[data-count]');
  const formatNumber = (number) => number.toLocaleString('en-US');

  const animateCounter = (element) => {
    const target = Number.parseInt(element.getAttribute('data-count'), 10);
    if (prefersReducedMotion) {
      element.textContent = formatNumber(target);
      return;
    }

    const duration = 1600;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatNumber(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = formatNumber(target);
    };
    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach((item, index) => {
    const button = $('.faq-q', item);
    const answer = $('.faq-a', item);
    if (!button || !answer) return;

    const answerId = `faq-answer-${index + 1}`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', answerId);
    answer.id = answerId;
    answer.setAttribute('role', 'region');

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove('open');
        const openButton = $('.faq-q', openItem);
        const openAnswer = $('.faq-a', openItem);
        openButton?.setAttribute('aria-expanded', 'false');
        if (openAnswer) openAnswer.style.maxHeight = '';
      });

      item.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? '' : `${answer.scrollHeight}px`;
    });
  });

  /* ---------- Accessible modal controller ---------- */
  const modals = $$('.modal');
  let activeModal = null;
  let lastFocusedElement = null;

  const getFocusable = (modal) => $$(
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    modal
  ).filter((element) => !element.closest('[hidden]'));

  const closeModal = (modal = activeModal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    activeModal = null;
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  const openModal = (modal) => {
    if (!modal) return;
    if (activeModal && activeModal !== modal) closeModal(activeModal);
    lastFocusedElement = document.activeElement;
    activeModal = modal;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    $('.modal-dialog', modal)?.focus();
  };

  window.TuHiTuSite = {
    openModal,
    closeModal,
    prefersReducedMotion,
  };

  modals.forEach((modal) => {
    $$('[data-close-modal]', modal).forEach((control) => {
      control.addEventListener('click', () => closeModal(modal));
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!activeModal) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = getFocusable(activeModal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ---------- Stories and policy information ---------- */
  const contentModal = $('#contentModal');
  const contentModalEyebrow = $('#contentModalEyebrow');
  const contentModalTitle = $('#contentModalTitle');
  const contentModalBody = $('#contentModalBody');
  const contentModalAction = $('#contentModalAction');
  let contentAction = 'newsletter';

  const contentEntries = {
    'story-one': {
      eyebrow: 'Programme Note · Why It Matters',
      title: 'Why regular companionship matters in elder care',
      body: '<p>Companionship is not a substitute for clinical or family care. It adds something different: a consistent human relationship built around listening, respect and shared time.</p><ul><li>Regular contact can create something meaningful to look forward to.</li><li>Conversation can help elders feel heard, remembered and connected.</li><li>Consistency matters more than grand gestures.</li></ul><p>TuHiTu Club is designed to make that connection safe, structured and sustainable.</p>',
      button: 'Get Programme Updates',
      action: 'newsletter',
    },
    'story-two': {
      eyebrow: 'Programme Note · Companion Readiness',
      title: 'How TuHiTu Club will prepare and support companions',
      body: '<p>Registering interest is the first step—not an automatic match. The planned pathway includes review, verification, orientation and safeguarding preparation before an approved participant is introduced to an elder.</p><ul><li>Preferences such as language, availability and connection format are discussed.</li><li>Responsibilities and escalation routes are clarified before matching.</li><li>Ongoing check-ins help both sides raise questions or request a change.</li></ul>',
      button: 'Companion With TuHiTu Club',
      action: 'volunteer',
    },
    'story-three': {
      eyebrow: 'Programme Note · Community Partnerships',
      title: 'How organisations can introduce TuHiTu Club safely',
      body: '<p>Care homes, senior communities, NGOs and community centres remain central to a safe programme. No elder should be registered or matched without an appropriate consent-led process.</p><ul><li>A named coordinator supports scheduling and communication.</li><li>Only necessary, non-sensitive information is collected at the enquiry stage.</li><li>Roles, safeguards and escalation routes are confirmed before launch.</li></ul>',
      button: 'Discuss a Partnership',
      action: 'partner',
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'Privacy Policy',
      body: '<p>TuHiTu Club collects only the contact, programme and donation-request information needed to respond, review and coordinate the action you choose.</p><ul><li>Card numbers, UPI PINs and online-banking credentials are entered only with the authorised payment gateway and are not stored by TuHiTu Club.</li><li>Do not submit medical records or identity documents through first-stage programme forms.</li><li>You may ask to update or delete submitted information by emailing connect@tuhitu.org, subject to records TuHiTu Club must retain by law.</li><li>Newsletter details are used only for TuHiTu Club updates and can be unsubscribed at any time.</li></ul>',
      button: 'Contact TuHiTu Club',
      action: 'contact',
    },
    terms: {
      eyebrow: 'Website Terms',
      title: 'Terms of Use',
      body: '<p>This website provides information and action pathways for the TuHiTu Club Adopt an Elder initiative. Submitting a programme form does not guarantee a volunteer match, partnership, sponsorship, funding or care-home approval.</p><ul><li>Use the website lawfully and provide accurate information.</li><li>Donation payment is completed through the authorised gateway; TuHiTu Club does not request card, UPI PIN or online-banking credentials directly.</li><li>Programme participation remains subject to TuHiTu Club verification, consent, safeguarding and operational review.</li></ul>',
      button: 'Contact TuHiTu Club',
      action: 'contact',
    },
    safeguarding: {
      eyebrow: 'Safety First',
      title: 'Safeguarding',
      body: '<p>TuHiTu Club is designed around safe, supported intergenerational connection. This website does not directly match or connect volunteers with elders.</p><ul><li>Approved volunteers complete the required verification and safeguarding preparation before matching.</li><li>Pairings consider language, interests, availability and the elder’s support context.</li><li>Safeguarding questions or concerns should be reported promptly to connect@tuhitu.org or +91 95996 61292.</li></ul>',
      button: 'Ask a Safeguarding Question',
      action: 'contact',
    },
    'donation-policy': {
      eyebrow: 'Donor Information',
      title: 'Donation & Receipt Policy',
      body: '<p>The Donate checkout records the donor request and hands payment to the authorised gateway. TuHiTu Club does not store card numbers, UPI PINs or online-banking credentials.</p><ul><li>One-time, monthly and currency availability depend on the configured provider and donor location.</li><li>Eligible Indian donations may qualify for an 80G deduction, subject to applicable law and issuance of a valid receipt.</li><li>Donors may be asked for information legally required for acknowledgement or receipt.</li><li>International donors should obtain independent advice on tax treatment in their jurisdiction.</li><li>Failed, duplicate, cancelled or incorrect payment queries should include the TuHiTu Club and gateway references where available.</li></ul>',
      button: 'Contact TuHiTu Club',
      action: 'contact',
    },
    grievance: {
      eyebrow: 'Accountability',
      title: 'Grievance & Complaints',
      body: '<p>Questions or complaints about safeguarding, data handling, volunteering, partnerships, sponsorships or donations can be submitted to connect@tuhitu.org or raised by phone at +91 95996 61292.</p><ul><li>Include your name, contact details, the relevant reference number if available, and a clear description of the concern.</li><li>Do not email medical records, identity documents, banking credentials or other unnecessary sensitive information.</li><li>Urgent safeguarding concerns should be identified clearly so they can be prioritised.</li></ul>',
      button: 'Email a Concern',
      action: 'contact',
    },
  };

  const showContentEntry = (entryKey) => {
    const entry = contentEntries[entryKey];
    if (!entry || !contentModal) return false;
    contentModalEyebrow.textContent = entry.eyebrow;
    contentModalTitle.textContent = entry.title;
    contentModalBody.innerHTML = entry.body;
    contentModalAction.textContent = entry.button;
    contentAction = entry.action;
    openModal(contentModal);
    return true;
  };

  $$('[data-content]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      showContentEntry(trigger.dataset.content);
    });
  });

  const requestedContent = new URLSearchParams(window.location.search).get('content');
  if (requestedContent && showContentEntry(requestedContent)) {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('content');
    window.history.replaceState({}, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
  }

  contentModalAction?.addEventListener('click', () => {
    closeModal(contentModal);
    if (contentAction === 'partner') {
      window.location.href = '/partner-with-us';
      return;
    }
    if (contentAction === 'contact') {
      window.location.href = 'mailto:connect@tuhitu.org';
      return;
    }
    if (contentAction === 'volunteer') {
      window.location.href = '/volunteer';
      return;
    }
    const newsletterEmail = $('#nlEmail');
    newsletterEmail?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => newsletterEmail?.focus(), prefersReducedMotion ? 0 : 350);
  });

  /* ---------- Language handoff ---------- */
  const languageSelect = $('#langSelect');
  languageSelect?.addEventListener('change', (event) => {
    const targetLanguage = event.target.value;
    if (targetLanguage === 'en') {
      showToast('English selected.');
      return;
    }

    const sourceUrl = window.location.href.split('#')[0];
    const translatedUrl = `https://translate.google.com/translate?sl=en&tl=${encodeURIComponent(targetLanguage)}&u=${encodeURIComponent(sourceUrl)}`;
    window.open(translatedUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening a translated version in a new tab.');
  });

  /* ---------- Social sharing ---------- */
  const copyPageLink = async () => {
    const pageUrl = window.location.href.split('#')[0];
    try {
      await navigator.clipboard.writeText(pageUrl);
      showToast('Page link copied. You can now share it on Instagram.');
    } catch {
      const helper = document.createElement('textarea');
      helper.value = pageUrl;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
      showToast('Page link copied. You can now share it on Instagram.');
    }
  };

  $$('[data-share]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const network = trigger.dataset.share;
      const pageUrl = window.location.href.split('#')[0];
      const shareText = 'Adopt an Elder. Restore Dignity. Renew Hope.';

      if (network === 'instagram') {
        copyPageLink();
        return;
      }

      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
        x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`,
      };
      if (shareUrls[network]) window.open(shareUrls[network], '_blank', 'noopener,noreferrer,width=720,height=620');
    });
  });

  /* ---------- Safety net for any intentionally unconfigured placeholder ---------- */
  $$('a[href="#"]:not([data-share])').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('This link will be added when the official destination is confirmed.');
    });
  });
});
