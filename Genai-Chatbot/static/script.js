let chatHistory = [];
function sendMessage() {

    let input = document.getElementById("user-input");

    let message = input.value.trim();

    if (message === "") return;

    addMessage(message, "user-message");

    input.value = "";

    showTyping();

    fetch("/chat", {

        method: "POST",

        body: JSON.stringify({
            message: message
        }),

        headers: {
            "Content-Type": "application/json"
        }

    })

    .then(response => response.json())

    .then(data => {

        removeTyping();

        addMessage(data.response, "bot-message");

    })

    .catch(error => {

        removeTyping();

        addMessage(
            "⚠️ Something went wrong while processing your request.",
            "bot-message"
        );

    });

}

function quickAsk(question) {

    document.getElementById("user-input").value = question;

    sendMessage();

}

function addMessage(message, className) {

    let chatBox = document.getElementById("chat-box");

    let messageWrapper = document.createElement("div");

    messageWrapper.className = className;

    let currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
});

    messageWrapper.innerHTML = `
    ${marked.parse(message)}
    <div class="timestamp">${currentTime}</div>
`;

    chatBox.appendChild(messageWrapper);

    chatHistory.push({
    message: message,
    className: className
});

    scrollChat();

}

function showTyping() {

    let chatBox = document.getElementById("chat-box");

    let typingDiv = document.createElement("div");

    typingDiv.className = "bot-message typing";

    typingDiv.id = "typing-indicator";

    typingDiv.innerHTML = `
        <span>AI is thinking</span>
        <div class="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </div>
    `;

    chatBox.appendChild(typingDiv);

    scrollChat();

}

function removeTyping() {

    let typing = document.getElementById("typing-indicator");

    if (typing) {

        typing.remove();

    }

}

function scrollChat() {

    let chatBox = document.getElementById("chat-box");

    chatBox.scrollTop = chatBox.scrollHeight;

}

document.getElementById("user-input").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});
function clearChat() {

    let chatBox = document.getElementById("chat-box");

    chatBox.innerHTML = `
        <div class="hero-card">
            <h3>Welcome, learner 👋</h3>
            <p>
                I can explain concepts, compare topics, help with projects,
                and simplify AI/ML terms in a student-friendly way.
            </p>
        </div>

        <div class="quick-buttons">
            <button onclick="quickAsk('What is Artificial Intelligence?')">AI Basics</button>
            <button onclick="quickAsk('Explain Machine Learning')">Machine Learning</button>
            <button onclick="quickAsk('What are Large Language Models?')">LLMs</button>
            <button onclick="quickAsk('Explain Generative AI')">Generative AI</button>
            <button onclick="quickAsk('What is supervised learning?')">Supervised Learning</button>
            <button onclick="quickAsk('What is prompt engineering?')">Prompt Engineering</button>
        </div>
    `;
}
function showHistory() {

    let historyText = "";

    chatHistory.forEach(chat => {

        if (chat.className === "user-message") {

            historyText += "🧑 You: " + chat.message + "\n\n";

        } else {

            historyText += "🤖 AI: " + chat.message + "\n\n";

        }

    });

    if (historyText === "") {

        alert("No chat history yet.");

    } else {

        alert(historyText);

    }

}
function startChat() {

    let screen = document.getElementById("welcome-screen");

    screen.style.opacity = "0";

    setTimeout(() => {

        screen.style.display = "none";

    }, 300);

}
async function uploadPDF() {

    let fileInput = document.getElementById("pdf-upload");

    let file = fileInput.files[0];

    if (!file) return;

    let formData = new FormData();

    formData.append("pdf", file);

    let response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    let data = await response.json();

    addMessage("📄 " + data.message, "bot-message");

}

async function uploadImage() {

    let fileInput = document.getElementById("image-upload");

    let file = fileInput.files[0];

    if (!file) return;

    addMessage(
        "🖼️ Image uploaded: " + file.name,
        "bot-message"
    );

}
function startVoice() {

    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice input is not supported in this browser. Please use Chrome.");
        return;
    }

    let recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
    };

    recognition.onerror = function() {
        alert("Could not capture voice. Please try again.");
    };
}