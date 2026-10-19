import React from 'react';
import {clamp} from '../lib/time';

// Seeded RNG (mulberry32)
export const rng = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export type Wall = {x1: number; y1: number; x2: number; y2: number; order: number};
export type MazeData = {cols: number; rows: number; walls: Wall[]; path: [number, number][]; entry: number; exit: number};

/** Perfect maze (recursive backtracker). Coordinates in cell units; path = cell centres from entry (left) to exit (right). */
export const makeMaze = (cols: number, rows: number, seed: number, entry = 0, exit?: number, corridor?: {row: number; c0: number; c1: number}): MazeData => {
	const R = rng(seed);
	const ex = exit ?? rows - 1;
	const id = (c: number, r: number) => r * cols + c;
	const open = new Set<string>(); // "a-b" passages
	const seen = new Array(cols * rows).fill(false);
	const stack: [number, number][] = [[0, entry]];
	seen[id(0, entry)] = true;
	while (stack.length) {
		const [c, r] = stack[stack.length - 1];
		const nb = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
			.map(([dc, dr]) => [c + dc, r + dr] as [number, number])
			.filter(([cc, rr]) => cc >= 0 && rr >= 0 && cc < cols && rr < rows && !seen[id(cc, rr)]);
		if (!nb.length) {
			stack.pop();
			continue;
		}
		const [nc, nr] = nb[Math.floor(R() * nb.length)];
		seen[id(nc, nr)] = true;
		const a = id(c, r);
		const b = id(nc, nr);
		open.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
		stack.push([nc, nr]);
	}
	// optional straight open corridor (for lyrics written on the floor)
	if (corridor) for (let c = corridor.c0; c < corridor.c1; c++) open.add(`${id(c, corridor.row)}-${id(c + 1, corridor.row)}`);
	const isOpen = (a: number, b: number) => open.has(`${Math.min(a, b)}-${Math.max(a, b)}`);
	// walls: horizontal segments (top of each cell) and vertical (left of each cell) + outer borders
	const segs: Wall[] = [];
	for (let r = 0; r <= rows; r++) {
		for (let c = 0; c < cols; c++) {
			const wall = r === 0 || r === rows || !isOpen(id(c, r - 1), id(c, r));
			if (wall) segs.push({x1: c, y1: r, x2: c + 1, y2: r, order: 0});
		}
	}
	for (let c = 0; c <= cols; c++) {
		for (let r = 0; r < rows; r++) {
			const door = (c === 0 && r === entry) || (c === cols && r === ex);
			const wall = !door && (c === 0 || c === cols || !isOpen(id(c - 1, r), id(c, r)));
			if (wall) segs.push({x1: c, y1: r, x2: c, y2: r + 1, order: 0});
		}
	}
	// merge collinear neighbours
	const merged: Wall[] = [];
	const horiz = segs.filter((s) => s.y1 === s.y2).sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1);
	const vert = segs.filter((s) => s.x1 === s.x2).sort((a, b) => a.x1 - b.x1 || a.y1 - b.y1);
	for (const s of horiz) {
		const last = merged[merged.length - 1];
		if (last && last.y1 === s.y1 && last.y2 === s.y2 && last.x2 === s.x1 && last.y1 === last.y2 && last.x2 - last.x1 < 3) last.x2 = s.x2;
		else merged.push({...s});
	}
	for (const s of vert) {
		const last = merged[merged.length - 1];
		if (last && last.x1 === s.x1 && last.x2 === s.x2 && last.y2 === s.y1 && last.x1 === last.x2 && last.y2 - last.y1 < 3) last.y2 = s.y2;
		else merged.push({...s});
	}
	// BFS solution
	const prev = new Array(cols * rows).fill(-1);
	const q = [id(0, entry)];
	const vis = new Array(cols * rows).fill(false);
	vis[id(0, entry)] = true;
	while (q.length) {
		const a = q.shift()!;
		const c = a % cols;
		const r = Math.floor(a / cols);
		for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
			const cc = c + dc;
			const rr = r + dr;
			if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
			const b = id(cc, rr);
			if (vis[b] || !isOpen(a, b)) continue;
			vis[b] = true;
			prev[b] = a;
			q.push(b);
		}
	}
	const path: [number, number][] = [];
	for (let a = id(cols - 1, ex); a !== -1; a = prev[a]) path.unshift([(a % cols) + 0.5, Math.floor(a / cols) + 0.5]);
	path.unshift([-0.6, entry + 0.5]);
	path.push([cols + 0.6, ex + 0.5]);
	// rise order: distance of wall midpoint from entry
	const R2 = rng(seed + 7);
	for (const w of merged) w.order = Math.hypot((w.x1 + w.x2) / 2, (w.y1 + w.y2) / 2 - entry) + R2() * 1.5;
	return {cols, rows, walls: merged, path, entry, exit: ex};
};

