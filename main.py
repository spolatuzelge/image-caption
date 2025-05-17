from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Yüklemesi
model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.post("/caption")
async def caption(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Görseli işle
    pixel_values = feature_extractor(images=image, return_tensors="pt").pixel_values.to(device)

    # Caption oluştur
    output_ids = model.generate(pixel_values, max_length=16, num_beams=4)
    caption_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    return {"caption": caption_text}
