/* ============================================
   NEXUS — FEATURES.JS (COMPLETE)
   Search • Notif • Lang • Chart • Calendar • Tour
   ============================================ */

/* ---------- SEARCH GLOBAL (F) ---------- */
function initSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    const dataIndex = [
        { icon: '📊', title: 'Dashboard', desc: 'Ringkasan aktivitas', url: 'dashboard.html' },
        { icon: '📁', title: 'Projects', desc: 'Kelola project', url: 'projects.html' },
        { icon: '💬', title: 'Messages', desc: 'Pesan & chat', url: 'messages.html' },
        { icon: '👤', title: 'Profil', desc: 'Edit informasi profil', url: 'profile.html' },
        { icon: '⚙️', title: 'Settings', desc: 'Pengaturan akun', url: 'settings.html' },
        { icon: '🔐', title: 'Ubah Password', desc: 'Ganti password', url: 'settings.html' },
        { icon: '🎨', title: 'Tema', desc: 'Ganti dark/light mode', url: 'settings.html' },
        { icon: '🌐', title: 'Bahasa', desc: 'Ganti bahasa ID/EN', url: 'settings.html' }
    ];

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        results.innerHTML = '';

        if (!query) {
            results.classList.remove('active');
            return;
        }

        const matches = dataIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query)
        );

        if (!matches.length) {
            results.innerHTML = '<div class="search-empty">Tidak ada hasil untuk "' + query + '"</div>';
        } else {
            results.innerHTML = matches.map(m =>
                '<a href="' + m.url + '" class="search-result-item">' +
                '<span class="icon">' + m.icon + '</span>' +
                '<div><strong>' + m.title + '</strong>' +
                '<div style="font-size:0.75rem;color:var(--text-dim)">' + m.desc + '</div>' +
                '</div></a>'
            ).join('');
        }

        results.classList.add('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            results.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') results.classList.remove('active');
    });
}

