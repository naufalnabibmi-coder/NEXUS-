/* ============================================
   NEXUS — APP.JS
   JS untuk halaman: profile, settings, projects, messages
   ============================================ */

/* ---------- HELPER: TOAST ---------- */
function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ---------- HELPER: GET USER ---------- */
function getUser() {
    const saved = localStorage.getItem('user');
    if (!saved) {
        window.location.href = 'login.html';
        return null;
    }
    try { return JSON.parse(saved); }
    catch (e) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return null;
    }
}

/* ---------- HELPER: SAVE USER ---------- */
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

/* ---------- INIT SIDEBAR (dipakai di semua halaman app) ---------- */
function initSidebar() {
    const user = getUser();
    if (!user) return;

    const displayName = user.name || user.email.split('@')[0] || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    const els = {
        sidebarName: document.getElementById('sidebarName'),
        sidebarEmail: document.getElementById('sidebarEmail'),
        userAvatar: document.getElementById('userAvatar')
    };

    if (els.sidebarName) els.sidebarName.textContent = displayName;
    if (els.sidebarEmail) els.sidebarEmail.textContent = user.email || '-';
    if (els.userAvatar) els.userAvatar.textContent = initial;

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

/* ---------- PROFILE PAGE ---------- */
function initProfilePage() {
    const user = getUser();
    if (!user) return;

    const displayName = user.name || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    // Isi tampilan
    document.getElementById('profileName').textContent = displayName;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileAvatar').textContent = initial;

    // Isi form
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editBio').value = user.bio || '';
    document.getElementById('editCity').value = user.city || '';
    document.getElementById('editPhone').value = user.phone || '';

    // Avatar upload
    const avatarBtn = document.getElementById('avatarUploadBtn');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');

    // Load avatar jika ada
    if (user.avatar) {
        profileAvatar.style.backgroundImage = `url(${user.avatar})`;
        profileAvatar.textContent = '';
    }

    avatarBtn.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast('Ukuran gambar maksimal 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            profileAvatar.style.backgroundImage = `url(${dataUrl})`;
            profileAvatar.textContent = '';

            const updated = { ...user, avatar: dataUrl };
            saveUser(updated);
            showToast('Foto profil diperbarui! ✅');
        };
        reader.readAsDataURL(file);
    });

    // Submit form
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const bio = document.getElementById('editBio').value.trim();
        const city = document.getElementById('editCity').value.trim();
        const phone = document.getElementById('editPhone').value.trim();

        const nameErr = document.getElementById('editNameError');
        const emailErr = document.getElementById('editEmailError');
        nameErr.classList.remove('show');
        emailErr.classList.remove('show');

        let valid = true;
        if (name.length < 2) {
            nameErr.textContent = 'Nama minimal 2 karakter';
            nameErr.classList.add('show');
            valid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailErr.textContent = 'Format email tidak valid';
            emailErr.classList.add('show');
            valid = false;
        }
        if (!valid) return;

        const updated = { ...user, name, email, bio, city, phone };
        saveUser(updated);

        // Update tampilan
        document.getElementById('profileName').textContent = name;
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('profileAvatar').textContent = name.charAt(0).toUpperCase();
        document.getElementById('profileAvatar').style.backgroundImage = updated.avatar ? `url(${updated.avatar})` : '';

        initSidebar(); // refresh sidebar
        showToast('Perubahan berhasil disimpan! ✅');
    });

    // Cancel
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('editName').value = user.name || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editBio').value = user.bio || '';
        document.getElementById('editCity').value = user.city || '';
        document.getElementById('editPhone').value = user.phone || '';
        showToast('Perubahan dibatalkan', 'error');
    });
}

