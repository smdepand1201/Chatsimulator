const groupMessages = {
    1: [
      { sender: "Alice", text: "New study shows vaccines protect kids from Long-COVID." },
      { sender: "Bob", text: "Really? I heard some people say vaccines cause heart problems." },
      { sender: "Charlie", text: "That's misinformation. The risks are very rare and minimal." },
      { sender: "Dana", text: "I’m not sure what to believe anymore with so much fake news." },
      { sender: "Eve", text: "Always check credible sources and scientific studies." },
    ],
    2: [
      { sender: "Alice", text: "Microplastics are polluting oceans faster than ever." },
      { sender: "Bob", text: "Did you see the claim that plastic pollution is not harmful?" },
      { sender: "Charlie", text: "That's misleading. Millions of animals die every year." },
      { sender: "Dana", text: "Why do some articles downplay the problem then?" },
      { sender: "Eve", text: "Fake experts spread misinformation for profit." },
    ],
    3: [
      { sender: "Alice", text: "Did you know gaming might boost intelligence in kids?" },
      { sender: "Bob", text: "What? I thought gaming ruins brain development." },
      { sender: "Charlie", text: "That’s old fake news. Studies show gaming has benefits." },
      { sender: "Dana", text: "It’s hard to trust any news online without fact-checking." },
      { sender: "Eve", text: "Exactly. Verify claims before believing or sharing them." },
    ],
  };
  
  let currentGroupId = 1;
  
  // Sequential message display with a delay
  function renderMessages(groupId) {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML = ""; // Clear messages
  
    groupMessages[groupId].forEach((message, index) => {
      setTimeout(() => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${message.sender === "You" ? "self" : "other"}`;
        messageDiv.innerText = `${message.sender}: ${message.text}`;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
      }, index * 5000); // 5-second delay per message
    });
  }
  
  // Send message
  document.getElementById("send-button").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const messageText = input.value.trim();
    if (messageText) {
      // Add message to UI
      const newMessage = { sender: "You", text: messageText };
      groupMessages[currentGroupId].push(newMessage);
      renderMessages(currentGroupId);
  
      // Save message to SQLite
      fetch("/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_id: currentGroupId,
          sender: "You",
          text: messageText,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Server response:", data))
        .catch((error) => console.error("Error saving message:", error));
        
      input.value = ""; // Clear input field
    }
  });
  
  // Show warning banner after 10 seconds
  setTimeout(() => {
    const warningBanner = document.getElementById("warning-banner");
    warningBanner.style.display = "block";
  }, 10000);
  
  // Group switching
  document.querySelectorAll(".group").forEach((group) => {
    group.addEventListener("click", () => {
      document.querySelectorAll(".group").forEach((g) => g.classList.remove("active"));
      group.classList.add("active");
  
      currentGroupId = parseInt(group.dataset.groupId);
      fetch(`/get-messages/${currentGroupId}`)
        .then((response) => response.json())
        .then((messages) => {
          groupMessages[currentGroupId] = messages;
          renderMessages(currentGroupId);
        });
    });
  });
  
  // Load initial messages
  renderMessages(currentGroupId);
  