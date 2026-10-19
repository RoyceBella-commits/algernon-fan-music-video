import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {PageView} from '../components/PageView';
import {Handwriting, HandLine} from '../components/Notebook';
import {PlateShot} from './PlateStill';
import {Cut, cutW} from '../components/Cut';
import {LightBand, Wash} from '../components/Overlays';
import {cut} from '../lib/assets';
import {NB2} from '../lib/texts';
import {boil, clamp, easeInOut, easeOut, inv, lerp, springT, stepT, W, H} from '../lib/time';

// ---------------------------------------------------------------- S10 the name tag
const SC = 1.3;
const TAG = {x: 520, y: 330, w: 700, rot: -7}; // plate px on the page
export const S10: React.FC<{t: number}> = ({t}) => {
	const c = cut('cut_tag');
	const th = (TAG.w * c.h) / c.w;
	const lines: HandLine[] = [
		{text: '阿儿吉农', line: 0, y: 0.47 * th, x: 0.38 * TAG.w, size: 70, font: 'KuaiLe', wobble: 1.1, start: 65.6, rate: 3, strike: [0, 4, 67.25]},
		{text: '阿尔吉侬', line: 0, y: 0.84 * th, x: 0.4 * TAG.w, size: 72, font: 'KuaiLe', wobble: 0.8, start: 67.7, rate: 2.6},
	];
	if (t >= 69.6) return <TaggedMouse t={t} />;
	// pencil tip follows the character being written
	const writing = t < 67.25 ? {i: (t - 65.6) * 3, L: lines[0]} : t < 67.6 ? {i: 4 * ((t - 67.25) / 0.35), L: {...lines[0], y: 0.5 * th}} : {i: (t - 67.7) * 2.6, L: lines[1]};
	const idx = clamp(writing.i, 0, 4);
	const lx = (writing.L.x ?? 0) + idx * (writing.L.size ?? 70) * 1.04;
	const ly = (writing.L.y ?? 0) - 20 + boil(t, 4, 6, 12);
	const rad = (TAG.rot * Math.PI) / 180;
	const px = (TAG.x + lx * Math.cos(rad) - ly * Math.sin(rad)) * SC;
	const py = (TAG.y + lx * Math.sin(rad) + ly * Math.cos(rad)) * SC;
	const handOn = t > 65.3 && t < 69.3;
	return (
		<PageView t={t} lines={[]} id="s10" scale={SC} zoom={lerp(1.55, 1.7, inv(65, 69.6, t))} fx={TAG.x + 360} fy={TAG.y + 170} sx={W * 0.48}>
			<div style={{position: 'absolute', left: TAG.x * SC, top: TAG.y * SC, width: TAG.w * SC, height: th * SC, transformOrigin: '0 0', transform: `rotate(${TAG.rot}deg)`, filter: 'drop-shadow(8px 12px 10px rgba(20,10,3,0.4))'}}>
				<Img src={c.src} style={{width: '100%', height: '100%'}} />
				<Handwriting lines={lines} t={t} scale={SC} id="tag" />
			</div>
			{handOn ? (
				<div style={{position: 'absolute', left: px - 0.02 * 560 * SC * (997 / 913), top: py - 0.94 * 560 * SC, width: 560 * SC * (997 / 913), height: 560 * SC, filter: 'drop-shadow(26px 34px 20px rgba(15,8,2,0.5))'}}>
					<Img src={cut('cut_hand_pencil').src} style={{width: '100%', height: '100%'}} />
				</div>
			) : null}
		</PageView>
	);
};

