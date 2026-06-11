/* ===========================
   FINDBACK — Main JavaScript
   =========================== */

// ── Navbar Scroll Effect ──────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Mobile Menu ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Search Tabs ───────────────────────────────────────
const searchTabs = document.querySelectorAll('.search-tab');
searchTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    searchTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Dashboard Tabs ────────────────────────────────────
const dashTabs = document.querySelectorAll('.dash-tab');
dashTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    dashTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Account Type Toggle (Register Page) ───────────────
const typeBtns = document.querySelectorAll('.type-btn');
const institutionFields = document.getElementById('institutionFields');

typeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    typeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (institutionFields) {
      const isInstitution = btn.dataset.type === 'institution';
      institutionFields.style.display = isInstitution ? 'block' : 'none';
    }
  });
});

// ── Password Strength Meter ───────────────────────────
const passwordInput = document.getElementById('password');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

if (passwordInput && strengthFill) {
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = ['', 'weak', 'fair', 'good', 'strong'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    strengthFill.className = 'strength-fill ' + (levels[score] || '');
    if (strengthLabel) strengthLabel.textContent = val ? (labels[score] || '') : '';
  });
}

// ── Eye Toggle (Password Visibility) ─────────────────
document.querySelectorAll('.eye-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁' : '🙈';
  });
});

// ── Form Validation ───────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(inputId, message) {
  const wrap = document.getElementById(inputId)?.closest('.input-wrap') ||
               document.getElementById(inputId)?.closest('.form-group');
  if (!wrap) return;
  wrap.classList.add('error');

  let errEl = wrap.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'field-error';
    errEl.style.cssText = 'color: var(--error); font-size: 0.75rem; margin-top: 4px; display:flex; align-items:center; gap:4px;';
    wrap.after(errEl);
  }
  errEl.textContent = '⚠ ' + message;
}

function clearFieldError(inputId) {
  const wrap = document.getElementById(inputId)?.closest('.input-wrap') ||
               document.getElementById(inputId)?.closest('.form-group');
  if (!wrap) return;
  wrap.classList.remove('error');
  const errEl = document.querySelector(`#${inputId}`)?.closest('.form-group')?.querySelector('.field-error');
  if (errEl) errEl.remove();
}

// Live validation
['email', 'loginEmail'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => {
      if (el.value && !validateEmail(el.value)) {
        showFieldError(id, 'Please enter a valid email address');
      } else {
        clearFieldError(id);
      }
    });
  }
});

// ── Login Form Submit ─────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    let valid = true;

    if (!email || !validateEmail(email)) {
      showFieldError('loginEmail', 'Please enter a valid email');
      valid = false;
    } else clearFieldError('loginEmail');

    if (!pass || pass.length < 6) {
      showFieldError('loginPassword', 'Password must be at least 6 characters');
      valid = false;
    } else clearFieldError('loginPassword');

    if (valid) {
      const btn = loginForm.querySelector('.submit-btn');
      btn.textContent = '⏳ Signing in...';
      btn.disabled = true;

      setTimeout(() => {
        showToast('Welcome back! Redirecting to your dashboard…', 'success');
        btn.textContent = '✓ Signed in';
        setTimeout(() => { window.location.href = 'index.html'; }, 1800);
      }, 1400);
    }
  });
}

// ── Register Form Submit ───────────────────────────────
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const pass = document.getElementById('password')?.value;
    const terms = document.getElementById('terms')?.checked;
    let valid = true;

    if (!email || !validateEmail(email)) {
      showFieldError('email', 'Please enter a valid email');
      valid = false;
    } else clearFieldError('email');

    if (!pass || pass.length < 8) {
      showFieldError('password', 'Password must be at least 8 characters');
      valid = false;
    } else clearFieldError('password');

    if (!terms) {
      showToast('Please agree to the Terms of Service', 'error');
      valid = false;
    }

    if (valid) {
      const btn = registerForm.querySelector('.submit-btn');
      btn.textContent = '⏳ Creating account...';
      btn.disabled = true;

      setTimeout(() => {
        showToast('Account created successfully! Welcome to FindBack 🎉', 'success');
        btn.textContent = '✓ Account created';
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
      }, 1600);
    }
  });
}

// ── Toast Notifications ───────────────────────────────
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Chatbot ───────────────────────────────────────────
const chatbotTrigger = document.getElementById('chatbotTrigger');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const quickReplies = document.querySelectorAll('.quick-reply');

