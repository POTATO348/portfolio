
(function() {
    function updateLogo() {
        const navLogo = document.getElementById('navLogo');
        if (!navLogo) return;
        const isDark = document.body.classList.contains('dark-mode') ||
                       document.documentElement.classList.contains('dark-mode') ||
                       (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        navLogo.src = isDark ? 'logo-dark.jpg' : 'logo-light.jpg';
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLogo);
    } else {
        updateLogo();
    }


    const observer = new MutationObserver(updateLogo);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogo);
    }

    
    document.addEventListener('click', function(e) {
        const target = e.target.closest('#neonThemeBtn') || e.target.closest('#themeSwitchMobile');
        if (target) setTimeout(updateLogo, 50);
    });
})();