const uploadInput = document.getElementById("audio-upload");
const fileInfo = document.getElementById("file-info");

let dataset = [];

async function loadDatasetJSON() {
  try {
    const res = await fetch("all_songs.json");
    const data = await res.json();

    dataset = data.map(item => {
      const parsed = {};
      for (const [k, v] of Object.entries(item)) {
        parsed[k] = Number(v);
        if (Number.isNaN(parsed[k])) parsed[k] = v; 
      }
      return parsed;
    });

    console.log("Dataset loaded:", dataset.length, "songs");
  } catch (err) {
    console.error("Could not load dataset:", err);
  }
}
loadDatasetJSON();

uploadInput.addEventListener("change", async () => {
  const file = uploadInput.files[0];
  if (!file) return;

  fileInfo.textContent = "Extracting features…";

  try {
    const features = await uploadAndExtract(file);
    console.log("Extracted features:", features);

    fileInfo.textContent = "Running similarity search…";

    const matches = findTopMatches(features, dataset);
    displayResults(matches);

  } catch (err) {
    console.error(err);
    fileInfo.textContent = "Error: " + err.message;
  }
});

async function uploadAndExtract(file) {
  const form = new FormData();
  form.append("file", file, file.name);

  console.log("Uploading file...");

  const res = await fetch("https://similarity-score-production.up.railway.app/extract", {
    method: "POST",
    body: form
  });

  const text = await res.text();
  console.log("Raw backend response:", text);

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error("JSON parse error — backend did NOT return JSON:", e);
    throw new Error("Backend returned non-JSON response");
  }

  if (!res.ok) {
    throw new Error(`Server returned status: ${res.status}`);
  }

  const finalFeatures = json.features ? json.features : json;

  if (!finalFeatures || typeof finalFeatures.tempo_bpm === "undefined") {
    throw new Error("Response is valid JSON but missing feature data (tempo, mfcc, etc).");
  }

  return finalFeatures;
}

function similarityScore(user, song) {
  let dist = 0;

  // MFCC 0–19
  for (let i = 0; i < 20; i++) {
    dist += Math.pow(user[`mfcc_${i}`] - song[`mfcc_${i}`], 2);
  }

  // Chroma 0–11
  for (let i = 0; i < 12; i++) {
    dist += Math.pow(user[`chroma_${i}`] - song[`chroma_${i}`], 2);
  }

  // Tempo
  dist += Math.pow(user["tempo_bpm"] - song["tempo_bpm"], 2);

  return Math.sqrt(dist);
}

function findTopMatches(user, dataset) {
  const scored = dataset.map(song => ({
    ...song,
    score: similarityScore(user, song)
  }));

  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, 10);
}

function displayResults(songs) {
  const div = document.getElementById("results");

  let aiCount = songs.filter(s => s.is_ai === 1).length;
  let percentAI = ((aiCount / songs.length) * 100).toFixed(1);

  let html = `<h2>Top 10 Most Similar Songs</h2>`;
  html += `<p><strong>${percentAI}%</strong> of the top matches are AI-generated.</p><br>`;
  html += `<ol>`;

  songs.forEach(song => {
    html += `
      <li>
        <strong>${song.song_name || "Unknown Song"}</strong><br>
        Score: ${song.score.toFixed(3)}<br>
        Type: ${song.is_ai ? "AI" : "Human"}
      </li><br>
    `;
  });

  html += `</ol>`;
  div.innerHTML = html;
}

window.addEventListener("load", () => {
  if (uploadInput) uploadInput.value = "";
});
