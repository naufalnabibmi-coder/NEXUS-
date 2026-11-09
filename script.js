/* ============================================
   NEXUS — MAIN SCRIPT
   Semua fungsi JS untuk semua halaman
   ============================================ */

/* ---------- THEME TOGGLE ---------- */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    toggle.textContent = saved === 'dark' ? '🌙' : '☀️';

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });
}

/* ---------- PARTICLES ---------- */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '0, 240, 255' : '255, 0, 229';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - d / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ---------- REGISTER FORM ---------- */
function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsCheck = document.getElementById('terms');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Toggle password
    const toggle = document.getElementById('togglePassword');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const show = passwordInput.type === 'password';
            passwordInput.type = show ? 'text' : 'password';
            toggle.querySelector('.eye-icon').textContent = show ? '🙈' : '👁';
        });
    }

    // Strength meter
    passwordInput.addEventListener('input', () => {
        const v = passwordInput.value;
        let score = 0;
        if (v.length >= 8) score++;
        if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
        if (/\d/.test(v)) score++;
        if (/[^a-zA-Z0-9]/.test(v)) score++;

        strengthBar.className = 'strength-bar';
        strengthText.className = 'strength-text';

        if (!v) { strengthText.textContent = ''; return; }
        if (score <= 1) {
            strengthBar.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Lemah';
        } else if (score <= 2) {
            strengthBar.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Sedang';
        } else {
            strengthBar.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Kuat ✓';
        }
    });

    // Helpers
    function err(input, msg, id) {
        input.closest('.form-group').classList.add('error');
        input.closest('.form-group').classList.remove('success');
        const e = document.getElementById(id);
        e.textContent = msg;
        e.classList.add('show');
    }
    function ok(input) {
        const g = input.closest('.form-group');
        g.classList.remove('error');
        g.classList.add('success');
        g.querySelector('.error-message').classList.remove('show');
    }
    function clear(input) {
        const g = input.closest('.form-group');
        g.classList.remove('error', 'success');
        g.querySelector('.error-message').classList.remove('show');
    }

    // Validators
    function vName() {
        const v = nameInput.value.trim();
        if (v.length < 2) { err(nameInput, 'Nama minimal 2 karakter', 'nameError'); return false; }
        ok(nameInput); return true;
    }
    function vEmail() {
        const v = emailInput.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err(emailInput, 'Format email tidak valid', 'emailError'); return false; }
        ok(emailInput); return true;
    }
    function vPass() {
        const v = passwordInput.value;
        if (v.length < 8) { err(passwordInput, 'Minimal 8 karakter', 'passwordError'); return false; }
        if (!/[A-Z]/.test(v)) { err(passwordInput, 'Butuh huruf besar', 'passwordError'); return false; }
        if (!/\d/.test(v)) { err(passwordInput, 'Butuh angka', 'passwordError'); return false; }
        ok(passwordInput); return true;
    }
    function vConfirm() {
        if (confirmInput.value !== passwordInput.value) {
            err(confirmInput, 'Password tidak cocok', 'confirmPasswordError'); return false;
        }
        ok(confirmInput); return true;
    }
    function vTerms() {
        const e = document.getElementById('termsError');
        if (!termsCheck.checked) { e.textContent = 'Wajib disetujui'; e.classList.add('show'); return false; }
        e.classList.remove('show'); return true;
    }

    // Live
    nameInput.addEventListener('blur', vName);
    emailInput.addEventListener('blur', vEmail);
    passwordInput.addEventListener('blur', vPass);
    confirmInput.addEventListener('blur', vConfirm);
    termsCheck.addEventListener('change', vTerms);
    [nameInput, emailInput, passwordInput, confirmInput].forEach(i => {
        i.addEventListener('input', () => clear(i));
    });

    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const valid = [vName(), vEmail(), vPass(), vConfirm(), vTerms()].every(Boolean);
        if (!valid) return;

        const btn = document.getElementById('submitBtn');
        btn.classList.add('loading');
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 1200));

        // Simpan user
        const user = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim()
        };
        localStorage.setItem('user', JSON.stringify(user));

        btn.classList.remove('loading');
        btn.disabled = false;

        document.getElementById('successModal').classList.add('active');
    });

    // Close modal on backdrop
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'successModal') modal.classList.remove('active');
        });
    }
}

/* ---------- LOGIN FORM ---------- */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Toggle password
    const toggle = document.getElementById('togglePassword');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const show = passwordInput.type === 'password';
            passwordInput.type = show ? 'text' : 'password';
            toggle.querySelector('.eye-icon').textContent = show ? '🙈' : '👁';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const emailErr = document.getElementById('emailError');
        const pwErr = document.getElementById('passwordError');
        emailErr.classList.remove('show');
        pwErr.classList.remove('show');

        let valid = true;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailErr.textContent = 'Email tidak valid';
            emailErr.classList.add('show');
            valid = false;
        }
        if (password.length < 6) {
            pwErr.textContent = 'Password minimal 6 karakter';
            pwErr.classList.add('show');
            valid = false;
        }
        if (!valid) return;

        const btn = document.getElementById('submitBtn');
        btn.classList.add('loading');
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 1000));

        // Cek user di localStorage
        const saved = JSON.parse(localStorage.getItem('user') || 'null');
        if (saved && saved.email === email) {
            // Login berhasil
            window.location.href = 'dashboard.html';
        } else {
            // Login gagal
            pwErr.textContent = 'Email atau password salah';
            pwErr.classList.add('show');
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });
}

/* ---------- DASHBOARD ---------- */
function initDashboard() {
    const saved = localStorage.getItem('user');
    if (!saved) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const user = JSON.parse(saved);
        const displayName = user.name || (user.email ? user.email.split('@')[0] : 'User');

        const userNameEl = document.getElementById('userName');
        const sidebarNameEl = document.getElementById('sidebarName');
        const sidebarEmailEl = document.getElementById('sidebarEmail');
        const avatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.textContent = displayName;
        if (sidebarNameEl) sidebarNameEl.textContent = displayName;
        if (sidebarEmailEl) sidebarEmailEl.textContent = user.email || '-';
        if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
    } catch (e) {
        console.error('Data user rusak:', e);
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Yakin ingin logout?')) {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        });
    }
}

/* ---------- REVEAL & COUNTER (untuk index) ---------- */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    items.forEach(el => obs.observe(el));
}

function initCounter() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    let done = false;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !done) {
                done = true;
                counters.forEach(c => {
                    const target = +c.dataset.target;
                    let cur = 0;
                    const step = target / 60;
                    const tick = () => {
                        cur += step;
                        if (cur < target) {
                            c.textContent = Math.ceil(cur);
                            requestAnimationFrame(tick);
                        } else {
                            c.textContent = target;
                        }
                    };
                    tick();
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
}