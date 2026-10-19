"""Tempo, beat grid and a 24 fps energy curve.
usage (repo root): .venv/bin/python analysis/analyze.py <song.wav> <out_dir>
writes <out_dir>/beats.json and <out_dir>/energy.json (copy beats.json to story/src/data/)."""
import json, sys, os, numpy as np, librosa
song, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
y, sr = librosa.load(song, sr=22050, mono=True)
hop = 512
onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, units="time")
tempo = float(np.atleast_1d(tempo)[0])
fps = 24
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop)[0]
t_rms = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
n = int(np.ceil(len(y) / sr * fps))
tt = np.arange(n) / fps
e = np.interp(tt, t_rms, rms)
e = e / np.percentile(e, 99)
ons = np.interp(tt, t_rms, onset / np.percentile(onset, 99))
json.dump({"tempo": tempo, "beats": [round(float(b), 3) for b in beats]}, open(f"{out}/beats.json", "w"))
json.dump({"fps": fps, "energy": [round(float(v), 3) for v in np.clip(e, 0, 1.5)],
           "onset": [round(float(v), 3) for v in np.clip(ons, 0, 2)]}, open(f"{out}/energy.json", "w"))
print("tempo", round(tempo, 2), "beats", len(beats))
