import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {NotebookPage, NB, HandLine} from '../components/Notebook';
import {PageView} from '../components/PageView';
import {PlateShot} from './PlateStill';
import {Cut, cutW} from '../components/Cut';
import {Wash} from '../components/Overlays';
import {cut, img} from '../lib/assets';
import {DENSE, NB_SLANT, NB4} from '../lib/texts';
import {boil, clamp, easeInOut, easeOut, hash, inv, lerp, stepT, W, H} from '../lib/time';

// ---------------------------------------------------------------- S20a fast flip through the genius pages
const IQChart: React.FC<{scale: number}> = ({scale}) => (
	<svg width={NB.w * scale} height={NB.h * scale} style={{position: 'absolute', left: 0, top: 0}}>
		<g transform={`translate(${1120 * scale} ${200 * scale}) scale(${scale})`} fill="none" stroke="#2c2a28" strokeWidth={2.2} opacity={0.75}>
			<path d="M0 0 V300 H460" />
			<path d="M0 290 C120 280 160 60 260 40" />
			<path d="M260 40 C330 30 380 200 455 290" strokeDasharray="8 7" />
			<text x={8} y={-12} fontFamily="MinchoM" fontSize={22} fill="#2c2a28" stroke="none">IQ</text>
			<text x={420} y={325} fontFamily="MinchoM" fontSize={22} fill="#2c2a28" stroke="none">t</text>
			<text x={270} y={30} fontFamily="WenKai" fontSize={22} fill="#2c2a28" stroke="none">？</text>
		</g>
	</svg>
);
export const S20a: React.FC<{t: number}> = ({t}) => {
	const sc = 1.2;
	const turns = [127.75, 128.45];
	const k = t < turns[0] ? 0 : t < turns[1] ? 1 : 2;
	const zoom = lerp(1.0, 1.55, easeInOut(inv(128.9, 129.95, t)));
	const page = (i: number) => (
		<div style={{position: 'absolute', inset: 0}}>
			<NotebookPage src={img('plate_notebook').src} scale={sc} lines={DENSE[i]} t={t} id={`dense${i}`} />
			{i === 1 ? <IQChart scale={sc} /> : null}
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#0d0907', overflow: 'hidden'}}>
			<AbsoluteFill style={{perspective: 2200, transform: `scale(${zoom})`, transformOrigin: '30% 72%'}}>
				<div style={{position: 'absolute', left: (W - NB.w * sc) / 2, top: (H - NB.h * sc) / 2, width: NB.w * sc, height: NB.h * sc, transformStyle: 'preserve-3d'}}>
					{page(Math.min(2, k + 1))}
					{[0, 1].map((i) =>
						k <= i ? (
							<div key={i} style={{position: 'absolute', inset: 0, transformOrigin: '0% 50%', transform: `rotateY(${-178 * easeInOut(inv(turns[i] - 0.3, turns[i], t))}deg)`, backfaceVisibility: 'hidden', zIndex: 3 - i}}>
								{page(i)}
							</div>
						) : null,
					)}
				</div>
			</AbsoluteFill>
			<Wash color="rgba(200,215,240,0.12)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S20b the cold paper city: he strides ahead, the mouse falls behind, she recedes
const Strip: React.FC<{name: string; y: number; h: number; offset: number; filter?: string}> = ({name, y, h, offset, filter}) => {
	const w = cutW(name, h);
	const n = Math.ceil(W / w) + 2;
	const x = -(((offset % w) + w) % w);
	return (
		<div style={{position: 'absolute', left: x, top: y - h, height: h, width: n * w, display: 'flex', filter}}>
			{Array.from({length: n}).map((_, i) => (
				<Img key={i} src={cut(name).src} style={{height: h, width: w, marginLeft: i ? -2 : 0}} />
			))}
		</div>
	);
};
export const S20b: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const d = st - 129.9;
	const bob = Math.floor(st * 12) % 2;
	const alice = easeInOut(inv(130.4, 134.2, t));
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<PlateShot name="plate_city_sky" p={inv(129.9, 134.3, t)} from={{s: 1.05, x: 0, y: 0}} to={{s: 1.05, x: -30, y: 0}} filter="saturate(0.7)" />
			<Strip name="cut_city1" y={700} h={360} offset={d * 30} filter="brightness(1.15) saturate(0.6) blur(1.2px)" />
			<Strip name="cut_city2" y={880} h={420} offset={d * 90} filter="brightness(0.95) saturate(0.75)" />
			<Cut name="cut_alice" x={1450 + alice * 160} y={905 - alice * 30} h={lerp(400, 300, alice)} opacity={lerp(1, 0.25, alice)} filter={`blur(${alice * 2}px) brightness(1.05)`} shadow={0.15} rot={boil(t, 2, 0.4)} />
			<Strip name="cut_city3" y={1080} h={340} offset={d * 200} filter="brightness(0.8)" />
			<Cut name="cut_mouse_run" x={720 - d * 120} y={1012 - bob * 6} h={120} shadow={0.4} />
			<Cut name="cut_charlie_walk" x={980} y={1010 - bob * 10} h={480} rot={bob ? 1.5 : -1.5} shadow={0.45} />
			<Wash color="rgba(90,120,170,0.35)" mode="soft-light" />
			<Wash color="linear-gradient(to bottom, rgba(180,200,240,0.15), rgba(0,0,0,0) 50%)" mode="screen" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S23b the neat writing begins to slant; S23c the lamp flickers
export const S23b: React.FC<{t: number}> = ({t}) => {
	const u = inv(151.6, 154.83, t);
	const lines: HandLine[] = NB_SLANT.map((l, i) => ({...l, wobble: lerp(0.08, 0.95, clamp(u * 1.3 - i * 0.08)), size: (l.size ?? 32) * (1 + u * 0.15 * (i % 2))}));
	return <PageView t={t} lines={lines} id="slant" scale={1.3} zoom={lerp(1.25, 1.4, u)} fx={640} fy={260} rot={lerp(-2, -6, u)} pageFilter={`saturate(${lerp(0.8, 0.5, u)})`} />;
};
export const S23c: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const r = hash(Math.floor(st * 12) * 3.7);
	const flick = st > 155.3 && r < 0.35 ? 0.35 + r : 1;
	const dim = lerp(1, 0.25, easeInOut(inv(156.6, 157.43, t)));
	return (
		<AbsoluteFill style={{filter: `brightness(${flick * dim})`}}>
			<PlateShot name="ref_desk" p={inv(154.83, 157.43, t)} from={{s: 1.08, x: 0, y: 0}} to={{s: 1.14, x: 30, y: 10}} filter="saturate(0.75)" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S24 forgetting: the characters drop off the lines
export const S24: React.FC<{t: number}> = ({t}) => {
	const u = inv(157.43, 164.1, t);
	const f = easeInOut(inv(158.9, 161.6, t)); // focus on the last line
	const line = {x: 315, y: 388}; // centre of 我不想忘记 (plate px)
	const view = (blurred: boolean) => (
		<PageView
			t={t}
			lines={NB4(158.9)}
			id={blurred ? 'nb4b' : 'nb4'}
			scale={1.3}
			zoom={lerp(1.22, 2.05, f)}
			fx={lerp(620, line.x, f)}
			fy={lerp(lerp(300, 340, u), line.y, f)}
			sx={W / 2}
			sy={lerp(H / 2, H * 0.47, f)}
			pageFilter={`saturate(${lerp(0.7, 0.35, u)}) brightness(${lerp(1, 0.9, u)})`}
			light={0.9}
		/>
	);
	return (
		<AbsoluteFill>
			{view(false)}
			{f > 0.02 ? (
				<AbsoluteFill
					style={{
						filter: `blur(${f * 7}px)`,
						WebkitMaskImage: `radial-gradient(ellipse ${lerp(90, 30, f)}% ${lerp(90, 16, f)}% at 50% 47%, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)`,
					}}
				>
					{view(true)}
				</AbsoluteFill>
			) : null}
			<Wash color="rgba(90,110,140,0.3)" mode="soft-light" />
		</AbsoluteFill>
	);
};