const botResponses = {
  'how to register': `To register on FindBack:\n1️⃣ Click <strong>"Get Started Free"</strong> on the homepage\n2️⃣ Choose <strong>Individual</strong> or <strong>Institution</strong>\n3️⃣ Fill in your name, email & password\n4️⃣ Verify your email & you're in! 🎉`,
  'how to report lost': `To report a lost item:\n1️⃣ Sign in to your account\n2️⃣ Click <strong>"Report Lost Item"</strong>\n3️⃣ Describe the item with details & photos\n4️⃣ Set the location & date\n5️⃣ Submit — our AI will start matching! 🔍`,
  'how to report found': `To report a found item:\n1️⃣ Sign in to your account\n2️⃣ Click <strong>"Report Found Item"</strong>\n3️⃣ Upload a photo & describe the item\n4️⃣ Choose where you found it\n5️⃣ Submit — we'll alert the owner! 📢`,
  'how to retrieve': `To retrieve a lost item:\n1️⃣ Search our database using keywords\n2️⃣ Browse AI-matched suggestions\n3️⃣ Claim the item if it's yours\n4️⃣ Provide proof of ownership\n5️⃣ Arrange pickup with the finder 🤝`,
  'institution': `Institutions like universities, hospitals & airports can join with a <strong>Standard, Premium or Enterprise</strong> plan.\n\nBenefits:\n• Staff management portal\n• Dedicated lost & found queue\n• Analytics dashboard\n• Priority AI matching\n\nClick <strong>"Get Started"</strong> to subscribe! 🏛`,
  'default': `Hi there! 👋 I'm <strong>FindBot</strong>, your FindBack assistant.\n\nI can help you with:\n• How to register\n• Reporting lost or found items\n• Retrieving your belongings\n• Institution subscriptions\n\nWhat would you like to know?`
};

function getBotReply(input) {
  const lower = input.toLowerCase();
  if (lower.includes('register') || lower.includes('sign up') || lower.includes('create account')) return botResponses['how to register'];
  if (lower.includes('lost') && (lower.includes('report') || lower.includes('how'))) return botResponses['how to report lost'];
  if (lower.includes('found') && (lower.includes('report') || lower.includes('how'))) return botResponses['how to report found'];
  if (lower.includes('retrieve') || lower.includes('claim') || lower.includes('get back') || lower.includes('recover')) return botResponses['how to retrieve'];
  if (lower.includes('institution') || lower.includes('university') || lower.includes('hospital') || lower.includes('school')) return botResponses['institution'];
  return botResponses['default'];
}

function addMessage(content, sender = 'bot') {
  if (!chatMessages) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;

  const avatarIcon = sender === 'bot' ? '🤖' : '👤';
  msg.innerHTML = `
    <div class="msg-avatar">${avatarIcon}</div>
    <div class="msg-bubble">${content}</div>
  `;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  if (!chatMessages) return null;
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="typing-indicator"><span></span><span></span><span></span></div>
  `;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
}

function sendChatMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  if (chatInput) chatInput.value = '';

  const typing = showTyping();
  setTimeout(() => {
    if (typing) typing.remove();
    addMessage(getBotReply(text), 'bot');
  }, 900 + Math.random() * 500);
}

if (chatbotTrigger && chatbotWindow) {
  chatbotTrigger.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
    if (chatbotWindow.classList.contains('open') && chatMessages && chatMessages.children.length === 0) {
      setTimeout(() => addMessage(botResponses['default'], 'bot'), 400);
    }
  });
}

if (chatClose) chatClose.addEventListener('click', () => chatbotWindow.classList.remove('open'));

if (chatSend) {
  chatSend.addEventListener('click', () => sendChatMessage(chatInput.value));
}

if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage(chatInput.value);
  });
}

quickReplies.forEach(btn => {
  btn.addEventListener('click', () => {
    chatbotWindow.classList.add('open');
    if (chatMessages && chatMessages.children.length === 0) {
      addMessage(botResponses['default'], 'bot');
    }
    setTimeout(() => sendChatMessage(btn.textContent), 300);
  });
});

// ── Counter Animation ─────────────────────────────────
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── Scroll Reveal ─────────────────────────────────────
const revealEls = document.querySelectorAll('.step-card, .inst-card, .plan-card, .dash-stat');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
  });
}

// ── Active Nav Link ───────────────────────────────────
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Smooth Anchor Scroll ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
