import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Stage, Floor, Cam} from '../components/Stage';
import {StandOnSheet} from '../components/Sheet';
import {NB, NotebookPage, Handwriting} from '../components/Notebook';
import {makeMaze, MazeWalls, PencilPath, along, MazeData} from '../components/Maze';
import {Cut} from '../components/Cut';
import {Rain, TiltShift, Wash, LightBand} from '../components/Overlays';
import {cut, img} from '../lib/assets';
import {MAZE_NOTE, WALL_TEXT} from '../lib/texts';
import {LINES, LyricLine} from '../components/Lyrics';
import {boil, clamp, easeInOut, easeOut, inv, lerp, springT, stepT} from '../lib/time';

const S = 2;
const PW = NB.w * S;
const PH = NB.h * S;
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({
	x: lerp(a.x, b.x, u),
	y: lerp(a.y, b.y, u),
	z: lerp(a.z, b.z, u),
	dist: lerp(a.dist, b.dist, u),
	tilt: lerp(a.tilt, b.tilt, u),
	persp: a.persp,
});
// sheet px -> world (sheet centred at origin)
const W3 = (x: number, y: number) => [x - PW / 2, y - PH / 2];

type Layout = {maze: MazeData; cell: number; ox: number; oy: number};
const layout = (cols: number, rows: number, seed: number, cell: number, oy?: number, corridor?: {row: number; c0: number; c1: number}): Layout => {
	const maze = makeMaze(cols, rows, seed, Math.floor(rows / 2), Math.floor(rows / 2), corridor);
	return {maze, cell, ox: (PW - cols * cell) / 2, oy: oy ?? (PH - rows * cell) / 2};
};
const pathPx = (L: Layout, off = 0, extra: [number, number][] = []) =>
	[...L.maze.path, ...extra].map(([x, y]) => [L.ox + (x + off) * L.cell, L.oy + (y + off) * L.cell] as [number, number]);

/** Paper mouse seen from above, lying on the sheet, heading `ang`. */
const TopMouse: React.FC<{x: number; y: number; ang: number; len: number; filter?: string}> = ({x, y, ang, len, filter = ''}) => {
	const c = cut('cut_mouse_top');
	const h = (len * c.h) / c.w;
	return (
		<div style={{position: 'absolute', left: x - len / 2, top: y - h / 2, width: len, height: h, transform: `translateZ(3px) rotate(${ang}rad)`}}>
			<Img src={c.src} style={{width: '100%', height: '100%', filter: `drop-shadow(6px 8px 6px rgba(20,10,3,0.45)) ${filter}`}} />
		</div>
	);
};

/** Lyric written on the maze floor along an open corridor, revealed in time with the singing. */
const FloorLyric: React.FC<{line: LyricLine; t: number; x: number; y: number; w: number; size: number}> = ({line, t, x, y, w, size}) => {
	const chars = Array.from(line.text);
	const step = w / chars.length;
	const exit = clamp((line.end - t) / 0.6);
	return (
		<div style={{position: 'absolute', left: x, top: y - size * 0.6, width: w, height: size * 1.3, transform: 'translateZ(1.6px)', opacity: exit}}>
			{chars.map((c, i) => {
				const at = line.times?.[i] ?? line.start + i * 0.3;
				const p = clamp((t - at + 0.06) / 0.25);
				return (
					<span
						key={i}
						style={{position: 'absolute', left: i * step, top: 0, width: step, textAlign: 'center', fontFamily: 'Mincho', fontSize: size, lineHeight: 1.2, color: '#2a2420', opacity: 0.88 * p, transform: `translateY(${(1 - p) * 10}px)`, filter: p < 1 ? `blur(${(1 - p) * 4}px)` : undefined}}
					>
						{c}
					</span>
				);
			})}
		</div>
	);
};

const Desk: React.FC = () => <Floor w={9000} d={5600} y={4} src={img('plate_desk_top').src} filter="brightness(0.75)" />;

