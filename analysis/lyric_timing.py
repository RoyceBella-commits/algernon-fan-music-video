"""Per-character lyric timing from the separated vocal stem.
usage (repo root): .venv/bin/python analysis/lyric_timing.py <vocals.wav> <lyrics.json>   (adds "times", in place)
Syllable onsets are detected on the vocal stem; each line's morae are mapped onto the onsets inside its window
(evenly resampled when counts differ). Falls back to a linear spread over the sung span."""
import json, sys, numpy as np, librosa
VOCALS, LYRICS = sys.argv[1], sys.argv[2]
SR, HOP = 22050, 220
y, _ = librosa.load(VOCALS, sr=SR, mono=True)
env = librosa.onset.onset_strength(y=y, sr=SR, hop_length=HOP, aggregate=np.median)
ons = librosa.onset.onset_detect(onset_envelope=env, sr=SR, hop_length=HOP, units="time", backtrack=True, delta=0.03, wait=5)
rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=HOP)[0]
db = 20 * np.log10(rms + 1e-6)
thr = np.percentile(db, 95) - 22
ons = np.array([o for o in ons if db[min(len(db) - 1, int(o * SR / HOP) + 3)] > thr])

KANJI = {'貴方': 3, '僕': 2, '心': 3, '目': 1, '描': 1, '空': 2, '大': 2, '雲': 2, '流': 2, '風': 2, '呑': 1, '込': 1, '夢': 2, '見': 1,
         '裸足': 3, '変': 1, '小': 2, '少': 2, '膨': 2, '眺': 2, '走': 2, '長': 2, '迷路': 3, '先': 2, '恐': 2, '名前': 3, '手': 1,
         '作': 2, '海': 2, '砂': 2, '波': 2, '両手': 3, '遠': 2, '一': 2, '眠': 2, '頭': 3, '真': 1, '中': 2, '育': 2, '木': 1,
         '根本': 3, '歩': 2, '人': 2, '出会': 2, '越': 1, '壁': 2, '竦': 2, '諦': 3, '忘': 2, '崩': 2, '塔': 2, '木陰': 3, '確': 2, '迷': 2}
SMALL = 'ゃゅょぁぃぅぇぉャュョァィゥェォ'

def morae(text):
    """mora count per character (multi-kanji words split across their chars)."""
    w = [0] * len(text)
    i = 0
    while i < len(text):
        two = text[i:i + 2]
        if two in KANJI:
            m = KANJI[two]; w[i] = (m + 1) // 2; w[i + 1] = m // 2; i += 2; continue
        c = text[i]
        if c in KANJI: w[i] = KANJI[c]
        elif c in SMALL or c == '　': w[i] = 0
        elif '一' <= c <= '鿿': w[i] = 2
        else: w[i] = 1
        i += 1
    return w

L = json.load(open(LYRICS))
L[-1]["end"] = 214.7  # last line is sung until ~214.5
starts = [l["start"] for l in L]
for k, line in enumerate(L):
    s0 = line["start"]
    nxt = starts[k + 1] if k + 1 < len(L) else s0 + 6
    o = ons[(ons >= s0 - 0.3) & (ons < nxt - 0.12)]
    w = morae(line["text"])
    M = sum(w)
    # mora index at which each char begins
    cum = np.concatenate([[0], np.cumsum(w)])[:-1]
    if len(o) >= 2:
        # map mora m (0..M-1) -> onset index (resample when counts differ)
        K = len(o)
        idx = np.clip(np.round(cum * (K - 1) / max(1, M - 1)), 0, K - 1).astype(int)
        times = o[idx]
        mode = "onset"
    else:
        times = s0 + cum / max(1, M) * (nxt - s0) * 0.8
        mode = "linear"
    times = np.array(times, dtype=float) - 0.04
    # keep the last character on screen for a moment before the line's exit fade
    lim = line["end"] - 0.75
    if times[-1] > lim and times[-1] > times[0]:
        times = times[0] + (times - times[0]) * (lim - times[0]) / (times[-1] - times[0])
    times = [round(float(t), 3) for t in times]
    line["times"] = times
    print(f"{s0:7.2f} {mode:6s} onsets {len(o):3d} morae {M:3d}  first {times[0]:7.2f} last {times[-1]:7.2f} next {nxt:7.2f}  {line['text'][:14]}")
json.dump(L, open(LYRICS, "w"), ensure_ascii=False, indent=1)