/** Neat mouse standing at the lamp's foot; optional paws / crumb. */
const MouseAtLamp: React.FC<{t: number; paws?: number; open?: number; crumb?: number; hug?: number; zoom?: number}> = ({t, paws = -1, open = 0, crumb = 0, hug = 0, zoom = 1}) => {
	const mh = 640;
	const mw = cutW('cut_mouse_neat_nopaws', mh);
	const mx = 1000;
	const my = 990;
	const left = mx - mw / 2;
	const top = my - mh;
	const pawH = mh * 0.3;
	const paw = (fx: number, fy: number, far: boolean, k: number) => {
		if (paws < 0) return null;
		const arrive = clamp(springT(t - (72.35 + k * 0.42), 1.6, 0.35), 0, 1.1);
		if (arrive <= 0) return null;
		const sx = left + fx * mw;
		const sy = top + fy * mh;
		const fromX = sx + (k ? 380 : 520);
		const fromY = sy - 700;
		const x = lerp(fromX, sx, Math.min(1, arrive));
		const y = lerp(fromY, sy, Math.min(1, arrive));
		const ang = -12 + open * 22 - hug * 30 + (arrive < 1 ? (1 - arrive) * 120 : 0);
		const pw = cutW('cut_paws_1', pawH);
		return (
			<div style={{position: 'absolute', left: x - pw * 0.18, top: y - pawH * 0.1, width: pw, height: pawH, transformOrigin: '18% 10%', transform: `rotate(${ang}deg)`, filter: `brightness(${far ? 0.78 : 1}) drop-shadow(4px 6px 4px rgba(20,10,3,0.4))`}}>
				<Img src={cut('cut_paws_1').src} style={{width: '100%', height: '100%'}} />
			</div>
		);
	};
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '52% 60%'}}>
				<PlateShot name="plate_lamp_base" p={0} from={{s: 1.0, x: 0, y: 0}} to={{s: 1.0, x: 0, y: 0}} filter="blur(1.5px)" />
				<div style={{position: 'absolute', left: mx - 240, top: my - 30, width: 480, height: 60, borderRadius: '50%', background: 'rgba(10,5,2,0.6)', filter: 'blur(14px)'}} />
				{paw(0.5, 0.56, true, 1)}
				<Cut name="cut_mouse_neat_nopaws" x={mx} y={my} h={mh} rot={boil(t, 7, 0.6)} shadow={0} shade={0.25} />
				{/* the name, written on its tag */}
				<div style={{position: 'absolute', left: left + 0.33 * mw, top: top + 0.565 * mh, fontFamily: 'KuaiLe', fontSize: 17, color: '#34302c', transform: 'rotate(-28deg)', opacity: 0.85}}>阿尔吉侬</div>
				{crumb > 0 ? <Cut name="cut_crumb" x={lerp(1650, left + 0.86 * mw, easeOut(crumb))} y={top + 0.78 * mh} h={95} anchor="center" rot={(1 - crumb) * 90} shadow={0.4} /> : null}
				{paw(0.64, 0.57, false, 0)}
			</AbsoluteFill>
			<Wash color="radial-gradient(ellipse 60% 60% at 30% 25%, rgba(255,190,110,0.25), rgba(0,0,0,0) 70%)" mode="screen" />
		</AbsoluteFill>
	);
};

const TaggedMouse: React.FC<{t: number}> = ({t}) => <MouseAtLamp t={t} zoom={lerp(1.12, 1.05, inv(69.6, 72.13, t))} />;

// ---------------------------------------------------------------- S11 paws are made; open, close, hold a crumb
export const S11: React.FC<{t: number}> = ({t}) => {
	const s6 = stepT(t, 6);
	const open = s6 > 73.9 && s6 < 75.8 ? (Math.floor((s6 - 73.9) * 3) % 2 === 0 ? 1 : 0) : 0;
	const crumb = inv(75.8, 76.6, stepT(t));
	const hug = s6 > 76.6 ? 1 : 0;
	return <MouseAtLamp t={t} paws={1} open={open} crumb={crumb} hug={hug} zoom={lerp(1.05, 1.16, easeInOut(inv(72.13, 78.7, t)))} />;
};

// ---------------------------------------------------------------- S12 / S13 the paper sea
const Waves: React.FC<{t: number; y: number; h: number; dir: number; phase: number; filter?: string}> = ({t, y, h, dir, phase, filter}) => {
	const w = cutW('cut_waves', h);
	const x = Math.sin(stepT(t, 12) * 1.1 + phase) * 70 * dir - w * 0.3;
	const n = Math.ceil((W + w) / (w * 0.98)) + 1;
	return (
		<div style={{position: 'absolute', left: x, top: y - h, height: h, width: n * w, display: 'flex', filter: `drop-shadow(0 -6px 10px rgba(10,30,50,0.35)) ${filter ?? ''}`}}>
			{Array.from({length: n}).map((_, i) => (
				<Img key={i} src={cut('cut_waves').src} style={{height: h, width: w, marginLeft: i ? -w * 0.02 : 0}} />
			))}
		</div>
	);
};

const Bird: React.FC<{t: number; name: string; x0: number; y0: number; vx: number; h: number; k: number}> = ({t, name, x0, y0, vx, h, k}) => {
	const s6 = stepT(t, 6);
	const flap = Math.floor(s6 * 6 + k) % 2 === 0 ? 1 : 0.45;
	return <Cut name={name} x={x0 + vx * (t - 78.7)} y={y0 + Math.sin(t * 2 + k) * 14} h={h} anchor="center" sy={flap} shadow={0.15} shade={0.05} />;
};

