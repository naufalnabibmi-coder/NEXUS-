/* ============================================
   NEXUS — MESSAGES.JS (COMPLETE CHAT)
   Kirim • Terima • Auto-reply • Persist
   ============================================ */

(function () {
    'use strict';

    // ---------- INIT ----------
    initThemeToggle();
    initParticles();

    // ---------- AUTH ----------
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

    // ---------- AUTO-REPLIES (BOT RESPONSES) ----------
    var botReplies = {
        greeting: [
            'Halo juga! Ada yang bisa saya bantu? 😊',
            'Hai! Senang bisa ngobrol denganmu 👋',
            'Halo! Apa kabar?'
        ],
        thanks: [
            'Sama-sama! 🙏',
            'Dengan senang hati! 😊',
            'No problem! Kalau butuh apa-apa, chat aja ya'
        ],
        question: [
            'Pertanyaan bagus! Saya akan cek dulu ya 🤔',
            'Menarik! Bisa jelaskan lebih detail?',
            'Oke, saya catat ya. Ada lagi?'
        ],
        project: [
            'Project-nya sudah saya update kok 👍',
            'Untuk project itu, cek di halaman Projects ya',
            'Desain-nya sudah oke, tinggal finalisasi 🎨'
        ],
        deadline: [
            'Deadline-nya masih aman kok ⏰',
            'Bisa dikerjakan minggu ini?',
            'Kalau deadline mepet, kabari saya ya'
        ],
        bye: [
            'Sampai jumpa! 👋',
            'Oke, hati-hati ya!',
            'Bye! Chat lagi kalau butuh sesuatu 😊'
        ],
        default: [
            'Oke, noted! 👍',
            'Saya mengerti maksudmu 😊',
            'Menarik! Ceritakan lebih lanjut?',
            'Hmm, oke. Ada yang lain?',
            'Baiklah, saya setuju! ✨',
            'Terima kasih sudah sharing 🙌',
            'Boleh! Kapan-kapan kita diskusi lagi',
            'Siap! Kalau ada update, saya kabari ya 🔔'
        ]
    };

    function getBotReply(text) {
        var lower = text.toLowerCase();

        if (/halo|hai|hi|hey|selamat (pagi|siang|sore|malam)/.test(lower)) {
            return pickRandom(botReplies.greeting);
        }
        if (/terima ?kasih|makasih|thanks|thank you|thx/.test(lower)) {
            return pickRandom(botReplies.thanks);
        }
        if (/project|proyek|kerjaan/.test(lower)) {
            return pickRandom(botReplies.project);
        }
        if (/deadline|tenggat|kapan|kapan selesai/.test(lower)) {
            return pickRandom(botReplies.deadline);
        }
        if (/bye|dadah|sampai jumpa|sampai ketemu|good ?bye/.test(lower)) {
            return pickRandom(botReplies.bye);
        }
        if (/\?|apa|bagaimana|gimana|kenapa|mengapa|siapa|dimana|kapan/.test(lower)) {
            return pickRandom(botReplies.question);
        }
        return pickRandom(botReplies.default);
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ---------- DEFAULT DATA ----------
    function getDefaultMessages() {
        var now = Date.now();
        var hour = 3600000;
        return [
            {
                id: 'chat-1',
                name: 'Sarah Wijaya',
                avatar: 'S',
                color: 'linear-gradient(135deg, #ff00e5, #7b2ff7)',
                online: true,
                unread: 2,
                messages: [
                    { id: 1, from: 'them', text: 'Hai! Apa kabar? 😊', time: now - 2 * hour },
                    { id: 2, from: 'me', text: 'Baik! Kamu gimana?', time: now - 1.8 * hour },
                    { id: 3, from: 'them', text: 'Baik juga. Btw desain homepage sudah aku revisi, cek ya', time: now - 1 * hour },
                    { id: 4, from: 'them', text: 'Kalau ada masukan, kabari aku 👍', time: now - 0.9 * hour }
                ]
            },
            {
                id: 'chat-2',
                name: 'Budi Santoso',
                avatar: 'B',
                color: 'linear-gradient(135deg, #00ff88, #00f0ff)',
                online: true,
                unread: 1,
                messages: [
                    { id: 1, from: 'them', text: 'Meeting Senin jam 10 ya', time: now - 5 * hour },
                    { id: 2, from: 'me', text: 'Oke, siap!', time: now - 4.5 * hour },
                    { id: 3, from: 'them', text: 'Jangan lupa bawa mockup-nya', time: now - 3 * hour }
                ]
            },
            {
                id: 'chat-3',
                name: 'NEXUS Team',
                avatar: 'N',
                color: 'linear-gradient(135deg, #ffb800, #ff00e5)',
                online: false,
                unread: 0,
                messages: [
                    { id: 1, from: 'them', text: '🎉 Selamat datang di NEXUS!', time: now - 48 * hour },
                    { id: 2, from: 'them', text: 'Jelajahi semua fitur dan mulai project pertama Anda. Kalau butuh bantuan, chat kami ya!', time: now - 47 * hour },
                    { id: 3, from: 'me', text: 'Terima kasih! 🙏', time: now - 46 * hour }
                ]
            },
            {
                id: 'chat-4',
                name: 'Andi Pratama',
                avatar: 'A',
                color: 'linear-gradient(135deg, #7b2ff7, #00f0ff)',
                online: false,
                unread: 0,
                messages: [
                    { id: 1, from: 'them', text: 'File final sudah saya kirim ke email ya', time: now - 72 * hour },
                    { id: 2, from: 'me', text: 'Oke, terima kasih Andi!', time: now - 71 * hour }
                ]
            }
        ];
    }

    // ---------- LOAD DATA ----------
    var chats = [];
    try {
        var saved = localStorage.getItem('chats_' + (user.email || 'user'));
        chats = saved ? JSON.parse(saved) : getDefaultMessages();
        if (!saved) saveChats();
    } catch (e) {
        chats = getDefaultMessages();
        saveChats();
    }

    function saveChats() {
        try {
            localStorage.setItem('chats_' + (user.email || 'user'), JSON.stringify(chats));
        } catch (e) {
            console.error('Gagal save chats:', e);
        }
    }

    // ---------- STATE ----------
    var activeChatId = null;
    var inboxFilter = 'all';
    var inboxSearch = '';

    // ---------- RENDER INBOX ----------
    function renderInbox() {
        var list = document.getElementById('inboxList');
        if (!list) return;

        // Filter
        var filtered = chats.filter(function (c) {
            if (inboxFilter === 'unread' && (!c.unread || c.unread === 0)) return false;
            if (inboxSearch) {
                var lastMsg = c.messages.length ? c.messages[c.messages.length - 1].text : '';
                if (c.name.toLowerCase().indexOf(inboxSearch) === -1 &&
                    lastMsg.toLowerCase().indexOf(inboxSearch) === -1) return false;
            }
            return true;
        });

        // Sort by last message time
        filtered.sort(function (a, b) {
            var aLast = a.messages.length ? a.messages[a.messages.length - 1].time : 0;
            var bLast = b.messages.length ? b.messages[b.messages.length - 1].time : 0;
            return bLast - aLast;
        });

        // Update unread count
        var totalUnread = chats.reduce(function (sum, c) { return sum + (c.unread || 0); }, 0);
        var unreadEl = document.getElementById('unreadCount');
        if (unreadEl) unreadEl.textContent = totalUnread + ' pesan belum dibaca';

        if (!filtered.length) {
            list.innerHTML = '<div class="inbox-empty">Tidak ada pesan</div>';
            return;
        }

        var html = '';
        filtered.forEach(function (c) {
            var lastMsg = c.messages.length ? c.messages[c.messages.length - 1] : null;
            var preview = lastMsg ? lastMsg.text : 'Belum ada pesan';
            var previewTime = lastMsg ? formatTime(lastMsg.time) : '';
            var unreadBadge = c.unread > 0 ? '<span class="inbox-badge">' + c.unread + '</span>' : '';
            var activeClass = c.id === activeChatId ? ' active' : '';
            var unreadClass = c.unread > 0 ? ' unread' : '';

            html += '<div class="inbox-item' + unreadClass + activeClass + '" data-id="' + c.id + '">';
            html += '<div class="inbox-avatar" style="background:' + c.color + '">' + c.avatar + '</div>';
            html += '<div class="inbox-content">';
            html += '<div class="inbox-row">';
            html += '<strong>' + escapeHtml(c.name) + '</strong>';
            html += '<span class="inbox-time">' + previewTime + '</span>';
            html += '</div>';
            html += '<div class="inbox-row">';
            html += '<p class="inbox-preview">' + escapeHtml(preview) + '</p>';
            html += unreadBadge;
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });

        list.innerHTML = html;

        list.querySelectorAll('.inbox-item').forEach(function (item) {
            item.addEventListener('click', function () {
                openChat(item.dataset.id);
            });
        });
    }

    // ---------- FORMAT TIME ----------
    function formatTime(timestamp) {
        var d = new Date(timestamp);
        var now = new Date();
        var diff = now - d;
        var min = 60000;
        var hour = 3600000;
        var day = 86400000;

        if (diff < min) return 'Baru saja';
        if (diff < hour) return Math.floor(diff / min) + 'm';
        if (diff < day) return Math.floor(diff / hour) + 'j';
        if (diff < day * 7) return Math.floor(diff / day) + 'h';
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }

    function formatMessageTime(timestamp) {
        var d = new Date(timestamp);
        var h = d.getHours().toString().padStart(2, '0');
        var m = d.getMinutes().toString().padStart(2, '0');
        return h + ':' + m;
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ---------- OPEN CHAT ----------
    function openChat(chatId) {
        var chat = chats.find(function (c) { return c.id === chatId; });
        if (!chat) return;

        activeChatId = chatId;

        // Mark as read
        chat.unread = 0;
        saveChats();

        // Update UI
        document.getElementById('chatEmpty').style.display = 'none';
        document.getElementById('chatActive').style.display = 'flex';

        document.getElementById('chatAvatar').textContent = chat.avatar;
        document.getElementById('chatAvatar').style.background = chat.color;
        document.getElementById('chatName').textContent = chat.name;

        var statusEl = document.getElementById('chatStatus');
        if (chat.online) {
            statusEl.innerHTML = '<span class="status-dot"></span> Online';
        } else {
            statusEl.innerHTML = '<span class="status-dot offline"></span> Offline';
        }

        renderMessages();
        renderInbox();

        // Focus input
        setTimeout(function () {
            document.getElementById('chatInput').focus();
        }, 100);
    }

    // ---------- RENDER MESSAGES ----------
    function renderMessages() {
        var chat = chats.find(function (c) { return c.id === activeChatId; });
        if (!chat) return;

        var container = document.getElementById('chatMessages');
        if (!container) return;

        var html = '';
        var lastDate = null;
        var lastFrom = null;

        chat.messages.forEach(function (m) {
            var msgDate = new Date(m.time).toDateString();
            if (msgDate !== lastDate) {
                html += '<div class="chat-date-separator"><span>' + formatDateLabel(m.time) + '</span></div>';
                lastDate = msgDate;
                lastFrom = null;
            }

            var isMe = m.from === 'me';
            var isSameSender = lastFrom === m.from;

            html += '<div class="message-row ' + (isMe ? 'me' : 'them') + (isSameSender ? ' compact' : '') + '">';
            html += '<div class="message-bubble ' + (isMe ? 'out' : 'in') + '">';
            html += '<div class="message-text">' + escapeHtml(m.text) + '</div>';
            html += '<div class="message-time">' + formatMessageTime(m.time) + '</div>';
            html += '</div>';
            html += '</div>';

            lastFrom = m.from;
        });

        container.innerHTML = html;

        // Scroll to bottom
        setTimeout(function () {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }

    function formatDateLabel(timestamp) {
        var d = new Date(timestamp);
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        var diffDays = Math.floor((today - msgDay) / 86400000);

        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return diffDays + ' hari lalu';
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }

    // ---------- SEND MESSAGE ----------
    function sendMessage(text) {
        if (!activeChatId || !text.trim()) return;

        var chat = chats.find(function (c) { return c.id === activeChatId; });
        if (!chat) return;

        var newMsg = {
            id: Date.now(),
            from: 'me',
            text: text.trim(),
            time: Date.now()
        };

        chat.messages.push(newMsg);
        saveChats();

        document.getElementById('chatInput').value = '';
        renderMessages();
        renderInbox();

        // Auto reply after delay
        simulateReply(chat);
    }

    // ---------- AUTO REPLY BOT ----------
    function simulateReply(chat) {
        // Show typing indicator
        var typing = document.getElementById('typingIndicator');
        if (typing) typing.style.display = 'flex';

        var delay = 1000 + Math.random() * 1500; // 1-2.5 detik

        setTimeout(function () {
            if (typing) typing.style.display = 'none';

            var lastUserMsg = '';
            for (var i = chat.messages.length - 1; i >= 0; i--) {
                if (chat.messages[i].from === 'me') {
                    lastUserMsg = chat.messages[i].text;
                    break;
                }
            }

            var replyText = getBotReply(lastUserMsg);

            var replyMsg = {
                id: Date.now() + 1,
                from: 'them',
                text: replyText,
                time: Date.now()
            };

            chat.messages.push(replyMsg);

            // Kalau chat bukan yang aktif, tandai unread
            if (chat.id !== activeChatId) {
                chat.unread = (chat.unread || 0) + 1;
            }

            saveChats();
            renderMessages();
            renderInbox();

            // Toast kecil
            if (chat.id !== activeChatId) {
                showToast('💬 Pesan baru dari ' + chat.name);
            }
        }, delay);
    }

    // ---------- CHAT FORM SUBMIT ----------
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');

    if (chatForm) {
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var text = chatInput.value;
            if (!text.trim()) return;
            sendMessage(text);
        });
    }

    // Enter to send (shift+enter for newline nanti)
    if (chatInput) {
        chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    // ---------- INBOX SEARCH ----------
    var searchInput = document.getElementById('inboxSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            inboxSearch = searchInput.value.toLowerCase().trim();
            renderInbox();
        });
    }

    // ---------- INBOX FILTER ----------
    document.querySelectorAll('.inbox-filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.inbox-filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            inboxFilter = btn.dataset.filter;
            renderInbox();
        });
    });

    // ---------- CLEAR CHAT ----------
    var clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', function () {
            if (!activeChatId) return;
            var chat = chats.find(function (c) { return c.id === activeChatId; });
            if (!chat) return;

            if (!confirm('Hapus semua pesan di chat ini?\nTindakan tidak bisa dibatalkan.')) return;

            chat.messages = [];
            saveChats();
            renderMessages();
            renderInbox();
            showToast('Semua pesan dihapus', 'error');
        });
    }

    // ---------- EMOJI PICKER ----------
    var emojis = ['😊', '😂', '🤣', '❤️', '👍', '👎', '🎉', '🔥', '✨', '💯',
                  '😍', '🤔', '😎', '🙏', '👋', '💪', '🙌', '😭', '😅', '🤗',
                  '👏', '⭐', '💬', '💡', '✅', '❌', '⚠️', '📌', '🎯', '🚀',
                  '🌈', '☀️', '🌙', '⚡', '💎', '🍕', '☕', '🎁', '🏆', '👑'];

    var emojiBtn = document.getElementById('emojiBtn');
    var emojiPicker = document.getElementById('emojiPicker');

    if (emojiBtn && emojiPicker) {
        // Build picker
        var pickerHtml = '';
        emojis.forEach(function (emo) {
            pickerHtml += '<button type="button" class="emoji-item">' + emo + '</button>';
        });
        emojiPicker.innerHTML = pickerHtml;

        emojiBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'grid' : 'none';
        });

        emojiPicker.querySelectorAll('.emoji-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                chatInput.value += btn.textContent;
                chatInput.focus();
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.chat-input-form') && !e.target.closest('.emoji-picker')) {
                emojiPicker.style.display = 'none';
            }
        });
    }

    // ---------- INIT RENDER ----------
    renderInbox();

    // Buka chat pertama kalau ada unread
    var firstUnread = chats.find(function (c) { return c.unread > 0; });
    if (firstUnread) {
        openChat(firstUnread.id);
    }

})();