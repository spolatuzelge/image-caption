
# 🖼️ Image Captioning Web Uygulaması

Bu proje, yüklenen bir görsel için otomatik olarak **görsel açıklaması (caption)** oluşturan ve bu açıklamayı **sesli okuma** özelliğiyle destekleyen modern bir web uygulamasıdır.

---

## 🧠 Özellikler

- ✅ Görsel yükleme ile otomatik açıklama üretimi (Image Captioning)
- ✅ ViT-GPT2 modeli (Hugging Face `nlpconnect/vit-gpt2-image-captioning`)
- ✅ Sesli okuma (Text-to-Speech) özelliği
- ✅ Mobil uyumlu, interaktif ve kullanıcı dostu tasarım
- ✅ Yükleme ve dinleme işlemleri için ilerleme çubuğu

---

## 🧰 Kullanılan Teknolojiler

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** FastAPI (Python)
- **Model:** ViT + GPT2 (VisionEncoderDecoderModel - HuggingFace Transformers)
- **Diğer:** CORS, PIL, Torch, SpeechSynthesis API (tarayıcı)

---

## 📁 Proje Dosya Yapısı

```
.
├── main.py              # FastAPI sunucusu (Model servis katmanı)
├── index.html           # Web arayüzü
├── script.js            # Görsel yükleme, istek gönderme ve sesli okuma
├── style.css            # Modern responsive tasarım
├── icon.png             # Görsel yükleme simgesi
├── README.md            # Proje dokümantasyonu
```

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Python ortamını kurun

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn pillow torch transformers
```

### 2. Sunucuyu başlatın

```bash
uvicorn main:app --reload
```

### 3. `index.html` dosyasını bir tarayıcıda açın

Tarayıcıdan açılan sayfa, yerel sunucuya (`http://127.0.0.1:8000/caption`) istek göndererek çalışır.

---

## ✨ Kullanım

1. Ana sayfada "Görsel Yükle" kutusuna tıklayın ve bir resim seçin.
2. “Açıklama Oluştur” butonuna basın.
3. Yapay zekâ modelinden gelen açıklama görüntülenir.
4. “Dinle” butonuyla açıklama sesli olarak okunur.

---

Hazırlayan: **POLAT ÜZELGE** · 2025
