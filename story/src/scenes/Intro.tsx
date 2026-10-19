import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {PageView} from '../components/PageView';
import {Stage, Floor} from '../components/Stage';
import {StandOnSheet} from '../components/Sheet';
import {NB, NotebookPage} from '../components/Notebook';
import {PlateShot} from './PlateStill';
import {Cut} from '../components/Cut';
import {LightBand, TiltShift, Wash} from '../components/Overlays';
import {cut, img} from '../lib/assets';
import {NB0} from '../lib/texts';
import contours from '../data/contours.json';
import {boil, clamp, easeInOut, easeOut, inv, lerp, springT, stepT, W, H} from '../lib/time';

// The flat paper mouse on the S01 page, in plate px.
const M = {x: 929, y: 260, w: 503, h: 560};
const SC = 1.3; // page scale
const P = (fx: number, fy: number) => [(M.x + fx * M.w) * SC, (M.y + fy * M.h) * SC];
const OUT = (contours as Record<string, number[][]>).cut_mouse_flat.map(([x, y]) => P(x, y));
const EYE1 = {fx: 0.66, fy: 0.215, r: 10};
const EYE2 = {fx: 0.565, fy: 0.19, r: 14};

const polyLen = (pts: number[][]) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
const pointAt = (pts: number[][], u: number) => {
	let s = clamp(u) * polyLen(pts);
	for (let i = 1; i < pts.length; i++) {
		const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		if (s <= d) return [pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * s) / d, pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * s) / d];
		s -= d;
	}
	return pts[pts.length - 1];
};

/** A hand-held tool cut-out positioned so its tip sits at page point (x,y). */
const Tool: React.FC<{name: string; x: number; y: number; h: number; tip: [number, number]; opacity?: number}> = ({name, x, y, h, tip, opacity = 1}) => {
	const c = cut(name);
	const w = (h * c.w) / c.h;
	return (
		<div style={{position: 'absolute', left: x - tip[0] * w, top: y - tip[1] * h, width: w, height: h, opacity, filter: 'drop-shadow(22px 30px 18px rgba(15,8,2,0.5))'}}>
			<Img src={c.src} style={{width: '100%', height: '100%'}} />
		</div>
	);
};

const CrayonDot: React.FC<{x: number; y: number; r: number; p: number; fade?: number}> = ({x, y, r, p, fade = 1}) =>
	p > 0 ? (
		<div
			style={{
				position: 'absolute',
				left: x - r * p,
				top: y - r * p * 0.92,
				width: 2 * r * p,
				height: 2 * r * p * 0.92,
				borderRadius: '48% 52% 46% 54%',
				background: 'radial-gradient(circle at 40% 35%, #3a3634 0%, #151312 60%, #0c0b0a 100%)',
				opacity: 0.92 * fade,
				filter: 'url(#crayon)',
			}}
		/>
	) : null;

const CrayonFilter = () => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<filter id="crayon">
			<feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves={2} seed={8} result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</svg>
);

/** The cut paper mouse lying on the page (with heart and eyes as they get added). */
const FlatMouse: React.FC<{lift: number; heart: number; eye1: number; eye2: number; rot?: number}> = ({lift, heart, eye1, eye2, rot = 0}) => {
	const [x0, y0] = P(0, 0);
	const w = M.w * SC;
	const h = M.h * SC;
	const hs = lerp(2.3, 1, heart);
	return (
		<div style={{position: 'absolute', left: x0, top: y0, width: w, height: h, transform: `rotate(${rot}deg) scale(${1 + lift * 0.03})`}}>
			<Img
				src={cut('cut_mouse_flat').src}
				style={{width: '100%', height: '100%', filter: `drop-shadow(${4 + lift * 14}px ${6 + lift * 18}px ${4 + lift * 14}px rgba(20,10,3,${0.35 + lift * 0.2}))`}}
			/>
			{heart > 0 ? (
				<Img
					src={cut('cut_hearts_1').src}
					style={{
						position: 'absolute',
						left: 0.55 * w - (0.1 * w * hs),
						top: 0.47 * h - (0.1 * w * hs * 0.95),
						width: 0.2 * w * hs,
						height: 0.2 * w * hs * 0.95,
						filter: `drop-shadow(${(hs - 1) * 30 + 3}px ${(hs - 1) * 40 + 4}px ${(hs - 1) * 20 + 3}px rgba(20,10,3,0.45))`,
					}}
				/>
			) : null}
			<CrayonDot x={EYE1.fx * w} y={EYE1.fy * h} r={EYE1.r * SC} p={eye1} />
			<CrayonDot x={EYE2.fx * w} y={EYE2.fy * h} r={EYE2.r * SC} p={eye2} />
		</div>
	);
};

