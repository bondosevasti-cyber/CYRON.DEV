document.addEventListener('DOMContentLoaded', () => {

    // ელემენტების წამოღება
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatIcon = document.getElementById('chat-icon');
    const greeting = document.getElementById('chatbot-greeting');

    // --- ფუნქციები ---

    let closeTimeout;

    // ჩატის გახსნა/დახურვა
    function toggleChat() {
        // Check if fully hidden or currently in closing animation
        const isHidden = chatWindow.classList.contains('hidden');
        const isClosing = chatWindow.classList.contains('chat-laser-close');

        // Clear any pending close callback to prevent hiding if we interrupt
        clearTimeout(closeTimeout);

        if (isHidden || isClosing) {
            // --- OPENING (Bottom -> Top) ---
            chatWindow.classList.remove('hidden');
            chatWindow.classList.remove('chat-laser-close');
            chatWindow.classList.add('chat-laser-open');

            if (greeting) greeting.style.display = 'none';
            chatIcon.innerText = 'chat_bubble';
            chatInput.focus();

            // Cleanup open class after animation finishes
            setTimeout(() => {
                chatWindow.classList.remove('chat-laser-open');
            }, 800);

        } else {
            // --- CLOSING (Top -> Bottom) ---
            chatWindow.classList.remove('chat-laser-open');
            chatWindow.classList.add('chat-laser-close');

            if (greeting) greeting.style.display = 'block';
            chatIcon.innerText = 'smart_toy';

            // Wait for animation to finish before truly hiding
            closeTimeout = setTimeout(() => {
                chatWindow.classList.add('hidden');
                chatWindow.classList.remove('chat-laser-close');
            }, 800);
        }
    }

    // შეტყობინების დამატება
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `flex gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''}`;

        const iconHtml = sender === 'bot'
            ? `<div class="w-8 h-8 rounded-none skew-x-[-10deg] bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.1)]"><span class="material-icons-round text-yellow-400 text-sm">smart_toy</span></div>`
            : `<div class="w-8 h-8 rounded-none bg-gray-800 flex items-center justify-center shrink-0 border border-gray-600"><span class="material-icons-round text-gray-400 text-sm">person</span></div>`;

        const bubbleClass = sender === 'bot'
            ? "bg-gray-900/80 text-yellow-100 p-3 rounded-none border border-yellow-400/20 text-xs md:text-sm font-mono leading-relaxed shadow-lg relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-yellow-400/50"
            : "bg-yellow-400 text-black p-3 rounded-none border border-yellow-400/50 text-xs md:text-sm font-mono leading-relaxed shadow-[0_0_10px_rgba(250,204,21,0.2)] font-bold";

        div.innerHTML = `
        ${iconHtml}
        <div class="${bubbleClass} animate-[fadeIn_0.3s_ease-out]">
            ${text}
        </div>
    `;

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    // ლოადერი
    function addLoader() {
        const id = 'loader-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = "flex gap-3";
        div.innerHTML = `
            <div class="w-8 h-8 rounded-none skew-x-[-10deg] bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.1)]"><span class="material-icons-round text-yellow-400 text-sm">smart_toy</span></div>
            <div class="bg-gray-900/80 p-3 rounded-none border border-yellow-400/20 flex items-center gap-1 shadow-lg relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-yellow-400/50">
                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-75"></span>
                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
            </div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeLoader(id) {
        const loader = document.getElementById(id);
        if (loader) loader.remove();
    }

    // გაგზავნა
    async function processUserMessage(message) {
        if (!message) return;

        addMessage(message, 'user');
        const loadingId = addLoader();

        try {
            // 3. Make.com Webhook Request via Proxy
            // const WEBHOOK_URL = "https://hook.eu1.make.com/4o637jud8u455wt1sr6bmoha3fci8psj"; // Removed direct link
            const API_URL = "/api/contact";
            const currentLang = localStorage.getItem('lang') || 'ka';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: "CHAT", // Routing flag
                    message: message,
                    language: currentLang,
                    timestamp: new Date().toISOString()
                })
            });

            // Make.com usually returns text directly or JSON depending on the scenario response module
            // We will attempt to read text first, then check if it's JSON
            const responseText = await response.text();

            removeLoader(loadingId); // ჯერ ვაშორებთ ლოადერს

            // ვამატებთ მხოლოდ ერთ შეტყობინებას
            addMessage(responseText, 'bot');

        } catch (error) {
            removeLoader(loadingId);
            console.error("Webhook Error:", error);
            // გამოვაჩინოთ კონკრეტული შეცდომა
            addMessage(`⚠️ კავშირის ხარვეზი. გთხოვთ სცადოთ მოგვიანებით.`, 'bot');
        }
    }

    // გაგზავნა
    async function handleSendMessage(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        processUserMessage(message);
        chatInput.value = '';
    }

    // ივენთები
    if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);
    if (chatForm) chatForm.addEventListener('submit', handleSendMessage);

    // Quick Questions Event Listeners
    const quickBtns = document.querySelectorAll('.quick-question-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find the span inside the button that holds the text
            const span = btn.querySelector('span');
            const message = span ? span.innerText : btn.innerText;
            processUserMessage(message);
        });
    });
});