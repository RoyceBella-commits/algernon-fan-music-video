import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, W, H} from '../lib/time';
import {LINES, LyricLine} from '../lib/lyricsData';

export {LINES};
export type {LyricLine};

export type LyricLayout = {
	x: number;
	y: number;
	vertical?: boolean;
	size?: number;
	color?: string;
	font?: string;
	align?: 'start' | 'center' | 'end';
	shadow?: string;
	spacing?: number; // letter-spacing em
	maxStagger?: number;
	scatter?: number; // 0..1 misalignment of characters (for the bridge triple)
	fall?: number; // 0..1 characters drop off the line (forgetting)
	split?: boolean; // break at full-width spaces (multi-column / multi-row)
};

const DEFAULT: Required<Omit<LyricLayout, 'x' | 'y'>> = {
	vertical: false,
	size: 44,
	color: '#f8f0df',
	font: 'Mincho',
	align: 'start',
	shadow: '0 0 22px rgba(25,12,4,0.55), 0 1px 3px rgba(0,0,0,0.45)',
	spacing: 0.12,
	maxStagger: 0.085,
	scatter: 0,
	fall: 0,
	split: false,
};

const rnd = (n: number) => {
	const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
	return x - Math.floor(x);
};

/** Vocaloid-PV style lyric line: per-character soft reveal, quiet exit. */
const PARTICLE = 'をにはがのてでもとくたらず';
/** Index (in chars) where a too-long line should wrap: a full-width space, else a particle near the middle. */
const breakIndex = (chars: string[]) => {
	const sp = chars.indexOf('　');
	if (sp > 0) return sp;
	const mid = chars.length / 2;
	let best = Math.round(mid);
	let bestD = 1e9;
	for (let i = 2; i < chars.length - 2; i++) {
		if (PARTICLE.includes(chars[i - 1]) && Math.abs(i - mid) < bestD) {
			best = i;
			bestD = Math.abs(i - mid);
		}
	}
	return best;
};

/** Vocaloid-PV style lyric line: per-character soft reveal (synced to the singing when times are known), quiet exit. */
export const LyricText: React.FC<{line: LyricLine; t: number; layout: LyricLayout}> = ({line, t, layout}) => {
	const L = {...DEFAULT, ...layout};
	const chars = Array.from(line.text);
	const dur = line.end - line.start;
	const stagger = Math.min(L.maxStagger, Math.max(0.03, (dur * 0.6) / chars.length));
	const appear = (i: number) => (line.times && line.times[i] !== undefined ? line.times[i] : line.start + i * stagger);
	// --- fit inside the frame: wrap into two columns/rows, then shrink if still too long
	const unit = (sz: number) => sz * (1 + L.spacing);
	const avail = L.vertical
		? L.align === 'center'
			? H - 120
			: H - L.y - 70
		: L.align === 'center'
			? W - 160
			: L.align === 'end'
				? L.x - 80
				: W - L.x - 80;
	const brk = new Set<number>();
	if (L.split) chars.forEach((c, i) => c === '　' && brk.add(i));
	let segs = [chars.length];
	if (!brk.size && chars.length * unit(L.size) > avail) brk.add(breakIndex(chars));
	if (brk.size) {
		const b = [...brk].sort((a, c) => a - c);
		segs = b.map((x, k) => x - (k ? b[k - 1] + 1 : 0)).concat(chars.length - b[b.length - 1] - 1);
	}
	const longest = Math.max(...segs);
	const size = Math.min(L.size, avail / (longest * (1 + L.spacing)));
	const exit = clamp((line.end - t) / 0.45);
	const tx = L.align === 'center' ? '-50%' : L.align === 'end' ? '-100%' : '0%';
	const transform = L.vertical
		? `translate(-100%, ${L.align === 'center' ? '-50%' : L.align === 'end' ? '-100%' : '0%'})`
		: `translate(${tx}, -100%)`;
	return (
		<div
			style={{
				position: 'absolute',
				left: L.x,
				top: L.y,
				transform,
				writingMode: L.vertical ? 'vertical-rl' : 'horizontal-tb',
				fontFamily: L.font,
				fontSize: size,
				letterSpacing: `${L.spacing}em`,
				color: L.color,
				textShadow: L.shadow,
				whiteSpace: 'nowrap',
				lineHeight: 1.45,
				textAlign: L.align === 'center' ? 'center' : undefined,
				opacity: exit,
				filter: exit < 1 ? `blur(${(1 - exit) * 4}px)` : undefined,
			}}
		>
			{chars.map((c, i) => {
				if (brk.has(i)) return c === '　' ? <br key={i} /> : [<br key={`b${i}`} />, renderChar(c, i)];
				return renderChar(c, i);
			})}
		</div>
	);
	function renderChar(c: string, i: number) {
		const p = clamp((t - appear(i) + 0.06) / 0.28);
		const e = p * p * (3 - 2 * p);
		const sc = L.scatter * (rnd(i + line.start) - 0.5);
		const fallP = clamp(L.fall * 1.5 - rnd(i * 3.1 + 7) * 0.6);
		const dy = (1 - e) * 10 + sc * 26 + fallP * fallP * 170;
		const rot = sc * 24 + fallP * (rnd(i) - 0.5) * 60;
		return (
			<span
				key={i}
				style={{
					display: 'inline-block',
					opacity: e * (1 - clamp(fallP * 1.3 - 0.55)),
					transform: L.vertical ? `translate(${sc * 18}px, ${dy * 0.5}px) rotate(${rot}deg)` : `translateY(${dy}px) translateX(${sc * 10}px) rotate(${rot}deg)`,
					filter: e < 1 ? `blur(${(1 - e) * 5}px)` : undefined,
					letterSpacing: L.scatter ? `${L.spacing + sc * 0.6}em` : undefined,
				}}
			>
				{c === '　' ? '\u3000' : c}
			</span>
		);
	}
};

/** Renders whichever lyric lines are active at song time t, placed by `layout(lineIndex)`. */
export const Lyrics: React.FC<{t: number; layout: (i: number, line: LyricLine) => LyricLayout | null}> = ({t, layout}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		{LINES.map((line, i) => {
			if (t < line.start - 0.05 || t >= line.end) return null;
			const l = layout(i, line);
			return l ? <LyricText key={i} line={line} t={t} layout={l} /> : null;
		})}
	</AbsoluteFill>
);