// S01 0:00-0:07 lamp on; the mouse is cut out of the diary page; a red heart is given.
export const S01: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const flick = [0.15, 0.85, 0.35, 1];
	const light = t < 0.5 ? 0 : t < 0.66 ? flick[Math.min(3, Math.floor((t - 0.5) / 0.04))] : 1;
	const u1 = easeInOut(inv(0.6, 3.8, t));
	const u2 = easeInOut(inv(3.8, 7.13, t));
	const zoom = t < 3.8 ? lerp(1.0, 1.07, u1) : lerp(1.07, 1.45, u2);
	const fx = t < 3.8 ? lerp(700, 760, u1) : lerp(760, 1180, u2);
	const fy = t < 3.8 ? lerp(430, 440, u1) : lerp(440, 545, u2);
	const cutU = easeInOut(inv(3.95, 6.0, st));
	const cutDone = st >= 6.0;
	const total = polyLen(OUT);
	const tip = pointAt(OUT, cutU);
	const heart = st < 6.25 ? 0 : clamp((st - 6.25) / 0.33);
	return (
		<PageView t={t} lines={NB0} id="nb0" scale={SC} zoom={zoom} fx={fx} fy={fy} light={light}>
			<CrayonFilter />
			<svg width={NB.w * SC} height={NB.h * SC} style={{position: 'absolute', left: 0, top: 0}}>
				<path d={OUT.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')} fill="none" stroke="#4a4642" strokeWidth={3.2} strokeDasharray="14 7" opacity={cutDone ? 0 : 0.55} />
				<path
					d={OUT.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')}
					fill="none"
					stroke="#2a2420"
					strokeWidth={2.4}
					strokeDasharray={total}
					strokeDashoffset={(1 - cutU) * total}
					opacity={cutDone ? 0 : 0.9}
				/>
			</svg>
			{cutDone ? <FlatMouse lift={easeOut(inv(6.0, 6.4, st))} heart={heart > 0 ? easeOut(heart) : 0} eye1={0} eye2={0} rot={-2 * easeOut(inv(6.0, 6.4, st))} /> : null}
			{st > 3.85 && st < 6.1 ? <Tool name="cut_hand_scissors" x={tip[0]} y={tip[1]} h={560 * SC} tip={[0.04, 0.9]} /> : null}
		</PageView>
	);
};

// S02 0:07-0:13 crayon draws the eyes (macro), then the mouse's first look (POV).
export const S02: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	if (t >= 10.43) {
		const p = inv(10.43, 13.73, t);
		const focus = easeOut(inv(10.5, 11.9, t));
		const iris = easeOut(inv(10.43, 11.0, t));
		return (
			<AbsoluteFill style={{background: '#000'}}>
				<AbsoluteFill style={{clipPath: `circle(${iris * 120}% at 50% 50%)`}}>
					<PlateShot name="s02_pov2" p={p} from={{s: 1.14, x: 20, y: 10}} to={{s: 1.04, x: -10, y: 0}} filter={`blur(${lerp(18, 1.5, focus)}px)`} bloom={0.45} />
					<Wash color="rgba(255,170,90,0.12)" mode="screen" />
				</AbsoluteFill>
			</AbsoluteFill>
		);
	}
	const e1 = [P(EYE1.fx, EYE1.fy)[0], P(EYE1.fx, EYE1.fy)[1]];
	const e2 = [P(EYE2.fx, EYE2.fy)[0], P(EYE2.fx, EYE2.fy)[1]];
	const off = [2300, 200];
	let tip = off;
	if (st < 8.3) tip = [lerp(off[0], e1[0], easeOut(inv(7.3, 8.3, st))), lerp(off[1], e1[1], easeOut(inv(7.3, 8.3, st)))];
	else if (st < 8.9) tip = e1;
	else if (st < 9.3) tip = [lerp(e1[0], e2[0], easeInOut(inv(8.9, 9.3, st))), lerp(e1[1], e2[1], easeInOut(inv(8.9, 9.3, st)))];
	else if (st < 9.7) tip = e2;
	else tip = [lerp(e2[0], off[0], easeInOut(inv(9.7, 10.4, st))), lerp(e2[1], off[1], easeInOut(inv(9.7, 10.4, st)))];
	const press = (st > 8.3 && st < 8.8) || (st > 9.3 && st < 9.7) ? boil(t, 3, 3) : 0;
	const eye1 = st < 8.42 ? 0 : st < 8.58 ? 0.6 : 1;
	const eye2 = st < 9.42 ? 0 : st < 9.58 ? 0.55 : 1;
	// after the second eye: rush into it (the big dot fills the frame), then we see through it
	const rush = inv(9.75, 10.43, t);
	const rushE = rush * rush * rush;
	// eye centre, including the mouse's 3% 'lift' scale about its centre
	const eyeP = [M.x + (0.5 + (EYE2.fx - 0.5) * 1.03) * M.w, M.y + (0.5 + (EYE2.fy - 0.5) * 1.03) * M.h];
	const aim = easeInOut(inv(9.55, 10.1, t));
	const zoom = lerp(2.5, 2.75, inv(7.13, 9.75, t)) * Math.pow(48, rushE);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<PageView
				t={t}
				lines={NB0}
				id="nb0b"
				scale={SC}
				zoom={zoom}
				fx={lerp(1215, eyeP[0], aim)}
				fy={lerp(420, eyeP[1], aim)}
				sx={lerp(W * 0.52, W / 2, aim)}
				sy={H * 0.5}
			>
				<CrayonFilter />
				<FlatMouse lift={1} heart={1} eye1={eye1} eye2={eye2} rot={0} />
				<Tool name="cut_hand_crayon" x={tip[0] + press} y={tip[1] + press} h={520 * SC} tip={[0.02, 0.93]} />
			</PageView>
			<AbsoluteFill style={{background: '#000', opacity: clamp((rush - 0.72) / 0.28)}} />
		</AbsoluteFill>
	);
};

