/* ============================================
   NEXUS - PARALLAX.JS (SIMPLE VERSION)
   Parallax + PWA install
   ============================================ */

function initParallax() {
    var layers = document.querySelectorAll('.parallax-layer');
    var heroContent = document.querySelector('.parallax-content');
    var cards = document.querySelectorAll('.p-card[data-speed]');

    var isMobile = window.innerWidth <= 768;
    var ticking = false;

    function update() {
        var scrollY = window.scrollY;

        // Update layers
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
            layer.style.transform = 'translate3d(0, ' + (scrollY * speed) + 'px, 0)';
        }

        // Hero fade
        if (heroContent) {
            var heroH = window.innerHeight;
            var opacity = Math.max(0, 1 - scrollY / (heroH * 0.8));
            heroContent.style.opacity = opacity;
            if (!isMobile) {
                heroContent.style.transform = 'translate3d(0, ' + (scrollY * 0.3) + 'px, 0)';
            }
        }

        // Cards
        if (!isMobile) {
            for (var j = 0; j < cards.length; j++) {
                var card = cards[j];
                var rect = card.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    var sp = parseFloat(card.getAttribute('data-speed')) || 0.15;
                    var offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * sp;
                    card.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
                }
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

/* ---------- PWA INSTALL ---------- */
var deferredPrompt = null;

function initPWA() {
    var banner = document.getElementById('pwaBanner');
    var installBtn = document.getElementById('pwaInstall');
    var closeBtn = document.getElementById('pwaClose');

    if (localStorage.getItem('pwaDismissed') === 'true') {
        return;
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;

        setTimeout(function () {
            if (banner) banner.classList.add('active');
        }, 3000);
    });

    if (installBtn) {
        installBtn.addEventListener('click', function () {
            if (!deferredPrompt) {
                if (banner) banner.classList.remove('active');
                return;
            }

            deferredPrompt.prompt();

            deferredPrompt.userChoice.then(function (result) {
                console.log('PWA outcome:', result.outcome);
                deferredPrompt = null;
                if (banner) banner.classList.remove('active');
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            if (banner) banner.classList.remove('active');
            localStorage.setItem('pwaDismissed', 'true');
        });
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
        if (banner) banner.classList.remove('active');
    }
}