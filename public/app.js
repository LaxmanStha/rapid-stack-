/**
 * Health Care — Frontend Application
 * Handles authentication, UI interactions, and API communication
 */

// ============================================
// Configuration
// ============================================
const API_BASE = window.location.origin + '/RSB/api';

// ============================================
// Particle Background
// ============================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#10b981', '#34d399', '#059669', '#06b6d4', '#6ee7b7'];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 3}px ${color}40;
    `;

    container.appendChild(particle);
  }
}

// ============================================
// Panel Switching
// ============================================
function switchPanel(panel) {
  const panels = ['loginPanel', 'signupPanel', 'dashboardPanel'];

  panels.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
    }
  });

  const targetPanel = document.getElementById(panel + 'Panel');
  if (targetPanel) {
    // Small delay for animation
    requestAnimationFrame(() => {
      targetPanel.classList.add('active');
    });
  }

  // Clear messages
  clearMessages();
}

function clearMessages() {
  document.querySelectorAll('.message-box').forEach(el => {
    el.className = 'message-box';
    el.textContent = '';
  });
}

// ============================================
// Password Visibility Toggle
// ============================================
function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  const eyeOpen = button.querySelector('.eye-open');
  const eyeClosed = button.querySelector('.eye-closed');

  if (input.type === 'password') {
    input.type = 'text';
    eyeOpen.style.display = 'none';
    eyeClosed.style.display = 'block';
  } else {
    input.type = 'password';
    eyeOpen.style.display = 'block';
    eyeClosed.style.display = 'none';
  }
}

// ============================================
// Password Strength Checker
// ============================================
function checkPasswordStrength(password) {
  const bars = document.querySelectorAll('.strength-bar');
  const text = document.getElementById('strengthText');

  if (!bars.length || !text) return;

  // Reset
  bars.forEach(bar => bar.className = 'strength-bar');
  text.textContent = '';

  if (!password) return;

  let score = 0;

  // Length checks
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;

  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Normalize to 1-4
  const strength = Math.min(4, Math.max(1, Math.ceil(score * 4 / 5)));

  const levels = ['', 'weak', 'fair', 'good', 'strong'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#84cc16', '#10b981'];

  for (let i = 0; i < strength; i++) {
    bars[i].classList.add(levels[strength]);
  }

  text.textContent = labels[strength];
  text.style.color = colors[strength];
}

// ============================================
// Form Validation
// ============================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(messageId, text) {
  const el = document.getElementById(messageId);
  if (el) {
    el.className = 'message-box error show';
    el.textContent = text;
  }
}

function showSuccess(messageId, text) {
  const el = document.getElementById(messageId);
  if (el) {
    el.className = 'message-box success show';
    el.textContent = text;
  }
}

function setLoading(buttonId, loading) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');

  if (loading) {
    btn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'flex';
  } else {
    btn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
  }
}

// ============================================
// API Calls
// ============================================
async function apiCall(endpoint, data) {
  try {
    const url = `${API_BASE}/${endpoint}`;
    console.log('API Call:', url, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('API Response Status:', response.status);
    const result = await response.json();
    console.log('API Response Data:', result);
    
    return { ok: response.ok, data: result };
  } catch (error) {
    console.error('API Error Details:', error);
    
    let errorMessage = 'Network error. Please check your connection.';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.toString()) {
      errorMessage = error.toString();
    }
    
    return { ok: false, data: { error: errorMessage } };
  }
}

// ============================================
// Login Handler
// ============================================
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Login form submitted');
  clearMessages();

  // Debug DOM elements
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const messageDiv = document.getElementById('loginMessage');
  const submitBtn = document.getElementById('loginBtn');

  console.log('Form element:', form);
  console.log('Email input:', emailInput);
  console.log('Password input:', passwordInput);
  console.log('Message div:', messageDiv);
  console.log('Submit button:', submitBtn);

  const email = emailInput?.value.trim() || '';
  const password = passwordInput?.value || '';

  // Client-side validation
  if (!email || !password) {
    showError('loginMessage', 'Please fill in all fields');
    return;
  }

  if (!validateEmail(email)) {
    showError('loginMessage', 'Please enter a valid email address');
    return;
  }

  setLoading('loginBtn', true);

  const { ok, data } = await apiCall('login.php', { email, password });

  setLoading('loginBtn', false);

   if (ok && data.success) {
    showSuccess('loginMessage', data.message || 'Login successful!');

    // Save auth data on PHP origin
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Also pass auth data to React app origin via URL params
    const reactBaseUrl = 'http://localhost:5174';
    const tokenParam = encodeURIComponent(data.token);
    const userParam = encodeURIComponent(btoa(JSON.stringify(data.user)));

    // Redirect to React dashboard (Vite dev server)
    setTimeout(() => {
      window.location.href = `${reactBaseUrl}?token=${tokenParam}&user=${userParam}`;
    }, 800);
  } else {
    showError('loginMessage', data.error || 'Login failed. Please try again.');
    // Shake the form
    document.getElementById('loginForm').classList.add('shake');
    setTimeout(() => {
      document.getElementById('loginForm').classList.remove('shake');
    }, 500);
  }
});

// ============================================
// Signup Handler
// ============================================
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Signup form submitted');
  clearMessages();

  // Debug DOM elements
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const termsCheckbox = document.getElementById('agreeTerms');
  const messageDiv = document.getElementById('signupMessage');
  const submitBtn = document.getElementById('signupBtn');

  console.log('Form element:', form);
  console.log('Name input:', nameInput);
  console.log('Email input:', emailInput);
  console.log('Password input:', passwordInput);
  console.log('Terms checkbox:', termsCheckbox);
  console.log('Message div:', messageDiv);
  console.log('Submit button:', submitBtn);

  const name = nameInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';
  const password = passwordInput?.value || '';
  const agreeTerms = termsCheckbox?.checked || false;

  // Client-side validation
  if (!name || !email || !password) {
    showError('signupMessage', 'Please fill in all fields');
    return;
  }

  if (name.length < 2) {
    showError('signupMessage', 'Name must be at least 2 characters');
    return;
  }

  if (!validateEmail(email)) {
    showError('signupMessage', 'Please enter a valid email address');
    return;
  }

  if (password.length < 6) {
    showError('signupMessage', 'Password must be at least 6 characters');
    return;
  }

  if (!agreeTerms) {
    showError('signupMessage', 'Please agree to the Terms of Service');
    return;
  }

  setLoading('signupBtn', true);

  const { ok, data } = await apiCall('signup.php', { name, email, password });

  setLoading('signupBtn', false);

  if (ok && data.success) {
    showSuccess('signupMessage', data.message || 'Account created successfully!');

    // Save auth data on PHP origin
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    localStorage.setItem('user', JSON.stringify(data.user));

    // Also pass auth data to React app origin via URL params
    const reactBaseUrl = 'http://localhost:5174';
    const tokenParam = data.token ? encodeURIComponent(data.token) : '';
    const userParam = encodeURIComponent(btoa(JSON.stringify(data.user)));

    // Redirect to React dashboard (Vite dev server)
    setTimeout(() => {
      const tokenQuery = tokenParam ? `&token=${tokenParam}` : '';
      window.location.href = `${reactBaseUrl}?user=${userParam}${tokenQuery}`;
    }, 1000);
  } else {
    showError('signupMessage', data.error || 'Signup failed. Please try again.');
    document.getElementById('signupForm').classList.add('shake');
    setTimeout(() => {
      document.getElementById('signupForm').classList.remove('shake');
    }, 500);
  }
});

// ============================================
// Dashboard
// ============================================
function showDashboard(user) {
  switchPanel('dashboard');

  // Set avatar
  const avatar = document.getElementById('userAvatar');
  const initial = document.getElementById('avatarInitial');
  if (avatar && initial) {
    avatar.style.background = `linear-gradient(135deg, ${user.avatar_color || '#6366f1'}, ${adjustColor(user.avatar_color || '#6366f1', -30)})`;
    initial.textContent = (user.name || 'U').charAt(0).toUpperCase();
  }

  // Set user info
  const nameEl = document.getElementById('dashUserName');
  const emailEl = document.getElementById('dashUserEmail');
  const idEl = document.getElementById('dashUserId');
  const sinceEl = document.getElementById('dashMemberSince');

  if (nameEl) nameEl.textContent = user.name || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (idEl) idEl.textContent = `#${user.id || '—'}`;
  if (sinceEl) {
    sinceEl.textContent = user.member_since
      ? new Date(user.member_since).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Today';
  }
}

