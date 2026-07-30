const themeBtn = document.getElementById('neonThemeBtn');
const themeSwitchMobile = document.getElementById('themeSwitchMobile');
const switchThumb = document.getElementById('switchThumb');
const profileAvatar = document.getElementById('profileAvatar');
const botAvatarImg = document.getElementById('botAvatarImg');

function updateChatbotAvatars() {
    const chatAvatarImgs = document.querySelectorAll('.message-avatar img');
    const src = window.lightActive ? window.lightModeImage : window.darkModeImage;
    chatAvatarImgs.forEach(img => {
        img.src = src;
    });
    if (botAvatarImg) botAvatarImg.src = src;
}

function updateProfileImage() {
    if (window.lightActive) {
        profileAvatar.style.backgroundImage = `url('delums1.jpg')`;
    } else {
        profileAvatar.style.backgroundImage = `url('delums.jpg')`;
    }
    updateChatbotAvatars();
}

function updateNeonTheme() {
    if (window.lightActive) {
        document.body.classList.add('light-mode');
        themeBtn.innerHTML = '🌝';
        if (switchThumb) switchThumb.textContent = '🌝';
    } else {
        document.body.classList.remove('light-mode');
        themeBtn.innerHTML = '🌕';
        if (switchThumb) switchThumb.textContent = '🌕';
    }
    updateProfileImage();
}

function toggleTheme() {
    window.lightActive = !window.lightActive;
    updateNeonTheme();
    localStorage.setItem('neonTheme', window.lightActive ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('neonTheme');
if (savedTheme === 'light') {
    window.lightActive = true;
    updateNeonTheme();
} else {
    profileAvatar.style.backgroundImage = `url('delums.jpg')`;
    if (botAvatarImg) botAvatarImg.src = window.darkModeImage;
}

themeBtn.addEventListener('click', toggleTheme);
if (themeSwitchMobile) {
    themeSwitchMobile.addEventListener('click', toggleTheme);
    themeSwitchMobile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });
}