#!/bin/zsh
# Render stills of the MV at song times (seconds) and tile them 5 per row into out/frames/<name>
# usage (from story/): scripts/frames.sh sheet.jpg 12.5 40 101.2 ...
cd "$(dirname "$0")/.."
OUT=../out/frames; mkdir -p $OUT
out=$1; shift
inputs=(); k=0; fl=""
for tt in "$@"; do
  fr=$(python3 -c "print(round($tt*24))")
  npx remotion still MV $OUT/f_$tt.png --frame=$fr --log=error 2>&1 | tail -3
  inputs+=(-i $OUT/f_$tt.png); fl+="[$k]scale=640:-1[v$k];"; k=$((k+1))
done
n=$k; rows=$(( (n+4)/5 )); all=""
for ((r=0;r<rows;r++)); do
  seg=""; c=0
  for ((j=r*5;j<n && j<r*5+5;j++)); do seg+="[v$j]"; c=$((c+1)); done
  while ((c<5)); do fl+="color=black:s=640x360:d=1[p$r$c];"; seg+="[p$r$c]"; c=$((c+1)); done
  fl+="${seg}hstack=5[r$r];"; all+="[r$r]"
done
if ((rows>1)); then fl+="${all}vstack=${rows}[o]"; else fl+="[r0]null[o]"; fi
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "$fl" -map "[o]" -frames:v 1 $OUT/$out && echo "$OUT/$out"