// ============================================
// Google Login
// ============================================
function handleGoogleLogin() {
  console.log('Initializing Google login...');
  
  // Configure Google Sign-In
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE',
    callback: handleGoogleCallback,
    auto_select: false,
    cancel_on_tap_outside: true
  });
  
  // Render Google Sign-In button
  google.accounts.id.prompt((notification) => {
    console.log('Google prompt notification:', notification);
    
    if (notification.isNotDisplayed()) {
      console.error('Google Sign-In prompt not displayed');
      showError('loginMessage', 'Google login is temporarily unavailable');
    } else if (notification.isSkippedMoment()) {
      console.warn('Google Sign-In prompt skipped');
    } else if (notification.isDismissedMoment()) {
      console.log('Google Sign-In prompt dismissed');
    }
  });
}

function handleGoogleCallback(response) {
  console.log('Google login callback received:', response);
  
  if (response.credential) {
    // Verify the ID token with our server
    verifyGoogleToken(response.credential);
  } else {
    showError('loginMessage', 'Google login failed. Please try again.');
  }
}

async function verifyGoogleToken(credential) {
  console.log('Verifying Google token...');
  
  const { ok, data } = await apiCall('google_login.php', { id_token: credential });
  
  if (ok && data.success) {
    showSuccess('loginMessage', data.message || 'Google login successful!');
    
    // Save auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Transition to dashboard
    setTimeout(() => {
      showDashboard(data.user);
    }, 800);
  } else {
    showError('loginMessage', data.error || 'Google login verification failed');
  }
}

