#!/bin/zsh
# Prepare story/public for rendering:
#   - copy the original plates art/raw/*.png -> story/public/img/raw/   (not committed twice)
#   - optional: encode your own copy of the song to story/public/audio/song.m4a (for Studio preview)
#   - rewrite src/data/images.json (image size manifest)
# usage (from story/): npm run sync [-- /path/to/song.flac]
STORY="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$STORY/.." && pwd)"
mkdir -p "$STORY/public/img/raw" "$STORY/public/audio"
rsync -a --include='*.png' --exclude='*' "$ROOT/art/raw/" "$STORY/public/img/raw/"
if [[ -n "${1:-}" ]]; then
  ffmpeg -loglevel error -y -i "$1" -map 0:a:0 -ar 48000 -c:a aac -b:a 320k "$STORY/public/audio/song.m4a" && echo "audio -> public/audio/song.m4a"
fi
cd "$STORY" && node scripts/manifest.mjs
