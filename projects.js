/* ============================================
   NEXUS — PROJECTS.JS (COMPLETE)
   Grid • List • Kanban • CRUD • Export/Import
   ============================================ */

(function () {
    'use strict';

    // ---------- INIT BASE ----------
    initThemeToggle();
    initParticles();

    // ---------- AUTH CHECK ----------
    var user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
        window.location.href = 'login.html';
        return;
    }

    // ---------- SIDEBAR ----------
    var displayName = user.name || (user.email ? user.email.split('@')[0] : 'User');
    var initial = displayName.charAt(0).toUpperCase();

    var sidebarName = document.getElementById('sidebarName');
    var sidebarEmail = document.getElementById('sidebarEmail');
    var userAvatar = document.getElementById('userAvatar');

    if (sidebarName) sidebarName.textContent = displayName;
    if (sidebarEmail) sidebarEmail.textContent = user.email || '-';
    if (userAvatar) userAvatar.textContent = initial;

    // ---------- LOGOUT ----------
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('Yakin ingin logout?')) {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        });
    }

    // ---------- TOAST ----------
    function showToast(msg, type) {
        type = type || 'success';
        var container = document.getElementById('toastContainer');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = msg;
        container.appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(400px)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    }

    // ---------- DATA ----------
    var defaultProjects = [
        { id: 1, name: 'Website Portfolio', desc: 'Portfolio pribadi dengan animasi modern', status: 'active', date: '2024-11-01', deadline: '2024-12-15', tasks: 5 },
        { id: 2, name: 'Mobile App Design', desc: 'Desain aplikasi mobile fintech', status: 'active', date: '2024-10-15', deadline: '2024-11-30', tasks: 8 },
        { id: 3, name: 'Landing Page Startup', desc: 'Landing page untuk startup SaaS', status: 'completed', date: '2024-09-20', deadline: '2024-10-10', tasks: 12 },
        { id: 4, name: 'E-commerce Site', desc: 'Toko online dengan payment gateway', status: 'completed', date: '2024-08-10', deadline: '2024-09-05', tasks: 20 },
        { id: 5, name: 'Blog Tech', desc: 'Blog tentang teknologi terbaru', status: 'archived', date: '2024-07-05', deadline: '2024-08-01', tasks: 6 },
        { id: 6, name: 'Dashboard Analytics', desc: 'Dashboard dengan chart interaktif', status: 'active', date: '2024-11-05', deadline: '2024-12-20', tasks: 10 }
    ];

    var projects = [];
    try {
        var saved = localStorage.getItem('projects');
        projects = saved ? JSON.parse(saved) : defaultProjects.slice();
        if (!saved) localStorage.setItem('projects', JSON.stringify(projects));
    } catch (e) {
        projects = defaultProjects.slice();
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    // ---------- STATE ----------
    var currentFilter = 'all';
    var currentSearch = '';
    var currentSort = 'newest';
    var currentView = 'grid';

    // ---------- HELPERS ----------
    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDate(str) {
        if (!str) return '-';
        var d = new Date(str);
        if (isNaN(d)) return str;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    function getFilteredProjects() {
        var filtered = projects.filter(function (p) {
            var matchFilter = currentFilter === 'all' || p.status === currentFilter;
            var matchSearch = !currentSearch ||
                p.name.toLowerCase().indexOf(currentSearch) !== -1 ||
                (p.desc || '').toLowerCase().indexOf(currentSearch) !== -1;
            return matchFilter && matchSearch;
        });

        // Sort
        filtered.sort(function (a, b) {
            if (currentSort === 'newest') return new Date(b.date) - new Date(a.date);
            if (currentSort === 'oldest') return new Date(a.date) - new Date(b.date);
            if (currentSort === 'name') return a.name.localeCompare(b.name);
            if (currentSort === 'status') {
                var order = { active: 0, completed: 1, archived: 2 };
                return order[a.status] - order[b.status];
            }
            return 0;
        });

        return filtered;
    }

    function updateStats() {
        var total = projects.length;
        var active = projects.filter(function (p) { return p.status === 'active'; }).length;
        var completed = projects.filter(function (p) { return p.status === 'completed'; }).length;
        var archived = projects.filter(function (p) { return p.status === 'archived'; }).length;

        setText('totalProjects', total);
        setText('activeProjects', active);
        setText('completedProjects', completed);
        setText('archivedProjects', archived);
    }

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    // ---------- RENDER GRID ----------
    function renderGrid() {
        var grid = document.getElementById('projectGrid');
        var empty = document.getElementById('projectEmpty');
        if (!grid) return;

        var filtered = getFilteredProjects();

        if (!filtered.length) {
            grid.style.display = 'none';
            grid.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (empty) empty.style.display = 'none';

        var html = '';
        filtered.forEach(function (p) {
            html += buildCardHtml(p);
        });
        grid.innerHTML = html;
        attachCardEvents(grid);
    }

    // ---------- BUILD CARD HTML ----------
    function buildCardHtml(p) {
        var labels = { active: '⚡ Aktif', completed: '✅ Selesai', archived: '📦 Arsip' };
        var icons = { active: '⚡', completed: '✅', archived: '📦' };
        var deadlineStr = p.deadline ? '⏰ ' + formatDate(p.deadline) : '';
        var taskStr = p.tasks ? '📋 ' + p.tasks + ' tugas' : '';

        var html = '<div class="project-card" data-id="' + p.id + '">';
        html += '<div class="project-card-head">';
        html += '<span class="status ' + p.status + '">' + labels[p.status] + '</span>';
        html += '<div class="project-actions">';
        html += '<button class="icon-btn edit-btn" data-id="' + p.id + '" title="Edit">✏️</button>';
        html += '<button class="icon-btn delete-btn" data-id="' + p.id + '" title="Hapus">🗑</button>';
        html += '</div>';
        html += '</div>';
        html += '<h3>' + escapeHtml(p.name) + '</h3>';
        html += '<p>' + escapeHtml(p.desc || 'Tidak ada deskripsi') + '</p>';
        html += '<div class="project-card-meta">';
        if (taskStr) html += '<span>' + taskStr + '</span>';
        if (deadlineStr) html += '<span>' + deadlineStr + '</span>';
        html += '</div>';
        html += '<div class="project-card-footer">';
        html += '<span>📅 ' + formatDate(p.date) + '</span>';
        html += '<span>' + icons[p.status] + '</span>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ---------- RENDER LIST ----------
    function renderList() {
        var list = document.getElementById('projectList');
        var empty = document.getElementById('projectEmpty');
        if (!list) return;

        var filtered = getFilteredProjects();

        if (!filtered.length) {
            list.style.display = 'none';
            list.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        list.style.display = 'flex';
        if (empty) empty.style.display = 'none';

        var labels = { active: '⚡ Aktif', completed: '✅ Selesai', archived: '📦 Arsip' };
        var html = '';
        filtered.forEach(function (p) {
            html += '<div class="project-list-item" data-id="' + p.id + '">';
            html += '<div class="list-item-main">';
            html += '<span class="status ' + p.status + '">' + labels[p.status] + '</span>';
            html += '<div class="list-item-text">';
            html += '<h4>' + escapeHtml(p.name) + '</h4>';
            html += '<p>' + escapeHtml(p.desc || 'Tidak ada deskripsi') + '</p>';
            html += '</div>';
            html += '</div>';
            html += '<div class="list-item-meta">';
            html += '<span>📅 ' + formatDate(p.date) + '</span>';
            if (p.deadline) html += '<span>⏰ ' + formatDate(p.deadline) + '</span>';
            html += '</div>';
            html += '<div class="list-item-actions">';
            html += '<button class="icon-btn edit-btn" data-id="' + p.id + '">✏️</button>';
            html += '<button class="icon-btn delete-btn" data-id="' + p.id + '">🗑</button>';
            html += '</div>';
            html += '</div>';
        });
        list.innerHTML = html;
        attachCardEvents(list);
    }

    // ---------- RENDER KANBAN ----------
    function renderKanban() {
        var board = document.getElementById('kanbanBoard');
        var empty = document.getElementById('projectEmpty');
        if (!board) return;

        if (!projects.length) {
            board.style.display = 'none';
            if (empty) empty.style.display = 'block';
            return;
        }

        board.style.display = 'grid';
        if (empty) empty.style.display = 'none';

        var statuses = ['active', 'completed', 'archived'];
        var labels = { active: '⚡ Aktif', completed: '✅ Selesai', archived: '📦 Arsip' };

        statuses.forEach(function (status) {
            var cards = document.getElementById('kanbanCards' + status.charAt(0).toUpperCase() + status.slice(1));
            var countEl = document.getElementById('kanbanCount' + status.charAt(0).toUpperCase() + status.slice(1));
            if (!cards) return;

            var filtered = projects.filter(function (p) {
                var matchFilter = status === p.status;
                var matchSearch = !currentSearch ||
                    p.name.toLowerCase().indexOf(currentSearch) !== -1 ||
                    (p.desc || '').toLowerCase().indexOf(currentSearch) !== -1;
                return matchFilter && matchSearch;
            });

            if (countEl) countEl.textContent = filtered.length;

            if (!filtered.length) {
                cards.innerHTML = '<div class="kanban-empty">Belum ada project</div>';
                return;
            }

            var html = '';
            filtered.forEach(function (p) {
                html += '<div class="kanban-card" data-id="' + p.id + '">';
                html += '<h4>' + escapeHtml(p.name) + '</h4>';
                html += '<p>' + escapeHtml(p.desc || '') + '</p>';
                html += '<div class="kanban-meta">';
                html += '<span>📅 ' + formatDate(p.date) + '</span>';
                html += '<button class="icon-btn edit-btn" data-id="' + p.id + '">✏️</button>';
                html += '</div>';
                html += '</div>';
            });
            cards.innerHTML = html;
            attachCardEvents(cards);
        });
    }

    // ---------- ATTACH EVENTS ----------
    function attachCardEvents(container) {
        container.querySelectorAll('[data-id]').forEach(function (card) {
            card.addEventListener('click', function (e) {
                if (e.target.closest('.edit-btn') || e.target.closest('.delete-btn')) return;
                var id = +card.dataset.id;
                openDetail(id);
            });
        });

        container.querySelectorAll('.edit-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                openEditModal(+btn.dataset.id);
            });
        });

        container.querySelectorAll('.delete-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                deleteProject(+btn.dataset.id);
            });
        });
    }

    // ---------- RENDER ALL ----------
    function render() {
        updateStats();

        var grid = document.getElementById('projectGrid');
        var list = document.getElementById('projectList');
        var kanban = document.getElementById('kanbanBoard');
        var empty = document.getElementById('projectEmpty');

        if (grid) grid.style.display = 'none';
        if (list) list.style.display = 'none';
        if (kanban) kanban.style.display = 'none';
        if (empty) empty.style.display = 'none';

        if (currentView === 'grid') renderGrid();
        else if (currentView === 'list') renderList();
        else if (currentView === 'kanban') renderKanban();
    }

    // ---------- VIEW SWITCH ----------
    document.querySelectorAll('.view-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.view-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            currentView = btn.dataset.view;
            render();
        });
    });

    // ---------- FILTER ----------
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    // ---------- SEARCH ----------
    var searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            currentSearch = searchInput.value.toLowerCase().trim();
            render();
        });
    }

    // ---------- SORT ----------
    var sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            currentSort = sortSelect.value;
            render();
        });
    }

    // ---------- MODAL NEW ----------
    var newModal = document.getElementById('newProjectModal');
    var newForm = document.getElementById('newProjectForm');

    function openNewModal() {
        if (!newModal) return;
        newModal.classList.add('active');
        document.getElementById('projectName').value = '';
        document.getElementById('projectDesc').value = '';
        document.getElementById('projectStatus').value = 'active';
        document.getElementById('projectDeadline').value = '';
        document.getElementById('projectNameError').classList.remove('show');
    }

    var newBtn = document.getElementById('newProjectBtn');
    if (newBtn) newBtn.addEventListener('click', openNewModal);

    var emptyNewBtn = document.getElementById('emptyNewBtn');
    if (emptyNewBtn) emptyNewBtn.addEventListener('click', openNewModal);

    var cancelProject = document.getElementById('cancelProject');
    if (cancelProject) cancelProject.addEventListener('click', function () {
        newModal.classList.remove('active');
    });

    if (newModal) {
        newModal.addEventListener('click', function (e) {
            if (e.target.id === 'newProjectModal') newModal.classList.remove('active');
        });
    }

    if (newForm) {
        newForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('projectName').value.trim();
            var desc = document.getElementById('projectDesc').value.trim();
            var status = document.getElementById('projectStatus').value;
            var deadline = document.getElementById('projectDeadline').value;
            var errEl = document.getElementById('projectNameError');

            errEl.classList.remove('show');

            if (!name) {
                errEl.textContent = 'Nama project wajib diisi';
                errEl.classList.add('show');
                return;
            }
            if (name.length < 3) {
                errEl.textContent = 'Nama minimal 3 karakter';
                errEl.classList.add('show');
                return;
            }

            var newProject = {
                id: Date.now(),
                name: name,
                desc: desc,
                status: status,
                date: new Date().toISOString().split('T')[0],
                deadline: deadline || '',
                tasks: 0
            };

            projects.unshift(newProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            render();
            newModal.classList.remove('active');
            showToast('Project "' + name + '" berhasil dibuat! 🚀');
        });
    }

    // ---------- DETAIL MODAL ----------
    var detailModal = document.getElementById('detailModal');
    var currentDetailId = null;

    function openDetail(id) {
        var project = projects.find(function (p) { return p.id === id; });
        if (!project || !detailModal) return;

        currentDetailId = id;
        var labels = { active: '⚡ Aktif', completed: '✅ Selesai', archived: '📦 Arsip' };
        var statusEl = document.getElementById('detailStatus');
        statusEl.textContent = labels[project.status];
        statusEl.className = 'status ' + project.status;

        setText('detailTitle', project.name);
        setText('detailDesc', project.desc || 'Tidak ada deskripsi');
        setText('detailCreated', formatDate(project.date));
        setText('detailDeadline', project.deadline ? formatDate(project.deadline) : '-');
        setText('detailTasks', (project.tasks || 0) + ' tugas');

        detailModal.classList.add('active');
    }

    var closeDetail = document.getElementById('closeDetail');
    if (closeDetail) closeDetail.addEventListener('click', function () {
        detailModal.classList.remove('active');
    });

    if (detailModal) {
        detailModal.addEventListener('click', function (e) {
            if (e.target.id === 'detailModal') detailModal.classList.remove('active');
        });
    }

    var detailEditBtn = document.getElementById('detailEditBtn');
    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', function () {
            detailModal.classList.remove('active');
            openEditModal(currentDetailId);
        });
    }

    var detailDeleteBtn = document.getElementById('detailDeleteBtn');
    if (detailDeleteBtn) {
        detailDeleteBtn.addEventListener('click', function () {
            detailModal.classList.remove('active');
            deleteProject(currentDetailId);
        });
    }

    var detailArchiveBtn = document.getElementById('detailArchiveBtn');
    if (detailArchiveBtn) {
        detailArchiveBtn.addEventListener('click', function () {
            var project = projects.find(function (p) { return p.id === currentDetailId; });
            if (!project) return;
            project.status = project.status === 'archived' ? 'active' : 'archived';
            localStorage.setItem('projects', JSON.stringify(projects));
            render();
            detailModal.classList.remove('active');
            showToast(project.status === 'archived' ? 'Project diarsipkan 📦' : 'Project diaktifkan ⚡');
        });
    }

    // ---------- MODAL EDIT ----------
    var editModal = document.getElementById('editProjectModal');
    var editForm = document.getElementById('editProjectForm');

    function openEditModal(id) {
        var project = projects.find(function (p) { return p.id === id; });
        if (!project || !editModal) return;

        document.getElementById('editProjectId').value = project.id;
        document.getElementById('editProjectName').value = project.name;
        document.getElementById('editProjectDesc').value = project.desc || '';
        document.getElementById('editProjectStatus').value = project.status;
        document.getElementById('editProjectDeadline').value = project.deadline || '';

        editModal.classList.add('active');
    }

    var cancelEdit = document.getElementById('cancelEdit');
    if (cancelEdit) cancelEdit.addEventListener('click', function () {
        editModal.classList.remove('active');
    });

    if (editModal) {
        editModal.addEventListener('click', function (e) {
            if (e.target.id === 'editProjectModal') editModal.classList.remove('active');
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var id = +document.getElementById('editProjectId').value;
            var name = document.getElementById('editProjectName').value.trim();
            var desc = document.getElementById('editProjectDesc').value.trim();
            var status = document.getElementById('editProjectStatus').value;
            var deadline = document.getElementById('editProjectDeadline').value;

            if (!name || name.length < 3) {
                showToast('Nama minimal 3 karakter', 'error');
                return;
            }

            var idx = projects.findIndex(function (p) { return p.id === id; });
            if (idx === -1) return;

            projects[idx].name = name;
            projects[idx].desc = desc;
            projects[idx].status = status;
            projects[idx].deadline = deadline;

            localStorage.setItem('projects', JSON.stringify(projects));
            render();
            editModal.classList.remove('active');
            showToast('Project berhasil diperbarui! ✅');
        });
    }

    // ---------- DELETE ----------
    function deleteProject(id) {
        var project = projects.find(function (p) { return p.id === id; });
        if (!project) return;

        if (!confirm('Yakin ingin menghapus "' + project.name + '"?\nTindakan ini tidak bisa dibatalkan.')) return;

        projects = projects.filter(function (p) { return p.id !== id; });
        localStorage.setItem('projects', JSON.stringify(projects));
        render();
        showToast('Project "' + project.name + '" dihapus', 'error');
    }

    // ---------- EXPORT ----------
    var exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            var dataStr = JSON.stringify(projects, null, 2);
            var blob = new Blob([dataStr], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'nexus-projects-' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Data berhasil di-export! ⬇');
        });
    }

    // ---------- IMPORT ----------
    var importBtn = document.getElementById('importBtn');
    var importFile = document.getElementById('importFile');

    if (importBtn && importFile) {
        importBtn.addEventListener('click', function () {
            importFile.click();
        });

        importFile.addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function (ev) {
                try {
                    var imported = JSON.parse(ev.target.result);
                    if (!Array.isArray(imported)) {
                        showToast('Format file tidak valid', 'error');
                        return;
                    }

                    if (!confirm('Import ' + imported.length + ' project?\nData lama akan digabung.')) return;

                    // Gabungkan, hindari duplikat id
                    var existingIds = projects.map(function (p) { return p.id; });
                    var added = 0;
                    imported.forEach(function (p) {
                        if (!p.name) return;
                        if (existingIds.indexOf(p.id) !== -1) {
                            p.id = Date.now() + Math.random();
                        }
                        projects.push(p);
                        added++;
                    });

                    localStorage.setItem('projects', JSON.stringify(projects));
                    render();
                    showToast(added + ' project berhasil di-import! ⬆');
                } catch (err) {
                    showToast('Gagal baca file: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    // ---------- INIT RENDER ----------
    render();

})();