/* ---------- SETTINGS PAGE ---------- */
function initSettingsPage() {
    const user = getUser();
    if (!user) return;

    // Load saved settings
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const fields = ['notifEmail', 'notifPush', 'notifNews', 'twoFactor', 'publicProfile', 'showEmail'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = settings[id] !== undefined ? settings[id] : (el.checked);
    });

    // Save on change
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                const s = JSON.parse(localStorage.getItem('settings') || '{}');
                s[id] = el.checked;
                localStorage.setItem('settings', JSON.stringify(s));
                showToast('Pengaturan disimpan');
            });
        }
    });

    // Change password modal
    const pwdModal = document.getElementById('pwdModal');
    document.getElementById('changePwdBtn').addEventListener('click', () => {
        pwdModal.classList.add('active');
    });
    document.getElementById('pwdCancel').addEventListener('click', () => {
        pwdModal.classList.remove('active');
    });
    pwdModal.addEventListener('click', (e) => {
        if (e.target.id === 'pwdModal') pwdModal.classList.remove('active');
    });

    document.getElementById('pwdForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPwd = document.getElementById('newPwd').value;
        if (newPwd.length < 8) {
            showToast('Password minimal 8 karakter', 'error');
            return;
        }
        showToast('Password berhasil diubah! ✅');
        pwdModal.classList.remove('active');
        document.getElementById('pwdForm').reset();
    });

    // Delete account
    document.getElementById('deleteAccountBtn').addEventListener('click', () => {
        if (confirm('⚠️ Yakin ingin HAPUS AKUN? Semua data akan hilang permanen!')) {
            if (confirm('Konfirmasi terakhir: Hapus akun sekarang?')) {
                localStorage.removeItem('user');
                localStorage.removeItem('settings');
                window.location.href = 'index.html';
            }
        }
    });
}

