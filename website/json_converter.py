import pandas as pd
import json

df = pd.read_csv("C:/Users/graha/data259-website/public/all_songs.csv")

mfcc_cols = [f"mfcc_{i}" for i in range(20)]
chroma_cols = [f"chroma_{i}" for i in range(12)]
numeric_cols = mfcc_cols + chroma_cols + ["tempo_bpm"]

required_cols = ["song_name", "is_ai"]

expected = required_cols + numeric_cols

cols_present = [c for c in expected if c in df.columns]
df = df[cols_present]

for c in numeric_cols:
    if c in df.columns:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0.0)

# Ensure is_ai is 0/1 int
if "is_ai" in df.columns:
    df["is_ai"] = pd.to_numeric(df["is_ai"], errors="coerce").fillna(0).astype(int)

records = df.to_dict(orient="records")

with open("all_songs.json", "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"Saved {len(records)} records to all_songs.json")
