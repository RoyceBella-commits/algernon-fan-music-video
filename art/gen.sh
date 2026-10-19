#!/bin/zsh
# Generate one image with the Codex CLI (image generation tool) and copy it to art/raw/<name>.png
# usage: art/gen.sh <name> [ref.png ...]      prompt is read from art/prompts/<name>.txt
# env:   CODEX_MODEL (default gpt-6-astra) — the agent model that calls the image tool
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
name=$1; shift
refs=()
for r in "$@"; do refs+=(-i "$r"); done
mkdir -p art/logs art/raw
{
  echo "Use your built-in image generation tool to create exactly ONE image for the brief below. Do not write code or files yourself; just generate the image once. Wide 16:9 landscape."
  if (( $# > 0 )); then echo "The attached image(s) are style/character references: keep the same characters, materials and photographic look."; fi
  echo
  cat "art/prompts/$name.txt"
} > "art/logs/$name.prompt"
codex exec --skip-git-repo-check -s workspace-write -m "${CODEX_MODEL:-gpt-6-astra}" -c model_reasoning_effort="low" -C "$ROOT" "${refs[@]}" < "art/logs/$name.prompt" > "art/logs/$name.log" 2>&1
sid=$(grep -m1 -i "session id" "art/logs/$name.log" | awk '{print $NF}')
img=$(find ~/.codex/generated_images/$sid -name "*.png" 2>/dev/null | head -1)
if [[ -n "$img" ]]; then
  cp "$img" "art/raw/$name.png"; echo "OK $name"
else
  echo "FAIL $name (session $sid)"; tail -5 "art/logs/$name.log"
fi