/* ---------- PROJECTS PAGE ---------- */
function initProjectsPage() {
    const user = getUser();
    if (!user) return;

    // Sample projects
    const defaultProjects = [
        { id: 1, name: 'Website Portfolio', desc: 'Portfolio pribadi dengan animasi', status: 'active', date: '2024-11-01' },
        { id: 2, name: 'Mobile App Design', desc: 'Desain aplikasi mobile fintech', status: 'active', date: '2024-10-15' },
        { id: 3, name: 'Landing Page Startup', desc: 'Landing page untuk startup SaaS', status: 'completed', date: '2024-09-20' },
        { id: 4, name: 'E-commerce Site', desc: 'Toko online dengan payment gateway', status: 'completed', date: '2024-08-10' },
        { id: 5, name: 'Blog Tech', desc: 'Blog tentang teknologi terbaru', status: 'archived', date: '2024-07-05' }
    ];

    let projects = JSON.parse(localStorage.getItem('projects') || 'null') || defaultProjects;
    if (!localStorage.getItem('projects')) localStorage.setItem('projects', JSON.stringify(projects));

    const grid = document.getElementById('projectGrid');
    let currentFilter = 'all';

    function render() {
        const filtered = currentFilter === 'all' ? projects : projects.filter(p => p.status === currentFilter);

        if (!filtered.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-dim)">
                <div style="font-size:3rem;margin-bottom:1rem">📁</div>
                <p>Belum ada project di kategori ini</p>
            </div>`;
            return;
        }

        grid.innerHTML = filtered.map(p => `
            <div class="project-card" data-id="${p.id}">
                <span class="status ${p.status}">${p.status}</span>
                <h3>${p.name}</h3>
                <p>${p.desc || 'Tidak ada deskripsi'}</p>
                <div class="meta">📅 ${p.date}</div>
            </div>
        `).join('');

        grid.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                showToast('Membuka project...');
            });
        });
    }

    render();

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    // New project modal
    const modal = document.getElementById('newProjectModal');
    document.getElementById('newProjectBtn').addEventListener('click', () => {
        modal.classList.add('active');
    });
    document.getElementById('cancelProject').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'newProjectModal') modal.classList.remove('active');
    });

    document.getElementById('newProjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('projectName').value.trim();
        const desc = document.getElementById('projectDesc').value.trim();
        if (!name) return;

        const newProject = {
            id: Date.now(),
            name,
            desc,
            status: 'active',
            date: new Date().toISOString().split('T')[0]
        };

        projects.unshift(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        render();
        modal.classList.remove('active');
        document.getElementById('newProjectForm').reset();
        showToast('Project baru berhasil dibuat! 🚀');
    });
}

/* ---------- MESSAGES PAGE ---------- */
function initMessagesPage() {
    const user = getUser();
    if (!user) return;

    const messages = [
        {
            id: 1,
            from: 'Sarah Wijaya',
            subject: 'Revisi Desain Homepage',
            preview: 'Hai, saya lihat desain homepage-nya sudah bagus...',
            time: '10:30',
            unread: true,
            messages: [
                { side: 'in', text: 'Hai! Saya lihat desain homepage-nya sudah bagus. Tapi bisa tolong ubah warna tombol jadi lebih cerah?' },
                { side: 'out', text: 'Halo Sarah! Baik, saya akan ubah ke cyan yang lebih terang ya.' },
                { side: 'in', text: 'Sempurna! Terima kasih 🙏' }
            ]
        },
        {
            id: 2,
            from: 'Budi Santoso',
            subject: 'Meeting Senin',
            preview: 'Halo, apakah bisa meeting Senin jam 10?',
            time: '09:15',
            unread: true,
            messages: [
                { side: 'in', text: 'Halo, apakah bisa meeting Senin jam 10 untuk bahas progress project?' },
                { side: 'out', text: 'Bisa Budi! Sampai ketemu Senin jam 10 ya.' }
            ]
        },
        {
            id: 3,
            from: 'NEXUS Team',
            subject: '🎉 Selamat Datang!',
            preview: 'Terima kasih telah bergabung dengan NEXUS...',
            time: 'Kemarin',
            unread: true,
            messages: [
                { side: 'in', text: 'Selamat datang di NEXUS! Kami senang Anda bergabung. Jelajahi semua fitur kami dan mulai project pertama Anda!' }
            ]
        },
        {
            id: 4,
            from: 'Andi Pratama',
            subject: 'File Final',
            preview: 'Sudah saya kirim file finalnya ya',
            time: '2 hari lalu',
            unread: false,
            messages: [
                { side: 'in', text: 'Sudah saya kirim file finalnya ya, cek email.' },
                { side: 'out', text: 'Oke, terima kasih Andi!' }
            ]
        }
    ];

    const inboxList = document.getElementById('inboxList');
    const chatView = document.getElementById('chatView');

    function renderInbox() {
        inboxList.innerHTML = messages.map(m => `
            <div class="inbox-item ${m.unread ? 'unread' : ''}" data-id="${m.id}">
                <strong>${m.from}</strong>
                <span>${m.time}</span>
                <div style="clear:both"></div>
                <div style="font-size:0.85rem;margin-top:0.2rem">${m.subject}</div>
                <p>${m.preview}</p>
            </div>
        `).join('');

        inboxList.querySelectorAll('.inbox-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = +item.dataset.id;
                openChat(id);
            });
        });
    }

    function openChat(id) {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;

        msg.unread = false;
        renderInbox();

        chatView.innerHTML = `
            <div class="chat-header">
                <div class="chat-avatar">${msg.from.charAt(0).toUpperCase()}</div>
                <div>
                    <strong>${msg.from}</strong>
                    <div style="font-size:0.75rem;color:var(--text-dim)">${msg.subject}</div>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages">
                ${msg.messages.map(m => `<div class="chat-bubble ${m.side}">${m.text}</div>`).join('')}
            </div>
            <form class="chat-input" id="chatForm">
                <input type="text" id="chatInput" placeholder="Tulis balasan..." autocomplete="off">
                <button type="submit" class="btn btn-primary btn-sm">Kirim</button>
            </form>
        `;

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('chatInput');
            const text = input.value.trim();
            if (!text) return;

            msg.messages.push({ side: 'out', text });
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble out';
            bubble.textContent = text;
            chatMessages.appendChild(bubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            input.value = '';
        });
    }

    renderInbox();
}

/* ---------- FORGOT PASSWORD ---------- */
function initForgotPassword() {
    const form = document.getElementById('forgotForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const emailErr = document.getElementById('emailError');
        emailErr.classList.remove('show');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailErr.textContent = 'Format email tidak valid';
            emailErr.classList.add('show');
            return;
        }

        const btn = document.getElementById('submitBtn');
        btn.classList.add('loading');
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 1200));

        btn.classList.remove('loading');
        btn.disabled = false;

        document.getElementById('resetModal').classList.add('active');
    });

    const modal = document.getElementById('resetModal');
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'resetModal') modal.classList.remove('active');
    });
}