// static/main.js
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.speak(utter);
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  appendMessage("user", message);
  messageInput.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      appendMessage("bot", data.response);
      speak(data.response);
    })
    .catch(() => {
      const errorMsg = "Sorry, something went wrong.";
      appendMessage("bot", errorMsg);
      speak(errorMsg);
    });
}

function startListening() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support voice recognition.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    sendMessage();
  };
  recognition.onerror = () => {
    speak("Sorry, I didn't catch that.");
  };
  recognition.start();
}