/* ---------- NOTIFIKASI (B) ---------- */
function initNotifications() {
    const btn = document.getElementById('notifBtn');
    const dropdown = document.getElementById('notifDropdown');
    const list = document.getElementById('notifList');
    const badge = document.getElementById('notifBadge');
    if (!btn) return;

    const notifications = JSON.parse(localStorage.getItem('notifications') || 'null') || [
        { id: 1, icon: '🎉', title: 'Selamat Datang!', desc: 'Jelajahi fitur NEXUS', time: 'Baru saja', unread: true },
        { id: 2, icon: '📁', title: 'Project baru tersedia', desc: 'Ada template baru', time: '5 menit lalu', unread: true },
        { id: 3, icon: '💬', title: 'Pesan baru dari Sarah', desc: '"Hai, revisi desain..."', time: '10 menit lalu', unread: true },
        { id: 4, icon: '✅', title: 'Project selesai', desc: 'Website Portfolio selesai', time: 'Kemarin', unread: false }
    ];

    function render() {
        const unread = notifications.filter(n => n.unread).length;

        if (unread === 0) {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
            badge.textContent = unread > 9 ? '9+' : unread;
        }

        if (!notifications.length) {
            list.innerHTML = '<div class="notif-empty">Tidak ada notifikasi</div>';
            return;
        }

        list.innerHTML = notifications.map(n =>
            '<div class="notif-item ' + (n.unread ? 'unread' : '') + '" data-id="' + n.id + '">' +
            '<div class="icon">' + n.icon + '</div>' +
            '<div class="content"><strong>' + n.title + '</strong>' +
            '<p>' + n.desc + '</p><span>' + n.time + '</span></div></div>'
        ).join('');

        list.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = +item.dataset.id;
                const notif = notifications.find(n => n.id === id);
                if (notif) notif.unread = false;
                localStorage.setItem('notifications', JSON.stringify(notifications));
                render();
            });
        });
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notif-wrapper')) {
            dropdown.classList.remove('active');
        }
    });

    const markAllBtn = document.getElementById('markAllRead');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            notifications.forEach(n => n.unread = false);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            render();
        });
    }

    render();

    window.pushNotification = (icon, title, desc) => {
        notifications.unshift({
            id: Date.now(),
            icon,
            title,
            desc,
            time: 'Baru saja',
            unread: true
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        render();
    };
}

/* ---------- LANGUAGE (C) ---------- */
const translations = {
    id: {
        'nav.dashboard': '📊 Dashboard',
        'nav.projects': '📁 Projects',
        'nav.messages': '💬 Messages',
        'nav.profile': '👤 Profil',
        'nav.settings': '⚙️ Settings',
        'dash.subtitle': 'Selamat datang kembali di dashboard NEXUS Anda.',
        'stat.projects': 'Total Projects',
        'stat.completed': 'Completed',
        'stat.messages': 'New Messages',
        'stat.performance': 'Performance',
        'chart.title': '📈 Statistik Aktivitas',
        'calendar.title': '📅 Kalender Aktivitas',
        'quick.title': '⚡ Aksi Cepat',
        'quick.newProject': 'Project Baru',
        'quick.newProjectDesc': 'Mulai project impian Anda',
        'quick.invite': 'Undang Tim',
        'quick.inviteDesc': 'Tambahkan anggota',
        'quick.note': 'Buat Catatan',
        'quick.noteDesc': 'Catat ide Anda',
        'quick.settings': 'Pengaturan',
        'quick.settingsDesc': 'Sesuaikan akun'
    },
    en: {
        'nav.dashboard': '📊 Dashboard',
        'nav.projects': '📁 Projects',
        'nav.messages': '💬 Messages',
        'nav.profile': '👤 Profile',
        'nav.settings': '⚙️ Settings',
        'dash.subtitle': 'Welcome back to your NEXUS dashboard.',
        'stat.projects': 'Total Projects',
        'stat.completed': 'Completed',
        'stat.messages': 'New Messages',
        'stat.performance': 'Performance',
        'chart.title': '📈 Activity Statistics',
        'calendar.title': '📅 Activity Calendar',
        'quick.title': '⚡ Quick Actions',
        'quick.newProject': 'New Project',
        'quick.newProjectDesc': 'Start your dream project',
        'quick.invite': 'Invite Team',
        'quick.inviteDesc': 'Add members',
        'quick.note': 'Create Note',
        'quick.noteDesc': 'Note your ideas',
        'quick.settings': 'Settings',
        'quick.settingsDesc': 'Customize account'
    }
};

function initLanguage() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;

    let lang = localStorage.getItem('lang') || 'id';

    function apply() {
        btn.textContent = lang === 'id' ? '🌐 ID' : '🌐 EN';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        localStorage.setItem('lang', lang);
    }

    btn.addEventListener('click', () => {
        lang = lang === 'id' ? 'en' : 'id';
        apply();
    });

    apply();
}

/* ---------- CHART (A) ---------- */
function initChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum dimuat. Pastikan CDN ada di HTML.');
        return;
    }

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.02)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(255, 0, 229, 0.5)');
    gradient2.addColorStop(1, 'rgba(255, 0, 229, 0.02)');

    const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text').trim() || '#ffffff';
    const dimColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-dim').trim() || '#8888aa';

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [
                {
                    label: 'Project Views',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#00f0ff',
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#00f0ff',
                    pointBorderColor: '#0a0a0f',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Messages',
                    data: [8, 12, 10, 15, 18, 22, 20],
                    borderColor: '#ff00e5',
                    backgroundColor: gradient2,
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#ff00e5',
                    pointBorderColor: '#0a0a0f',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: dimColor, font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(128, 128, 128, 0.1)' },
                    ticks: { color: dimColor, font: { size: 11 } },
                    beginAtZero: true
                }
            }
        }
    });
}

