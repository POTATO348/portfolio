const animatedElements = document.querySelectorAll('.scroll-animate');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('exit');
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
            entry.target.classList.add('exit');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
});

animatedElements.forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
});