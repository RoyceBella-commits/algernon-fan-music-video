import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {PlateShot} from './PlateStill';
import {PageView} from '../components/PageView';
import {Stage, Floor, Cam} from '../components/Stage';
import {StandOnSheet} from '../components/Sheet';
import {NB, NotebookPage} from '../components/Notebook';
import {Cut, cutW} from '../components/Cut';
import {Dapple, Falling, Rain, Wash, LightBand} from '../components/Overlays';
import {cut, img} from '../lib/assets';
import {NB5} from '../lib/texts';
import {quadMatrix} from '../lib/quad';
import {boil, clamp, easeInOut, easeOut, hash, inv, lerp, springT, stepT, W, H} from '../lib/time';

// ---------------------------------------------------------------- S25 the damp tower collapses
export const S25: React.FC<{t: number}> = ({t}) => {
	const u = inv(164.1, 170.85, t);
	const shake = stepT(t) > 166.4 && stepT(t) < 166.7 ? boil(t, 1, 6) : 0;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
				<PlateShot name="s25_tower" p={easeInOut(u)} from={{s: 1.04, x: 0, y: 0}} to={{s: 1.12, x: 30, y: 20}} filter="saturate(0.55) contrast(0.95) brightness(0.95)" />
			</AbsoluteFill>
			<Falling
				t={t}
				t0={163.8}
				items={['cut_scraps_1', 'cut_scraps_2', 'cut_scraps_3', 'cut_scraps_4', 'cut_scraps_5', 'cut_scraps_6']}
				count={18}
				size={[50, 110]}
				speed={210}
				sway={30}
				render={(n, x, y, h, rot, key) => <Cut key={key} name={n} x={500 + (x % 900)} y={y} h={h} anchor="center" rot={rot} shadow={0.3} shade={0} filter="saturate(0.4) brightness(0.9)" />}
			/>
			<Rain t={t} opacity={0.12} count={40} />
			<Wash color="rgba(80,100,130,0.25)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S26 the crayon eyes fade; into the box; the lid; the lamp goes out
const RIM = [[875, 322], [1350, 505], [1125, 795], [625, 540]]; // box opening TL,TR,BR,BL (1920x1080 plate space)
const CrayonDots: React.FC<{x: number; y: number; r: number; o: number}> = ({x, y, r, o}) => (
	<>
		{[[0, 0, 1], [-r * 2.6, -r * 0.6, 0.75]].map(([dx, dy, s], i) => (
			<div key={i} style={{position: 'absolute', left: x + dx - r * s, top: y + dy - r * s, width: 2 * r * s, height: 1.9 * r * s, borderRadius: '50%', background: '#141210', opacity: o * (i ? clamp(o * 1.4 - 0.2) : 1), filter: 'blur(0.6px)'}} />
		))}
	</>
);
export const S26: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const dim = 1 - easeInOut(inv(177.2, 178.5, t));
	const inBox = st >= 175.0;
	const lidP = easeOut(inv(176.0, 177.3, st));
	const mh = 260;
	const mw = cutW('cut_mouse_curl_crude', mh);
	const eyes = 1 - inv(172.0, 174.6, st);
	const lidQ = RIM.map(([x, y]) => [lerp(960 + (x - 960) * 1.6, x, lidP), lerp(y - 520, y, lidP)]);
	const pad = (q: number[][]) => {
		const cx = q.reduce((s, p) => s + p[0], 0) / 4;
		const cy = q.reduce((s, p) => s + p[1], 0) / 4;
		return q.map(([x, y]) => [cx + (x - cx) * 1.07, cy + (y - cy) * 1.07]);
	};
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<AbsoluteFill style={{filter: `brightness(${dim})`}}>
				<PlateShot name="plate_box" p={inv(170.85, 178.5, t)} from={{s: 1.0, x: 0, y: 0}} to={{s: 1.0, x: 0, y: 0}} filter="saturate(0.8)" />
				{!inBox ? (
					<div style={{position: 'absolute', left: 300 - mw / 2, top: 760 - mh, width: mw, height: mh, filter: 'drop-shadow(10px 14px 10px rgba(10,5,2,0.6)) brightness(0.9)'}}>
						<Img src={cut('cut_mouse_curl_crude').src} style={{width: '100%', height: '100%'}} />
						<CrayonDots x={0.74 * mw} y={0.42 * mh} r={7} o={eyes} />
					</div>
				) : (
					<div style={{position: 'absolute', inset: 0, clipPath: `polygon(${RIM.map(([x, y]) => `${x}px ${y}px`).join(',')})`}}>
						<div style={{position: 'absolute', left: 1000 - mw * 0.45, top: 705 - mh * 0.9, width: mw * 0.9, height: mh * 0.9, filter: 'drop-shadow(8px 10px 8px rgba(10,5,2,0.55)) brightness(0.85)'}}>
							<Img src={cut('cut_mouse_curl_crude').src} style={{width: '100%', height: '100%'}} />
						</div>
					</div>
				)}
				{lidP > 0 ? (
					<div style={{position: 'absolute', left: 0, top: 0, width: 985, height: 607, transformOrigin: '0 0', transform: quadMatrix(985, 607, pad(lidQ)), filter: `drop-shadow(0 ${30 * (1 - lidP) + 6}px ${20 * (1 - lidP) + 6}px rgba(0,0,0,0.6))`}}>
						<Img src={cut('cut_box_lid').src} style={{width: '100%', height: '100%'}} />
					</div>
				) : null}
			</AbsoluteFill>
			<Wash color="rgba(70,90,130,0.25)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S27 the bakery again, rebuilt by a clumsy hand (torn edges); kind coworkers
const S = 2;
const PW = NB.w * S;
const PH = NB.h * S;
const TornFilter = () => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<filter id="torn">
			<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={4} result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale={22} xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</svg>
);
export const S27: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const u = easeInOut(inv(180.86, 187.63, t));
	const cam: Cam = {x: 140, y: -650, z: -420, dist: lerp(2150, 1900, u), tilt: 7, persp: 1500};
	const sweep = Math.sin(st * Math.PI * 2 * 1.2) * 4 + boil(t, 5, 0.8);
	const cx = lerp(2500, 2080, easeOut(inv(181.2, 184, st)));
	const wave = (k: number) => Math.sin(stepT(t, 6) * 5 + k) * 6;
	const light = easeOut(inv(180.86, 182.2, t));
	return (
		<AbsoluteFill style={{background: '#0d0907', filter: `brightness(${lerp(0.3, 1, light)})`}}>
			<TornFilter />
			<Stage cam={cam}>
				<Floor w={9000} d={5600} y={4} src={img('plate_desk_top').src} filter="brightness(0.8)" />
				<Floor w={PW} d={PH} y={2}>
					<NotebookPage src={img('plate_notebook').src} scale={S} lines={[]} t={t} id="crude" filter="sepia(0.2)" />
					<StandOnSheet src={img('plate_bakery_crude').src} w={PW} h={PH} x={PW / 2} y={0} shadow={0} contact={0} shade={0.1} blur={1.2} />
					<StandOnSheet src={cut('cut_oven').src} w={780} h={940} x={2620} y={760} tiltZ={-2 + boil(t, 2, 0.4)} brightness={0.95} />
					<StandOnSheet src={cut('cut_coworkers_1').src} w={380} h={800} x={1050} y={1060} tiltZ={wave(0)} />
					<StandOnSheet src={cut('cut_coworkers_2').src} w={470} h={640} x={1500} y={1100} tiltZ={wave(1.5)} />
					<StandOnSheet src={cut('cut_charlie_broom').src} w={460} h={810} x={cx} y={1100} tiltZ={sweep} />
					<StandOnSheet src={cut('cut_counter').src} w={1500} h={730} x={1150} y={1380} tiltZ={1.5 + boil(t, 3, 0.3)} />
				</Floor>
			</Stage>
			<Wash color="rgba(255,165,80,0.3)" mode="soft-light" />
			<LightBand p={inv(180, 190, t)} opacity={0.2} angle={24} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S28 backyard: real tree-shade over a small mound
export const S28: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<PlateShot name="plate_backyard" p={easeInOut(inv(187.63, 194.32, t))} from={{s: 1.04, x: 0, y: 0}} to={{s: 1.2, x: 20, y: -90}} />
		<Dapple t={t} opacity={0.55} />
		<Wash color="rgba(255,200,120,0.12)" mode="soft-light" />
	</AbsoluteFill>
);

