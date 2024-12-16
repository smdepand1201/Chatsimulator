// Global Variables
let userName = '';
let currentGroupId = 1;

// Show popup warning
const popup = document.getElementById("popup");
const popupOkButton = document.getElementById("popup-ok-button");
popupOkButton.addEventListener("click", () => {
  popup.style.display = "none";
  document.getElementById("name-prompt").style.display = "flex";
});

// Name prompt
const namePrompt = document.getElementById("name-prompt");
const nameSubmitButton = document.getElementById("name-submit-button");
nameSubmitButton.addEventListener("click", () => {
  const usernameInput = document.getElementById("username-input").value.trim();
  if (usernameInput) {
    userName = usernameInput;
    namePrompt.style.display = "none";
    document.getElementById("app").style.display = "flex";
    renderMessages(currentGroupId);
  }
});

// Group Messages
const groupMessages = {
  1: [
    { sender: "Alice", text: "New study shows vaccines protect kids from Long-COVID." },
    { sender: "Bob", text: "Really? I heard some people say vaccines cause heart problems." },
    { sender: "Charlie", text: "That's misinformation. The risks are very rare and minimal." },
    { sender: "Dana", text: "What do you think about this?" },
  ],
  2: [
    { sender: "Alice", text: "Microplastics are polluting oceans faster than ever." },
    { sender: "Dana", text: "Why do you think people downplay this issue?" },
  ],
  3: [
    { sender: "Alice", text: "Did you know gaming might boost intelligence in kids?" },
    { sender: "Dana", text: "What is your view on gaming?" },
  ],
};

// Render Messages
function renderMessages(groupId) {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = "";
  groupMessages[groupId].forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${message.sender === userName ? "self" : "other"}`;
    messageDiv.innerText = `${message.sender}: ${message.text}`;
    chatWindow.appendChild(messageDiv);
  });
}

// Handle Send Button
document.getElementById("send-button").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const messageText = input.value.trim();
  if (messageText) {
    groupMessages[currentGroupId].push({ sender: userName, text: messageText });
    renderMessages(currentGroupId);
    input.value = "";
  }
});