// S03 0:13-0:20 the mouse stands up; a paper sky pops up behind it; clouds drift in the wind.
const S = 2;
const PW = NB.w * S;
const PH = NB.h * S;
export const S03: React.FC<{t: number}> = ({t}) => {
	const u = easeInOut(inv(13.73, 20.43, t));
	const cam = {x: lerp(80, 0, u), y: lerp(-230, -560, u), z: lerp(240, -150, u), dist: lerp(1050, 2650, u), tilt: lerp(10, 7, u), persp: 1500};
	const mouseUp = clamp(springT(t - 14.1, 1.4, 0.3), -0.2, 1.2);
	const skyUp = clamp(springT(t - 15.05, 1.2, 0.32), -0.2, 1.2);
	const clouds = [
		{n: 'cut_clouds_1', x: 900, y: 420, e: 820, t0: 15.9, h: 360},
		{n: 'cut_clouds_2', x: 2350, y: 300, e: 980, t0: 16.3, h: 420},
		{n: 'cut_clouds_3', x: 1750, y: 640, e: 760, t0: 16.7, h: 340},
	];
	return (
		<AbsoluteFill style={{background: '#100b08'}}>
			<TiltShift blur={lerp(6, 2.5, u)} focus={lerp(66, 58, u)} band={lerp(14, 24, u)}>
				<Stage cam={cam}>
					<Floor w={9000} d={5600} y={4} src={img('plate_desk_top').src} filter="brightness(0.75)" />
					<Floor w={PW} d={PH} y={2}>
						<NotebookPage src={img('plate_notebook').src} scale={S} lines={[]} t={t} id="s03" />
						<StandOnSheet src={img('plate_sky_back').src} w={PW} h={PH} x={PW / 2} y={0} lie={1 - skyUp} shadow={0} contact={0} shade={0.1} />
						{clouds.map((c, i) => {
							const drop = clamp(springT(t - c.t0, 1.1, 0.35), 0, 1.15);
							if (drop <= 0) return null;
							const cc = cut(c.n);
							return (
								<StandOnSheet
									key={i}
									src={cc.src}
									w={(c.h * cc.w) / cc.h}
									h={c.h}
									x={c.x - (t - 15) * 70 * (1 + i * 0.3)}
									y={c.y}
									elev={c.e + (1 - drop) * 900}
									tiltZ={Math.sin(t * 1.3 + i) * 4}
									shadow={0}
									shade={0.05}
								/>
							);
						})}
						<StandOnSheet src={cut('cut_mouse_crude_stand').src} w={470} h={545} x={1672} y={1150} lie={1 - mouseUp} tiltZ={boil(t, 4, 0.8)} shadowSkew={-24} />
					</Floor>
				</Stage>
			</TiltShift>
			<Wash color="rgba(255,190,120,0.16)" mode="soft-light" />
			<LightBand p={inv(14, 22, t)} opacity={0.12} angle={22} />
		</AbsoluteFill>
	);
};

// S04 0:20-0:27 night stage, paper moon and stars; Charlie and the mouse asleep.
export const S04: React.FC<{t: number}> = ({t}) => {
	const p = inv(20.43, 27.97, t);
	const stars = [
		{n: 'cut_stars_1', x: 210, top: -40, h: 300},
		{n: 'cut_stars_3', x: 610, top: -90, h: 250},
		{n: 'cut_stars_5', x: 1500, top: -60, h: 280},
		{n: 'cut_stars_6', x: 1790, top: -120, h: 330},
	];
	return (
		<AbsoluteFill>
			<PlateShot name="s04_night" p={p} from={{s: 1.1, x: 40, y: 0}} to={{s: 1.05, x: -40, y: -10}} bloom={0.2} />
			{stars.map((s, i) => (
				<Cut
					key={i}
					name={s.n}
					x={s.x - p * 40}
					y={s.top}
					h={s.h}
					anchor="top"
					origin="50% 0%"
					rot={Math.sin(stepT(t, 8) * 1.1 + i * 1.7) * 7}
					shadow={0.25}
					filter="blur(2.5px) brightness(0.9)"
				/>
			))}
			<Wash color="radial-gradient(ellipse 50% 40% at 24% 30%, rgba(150,180,255,0.18), rgba(0,0,0,0) 70%)" mode="screen" />
			<Wash color="rgba(40,60,120,0.18)" mode="soft-light" />
		</AbsoluteFill>
	);
};
