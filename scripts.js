// Global Variables
let userName = '';
let currentGroupId = 1; // Default group ID
let renderedMessages = {}; // Tracks rendered messages for each group
let messageTimers = []; // Stores timers to control message delay
let warningTimeoutId = null; // Tracks the warning popup timeout

// Initialize popup state
document.getElementById("popup").style.display = "none";

// Initialize renderedMessages for all groups
for (let groupId = 1; groupId <= 3; groupId++) {
  renderedMessages[groupId] = [];
}

// Show Name Prompt Once
document.getElementById("name-prompt").style.display = "flex";

// Ensure event listener is added only once
document.getElementById("name-submit-button").addEventListener("click", () => {
  const usernameInput = document.getElementById("username-input").value.trim();
  if (usernameInput) {
    userName = usernameInput;
    document.getElementById("name-prompt").style.display = "none";
    
    // Clear any existing timeout before setting a new one
    if (warningTimeoutId) {
      clearTimeout(warningTimeoutId);
    }
    
    // Set new timeout
    warningTimeoutId = setTimeout(() => {
      document.getElementById("popup").style.display = "flex";
    }, 10000);
  }
});

// Close Warning Popup
document.getElementById("popup-ok-button").addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
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

// Render Messages with 5-Second Delay (Restart on Group Switch)
function renderMessages(groupId) {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = ""; // Clear chat window on group change
  messageTimers.forEach((timer) => clearTimeout(timer)); // Clear all existing timers
  messageTimers = []; // Reset timers

  const messages = groupMessages[groupId];
  messages.forEach((message, index) => {
    const timer = setTimeout(() => {
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
    }, index * 5000); // Delay for each message
    messageTimers.push(timer);
  });
}

// Handle Send Button
document.getElementById("send-button").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const messageText = input.value.trim();
  if (messageText) {
    const userMessage = { sender: userName, text: messageText };

    // Save message to groupMessages
    groupMessages[currentGroupId].push(userMessage);

    // Render the new message immediately
    const chatWindow = document.getElementById("chat-window");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message self";

    const image = document.createElement("img");
    image.src = "images/people.1.jpeg";
    image.alt = "User Photo";
    image.className = "message-image";
    messageDiv.appendChild(image);

    const text = document.createElement("span");
    text.innerText = `${userName}: ${messageText}`;
    messageDiv.appendChild(text);

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll

    input.value = ""; // Clear input field
  }
});

// Group Switching
document.querySelectorAll(".group").forEach((group) => {
  group.addEventListener("click", () => {
    document.querySelectorAll(".group").forEach((g) => g.classList.remove("active"));
    group.classList.add("active");

    currentGroupId = parseInt(group.dataset.groupId);
    renderMessages(currentGroupId);
  });
});
