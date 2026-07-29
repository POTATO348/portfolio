
(function() {
    'use strict';


    window.hrisImages = [];
    for (let i = 1; i <= 12; i++) {
        window.hrisImages.push('hris' + i + '.png');
    }

    window.irisScreenshots = [];
    for (let i = 1; i <= 25; i++) {
        window.irisScreenshots.push(i + '.jpg');
    }

    console.log('✅ HRIS images:', window.hrisImages.length);
    console.log('✅ IRIS screenshots:', window.irisScreenshots.length);

  
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    const counter = document.getElementById('imageCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const exitBtn = document.getElementById('modalExitBtn');

    if (modal && modalImg) {
        let currentImages = [];
        let currentIndex = 0;

        window.openScreenshotModal = function(images, startIndex = 0) {
            if (!images || images.length === 0) {
                alert('No screenshots available.');
                return;
            }
            currentImages = images;
            currentIndex = Math.min(startIndex, images.length - 1);
            updateModalContent();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        function updateModalContent() {
            if (currentImages.length === 0) return;
            modalImg.src = currentImages[currentIndex];
            modalImg.alt = 'Screenshot ' + (currentIndex + 1);
            caption.textContent = 'Screenshot ' + (currentIndex + 1) + ' of ' + currentImages.length;
            counter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
        }

        function goPrev() {
            if (currentImages.length === 0) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateModalContent();
        }

        function goNext() {
            if (currentImages.length === 0) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateModalContent();
        }

        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        prevBtn.addEventListener('click', goPrev);
        nextBtn.addEventListener('click', goNext);
        exitBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'flex') {
                if (e.key === 'Escape') closeModal();
                else if (e.key === 'ArrowLeft') goPrev();
                else if (e.key === 'ArrowRight') goNext();
            }
        });
    } else {
        console.warn('⚠️ Image modal not found.');
    }

    // ===== 3. ATTACH TO VIEW BUTTONS =====
    const irisBtn = document.getElementById('viewIrisScreenshots');
    if (irisBtn) {
        irisBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.irisScreenshots && window.irisScreenshots.length > 0) {
                if (window.openScreenshotModal) {
                    window.openScreenshotModal(window.irisScreenshots, 0);
                } else {
                    alert('Screenshot viewer not available.');
                }
            } else {
                alert('No screenshots found for IRIS Scanner Mobile.');
            }
        });
    }

    const hrisBtn = document.getElementById('viewHrisImages');
    if (hrisBtn) {
        hrisBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.hrisImages && window.hrisImages.length > 0) {
                if (window.openScreenshotModal) {
                    window.openScreenshotModal(window.hrisImages, 0);
                } else {
                    alert('Screenshot viewer not available.');
                }
            } else {
                alert('No screenshots found for HRIS Timekeeping System.');
            }
        });
    }

    console.log('✅ Screenshot viewer ready!');
})();