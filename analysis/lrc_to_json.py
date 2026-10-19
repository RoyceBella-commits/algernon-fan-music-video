"""LRC -> lyrics.json ([{start, end, text}]); blank timestamp lines mark where the previous line ends.
usage: python3 analysis/lrc_to_json.py <lyrics.lrc> <lyrics.json>"""
import json, re, sys
rows = []
for line in open(sys.argv[1], encoding="utf-8"):
    m = re.match(r"\[(\d+):(\d+\.\d+)\](.*)", line.strip())
    if m:
        rows.append((int(m[1]) * 60 + float(m[2]), m[3].strip()))
out = []
for i, (t, txt) in enumerate(rows):
    if not txt:
        continue
    end = rows[i + 1][0] if i + 1 < len(rows) else t + 4.5
    out.append({"start": round(t, 3), "end": round(end, 3), "text": txt})
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print(len(out), "lines")