// ---------------------------------------------------------------- S29 running barefoot along a long strip of paper
export const S29: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const d = st - 194.32;
	const bob = Math.floor(st * 12) % 2;
	const stripH = 360;
	const sw = (NB.w * stripH) / (NB.h * 0.55);
	const off = (d * 1100) % sw;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<Img src={img('plate_desk_top').src} style={{position: 'absolute', left: -((d * 260) % 600) - 100, top: -60, width: W + 900, height: H + 120, filter: 'blur(6px) brightness(0.8)'}} />
			<div
				style={{
					position: 'absolute',
					left: -off,
					top: 740,
					height: stripH,
					width: sw * 4,
					background: `repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 52px, rgba(95,140,190,0.55) 52px, rgba(95,140,190,0.55) 54px), linear-gradient(to bottom, #efe4cc, #e2d3b4)`,
					boxShadow: '0 24px 40px rgba(0,0,0,0.6), inset 0 6px 10px rgba(255,255,255,0.25)',
				}}
			>
				<Img src={img('plate_notebook').src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35, mixBlendMode: 'multiply'}} />
				{[0, 1, 2, 3].map((i) => (
					<div key={i} style={{position: 'absolute', left: i * sw + 120, top: 40, width: 2, height: stripH - 40, background: 'rgba(200,70,70,0.55)'}} />
				))}
			</div>
			<div style={{position: 'absolute', left: 700, top: 905, width: 360, height: 40, borderRadius: '50%', background: 'rgba(20,10,4,0.5)', filter: 'blur(10px)'}} />
			<Cut name="cut_charlie_run" x={880} y={915 - bob * 22} h={500} rot={bob ? -4 : 2} shadow={0.25} />
			<Wash color="rgba(255,200,130,0.18)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S31 the last lyric line alone; then the last page