/* ---------- CALENDAR (G) ---------- */
function initCalendar() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('calendarTitle');
    const eventsBox = document.getElementById('calendarEvents');
    if (!grid || !title) return;

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    let currentDate = new Date();
    let selectedDate = null;

    // Sample events — key: YYYY-MM-DD
    const events = JSON.parse(localStorage.getItem('calendarEvents') || 'null') || (() => {
        const today = new Date();
        const fmt = (d) => d.toISOString().split('T')[0];

        const d1 = new Date(today); d1.setDate(today.getDate() + 2);
        const d2 = new Date(today); d2.setDate(today.getDate() - 3);
        const d3 = new Date(today); d3.setDate(today.getDate() + 5);

        return {
            [fmt(today)]: [
                { time: '10:00', title: 'Meeting dengan tim desain' },
                { time: '14:30', title: 'Review project NEXUS' }
            ],
            [fmt(d1)]: [
                { time: '09:00', title: 'Deadline project portfolio' }
            ],
            [fmt(d2)]: [
                { time: '16:00', title: 'Call klien Sarah' }
            ],
            [fmt(d3)]: [
                { time: '11:00', title: 'Presentasi hasil desain' }
            ]
        };
    })();

    if (!localStorage.getItem('calendarEvents')) {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    function render() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        title.textContent = monthNames[month] + ' ' + year;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        let html = '';

        // Day labels
        dayNames.forEach(d => {
            html += '<div class="calendar-day-label">' + d + '</div>';
        });

        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            const isToday = dateStr === todayStr;
            const hasEvent = events[dateStr] && events[dateStr].length > 0;
            const isSelected = selectedDate === dateStr;

            const classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (hasEvent) classes.push('has-event');
            if (isSelected) classes.push('selected');

            html += '<div class="' + classes.join(' ') + '" data-date="' + dateStr + '">' + d + '</div>';
        }

        grid.innerHTML = html;

        // Click events
        grid.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                selectedDate = day.dataset.date;
                render();
                showEvents(selectedDate);
            });
        });
    }

    function showEvents(dateStr) {
        const dayEvents = events[dateStr] || [];

        if (!dayEvents.length) {
            eventsBox.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:1rem">Tidak ada aktivitas pada tanggal ini</p>';
            return;
        }

        eventsBox.innerHTML = dayEvents.map(e =>
            '<div class="calendar-event-item">' +
            '<span class="time">' + e.time + '</span>' +
            '<span>' + e.title + '</span></div>'
        ).join('');
    }

    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            render();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            render();
        });
    }

    render();
}

/* ---------- ONBOARDING TOUR (E) ---------- */
function initTour() {
    const overlay = document.getElementById('tourOverlay');
    const box = document.getElementById('tourBox');
    const stepEl = document.getElementById('tourStep');
    const titleEl = document.getElementById('tourTitle');
    const textEl = document.getElementById('tourText');
    const nextBtn = document.getElementById('tourNext');
    const skipBtn = document.getElementById('tourSkip');
    if (!overlay || !stepEl) return;

    const steps = [
        {
            title: 'Selamat Datang! 👋',
            text: 'Ini adalah dashboard NEXUS Anda. Mari jelajahi fitur-fiturnya dalam 30 detik.'
        },
        {
            title: '📊 Statistik Aktivitas',
            text: 'Lihat grafik aktivitas mingguan Anda — project views dan pesan masuk.'
        },
        {
            title: '📅 Kalender Aktivitas',
            text: 'Kelola jadwal dan deadline project Anda di kalender interaktif.'
        },
        {
            title: '🔍 Pencarian Global',
            text: 'Cari project, pesan, atau pengaturan dengan cepat lewat search bar di atas.'
        },
        {
            title: '🎨 Kustomisasi',
            text: 'Ganti tema (dark/light) dan bahasa (ID/EN) sesuai selera Anda. Selamat berkreasi! 🚀'
        }
    ];

    let currentStep = 0;

    // Cek apakah sudah pernah lihat tour
    if (localStorage.getItem('tourDone') === 'true') return;

    function show() {
        const step = steps[currentStep];
        stepEl.textContent = (currentStep + 1) + ' / ' + steps.length;
        titleEl.textContent = step.title;
        textEl.textContent = step.text;

        nextBtn.textContent = currentStep === steps.length - 1 ? 'Selesai 🎉' : 'Lanjut →';
    }

    function close() {
        overlay.classList.remove('active');
        localStorage.setItem('tourDone', 'true');
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            show();
        } else {
            close();
        }
    });

    skipBtn.addEventListener('click', close);

    // Tampilkan setelah 1 detik
    setTimeout(() => {
        overlay.classList.add('active');
        show();
    }, 1000);

    // Expose reset tour untuk testing
    window.resetTour = () => {
        localStorage.removeItem('tourDone');
        location.reload();
    };
}