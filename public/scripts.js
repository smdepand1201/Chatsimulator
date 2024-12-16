// Global Variables
let userName = '';
let currentGroupId = 1;

// Show popup warning after 10 seconds
setTimeout(() => {
  document.getElementById("popup").style.display = "flex";
}, 10000);

const popupOkButton = document.getElementById("popup-ok-button");
popupOkButton.addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
  document.getElementById("name-prompt").style.display = "flex";
});

// Name prompt
const nameSubmitButton = document.getElementById("name-submit-button");
nameSubmitButton.addEventListener("click", () => {
  const usernameInput = document.getElementById("username-input").value.trim();
  if (usernameInput) {
    userName = usernameInput;
    document.getElementById("name-prompt").style.display = "none";
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

// Render Messages with Delay
function renderMessages(groupId) {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = ""; // Clear messages

  const messages = groupMessages[groupId];
  messages.forEach((message, index) => {
    setTimeout(() => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${message.sender === userName ? "self" : "other"}`;

      // Add photo and text
      const image = document.createElement("img");
      image.src = "images/people.1.jpeg";
      image.alt = "User Photo";
      image.className = "message-image";
      messageDiv.appendChild(image);

      const text = document.createElement("span");
      text.innerText = `${message.sender}: ${message.text}`;
      messageDiv.appendChild(text);

      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
    }, index * 5000); // 5-second delay per message
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
