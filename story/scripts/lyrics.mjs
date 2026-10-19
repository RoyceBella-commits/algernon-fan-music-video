// Lyrics are NOT part of this repository. The repo keeps only their timing (src/data/lyrics.public.json:
// line start/end, per-character appearance times, character count). Bring your own lyrics file:
//
//   node scripts/lyrics.mjs merge /path/to/lyrics.lrc   -> src/data/lyrics.local.json  (git-ignored)
//   node scripts/lyrics.mjs strip /path/to/lyrics.json  -> src/data/lyrics.public.json (timing only)
//
// The LRC must be the common 33-line version of the song (blank timestamp lines allowed).
import fs from 'node:fs';

const [, , cmd, file] = process.argv;
const PUB = 'src/data/lyrics.public.json';
const LOCAL = 'src/data/lyrics.local.json';

const parseLrc = (txt) =>
	txt
		.split(/\r?\n/)
		.map((l) => l.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/))
		.filter(Boolean)
		.map((m) => ({start: +m[1] * 60 + +m[2], text: m[3].trim()}))
		.filter((l) => l.text);

if (cmd === 'merge') {
	if (!file) throw new Error('usage: merge <lyrics.lrc>');
	const pub = JSON.parse(fs.readFileSync(PUB, 'utf8'));
	const lrc = parseLrc(fs.readFileSync(file, 'utf8'));
	const out = pub.map((p, i) => {
		const best = lrc.reduce((a, l) => (Math.abs(l.start - p.start) < Math.abs(a.start - p.start) ? l : a), lrc[0]);
		if (Math.abs(best.start - p.start) > 1.0) throw new Error(`line ${i + 1}: no LRC line near ${p.start.toFixed(2)}s`);
		const n = Array.from(best.text).length;
		if (n !== p.n) console.warn(`line ${i + 1}: ${n} chars, timing expects ${p.n} — check your LRC`);
		return {text: best.text};
	});
	fs.writeFileSync(LOCAL, JSON.stringify(out, null, 1));
	console.log(`wrote ${LOCAL} (${out.length} lines)`);
} else if (cmd === 'strip') {
	if (!file) throw new Error('usage: strip <lyrics.json with text+times>');
	const full = JSON.parse(fs.readFileSync(file, 'utf8'));
	const pub = full.map((l) => ({start: l.start, end: l.end, n: Array.from(l.text).length, times: l.times}));
	fs.writeFileSync(PUB, JSON.stringify(pub, null, 1));
	console.log(`wrote ${PUB} (${pub.length} lines, no text)`);
} else {
	console.log('usage: node scripts/lyrics.mjs merge <lyrics.lrc> | strip <lyrics.json>');
}
