
(function() {
    const galleryImages = document.querySelectorAll('.gallery-track img');
    if (galleryImages.length === 0) {
        console.warn('⚠️ No gallery images found.');
        return;
    }


    const uniqueUrls = [];
    const seen = new Set();
    galleryImages.forEach(img => {
        if (!seen.has(img.src)) {
            seen.add(img.src);
            uniqueUrls.push(img.src);
        }
    });

    console.log('✅ Gallery unique images:', uniqueUrls.length);

 
    function handleGalleryClick(e) {
        const img = e.currentTarget;
        const src = img.src;
      
        let index = uniqueUrls.indexOf(src);
        if (index === -1) {
     
            const fallbackIndex = Array.from(galleryImages).findIndex(i => i.src === src);
            if (fallbackIndex !== -1) {
                const fallbackSrc = galleryImages[fallbackIndex].src;
                index = uniqueUrls.indexOf(fallbackSrc);
            }
            if (index === -1) {
                console.warn('Image src not found in unique list, opening as single image.');
           
                const modal = document.getElementById('imageModal');
                const modalImg = document.getElementById('modalImage');
                const caption = document.getElementById('modalCaption');
                const counter = document.getElementById('imageCounter');
                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                if (modal && modalImg) {
                    if (prevBtn) prevBtn.style.display = 'none';
                    if (nextBtn) nextBtn.style.display = 'none';
                    modalImg.src = src;
                    modalImg.alt = 'Gallery image';
                    if (caption) caption.textContent = 'Gallery image';
                    if (counter) counter.textContent = '';
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
                return;
            }
        }

      
        if (window.openScreenshotModal) {
            window.openScreenshotModal(uniqueUrls, index);
           
            setTimeout(() => {
                const caption = document.getElementById('modalCaption');
                const counter = document.getElementById('imageCounter');
                if (caption) {
                    caption.textContent = 'Gallery image ' + (index + 1) + ' of ' + uniqueUrls.length;
                }
                if (counter) {
                    counter.textContent = (index + 1) + ' / ' + uniqueUrls.length;
                }
            }, 10);
        } else {
      
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const caption = document.getElementById('modalCaption');
            const counter = document.getElementById('imageCounter');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (modal && modalImg) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                modalImg.src = src;
                modalImg.alt = 'Gallery image';
                if (caption) caption.textContent = 'Gallery image';
                if (counter) counter.textContent = '';
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    }


    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', handleGalleryClick);
    });

    console.log('✅ Gallery viewer ready! Click any gallery image to view full size.');
})();