export const S31: React.FC<{t: number}> = ({t}) => {
	if (t < 214.7) {
		const fade = inv(207.84, 208.6, t) * (1 - inv(214.2, 214.7, t));
		return (
			<AbsoluteFill style={{background: '#000'}}>
				<AbsoluteFill style={{opacity: 0.5 * fade}}>
					<PlateShot name="plate_desk_top" p={0} filter="brightness(0.55) blur(3px)" />
				</AbsoluteFill>
			</AbsoluteFill>
		);
	}
	const u = easeInOut(inv(214.7, 220.5, t));
	return <PageView t={t} lines={NB5(215.0)} id="nb5" scale={1.3} zoom={lerp(1.45, 1.25, u)} fx={lerp(520, 660, u)} fy={lerp(230, 290, u)} light={clamp(inv(214.7, 215.2, t) + 0.2)} />;
};

// ---------------------------------------------------------------- S32 a flower made of torn petals (no hands)
export const S32: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const center = [1060, 640];
	const petals = ['cut_petals_1', 'cut_petals_2', 'cut_petals_3', 'cut_petals_5', 'cut_petals_6', 'cut_petals_7'];
	const u = inv(220.5, 223.42, t);
	return (
		<PageView t={t} lines={NB5(0)} id="nb5b" scale={1.3} zoom={lerp(1.6, 1.75, u)} fx={center[0]} fy={center[1] - 30} light={1}>
			{petals.map((p, i) => {
				const t0 = 220.9 + i * 0.418;
				const k = st - t0;
				if (k < 0) return null;
				const drop = clamp(k / 0.25);
				const ang = (i / petals.length) * 360 + boil(i, 3, 6);
				const r = 135 * 1.3;
				const x = center[0] * 1.3 + Math.cos(((ang - 90) * Math.PI) / 180) * r;
				const y = center[1] * 1.3 + Math.sin(((ang - 90) * Math.PI) / 180) * r;
				const s = lerp(1.5, 1, drop);
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${ang + 90}deg) scale(${s})`, filter: `drop-shadow(${4 + (s - 1) * 30}px ${6 + (s - 1) * 40}px ${4 + (s - 1) * 20}px rgba(20,10,3,0.45))`}}>
						<Img src={cut(p).src} style={{height: 125 * 1.3, width: (125 * 1.3 * cut(p).w) / cut(p).h, display: 'block', transform: 'rotate(90deg)'}} />
					</div>
				);
			})}
			{st > 223.1 ? (
				<div style={{position: 'absolute', left: center[0] * 1.3, top: center[1] * 1.3, transform: `translate(-50%,-50%) scale(${lerp(1.5, 1, clamp((st - 223.1) / 0.25))})`, filter: 'drop-shadow(4px 6px 5px rgba(20,10,3,0.45))'}}>
					<Img src={cut('cut_petals_4').src} style={{width: 120, height: 115, display: 'block'}} />
				</div>
			) : null}
		</PageView>
	);
};

// ---------------------------------------------------------------- S33-S35 the grave under the tree: seasons, flowers, lights out, white page
const SEASONS = [
	{t: 223.42, plate: 'plate_backyard'},
	{t: 226.766, plate: 'plate_backyard_spring'},
	{t: 230.087, plate: 'plate_backyard_summer'},
	{t: 233.43, plate: 'plate_backyard_autumn'},
	{t: 236.751, plate: 'plate_backyard_winter'},
];
const FLOWERS = [
	{t: 223.84, n: 'cut_flowers_1', dx: 0, h: 160},
	{t: 227.18, n: 'cut_flowers_2', dx: -78, h: 145},
	{t: 230.5, n: 'cut_flowers_3', dx: 74, h: 150},
	{t: 233.85, n: 'cut_flowers_4', dx: -36, h: 138},
	{t: 237.17, n: 'cut_flowers_1', dx: 38, h: 132},
];
const MOUND = [922, 812];
const SEASON_ORIGIN = [MOUND[0], MOUND[1] - 0.06 * H]; // transform-origin of the 2D push-in
export const seasonScale = (t: number) => lerp(1.03, 1.16, easeInOut(inv(223.42, 240.2, t)));
export const Seasons: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const si = SEASONS.reduce((k, s, i) => (st >= s.t ? i : k), 0);
	const slide = si > 0 ? clamp((st - SEASONS[si].t) / 0.42) : 1;
	const scale = seasonScale(t);
	const winter = si === 4;
	const plateAt = (k: number) => <PlateShot name={SEASONS[k].plate} p={0} from={{s: 1, x: 0, y: 0}} to={{s: 1, x: 0, y: 0}} />;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: `${SEASON_ORIGIN[0]}px ${SEASON_ORIGIN[1]}px`}}>
				{si > 0 ? plateAt(si - 1) : null}
				<AbsoluteFill style={{transform: `translateX(${(1 - slide) * W}px)`, boxShadow: slide < 1 ? '-30px 0 40px rgba(0,0,0,0.5)' : undefined}}>{plateAt(si)}</AbsoluteFill>
				{si <= 2 ? <Dapple t={t} opacity={0.4} /> : null}
				{FLOWERS.map((f, i) => {
					const k = st - f.t;
					if (k < 0) return null;
					const drop = clamp(k / 0.33);
					return <Cut key={i} name={f.n} x={MOUND[0] + f.dx} y={MOUND[1] + 4 - (1 - drop) * 140} h={f.h * lerp(1.25, 1, drop)} rot={boil(i, 2, 6) + Math.sin(t * 1.5 + i) * 2} shadow={0.4} shade={0.1} />;
				})}
				{si === 1 ? (
					<Falling t={t} t0={226.3} items={['x']} count={30} size={[10, 18]} speed={140} seed={3} render={(n, x, y, h, rot, key) => <div key={key} style={{position: 'absolute', left: x, top: y, width: h, height: h * 0.7, borderRadius: '50%', background: '#f6c5d4', transform: `rotate(${rot}deg)`, boxShadow: '1px 2px 2px rgba(0,0,0,0.2)'}} />} />
				) : null}
				{si === 3 ? (
					<Falling
						t={t}
						t0={232.9}
						items={['cut_leaves_2', 'cut_leaves_4', 'cut_leaves_6', 'cut_leaves_8']}
						count={16}
						size={[50, 80]}
						speed={170}
						seed={5}
						render={(n, x, y, h, rot, key) => <Cut key={key} name={n} x={x} y={y} h={h} anchor="center" rot={rot} shadow={0.3} shade={0} filter="sepia(1) saturate(3) hue-rotate(-20deg) brightness(0.85)" />}
					/>
				) : null}
			</AbsoluteFill>
			{winter ? (
				<Falling
					t={t}
					t0={236.3}
					items={['x']}
					count={70}
					size={[5, 12]}
					speed={95}
					seed={9}
					sway={30}
					render={(n, x, y, h, rot, key) => <div key={key} style={{position: 'absolute', left: x, top: y, width: h, height: h, borderRadius: '50%', background: '#fbfbff', opacity: 0.9}} />}
				/>
			) : null}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S34-S35 the winter stage is a pop-up page on the desk; it closes; a blank page
const BMOUND = [0.48, 0.752];
export const BookClose: React.FC<{t: number}> = ({t}) => {
	const winter = img('plate_backyard_winter');
	const nb = img('plate_notebook');
	const T0 = 238.0;
	const pull = easeInOut(inv(238.5, 242.6, t));
	const fold = easeInOut(inv(242.4, 246.3, t));
	const push = easeInOut(inv(245.9, 249.4, t));
	// camera that reproduces the 2D winter frame at T0: same screen centre, same scale
	const s2 = seasonScale(T0);
	const P0 = [SEASON_ORIGIN[0] + (W / 2 - SEASON_ORIGIN[0]) / s2, SEASON_ORIGIN[1] + (H / 2 - SEASON_ORIGIN[1]) / s2];
	const persp = 1500;
	const cam0: Cam = {x: (P0[0] / W) * PW - PW / 2, y: -(PH - (P0[1] / H) * PH) + 2, z: -PH / 2 - 1.5, dist: (PW * persp) / (W * s2), tilt: 0, persp};
	const cam1: Cam = {x: 0, y: -380, z: -260, dist: 4300, tilt: 30, persp};
	const cam: Cam =
		t < 242.4
			? {x: lerp(cam0.x, cam1.x, pull), y: lerp(cam0.y, cam1.y, pull), z: lerp(cam0.z, cam1.z, pull), dist: lerp(cam0.dist, cam1.dist, pull), tilt: lerp(0, 30, pull), persp}
			: {x: 0, y: lerp(-380, 0, Math.max(fold, push)), z: lerp(-260, 0, Math.max(fold, push)), dist: lerp(4300, 2620, push), tilt: lerp(30, lerp(64, 89.5, push), fold), persp};
	const ang = -90 - 90 * fold; // -90 standing, -180 folded down onto the lower page
	const kH = PH / H; // 2D flower px -> page px
	const snowFade = 1 - inv(239.0, 240.8, t);
	const final = easeInOut(inv(249.5, 250.3, t));
	const title = Array.from('アルジャーノンに、花束を');
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<Stage cam={cam}>
				<Floor w={9000} d={5600} y={4} src={img('plate_desk_top').src} filter="brightness(0.8)" />
				<Floor w={PW} d={PH} y={2}>
					<NotebookPage src={nb.src} scale={S} lines={[]} t={t} id="close" />
					{/* the folding stage page: front = winter backyard with the flowers glued on; back = a blank page */}
					<div style={{position: 'absolute', left: 0, top: -PH, width: PW, height: PH, transformOrigin: '50% 100%', transformStyle: 'preserve-3d', transform: `translateZ(1.5px) rotateX(${ang}deg)`}}>
						<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transformStyle: 'preserve-3d'}}>
							<Img src={winter.src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
							{FLOWERS.map((f, i) => {
								const c = cut(f.n);
								const h = f.h * kH;
								const w = (h * c.w) / c.h;
								return (
									<div
										key={i}
										style={{
											position: 'absolute',
											left: (MOUND[0] + f.dx) * kH - w / 2,
											top: (MOUND[1] + 4) * kH - h,
											width: w,
											height: h,
											transformOrigin: '50% 100%',
											transform: `translateZ(3px) rotate(${boil(i, 2, 6) + Math.sin(t * 1.5 + i) * 2}deg)`,
											filter: `drop-shadow(${10 * kH}px ${14 * kH}px ${(f.h * 0.035 + 6) * kH}px rgba(18,9,3,0.4))`,
										}}
									>
										<Img src={c.src} style={{width: '100%', height: '100%'}} />
									</div>
								);
							})}
						</div>
						<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
							<Img src={nb.src} style={{width: '100%', height: '100%', transform: 'scale(-1, -1)', filter: 'brightness(0.97)'}} />
						</div>
					</div>
				</Floor>
			</Stage>
			{snowFade > 0 ? (
				<AbsoluteFill style={{opacity: snowFade}}>
					<Falling t={t} t0={236.3} items={['x']} count={70} size={[5, 12]} speed={95} seed={9} sway={30} render={(n, x, y, h, rot, key) => <div key={key} style={{position: 'absolute', left: x, top: y, width: h, height: h, borderRadius: '50%', background: '#fbfbff', opacity: 0.9}} />} />
				</AbsoluteFill>
			) : null}
			{/* desk lamp */}
			<Wash color={`radial-gradient(ellipse 75% 70% at 30% 22%, rgba(255,190,110,${0.3 * pull}), rgba(0,0,0,0) 65%)`} mode="screen" />
			{final > 0 ? (
				<AbsoluteFill style={{opacity: final}}>
					<Img src={nb.src} style={{width: W, height: H, objectFit: 'cover'}} />
					<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 32% 28%, rgba(255,200,130,0.18) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)', mixBlendMode: 'multiply'}} />
					<div style={{position: 'absolute', left: W / 2, top: H * 0.47, transform: 'translate(-50%,-50%)', fontFamily: 'Mincho', fontSize: 66, letterSpacing: '0.28em', color: '#2c2622', whiteSpace: 'nowrap'}}>
						{title.map((c, i) => {
							const p = clamp((t - (250.2 + i * 0.16)) / 0.4);
							return (
								<span key={i} style={{display: 'inline-block', opacity: p * 0.9, transform: `translateY(${(1 - p) * 10}px)`, filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined}}>
									{c}
								</span>
							);
						})}
					</div>
					<div style={{position: 'absolute', right: 120, bottom: 90, textAlign: 'right', fontFamily: 'Mincho', color: '#3a332e', opacity: clamp(inv(252.6, 253.4, t)) * 0.85}}>
						<div style={{fontSize: 30, letterSpacing: '0.2em'}}>アルジャーノン</div>
						<div style={{fontSize: 20, letterSpacing: '0.3em', marginTop: 6}}>ヨルシカ　／　fan-made MV</div>
					</div>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};
