window.addEventListener('load', function() {
    const loadingEl = document.getElementById('loadingOverlay');
    const loadingTextSpan = document.getElementById('loadingText');

    setTimeout(() => {
        loadingTextSpan.textContent = "HERE WE GEW!!";
        setTimeout(() => {
            loadingEl.classList.add('hide');
            setTimeout(() => {
                loadingEl.style.display = 'none';
            }, 800);
        }, 600);
    }, 1500);
});