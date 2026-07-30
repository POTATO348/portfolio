const progressFills = document.querySelectorAll('.progress-fill');

function animateProgressBars() {
    progressFills.forEach(fill => {
        fill.style.animation = 'none';
        fill.offsetHeight;
        fill.style.animation = 'progressUp 0.7s cubic-bezier(0.22, 0.97, 0.36, 1) forwards';
    });
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            animateProgressBars();
            ticking = false;
        });
        ticking = true;
    }
});
window.addEventListener('load', () => animateProgressBars());

document.querySelectorAll('.project-img-placeholder').forEach(div => {
    const bg = div.style.backgroundImage;
    if (!bg || bg === 'none' || bg === 'url("undefined")') {
        div.style.background = 'linear-gradient(135deg, #0f172f, #030617)';
        div.innerHTML = '<span style="background:rgba(0,0,0,0.5); padding:4px 12px; border-radius:30px;">preview</span>';
    }
});