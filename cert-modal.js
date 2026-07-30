
(function() {
  
    window.openCertModal = function(imgSrc, title) {
        const certModal = document.getElementById('certModal');
        const certModalImg = document.getElementById('certModalImage');
        const certModalCaption = document.getElementById('certModalCaption');
        if (certModal && certModalImg) {
            certModalImg.src = imgSrc;
            certModalCaption.textContent = title || 'Certificate';
            certModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            alert('Certificate viewer not available.');
        }
    };

   
    const certExitBtn = document.getElementById('certModalExitBtn');
    if (certExitBtn) {
        certExitBtn.addEventListener('click', function() {
            const certModal = document.getElementById('certModal');
            if (certModal) {
                certModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    const certModal = document.getElementById('certModal');
    if (certModal) {
        certModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
})();