const SeaStage: React.FC<{t: number; children?: React.ReactNode; sunY?: number}> = ({t, children, sunY}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<PlateShot name="plate_sky_back" p={inv(78.7, 91.3, t)} from={{s: 1.05, x: 0, y: -40}} to={{s: 1.08, x: -30, y: -40}} />
		{sunY !== undefined ? <Cut name="cut_sun_stick" x={640} y={sunY} h={560} rot={boil(t, 2, 1.2)} shadow={0.25} /> : null}
		<Waves t={t} y={720} h={170} dir={1} phase={0} filter="brightness(1.12) saturate(0.75) blur(1px)" />
		<Waves t={t} y={790} h={190} dir={-1} phase={1.3} filter="brightness(1.05) saturate(0.85)" />
		<Waves t={t} y={865} h={210} dir={1} phase={2.6} />
		<Waves t={t} y={950} h={230} dir={-1} phase={3.9} filter="brightness(0.92)" />
		{children}
	</AbsoluteFill>
);

export const S12: React.FC<{t: number}> = ({t}) => {
	const sandH = 330;
	return (
		<SeaStage t={t}>
			<Bird t={t} name="cut_birds_1" x0={-200} y0={260} vx={160} h={150} k={0} />
			<Bird t={t} name="cut_birds_2" x0={400} y0={170} vx={120} h={110} k={1} />
			<Bird t={t} name="cut_birds_3" x0={-600} y0={380} vx={210} h={130} k={0.5} />
			<div style={{position: 'absolute', left: -120, top: H - sandH + 70, width: W + 240, height: sandH, filter: 'drop-shadow(0 -8px 14px rgba(40,25,10,0.35))'}}>
				<Img src={cut('cut_sand').src} style={{width: '100%', height: '100%'}} />
			</div>
			<Cut name="cut_charlie_read" x={1340} y={1050} h={420} rot={boil(t, 3, 0.6)} shadow={0.35} />
			<Wash color="rgba(255,220,170,0.12)" mode="soft-light" />
			<LightBand p={inv(78, 86, t)} opacity={0.12} />
		</SeaStage>
	);
};

export const S13: React.FC<{t: number}> = ({t}) => {
	const u = easeInOut(inv(85.38, 91.27, t));
	const sunY = lerp(1000, 560, easeOut(inv(85.6, 89.4, stepT(t))));
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${lerp(1.2, 1.0, u)})`, transformOrigin: '50% 70%'}}>
				<SeaStage t={t} sunY={sunY}>
					<Cut name="cut_charlie_back" x={1080} y={1180} h={820} rot={boil(t, 5, 0.5)} shadow={0.3} shade={0.35} />
				</SeaStage>
			</AbsoluteFill>
			<Wash color="rgba(255,200,140,0.18)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S14 yawn; S15 punctuation page
export const S14: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const pose = st < 92.6 ? 'cut_mouse_sit_neat' : st < 93.7 ? 'cut_mouse_yawn' : st < 94.9 ? 'cut_mouse_sit_neat' : 'cut_mouse_curl_neat';
	const h = pose === 'cut_mouse_curl_neat' ? 360 : 560;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<PlateShot name="plate_lamp_base" p={inv(91.27, 96.68, t)} from={{s: 1.06, x: 0, y: 0}} to={{s: 1.12, x: -20, y: -10}} filter="blur(1.5px)" />
			<div style={{position: 'absolute', left: 760, top: 950, width: 440, height: 56, borderRadius: '50%', background: 'rgba(10,5,2,0.6)', filter: 'blur(14px)'}} />
			<Cut name={pose} x={980} y={985} h={h} rot={boil(t, 9, 0.6)} shadow={0} shade={0.22} />
			<Wash color="radial-gradient(ellipse 60% 60% at 30% 25%, rgba(255,190,110,0.28), rgba(0,0,0,0) 70%)" mode="screen" />
		</AbsoluteFill>
	);
};

export const S15: React.FC<{t: number}> = ({t}) => (
	<PageView t={t} lines={NB2(96.75)} id="nb2" scale={SC} zoom={lerp(1.35, 1.2, inv(96.68, 100.93, t))} fx={lerp(560, 640, inv(96.68, 100.93, t))} fy={lerp(220, 300, inv(96.68, 100.93, t))} />
);
