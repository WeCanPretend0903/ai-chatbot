document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const themeText = document.getElementById('themeText');
    const body = document.body;

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
        if (themeText) themeText.textContent = 'Dark Mode';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            // Prevent the dropdown from closing immediately if we want to see the change, 
            // or let it stay open since it's inside the dropdown container.
            e.stopPropagation(); 
            
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            
            if (isLight) {
                if (sunIcon) sunIcon.style.display = 'none';
                if (moonIcon) moonIcon.style.display = 'block';
                if (themeText) themeText.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'light');
            } else {
                if (sunIcon) sunIcon.style.display = 'block';
                if (moonIcon) moonIcon.style.display = 'none';
                if (themeText) themeText.textContent = 'Light Mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Account Dropdown Toggle
    const accountBtn = document.getElementById('accountBtn');
    const accountDropdown = document.getElementById('accountDropdown');

    if (accountBtn && accountDropdown) {
        accountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!accountBtn.contains(e.target) && !accountDropdown.contains(e.target)) {
                accountDropdown.classList.remove('show');
            }
        });
    }

    // Enter key support
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Send button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
});

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    const chatBox = document.getElementById("chat-box");
    
    if (!text) return;

    // Show user message
    appendMessage(text, 'user');
    input.value = "";

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: text})
        });
        
        const data = await response.json();
        
        // Show bot message
        appendMessage(data.reply, 'bot');
    } catch (error) {
        console.error('Error:', error);
        appendMessage("Sorry, something went wrong. Please try again.", 'bot');
    }
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
