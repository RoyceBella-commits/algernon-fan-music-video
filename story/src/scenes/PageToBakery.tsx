import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Stage, Floor} from '../components/Stage';
import {StandOnSheet, TurningPage} from '../components/Sheet';
import {NB, NotebookPage, HandLine} from '../components/Notebook';
import {Wash, LightBand, TiltShift} from '../components/Overlays';
import {img, cut} from '../lib/assets';
import {boil, clamp, easeInOut, easeOut, inv, lerp, springT, stepT} from '../lib/time';

// S05 (27.9-37.42): barefoot paper Charlie on the pre-surgery diary page.
// 37.42: the page turns, the bakery spread pops up (S06, until 44.05).
const S = 2; // world px per plate px
const PW = NB.w * S;
const PH = NB.h * S;

export const NB1: HandLine[] = [
	{text: '近步抱告 4', line: 1, x: 205, size: 46, wobble: 1.35, font: 'KuaiLe'},
	{text: '3月7日', line: 1, x: 1270, size: 40, wobble: 1.35, font: 'KuaiLe'},
	{text: '他们给我看纸上的墨水点 我找不到里面藏的画', line: 3, size: 39, wobble: 1.35, font: 'KuaiLe'},
	{text: '我跟一只叫阿尔吉侬的老鼠比走迷公 我输了', line: 4, size: 39, wobble: 1.35, font: 'KuaiLe'},
	{text: '明天就要做手术了 我不害帕', line: 5, size: 39, wobble: 1.35, font: 'KuaiLe'},
	{text: '我想变聪明', line: 6, size: 42, wobble: 1.35, font: 'KuaiLe', start: 30.6, rate: 2.2},
];

// plate px -> world (page centred at origin)
const P = (px: number, py: number) => [px * S - PW / 2, py * S - PH / 2];

const camAt = (t: number) => {
	// keyframes: [time, x, y, z, dist, tilt]
	const c0 = P(240, 300);
	const c1 = P(470, 400);
	const c2 = P(585, 430);
	const K: [number, number, number, number, number, number][] = [
		[27.9, c0[0], -150, c0[1], 1750, 24],
		[33.9, c1[0], -280, c1[1], 1600, 19],
		[37.0, c2[0], -330, c2[1], 1450, 17],
		[37.85, 0, -380, -260, 2750, 46],
		[41.6, 0, -640, -360, 2420, 9],
		[44.1, 120, -660, -420, 2080, 7],
	];
	let i = 0;
	while (i < K.length - 2 && t > K[i + 1][0]) i++;
	const a = K[i];
	const b = K[i + 1];
	const u = easeInOut(inv(a[0], b[0], t));
	return {x: lerp(a[1], b[1], u), y: lerp(a[2], b[2], u), z: lerp(a[3], b[3], u), dist: lerp(a[4], b[4], u), tilt: lerp(a[5], b[5], u)};
};

export const PageToBakery: React.FC<{t: number}> = ({t}) => {
	const cam = camAt(t);
	const nb = img('plate_notebook');
	const back = img('plate_bakery_back2');
	const charlie = cut('cut_charlie_stand');
	const broom = cut('cut_charlie_broom');
	const oven = cut('cut_oven');
	const counter = cut('cut_counter');

	const turn = easeInOut(inv(37.42, 38.15, t));
	const st = stepT(t);
	// pop-up rises, on beats of the chorus downbeat (37.59) + 2-beat steps
	const rise = (t0: number) => clamp(springT(t - t0, 1.5, 0.3), -0.2, 1.2);
	const backRise = rise(37.593);
	const ovenRise = rise(38.43);
	const counterRise = rise(39.27);
	// Charlie slides in on his paper track from the right, sweeping (12fps)
	const slide = easeOut(inv(40.1, 42.6, st));
	const cx = lerp(3700, 2020, slide);
	const sweep = Math.sin(st * Math.PI * 2 * 1.2) * 4 + boil(t, 5, 0.8);
	const morning = inv(37.6, 40, t); // warm light grows as the spread opens

	return (
		<AbsoluteFill style={{background: '#0d0907'}}>
			<TiltShift blur={lerp(7, 3, inv(37.0, 38.5, t))} focus={lerp(72, 62, inv(37.0, 40, t))} band={lerp(12, 26, inv(37.0, 40, t))}>
			<Stage cam={{...cam, persp: 1500}}>
				{/* desk under the book */}
				<Floor w={9000} d={5600} y={4} src={img('plate_desk_top').src} filter="brightness(0.8)" />
				{/* bakery spread (lower page) */}
				<Floor w={PW} d={PH} y={2}>
					<NotebookPage src={nb.src} scale={S} lines={[]} t={t} id="spread" filter={`brightness(${lerp(0.75, 1.0, morning)}) sepia(0.15)`} />
					{t >= 37.42 ? (<>
					{/* upper page of the spread = bakery back wall, hinged at the far edge */}
					<StandOnSheet src={back.src} w={PW} h={PH} x={PW / 2} y={0} lie={1 - backRise} shadow={0} shade={0.15} contact={0} brightness={lerp(0.8, 1.05, morning)} blur={lerp(0, 1.8, inv(40, 42.5, t))} />
					<StandOnSheet src={oven.src} w={780} h={940} x={2620} y={760} lie={1 - ovenRise} tiltZ={boil(t, 2, 0.25)} />
					<StandOnSheet src={broom.src} w={460} h={810} x={cx} y={1080} lie={t < 40.1 ? 1 : 0} tiltZ={sweep} opacity={t < 40.1 ? 0 : 1} />
					<StandOnSheet src={counter.src} w={1560} h={760} x={1050} y={1330} lie={1 - counterRise} tiltZ={boil(t, 3, 0.2)} />
					</>) : null}
				</Floor>
				{/* S05 diary page lying on top; turns at 37.42 */}
				{t < 38.2 ? (
					<Floor w={PW} d={PH} y={0}>
						<TurningPage
							w={PW}
							h={PH}
							turn={turn}
							front={
								<>
									<NotebookPage src={nb.src} scale={S} lines={NB1} t={t} id="nb1" />
									<StandOnSheet
										src={charlie.src}
										w={300}
										h={650}
										x={1250 + boil(t, 9, 3)}
										y={905}
										lie={clamp(turn * 2.5)}
										tiltZ={boil(t, 1, 0.6) + Math.sin(st * 1.3) * 0.8}
										shadowSkew={-34}
									/>
								</>
							}
							back={<Img src={nb.src} style={{width: '100%', height: '100%', filter: 'brightness(0.85)', transform: 'scaleX(-1)'}} />}
						/>
					</Floor>
				) : null}
			</Stage>
			</TiltShift>
			{/* lamp pool before the turn; dawn light after */}
			<Wash color={`radial-gradient(ellipse 70% 80% at 30% 20%, rgba(255,190,110,${0.5 * (1 - morning)}) 0%, rgba(0,0,0,0) 70%)`} mode="screen" />
			<Wash color={`rgba(255,150,60,${0.35 * morning})`} mode="soft-light" />
			{morning > 0 ? <LightBand p={inv(38, 46, t)} opacity={0.18 * morning} angle={24} /> : null}
		</AbsoluteFill>
	);
};
