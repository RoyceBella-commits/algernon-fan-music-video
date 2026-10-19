import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {PlateShot} from './PlateStill';
import {Cut} from '../components/Cut';
import {Falling, Wash} from '../components/Overlays';
import {RisingWords, Dust} from '../components/Motes';
import {boil, clamp, easeInOut, inv, lerp, stepT, W, H} from '../lib/time';

const FgStars: React.FC<{t: number}> = ({t}) => (
	<>
		<Cut name="cut_stars_2" x={150} y={-70} h={340} anchor="top" origin="50% 0%" rot={Math.sin(stepT(t, 8) * 1.1) * 6} shadow={0.2} filter="blur(4px) brightness(0.85)" />
		<Cut name="cut_stars_4" x={1700} y={-120} h={300} anchor="top" origin="50% 0%" rot={Math.sin(stepT(t, 8) * 0.9 + 2) * 6} shadow={0.2} filter="blur(5px) brightness(0.8)" />
	</>
);

// S16 he falls asleep among his books
export const S16: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill>
		<PlateShot name="s16_sleep" p={easeInOut(inv(100.93, 104.9, t))} from={{s: 1.3, x: 110, y: 40}} to={{s: 1.26, x: 100, y: 60}} />
		<Dust t={t} count={30} area={[200, 0, 1700, 900]} opacity={0.5} />
		<FgStars t={t} />
		<Wash color="rgba(60,80,140,0.15)" mode="soft-light" />
	</AbsoluteFill>
);

// S17 the tree grows from the middle of his head (baked growth sequence, 12 fps)
export const treeFrame = (k: number) => staticFile(`seq/tree/${String(clamp(k, 0, 112)).padStart(3, '0')}.jpg`);
export const S17: React.FC<{t: number}> = ({t}) => {
	const k = Math.floor((t - 104.9) * 12);
	const u = easeInOut(inv(104.76, 113.6, t));
	const s = lerp(1.26, 1.02, u);
	const ty = lerp(60, 0, u);
	const tx = lerp(100, 0, u);
	// the top of the sleeping puppet's head, in screen space
	const hx = W / 2 + (0.43 * W - W / 2) * s + tx;
	const hy = H / 2 + (0.455 * H - H / 2) * s + ty;
	const birds = inv(111.8, 114.1, t);
	const flap = (n: number) => (Math.floor(stepT(t, 6) * 6 + n) % 2 === 0 ? 1 : 0.45);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<Img src={treeFrame(k)} style={{position: 'absolute', width: W, height: H, objectFit: 'cover', transform: `translate(${tx}px, ${ty}px) scale(${s})`}} />
			<Dust t={t} count={70} area={[150, 0, 1750, hy]} opacity={0.4 + 0.5 * u} />
			<RisingWords t={t} t0={105.1} every={0.36} count={24} sx={hx} sy={hy - 10} spread={620} rise={hy - 60} life={3.6} />
			{birds > 0 ? (
				<>
					<Cut name="cut_birds_1" x={lerp(900, 2150, birds)} y={lerp(300, -120, birds)} h={130} anchor="center" sy={flap(0)} shadow={0.15} shade={0} />
					<Cut name="cut_birds_3" x={lerp(1100, 1950, birds * 1.1)} y={lerp(380, 60, birds)} h={110} anchor="center" sy={flap(1)} shadow={0.15} shade={0} />
				</>
			) : null}
			<FgStars t={t} />
			<Wash color={`radial-gradient(ellipse 60% 50% at 45% 35%, rgba(255,200,120,${0.25 * u}), rgba(0,0,0,0) 70%)`} mode="screen" />
		</AbsoluteFill>
	);
};

// S18 the mouse walks slowly among the roots
export const S18: React.FC<{t: number}> = ({t}) => {
	const st = stepT(t);
	const u = inv(114.1, 118.22, st);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<PlateShot name="plate_roots" p={u} from={{s: 1.12, x: 40, y: -30}} to={{s: 1.1, x: -40, y: -30}} />
			<Dust t={t} count={60} area={[0, 0, 1920, 1000]} opacity={0.75} />
			<RisingWords t={t} t0={113.6} every={0.6} count={7} sx={960} sy={760} spread={700} rise={420} life={3.4} scale={0.9} />
			<Cut name="cut_mouse_walk_lace" x={lerp(520, 1180, u)} y={1010 + (Math.floor(st * 12) % 2) * -4} h={210} rot={boil(t, 4, 1.2)} shadow={0.5} shade={0.15} />
			<Wash color="rgba(255,190,100,0.15)" mode="soft-light" />
		</AbsoluteFill>
	);
};

// S23a the tree starts to lose its leaves
export const S23a: React.FC<{t: number}> = ({t}) => {
	const u = inv(148.24, 151.6, t);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={treeFrame(112)} style={{position: 'absolute', width: W, height: H, transform: `scale(${lerp(1.05, 1.1, u)})`, filter: `saturate(${lerp(0.9, 0.55, u)}) brightness(${lerp(1, 0.85, u)})`}} />
			<Falling
				t={t}
				t0={147.6}
				items={['cut_leaves_1', 'cut_leaves_2', 'cut_leaves_3', 'cut_leaves_4', 'cut_leaves_5', 'cut_leaves_6', 'cut_leaves_7', 'cut_leaves_8']}
				count={26}
				size={[70, 130]}
				speed={260}
				render={(n, x, y, h, rot, key) => <Cut key={key} name={n} x={x} y={y} h={h} anchor="center" rot={rot} shadow={0.35} shade={0} filter="saturate(0.7)" />}
			/>
			<Wash color="rgba(70,90,140,0.25)" mode="soft-light" />
		</AbsoluteFill>
	);
};
