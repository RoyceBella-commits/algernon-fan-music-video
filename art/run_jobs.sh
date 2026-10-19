#!/bin/zsh
# Run image jobs in parallel. Each line of the jobs file: "name|ref1.png,ref2.png"
# usage: art/run_jobs.sh art/logs/jobs.txt [parallelism=6]
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
cat "$1" | xargs -P ${2:-6} -I{} zsh -c 'line="{}"; name=${line%%|*}; refs=${line#*|}; art/gen.sh $name ${(s:,:)refs}'
