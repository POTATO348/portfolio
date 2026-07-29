const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');


window.lightModeImage = 'delums1.jpg';
window.darkModeImage = 'delums.jpg';

window.lightActive = document.documentElement.classList.contains('light-mode');

function getCurrentBotImage() {
    return window.lightActive
        ? window.lightModeImage
        : window.darkModeImage;
}

function updateChatbotIcon() {
    const toggleImg = chatbotToggle.querySelector('img');
    if (toggleImg) {
        toggleImg.src = getCurrentBotImage();
    }
}

chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('hidden');
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.add('hidden');
});

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    if (
        msg.includes('number') ||
        msg.includes('contact number') ||
        msg.includes('phone number')
    ) {
        return "You can reach Anjenel at 📱 09298988721 (Smart) or 📱 0992 692 4594 (DITO).";
    }

    if (
        msg.includes('ilang taon') ||
        msg.includes('age') ||
        msg.includes('how old')
    ) {
        return "Anjenel is 23 years old.";
    }

    if (msg.includes('birthday')) {
        return "Anjenel's birthday is July 17, 2003.";
    }

    if (msg.includes('job') || msg.includes('looking for') || msg.includes('role')) {
        return "Anjenel is looking for roles as a Mobile Application Developer, Front-End Developer, UI/UX Designer, or IT Technical or something related.";
    }

    if (msg.includes('skill')) {
        return "Anjenel is skilled in Mobile Development (Kotlin, Java, Android), Front-End (HTML, CSS, React.js), UI/UX Design (Figma), and IT support.";
    }

    if (msg.includes('project')) {
        return "Anjenel has built: IRIS Scanner Mobile, Royale Fitness Center, Mental Health Awareness, Cyber Security Education, Website BookList, HRIS Timekeeping System and I-RIS Website.";
    }

    if (msg.includes('experience')) {
        return "Anjenel completed OJT at Urban Travellers Hotel (Feb-May 2026) as IT Intern, Front-End Developer, and UI/UX Designer.";
    }

    if (msg.includes('education')) {
        return "Anjenel graduated with BS Computer Science from Philippine Christian University - Dasmariñas (2026).";
    }

    if (msg.includes('hello')) {
        return "Hi there! Ask me about Anjenel's skills, projects, or contact number!";
    }

    return "Anjenel G. Delumen is a CS graduate. Ask me about her skills, projects, or contact number!";
}

function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    if (isUser) {
        msgDiv.innerHTML = `
            <div class="message-content">
                ${escapeHtml(text)}
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${getCurrentBotImage()}" alt="Anjenel"
                     style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div class="message-content">
                ${escapeHtml(text)}
            </div>
        `;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="${getCurrentBotImage()}" alt="Anjenel"
                 style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div class="message-content">...</div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const ind = document.getElementById('typingIndicator');
    if (ind) ind.remove();
}

window.sendMessage = function () {
    const userMessage = chatInput.value.trim();

    if (!userMessage) return;

    addMessage(userMessage, true);
    chatInput.value = '';

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        addMessage(getBotResponse(userMessage), false);
    }, 600);
};


window.updateThemeState = function (isLightMode) {
    window.lightActive = isLightMode;
    updateChatbotIcon();
    const chatAvatarImgs = document.querySelectorAll('.message-avatar img');
    const src = getCurrentBotImage();
    chatAvatarImgs.forEach(img => {
        img.src = src;
    });
};

updateChatbotIcon();