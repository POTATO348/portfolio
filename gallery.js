document.querySelectorAll('.gallery-track img').forEach((img) => {
    img.addEventListener('click', function(e) {
        e.stopPropagation();
        const allImgs = document.querySelectorAll('.gallery-track img');
        const uniqueSrcs = [];
        const seen = new Set();
        allImgs.forEach(el => {
            const src = el.getAttribute('src');
            if (!seen.has(src) && src && !src.includes('placehold')) {
                seen.add(src);
                uniqueSrcs.push(src);
            }
        });
        const galleryImages = uniqueSrcs.length > 0 ? uniqueSrcs : Array.from(allImgs).map(el => el.src);

        const clickedSrc = this.getAttribute('src');
        let foundIndex = galleryImages.indexOf(clickedSrc);
        if (foundIndex === -1) foundIndex = 0;

        window.currentProject = 'gallery';
        window.currentImageIndex = foundIndex;

        const galleryUpdate = function() {
            if (galleryImages.length && window.currentImageIndex >= 0 && window.currentImageIndex < galleryImages.length) {
                window.modalImg.src = galleryImages[window.currentImageIndex];
                window.modalImg.alt = "Gallery image " + (window.currentImageIndex + 1);
                window.modalCaption.textContent = "Gallery — " + (window.currentImageIndex + 1) + " / " + galleryImages.length;
                window.imageCounter.textContent = (window.currentImageIndex + 1) + " / " + galleryImages.length;
                window.modalImg.onerror = function() {
                    this.src = "https://placehold.co/1000x700/1a1f35/00f0ff?text=Gallery+Image+" + (window.currentImageIndex + 1);
                };
            }
        };

        const tempNext = function() {
            if (galleryImages.length) {
                window.currentImageIndex = (window.currentImageIndex + 1) % galleryImages.length;
                galleryUpdate();
            }
        };
        const tempPrev = function() {
            if (galleryImages.length) {
                window.currentImageIndex = (window.currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                galleryUpdate();
            }
        };

        const oldNext = window.nextBtn.onclick;
        const oldPrev = window.prevBtn.onclick;
        window.nextBtn.onclick = tempNext;
        window.prevBtn.onclick = tempPrev;

        galleryUpdate();
        window.modal.style.display = "flex";
        document.body.style.overflow = "hidden";

        const restoreOnClose = function() {
            window.nextBtn.onclick = oldNext || nextImage;
            window.prevBtn.onclick = oldPrev || prevImage;
            window.modalExitBtn.removeEventListener('click', restoreOnClose);
        };
        window.modalExitBtn.addEventListener('click', restoreOnClose);

        const observer = new MutationObserver(() => {
            if (window.modal.style.display === 'none') {
                window.nextBtn.onclick = oldNext || nextImage;
                window.prevBtn.onclick = oldPrev || prevImage;
                observer.disconnect();
            }
        });
        observer.observe(window.modal, { attributes: true, attributeFilter: ['style'] });
    });
});