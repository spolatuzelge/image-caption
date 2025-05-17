const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const caption = document.getElementById('caption');
const spinner = document.getElementById('spinner');
const placeholder = document.getElementById('placeholder');
const imageBox = document.getElementById('imageBox');
const captionButton = document.getElementById('captionButton');
const listenButton = document.getElementById('listenButton');
const stopButton = document.getElementById('stopButton');
const listenProgressBar = document.getElementById('listenProgressBar');

const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
let listenInterval = null;

imageBox.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    captionButton.disabled = false;
    listenButton.disabled = true;
    stopButton.disabled = true;

    startProgressBar();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateProgressBar(progress);
      if (progress >= 100) {
        clearInterval(interval);
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        resetProgressBar();
      }
    }, 100);
  }
});

function startProgressBar() {
  progressContainer.style.display = 'block';
  progressBar.style.width = '0%';
}

function updateProgressBar(value) {
  progressBar.style.width = `${value}%`;
}

function resetProgressBar() {
  setTimeout(() => {
    progressContainer.style.display = 'none';
    progressBar.style.width = '0%';
  }, 500);
}

async function uploadImage() {
  const file = imageInput.files[0];
  if (!file) {
    alert("Lütfen bir görsel seçin.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  caption.innerText = "";
  spinner.style.display = 'block';
  captionButton.disabled = true;
  listenButton.disabled = true;
  stopButton.disabled = true;

  try {
    const response = await fetch('http://127.0.0.1:8000/caption', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error("Sunucu hatası!");

    const data = await response.json();
    caption.innerText = data.caption || "Açıklama bulunamadı.";

    listenButton.disabled = false;

  } catch (error) {
    caption.innerText = "Hata: " + error.message;
  } finally {
    spinner.style.display = 'none';
  }
}

function startListening() {
  const text = caption.innerText;

  if (!text || text === "Açıklama burada gösterilecek." || text.includes("Hata")) {
    alert("Okunacak açıklama bulunamadı!");
    return;
  }

  window.speechSynthesis.cancel();
  resetListenProgress();

  speakText(text);
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert("Tarayıcınız sesli okuma desteklemiyor!");
    return;
  }

  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = 'en-US';
  msg.rate = 1;
  msg.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const turkishVoice = voices.find(voice => voice.lang === 'en-US');
  if (turkishVoice) {
    msg.voice = turkishVoice;
  }

  stopButton.disabled = false;

  msg.onstart = () => {
    startListenProgress(msg);
  };

  msg.onend = () => {
    stopButton.disabled = true;
    resetListenProgress();
  };

  window.speechSynthesis.speak(msg);
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
  stopButton.disabled = true;
  clearInterval(listenInterval);
}

function startListenProgress(msg) {
  const estimatedDuration = getEstimatedDuration(msg.text);
  const startTime = Date.now();

  listenInterval = setInterval(() => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    let progress = (elapsedTime / estimatedDuration) * 100;

    if (progress >= 100) {
      progress = 100;
      clearInterval(listenInterval);
    }

    listenProgressBar.style.width = `${progress}%`;
  }, 100);
}

function resetListenProgress() {
  clearInterval(listenInterval);
  listenProgressBar.style.width = `0%`;
}

function getEstimatedDuration(text) {
  const wordsPerMinute = 180;
  const words = text.trim().split(/\s+/).length;
  return (words / wordsPerMinute) * 60;
}
