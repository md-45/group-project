from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import librosa
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during dev
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_features(path):
    y, sr = librosa.load(path, sr=None)

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    mfcc_mean = np.mean(mfcc, axis=1).tolist()

    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = np.mean(chroma, axis=1).tolist()

    tempo = librosa.beat.tempo(y=y, sr=sr)[0]

    return {
        "mfcc": mfcc_mean,
        "chroma": chroma_mean,
        "tempo_bpm": float(tempo)
    }

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    data = await file.read()
    temp_path = "temp_uploaded_audio"

    with open(temp_path, "wb") as f:
        f.write(data)

    features = extract_features(temp_path)
    return features

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)