/** Point at arc-length fraction u along a polyline + heading angle (rad). */
export const along = (pts: [number, number][], u: number) => {
	const seg: number[] = [];
	let total = 0;
	for (let i = 1; i < pts.length; i++) {
		const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		seg.push(d);
		total += d;
	}
	let s = clamp(u) * total;
	for (let i = 0; i < seg.length; i++) {
		if (s <= seg[i] || i === seg.length - 1) {
			const k = seg[i] ? s / seg[i] : 0;
			const [x0, y0] = pts[i];
			const [x1, y1] = pts[i + 1];
			return {x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, ang: Math.atan2(y1 - y0, x1 - x0), total};
		}
		s -= seg[i];
	}
	return {x: pts[pts.length - 1][0], y: pts[pts.length - 1][1], ang: 0, total};
};

/** Paper walls standing on a Floor sheet. cell = px per cell; (ox,oy) sheet offset of cell (0,0). rise(order) -> 0..1 */
export const MazeWalls: React.FC<{
	maze: MazeData;
	cell: number;
	ox: number;
	oy: number;
	h: number;
	rise: (order: number) => number;
	tex?: string;
	tone?: string;
	opacity?: number;
	children?: (w: Wall, i: number) => React.ReactNode;
}> = ({maze, cell, ox, oy, h, rise, tex, tone = '#efe6d2', opacity = 1, children}) => (
	<>
		{maze.walls.map((w, i) => {
			const r = clamp(rise(w.order), -0.15, 1.15);
			if (r <= 0.001) return null;
			const x1 = ox + w.x1 * cell;
			const y1 = oy + w.y1 * cell;
			const len = Math.hypot(w.x2 - w.x1, w.y2 - w.y1) * cell;
			const ang = Math.atan2(w.y2 - w.y1, w.x2 - w.x1);
			const facing = Math.abs(Math.cos(ang)) > 0.5; // horizontal walls face the camera
			return (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: x1 - 2,
						top: y1 - h,
						width: len + 4,
						height: h,
						transformOrigin: '2px 100%',
						transform: `translateZ(1px) rotateZ(${ang}rad) rotateX(${-90 * r}deg)`,
						background: tex
							? `linear-gradient(to bottom, rgba(255,240,210,0.25), rgba(0,0,0,0) 30%, rgba(40,20,5,0.35)), url(${tex}) ${(i * 137) % 900}px 0 / 900px auto, ${tone}`
							: `linear-gradient(to bottom, ${tone}, #cdbf9f)`,
						filter: `brightness(${facing ? 1 : 0.8})`,
						boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -3px 6px rgba(60,30,10,0.25)',
						opacity,
						overflow: 'hidden',
					}}
				>
					{children ? children(w, i) : null}
				</div>
			);
		})}
	</>
);

/** Pencil line drawn along a polyline (sheet plane). p = 0..1 progress. */
export const PencilPath: React.FC<{pts: [number, number][]; p: number; w: number; h: number; width: number; color?: string; id: string; text?: string; textSize?: number; font?: string}> = ({
	pts,
	p,
	w,
	h,
	width,
	color = '#2c2926',
	id,
	text,
	textSize = 40,
	font = 'Mincho',
}) => {
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
	let len = 0;
	for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
	return (
		<svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, transform: 'translateZ(1.5px)', overflow: 'visible'}}>
			<defs>
				<filter id={`pp-${id}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={5} result="n" />
					<feDisplacementMap in="SourceGraphic" in2="n" scale={width * 0.6} xChannelSelector="R" yChannelSelector="G" />
				</filter>
				<path id={`path-${id}`} d={d} />
				<mask id={`m-${id}`}>
					<path d={d} fill="none" stroke="#fff" strokeWidth={textSize * 2.4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={(1 - p) * len} />
				</mask>
			</defs>
			<path
				d={d}
				fill="none"
				stroke={color}
				strokeWidth={width}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={len}
				strokeDashoffset={(1 - p) * len}
				opacity={0.85}
				filter={`url(#pp-${id})`}
			/>
			{text ? (
				<g mask={`url(#m-${id})`}>
					<text fontFamily={font} fontSize={textSize} fill={color} opacity={0.8} dy={-textSize * 0.45} letterSpacing={textSize * 0.25}>
						<textPath href={`#path-${id}`} startOffset={textSize * 1.5}>
							{text}
						</textPath>
					</text>
				</g>
			) : null}
		</svg>
	);
};
