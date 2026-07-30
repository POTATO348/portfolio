document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const targetElem = document.querySelector(targetId);
            if (targetElem) targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

function openMobileMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

if (burgerBtn) burgerBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        closeMobileMenu();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            setTimeout(() => {
                const targetElem = document.querySelector(targetId);
                if (targetElem) targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 280);
        }
    });
});