// ---------------------------------------------------------------- S08 + S09: the maze race (mouse wins)
const CORR = {row: 1, c0: 4, c1: 8};
const RACE = layout(9, 5, 11, 230, 560, CORR);
export const MazeRace: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const L = RACE;
	const rise = (o: number) => clamp(springT(t - (50.85 + Math.floor(o / 1.4) * 0.209), 1.6, 0.32), -0.15, 1.15);
	const top = t >= 54.75;
	const mazeMid = W3(L.ox + (L.maze.cols * L.cell) / 2, L.oy + (L.maze.rows * L.cell) / 2);
	const entry = W3(L.ox - 120, L.oy + (L.maze.entry + 0.5) * L.cell);
	let cam: Cam;
	if (!top) {
		const u = easeInOut(inv(50.71, 54.75, t));
		cam = camLerp(
			{x: entry[0] + 260, y: -200, z: entry[1] + 40, dist: 1250, tilt: 13, persp: 1500},
			{x: entry[0] + 700, y: -260, z: entry[1] - 80, dist: 1900, tilt: 24, persp: 1500},
			u,
		);
	} else {
		const u = easeInOut(inv(62.4, 65.0, t));
		cam = camLerp({x: mazeMid[0], y: 0, z: mazeMid[1], dist: 2350, tilt: 86, persp: 1500}, {x: 0, y: 0, z: 40, dist: 3900, tilt: 82, persp: 1500}, u);
		cam.dist += lerp(80, 0, inv(54.75, 57, t));
	}
	const pencil = pathPx(L, 0.14);
	const mousePts = pathPx(L, -0.14);
	const pp = inv(55.4, 63.3, t);
	const mu = easeInOut(inv(55.5, 61.1, st));
	const m = along(mousePts, mu);
	return (
		<AbsoluteFill style={{background: '#0d0907'}}>
			<TiltShift blur={top ? 0 : 5} focus={62} band={20}>
				<Stage cam={cam}>
					<Desk />
					<Floor w={PW} d={PH} y={2}>
						<NotebookPage src={img('plate_notebook').src} scale={S} lines={[]} t={t} id="race" />
						<Handwriting lines={MAZE_NOTE} t={t} scale={S} id="racenote" />
						<MazeWalls maze={L.maze} cell={L.cell} ox={L.ox} oy={L.oy} h={130} rise={rise} tex={img('plate_notebook').src} />
						{top ? (
							<>
								<PencilPath pts={pencil} p={pp} w={PW} h={PH} width={9} id="racepen" />
								<FloorLyric
									line={LINES[8]}
									t={t}
									x={L.ox + (CORR.c0 + 0.12) * L.cell}
									y={L.oy + (CORR.row + 0.5) * L.cell}
									w={(CORR.c1 - CORR.c0 + 0.76) * L.cell}
									size={66}
								/>
								<TopMouse x={m.x} y={m.y} ang={st > 61.1 ? Math.PI : m.ang} len={230} />
							</>
						) : (
							<>
								<StandOnSheet src={cut('cut_charlie_stand').src} w={250} h={540} x={L.ox - 230} y={L.oy + (L.maze.entry + 0.2) * L.cell} tiltZ={boil(t, 2, 0.7)} />
								<StandOnSheet src={cut('cut_mouse_crude_stand').src} w={170} h={200} x={L.ox - 70} y={L.oy + (L.maze.entry + 0.85) * L.cell} tiltZ={boil(t, 5, 1.2)} />
							</>
						)}
					</Floor>
				</Stage>
			</TiltShift>
			<Wash color="rgba(255,180,100,0.14)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S19: the root maze (Charlie's line wins and runs off the page)
const ROOTS = layout(9, 5, 29, 230, 380);
export const RootRace: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const L = ROOTS;
	const extra: [number, number][] = [
		[L.maze.cols + 2.5, L.maze.exit + 0.5],
		[L.maze.cols + 3.4, L.maze.exit - 0.6],
		[L.maze.cols + 6, L.maze.exit - 0.9],
	];
	const pencil = pathPx(L, 0.12, extra);
	const mousePts = pathPx(L, -0.14);
	const pp = easeOut(inv(118.5, 124.2, t));
	const mu = inv(118.7, 127.3, st) * 0.72;
	const stopped = st > 124.8;
	const m = along(mousePts, stopped ? (124.8 - 118.7) / (127.3 - 118.7) * 0.72 : mu);
	const mid = W3(L.ox + (L.maze.cols * L.cell) / 2, L.oy + (L.maze.rows * L.cell) / 2);
	const u = easeInOut(inv(121.5, 126.8, t));
	const cam: Cam = {x: lerp(mid[0] - 150, mid[0] + 900, u), y: 0, z: mid[1], dist: lerp(2500, 2900, u), tilt: lerp(78, 84, inv(118.22, 122, t)), persp: 1500};
	return (
		<AbsoluteFill style={{background: '#0d0907'}}>
			<Stage cam={cam}>
				<Desk />
				<Floor w={PW} d={PH} y={2}>
					<NotebookPage src={img('plate_graph').src} scale={S} lines={[]} t={t} id="roots" filter="sepia(0.25) brightness(1.02)" />
					<MazeWalls maze={L.maze} cell={L.cell} ox={L.ox} oy={L.oy} h={170} rise={() => 1} tex={img('plate_roots').src} tone="#e9d6ae" />
					<PencilPath pts={pencil} p={pp} w={PW} h={PH} width={7} id="rootpen" color="#1f1c1a" />
					<TopMouse x={m.x} y={m.y} ang={stopped ? m.ang - 0.6 : m.ang} len={190} filter="sepia(0.2)" />
				</Floor>
			</Stage>
			<Wash color="rgba(255,190,90,0.22)" mode="soft-light" />
			<Wash color="radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,210,140,0.18), rgba(0,0,0,0) 70%)" mode="screen" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S21: walls of formulas rise around Charlie
const WALLS = layout(7, 5, 5, 300, 330);
export const FormulaWalls: React.FC<{t: number}> = ({t}) => {
	const L = WALLS;
	const st = stepT(t);
	const rise = (o: number) => clamp(springT(st - (134.4 + o * 0.11), 2.2, 0.35), -0.1, 1.1);
	const cx = L.ox + 3.5 * L.cell;
	const cy = L.oy + 2.6 * L.cell;
	const c = W3(cx, cy);
	const u = easeInOut(inv(135.6, 140.7, t));
	const cam: Cam = {x: lerp(c[0], c[0], u), y: lerp(-300, 0, u), z: lerp(c[1] + 60, c[1] - 200, u), dist: lerp(1300, 3900, u), tilt: lerp(9, 86, u), persp: 1500};
	return (
		<AbsoluteFill style={{background: '#06080c'}}>
			<Stage cam={cam}>
				<Desk />
				<Floor w={PW} d={PH} y={2}>
					<NotebookPage src={img('plate_notebook').src} scale={S} lines={[]} t={t} id="walls" filter="brightness(0.7) saturate(0.4)" />
					<MazeWalls
						maze={L.maze}
						cell={L.cell}
						ox={L.ox}
						oy={L.oy}
						h={420}
						rise={rise}
						tex={img('plate_notebook').src}
						tone="#dfe3e6"
					>
						{(w, i) => (
							<div style={{position: 'absolute', inset: 0, padding: '18px 14px', fontFamily: 'WenKai', fontSize: 30, lineHeight: 1.65, color: '#25292e', opacity: 0.8, whiteSpace: 'nowrap'}}>
								{[0, 1, 2, 3, 4, 5, 6].map((k) => (
									<div key={k} style={{marginLeft: -((i * 97 + k * 61) % 400)}}>
										{WALL_TEXT[(i + k) % WALL_TEXT.length]}　{WALL_TEXT[(i + k + 2) % WALL_TEXT.length]}
									</div>
								))}
							</div>
						)}
					</MazeWalls>
					<StandOnSheet src={cut('cut_charlie_stand').src} w={250} h={540} x={cx} y={cy} tiltZ={boil(t, 3, 0.5)} shadowLen={0.25} shadowSkew={0} />
				</Floor>
			</Stage>
			<Wash color="linear-gradient(to bottom, rgba(190,215,255,0.35), rgba(0,0,0,0) 60%)" mode="screen" />
			<Wash color="rgba(70,100,150,0.35)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S22: the mouse slows down in a graph-paper maze; rain; a pencil hesitates
const CAGE = layout(6, 3, 7, 300, 900);
export const SlowMouse: React.FC<{t: number}> = ({t}) => {
	const L = CAGE;
	const s6 = stepT(t, 6);
	const pts = pathPx(L, 0);
	// forward, bump (back a little), forward again, stop
	const k = s6 - 140.9;
	const prog = k < 2.4 ? k * 0.09 : k < 2.9 ? 0.216 - (k - 2.4) * 0.06 : k < 5.4 ? 0.186 + (k - 2.9) * 0.05 : 0.31;
	const m = along(pts, prog);
	const back = k > 2.4 && k < 2.9;
	const heading = Math.cos(m.ang) < 0;
	const u = easeInOut(inv(140.89, 148.24, t));
	const c = W3(m.x, m.y);
	const cam: Cam = {x: lerp(c[0] - 200, c[0], u), y: -420, z: lerp(c[1] + 300, c[1] + 100, u), dist: lerp(2100, 1600, u), tilt: 13, persp: 1500};
	return (
		<AbsoluteFill style={{background: '#0b0c0e'}}>
			<TiltShift blur={6} focus={60} band={16}>
				<Stage cam={cam}>
					<Desk />
					<Floor w={PW} d={PH} y={2}>
						<NotebookPage src={img('plate_graph').src} scale={S} lines={[]} t={t} id="cage" filter="saturate(0.5) brightness(0.85)" />
						<StandOnSheet src={img('plate_rain_window').src} w={PW * 1.9} h={PH * 1.9} x={PW / 2} y={-700} shadow={0} contact={0} shade={0} blur={3} />
						<MazeWalls maze={L.maze} cell={L.cell} ox={L.ox} oy={L.oy} h={120} rise={() => 1} tex={img('plate_graph').src} tone="#e2e0d6" />
						<StandOnSheet
							src={cut('cut_mouse_run').src}
							w={300}
							h={160}
							x={m.x}
							y={m.y + 30}
							flipX={heading !== back}
							tiltZ={back ? 6 : boil(t, 8, 1.5, 6)}
						/>
					</Floor>
				</Stage>
			</TiltShift>
			<Rain t={t} opacity={0.18} />
			<Cut name="cut_hand_pencil" x={1560 + Math.sin(t * 1.3) * 12} y={-60 + Math.sin(t * 0.9) * 8} h={520} anchor="top" shadow={0.5} shadowDx={60} shadowDy={110} filter="brightness(0.8) saturate(0.6)" />
			<Wash color="rgba(80,100,130,0.35)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S30: he walks into the maze, unafraid; the walls fade back into pencil lines
const CALM = layout(9, 5, 41, 230, 560);
export const CalmMaze: React.FC<{t: number}> = ({t}) => {
	const L = CALM;
	const st = stepT(t);
	const pts = pathPx(L, 0);
	const u = inv(198.4, 207.8, st) * 0.62;
	const p = along(pts, u);
	const c = W3(p.x, p.y);
	const mid = W3(L.ox + (L.maze.cols * L.cell) / 2, L.oy + (L.maze.rows * L.cell) / 2);
	const v = easeInOut(inv(199.5, 207.6, t));
	const cam: Cam = {x: lerp(c[0] + 150, mid[0], v), y: lerp(-260, 0, v), z: lerp(c[1] + 120, mid[1], v), dist: lerp(1350, 3800, v), tilt: lerp(18, 84, v), persp: 1500};
	const fade = 1 - easeInOut(inv(201.5, 206, t));
	const goingLeft = Math.cos(p.ang) < -0.3;
	return (
		<AbsoluteFill style={{background: '#0d0907'}}>
			<Stage cam={cam}>
				<Desk />
				<Floor w={PW} d={PH} y={2}>
					<NotebookPage src={img('plate_notebook').src} scale={S} lines={[]} t={t} id="calm" />
					<svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0, transform: 'translateZ(1px)'}}>
						{L.maze.walls.map((w, i) => (
							<line key={i} x1={L.ox + w.x1 * L.cell} y1={L.oy + w.y1 * L.cell} x2={L.ox + w.x2 * L.cell} y2={L.oy + w.y2 * L.cell} stroke="#3a3632" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
						))}
					</svg>
					<MazeWalls maze={L.maze} cell={L.cell} ox={L.ox} oy={L.oy} h={140} rise={() => 1} tex={img('plate_notebook').src} opacity={fade} />
					<StandOnSheet
						src={cut('cut_charlie_walk').src}
						w={150}
						h={250}
						x={p.x}
						y={p.y + 20}
						flipX={goingLeft}
						tiltZ={boil(t, 6, 1.5)}
						shadowLen={0.35}
					/>
				</Floor>
			</Stage>
			<Wash color="rgba(255,205,150,0.2)" mode="soft-light" />
			<LightBand p={inv(196, 210, t)} opacity={0.1} />
		</AbsoluteFill>
	);
};