// ============================================
// Logout
// ============================================
async function logout() {
  const token = localStorage.getItem('token');

  if (token) {
    // Best-effort server logout
    apiCall('logout.php', { token }).catch(() => {});
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  switchPanel('login');

  // Clear form fields
  document.querySelectorAll('.auth-form').forEach(form => form.reset());
}

// ============================================
// Utility Functions
// ============================================
function adjustColor(hex, amount) {
  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);
  let r = Math.min(255, Math.max(0, (num >> 16) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Create background particles
  createParticles();
  
   // Social Login Handlers
    const googleBtn = document.querySelector('.btn-social.google');
    const facebookBtn = document.querySelector('.btn-social.facebook');
    
    console.log('Google button element:', googleBtn);
    console.log('Facebook button element:', facebookBtn);
    
    if (googleBtn) {
      googleBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (facebookBtn) {
      facebookBtn.addEventListener('click', () => {
        console.log('Facebook login clicked');
        showError('loginMessage', 'Facebook login is coming soon!');
      });
    }

  // Password strength listener
  const signupPassword = document.getElementById('signupPassword');
  if (signupPassword) {
    signupPassword.addEventListener('input', (e) => {
      checkPasswordStrength(e.target.value);
    });
  }

  // Check for existing session
  const savedUser = localStorage.getItem('user');
  const savedToken = localStorage.getItem('token');

  if (savedUser && savedToken) {
    try {
      const user = JSON.parse(savedUser);
      // Verify token is still valid
      apiCall('verify.php', { token: savedToken }).then(({ ok, data }) => {
        if (ok && data.success) {
          showDashboard(data.user);
        } else {
          // Token expired, clear and show login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          switchPanel('login');
        }
      }).catch(() => {
        // If verification fails (e.g., no server), show dashboard with cached data
        showDashboard(user);
      });
    } catch {
      switchPanel('login');
    }
  }

  // Add input animations
  document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
});
