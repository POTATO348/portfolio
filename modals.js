function updateModalImage() {
    const images = window.currentProject === 'iris' ? window.irisScreenshots : window.hrisImages;
    const projectName = window.currentProject === 'iris' ? 'IRIS Scanner Mobile' : 'HRIS Timekeeping System';
    if (images.length && window.currentImageIndex >= 0 && window.currentImageIndex < images.length) {
        window.modalImg.src = images[window.currentImageIndex];
        window.modalImg.alt = projectName + " Screenshot " + (window.currentImageIndex + 1);
        window.modalCaption.textContent = projectName + " - Screen " + (window.currentImageIndex + 1);
        window.imageCounter.textContent = (window.currentImageIndex + 1) + " / " + images.length;
        window.modalImg.onerror = function() {
            this.src = "https://placehold.co/1000x700/1a1f35/00f0ff?text=" + projectName + "+" + (window.currentImageIndex + 1);
        };
    }
}

function openModal(project = 'hris') {
    window.currentProject = project;
    const images = project === 'iris' ? window.irisScreenshots : window.hrisImages;
    if (images.length) {
        window.currentImageIndex = 0;
        updateModalImage();
        window.modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    } else alert("No screenshots available.");
}

function closeModal() { 
    window.modal.style.display = "none";
    document.body.style.overflow = "auto";
}

function closeCertModalFunc() {
    window.certModal.style.display = "none";
    document.body.style.overflow = "auto";
}

function nextImage() {
    const images = window.currentProject === 'iris' ? window.irisScreenshots : window.hrisImages;
    if (images.length) {
        window.currentImageIndex = (window.currentImageIndex + 1) % images.length;
        updateModalImage();
    }
}

function prevImage() {
    const images = window.currentProject === 'iris' ? window.irisScreenshots : window.hrisImages;
    if (images.length) {
        window.currentImageIndex = (window.currentImageIndex - 1 + images.length) % images.length;
        updateModalImage();
    }
}

if (window.modalExitBtn) window.modalExitBtn.onclick = closeModal;
if (window.certModalExitBtn) window.certModalExitBtn.onclick = closeCertModalFunc;
if (window.prevBtn) window.prevBtn.onclick = prevImage;
if (window.nextBtn) window.nextBtn.onclick = nextImage;

const viewHrisBtn = document.getElementById('viewHrisImages');
if (viewHrisBtn) viewHrisBtn.onclick = () => openModal('hris');
const viewIrisBtn = document.getElementById('viewIrisScreenshots');
if (viewIrisBtn) viewIrisBtn.onclick = () => openModal('iris');

window.onclick = (event) => {
    if (event.target == window.modal) closeModal();
    if (event.target == window.certModal) closeCertModalFunc();
};

document.addEventListener('keydown', (e) => {
    if (window.modal.style.display === "flex") {
        if (e.key === 'ArrowRight') nextImage();
        else if (e.key === 'ArrowLeft') prevImage();
        else if (e.key === 'Escape') closeModal();
    }
    if (window.certModal && window.certModal.style.display === 'flex' && e.key === 'Escape') closeCertModalFunc();
});

window.openCertModal = (imageSrc, certName) => {
    window.certModalImg.src = imageSrc;
    window.certModalCaption.textContent = certName + ' Certificate';
    window.certModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    window.certModalImg.onerror = function() {
        this.src = "https://placehold.co/1000x700/1a1f35/00f0ff?text=" + encodeURIComponent(certName);
    };
};
window.closeCertModal = closeCertModalFunc;