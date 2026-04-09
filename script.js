const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

const loadingModal = document.getElementById("loadingModal");
const errorModal = document.getElementById("errorModal");
const chatModal = document.getElementById("chatModal");
const confettiContainer = document.getElementById("confetti-container");

const contactCsBtn = document.getElementById("contactCsBtn");
const closeErrorBtn = document.getElementById("closeErrorBtn");
const closeChatBtn = document.getElementById("closeChatBtn");

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatBox = document.getElementById("chatBox");

const firstCsReply = `hyy sayang🥰🥰
selamat ultah tahun honey, kamu apa kabarnya,aku perhatiin kok kamu ngoding terus sih, berusaha buat bikin hubungan kita sempurna, hari ini udah cukup ngoding nya, istirahat sana besok kan bisa di lanjut sayang🥰🥰❤️`;
const followUpReply = "Lah iya anjir";
const stickerImagePath = "gokil-stiker.jpg";

let hasShownFirstCsConfetti = false;
let userMessageCount = 0;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (value === "C") {
      display.value = "";
      return;
    }

    if (value === "DEL") {
      display.value = display.value.slice(0, -1);
      return;
    }

    if (value === "=") {
      fakeCalculate();
      return;
    }

    display.value += value;
  });
});

function fakeCalculate() {
  loadingModal.classList.remove("hidden");

  setTimeout(() => {
    loadingModal.classList.add("hidden");
    errorModal.classList.remove("hidden");
  }, 1800);
}

contactCsBtn.addEventListener("click", () => {
  errorModal.classList.add("hidden");
  chatModal.classList.remove("hidden");
  chatInput.focus();
});

closeErrorBtn.addEventListener("click", () => {
  errorModal.classList.add("hidden");
});

closeChatBtn.addEventListener("click", () => {
  chatModal.classList.add("hidden");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, "user-message");
  chatInput.value = "";
  userMessageCount += 1;

  setTimeout(() => {
    if (userMessageCount === 1) {
      showTypingThenReply(firstCsReply, { showConfetti: true });
      return;
    }

    showTypingThenReply(followUpReply, {
      onComplete: () => {
        setTimeout(() => {
          addStickerMessage(stickerImagePath);
        }, 1000);
      },
    });
  }, 500);
});

function addMessage(text, className) {
  const bubble = document.createElement("div");
  bubble.className = `message ${className}`;
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingThenReply(text, options = {}) {
  const { showConfetti = false, onComplete } = options;
  const typingBubble = document.createElement("div");
  typingBubble.className = "message cs-message typing-message";
  typingBubble.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;

  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typingBubble.remove();
    addMessage(text, "cs-message");

    if (showConfetti && !hasShownFirstCsConfetti) {
      launchConfetti(90);
      hasShownFirstCsConfetti = true;
    }

    if (typeof onComplete === "function") {
      onComplete();
    }
  }, 1800);
}

function addStickerMessage(imagePath) {
  const bubble = document.createElement("div");
  bubble.className = "message cs-message sticker-message";

  const image = document.createElement("img");
  image.src = imagePath;
  image.alt = "CS sticker";
  image.className = "sticker-image";
  image.addEventListener("load", () => {
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  bubble.appendChild(image);
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function launchConfetti(amount = 80) {
  const colors = ["#ff5f6d", "#ffd166", "#4dd0e1", "#5be7a9", "#ffffff", "#ff8fab"];
  const shapes = ["square", "circle", "triangle"];

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("div");
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const left = Math.random() * 100;
    const duration = 2 + Math.random() * 2.5;
    const delay = Math.random() * 0.8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = 8 + Math.random() * 10;

    piece.classList.add("confetti-piece", shape);
    piece.style.left = `${left}vw`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;

    if (shape === "triangle") {
      piece.style.borderBottomColor = color;
    } else {
      piece.style.background = color;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 1.4}px`;
    }

    confettiContainer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, (duration + delay) * 1000);
  }
}
