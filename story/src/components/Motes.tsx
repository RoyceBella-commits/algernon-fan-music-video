import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, hash} from '../lib/time';

export const FRAGMENTS = ['E = mc²', '∫ f(x) dx', 'π', 'Ψ', '♪', 'λ', '√2', '∞', 'Σ', 'Mozart', 'Newton', 'Ich denke', 'λόγος', 'φ', '知', '书', '星', '梦', '地图', 'Δ', '♫', 'a² + b² = c²', 'Il faut', 'dI/dt', '为什么', 'Algernon'];

/** Handwritten fragments of knowledge rising from a point (sx,sy) and drifting into the crown. */
export const RisingWords: React.FC<{t: number; t0: number; every: number; count: number; sx: number; sy: number; spread?: number; rise?: number; life?: number; scale?: number}> = ({
	t,
	t0,
	every,
	count,
	sx,
	sy,
	spread = 650,
	rise = 520,
	life = 3.4,
	scale = 1,
}) => {
	const out = [];
	for (let i = 0; i < count; i++) {
		const born = t0 + i * every;
		const a = (t - born) / life;
		if (a < 0 || a > 1) continue;
		const r1 = hash(i * 3.1 + 1);
		const r2 = hash(i * 7.7 + 2);
		const ease = 1 - Math.pow(1 - a, 2);
		const x = sx + (r1 - 0.5) * 40 + (r1 - 0.5) * 2 * spread * ease + Math.sin(a * 6 + i) * 18;
		const y = sy - rise * ease * (0.7 + r2 * 0.6);
		const op = clamp(a / 0.15) * clamp((1 - a) / 0.35);
		const word = FRAGMENTS[i % FRAGMENTS.length];
		const cjk = /[一-鿿]/.test(word);
		out.push(
			<div
				key={i}
				style={{
					position: 'absolute',
					left: x,
					top: y,
					transform: `translate(-50%,-50%) rotate(${(r2 - 0.5) * 24}deg) scale(${(0.7 + a * 0.5) * scale})`,
					fontFamily: cjk ? 'WenKai' : 'MinchoM',
					fontSize: 26 + r2 * 16,
					color: '#fff2d6',
					opacity: op * 0.9,
					textShadow: '0 0 10px rgba(255,200,120,0.95), 0 0 24px rgba(255,170,80,0.6)',
					whiteSpace: 'nowrap',
				}}
			>
				{word}
			</div>,
		);
	}
	return <AbsoluteFill style={{pointerEvents: 'none'}}>{out}</AbsoluteFill>;
};

/** Warm floating dust / sparks drifting upward. */
export const Dust: React.FC<{t: number; count?: number; area?: [number, number, number, number]; color?: string; opacity?: number}> = ({
	t,
	count = 50,
	area = [0, 0, 1920, 1080],
	color = '255,214,150',
	opacity = 0.8,
}) => {
	const [x0, y0, x1, y1] = area;
	const out = [];
	for (let i = 0; i < count; i++) {
		const r1 = hash(i * 1.37 + 0.3);
		const r2 = hash(i * 2.91 + 0.7);
		const r3 = hash(i * 5.13 + 0.1);
		const h = y1 - y0;
		const y = y1 - ((t * (14 + r2 * 26) + r1 * h) % h);
		const x = x0 + r3 * (x1 - x0) + Math.sin(t * 0.6 + i) * 20;
		const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (1.5 + r1 * 2) + i));
		const s = 2 + r2 * 4;
		out.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: `rgba(${color},1)`, opacity: tw * opacity, boxShadow: `0 0 ${s * 3}px rgba(${color},0.9)`}} />);
	}
	return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>{out}</AbsoluteFill>;
};
