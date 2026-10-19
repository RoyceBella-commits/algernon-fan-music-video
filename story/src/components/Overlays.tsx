import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Animated film/paper grain (changes on twos). */
export const Grain: React.FC<{t: number; opacity?: number}> = ({t, opacity = 0.1}) => {
	const seed = Math.floor(t * 12);
	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
			<svg width={960} height={540} style={{width: '100%', height: '100%'}}>
				<filter id={`grain${seed}`} x="0" y="0">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed % 97} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="960" height="540" filter={`url(#grain${seed})`} />
			</svg>
		</AbsoluteFill>
	);
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.55, color = '0,0,0'}) => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
		}}
	/>
);

/** Full-frame colour wash. */
export const Wash: React.FC<{color: string; mode?: React.CSSProperties['mixBlendMode']; opacity?: number}> = ({
	color,
	mode = 'soft-light',
	opacity = 1,
}) => <AbsoluteFill style={{background: color, mixBlendMode: mode, opacity, pointerEvents: 'none'}} />;

/** Soft beam of window light sweeping across (time passing). p: 0..1 position. */
export const LightBand: React.FC<{p: number; opacity?: number; angle?: number; color?: string}> = ({
	p,
	opacity = 0.35,
	angle = 18,
	color = '255,196,120',
}) => (
	<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity, overflow: 'hidden'}}>
		<div
			style={{
				position: 'absolute',
				top: '-30%',
				height: '160%',
				width: 520,
				left: `${-30 + p * 140}%`,
				transform: `rotate(${angle}deg)`,
				background: `linear-gradient(90deg, rgba(${color},0) 0%, rgba(${color},0.9) 45%, rgba(${color},0.9) 55%, rgba(${color},0) 100%)`,
				filter: 'blur(30px)',
			}}
		/>
	</AbsoluteFill>
);

export const Black: React.FC<{opacity: number}> = ({opacity}) =>
	opacity > 0 ? <AbsoluteFill style={{background: '#000', opacity, pointerEvents: 'none'}} /> : null;

/** Fake macro depth of field: blurred copy of the scene masked outside a horizontal focus band (percent of height). */
export const TiltShift: React.FC<{blur: number; focus: number; band?: number; nearBlur?: number; children: React.ReactNode}> = ({
	blur,
	focus,
	band = 14,
	nearBlur,
	children,
}) => (
	<AbsoluteFill>
		<AbsoluteFill>{children}</AbsoluteFill>
		{blur > 0.3 ? (
			<AbsoluteFill
				style={{
					filter: `blur(${blur}px)`,
					WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${focus - band}%, rgba(0,0,0,0) ${focus + band}%, rgba(0,0,0,${nearBlur ?? 0.7}) 100%)`,
				}}
			>
				{children}
			</AbsoluteFill>
		) : null}
	</AbsoluteFill>
);

/** Rain streaks on glass (cheap procedural). */
export const Rain: React.FC<{t: number; opacity?: number; count?: number}> = ({t, opacity = 0.35, count = 70}) => {
	const items = [];
	for (let i = 0; i < count; i++) {
		const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
		const r2 = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
		const speed = 700 + r2 * 900;
		const y = ((t * speed + r1 * 2000) % 1400) - 200;
		items.push(
			<div
				key={i}
				style={{position: 'absolute', left: `${r1 * 100}%`, top: y, width: 1.5, height: 60 + r2 * 90, background: 'linear-gradient(to bottom, rgba(220,230,240,0), rgba(220,230,240,0.8))', transform: 'rotate(8deg)'}}
			/>,
		);
	}
	return <AbsoluteFill style={{opacity, pointerEvents: 'none', overflow: 'hidden', mixBlendMode: 'screen'}}>{items}</AbsoluteFill>;
};

/** Dappled sunlight through leaves (moving soft light spots). */
export const Dapple: React.FC<{t: number; opacity?: number; color?: string}> = ({t, opacity = 0.5, color = '255,226,160'}) => {
	const spots = [];
	for (let i = 0; i < 26; i++) {
		const r1 = Math.abs(Math.sin(i * 3.1 + 1) * 9999) % 1;
		const r2 = Math.abs(Math.sin(i * 7.7 + 2) * 9999) % 1;
		const x = r1 * 100 + Math.sin(t * 0.7 + i) * 1.6;
		const y = 45 + r2 * 55 + Math.cos(t * 0.5 + i * 2) * 1.2;
		const s = 50 + r2 * 120;
		spots.push(
			<div key={i} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: s, height: s * 0.45, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${color},0.9), rgba(${color},0) 70%)`, transform: 'translate(-50%,-50%)'}} />,
		);
	}
	return <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity, pointerEvents: 'none'}}>{spots}</AbsoluteFill>;
};

/** Things that fall with stop-motion stepping (leaves, scraps, snow). items: cut-out names */
export const Falling: React.FC<{t: number; t0: number; items: string[]; count: number; size: [number, number]; speed?: number; seed?: number; sway?: number; render: (name: string, x: number, y: number, h: number, rot: number, key: number) => React.ReactNode}> = ({
	t,
	t0,
	items,
	count,
	size,
	speed = 220,
	seed = 1,
	sway = 60,
	render,
}) => {
	const st = Math.floor(t * 12) / 12;
	const out = [];
	for (let i = 0; i < count; i++) {
		const r = (k: number) => Math.abs(Math.sin((i + 1) * (k + 3.7) * 12.9898 + seed * 7.1) * 43758.5453) % 1;
		const start = t0 + r(1) * 4;
		const age = st - start;
		if (age < 0) continue;
		const y = -120 + age * speed * (0.7 + r(2) * 0.6);
		if (y > 1250) continue;
		const x = r(3) * 1920 + Math.sin(age * 2.2 + r(4) * 6) * sway;
		const h = size[0] + r(5) * (size[1] - size[0]);
		out.push(render(items[i % items.length], x, y, h, Math.sin(age * 3 + r(6) * 6) * 40, i));
	}
	return <>{out}</>;
};
