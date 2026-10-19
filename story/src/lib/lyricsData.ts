// Lyric lines = committed timing (lyrics.public.json) + your own lyric text (lyrics.local.json, git-ignored).
// Without lyrics.local.json the MV renders with no lyric text. See scripts/lyrics.mjs.
import pub from '../data/lyrics.public.json';

declare const require: any; // webpack require.context (Remotion bundler)
const ctx = require.context('../data', false, /^\.\/lyrics\.local\.json$/);
const local: {text: string}[] | null = ctx.keys().length ? ctx(ctx.keys()[0]) : null;

export type LyricLine = {start: number; end: number; text: string; times?: number[]};
export const HAS_LYRICS = local !== null;
export const LINES: LyricLine[] = (pub as {start: number; end: number; times: number[]; n: number}[]).map((l, i) => ({
	start: l.start,
	end: l.end,
	times: l.times,
	text: local?.[i]?.text ?? '',
}));
