# Music Similarity Analysis: AI vs. Human Songs

This project analyzes how similar AI-generated songs are to human-made songs using audio-based machine learning features. We extract MFCCs, tempo data, and chroma vectors for each track, compute pairwise cosine similarity, and evaluate patterns using clustering and PCA visualization.

## Project Structure

```
project/
│
├── All_features_extractor.ipynb
├── requirements.txt
├── README.md
│
└── data/
    ├── AI/        # AI-generated MP3s from Suno
    ├── Spotify/   # Human training songs
    └── Control/   # Human test songs
```

## Installation

```bash
pip install -r requirements.txt
```

## How to Reproduce Results

1. Place MP3 files into the `data/AI`, `data/Spotify`, and `data/Control` folders.
2. Run the analysis:
```bash
python All_features_extractor.ipynb
```

## What the Script Does

### A. Extracts Audio Features
- MFCC means  
- Tempo (BPM)  
- Chroma vector means  

Saved into CSV feature files.

### B. Combines All Features
Creates unified datasets with `is_ai` labels.

### C. Computes Similarity
- Cosine similarity matrix  
- Random sample of 100,000 pairs  
- `pair.csv` output  
- Cohen's D  
- Violin plots  

### D. Clustering & PCA
- Standard scaling  
- KMeans (k=2)  
- Silhouette score  
- PCA visualizations  

## Output Files

| File | Description |
|------|-------------|
| `*AI_mfcc_features.csv` | AI MFCC values |
| `*Spotify_mfcc_features.csv` | Human Training MFCC values |
| `*Control_mfcc_features.csv` | Human Test MFCC values |
| `*AI_tempo_features.csv` | AI BPM data |
| `*Spotify_tempo_features.csv` | Human Training BPM data |
| `*Control_tempo_features.csv` | Human Test BPM data |
| `*AI_chroma_features.csv` | AI Chroma vectors |
| `*Spotify_chroma_features.csv` | Human Training Chroma vectors |
| `*Control_chroma_features.csv` | Human Test Chroma vectors |
| `combined_AI_features*.csv` | AI Merged features |
| `combined_spotify_features*.csv` | Spotify Merged features |
| `combined_control_features*.csv` | Control Merged features |
| `all_songs*.csv` | All Merged features |
| `pair.csv` | Sampled similarities |
| PCA & distribution plots | Visual analysis |

## Data Availability

### Included
Feature CSVs (MFCC, tempo, chroma) and similarity data (`pair.csv`).

### Not Included
Raw MP3 audio files, due to size limitations.

## Reproducibility Notes

- Use the exact package versions in `requirements.txt`.
- Provide ≥30 seconds of audio for each track.

## Acknowledgements

Thanks to:
- Librosa  
- Scikit-learn  
- Matplotlib
- Seaborn
- Numpy
- Pandas
