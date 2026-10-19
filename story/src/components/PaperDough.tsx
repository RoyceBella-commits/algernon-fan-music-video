import React from 'react';

/**
 * Layered cut-paper dough: a stack of paper ellipses forming a dome.
 * rise 0 = flat disc, 1 = tall proof. Seen slightly from above. (x,y) = base centre.
 */
// hand-cut ellipse outline (slightly irregular scissor edge)
const wobbly = (seed: number) => {
	const pts = [];
	for (let k = 0; k < 36; k++) {
		const a = (k / 36) * Math.PI * 2;
		const r = 0.5 * (1 + 0.035 * Math.sin(a * 5 + seed) + 0.025 * Math.sin(a * 11 + seed * 2.1));
		pts.push(`${(50 + Math.cos(a) * r * 100).toFixed(2)}% ${(50 + Math.sin(a) * r * 100).toFixed(2)}%`);
	}
	return `polygon(${pts.join(',')})`;
};

export const PaperDough: React.FC<{x: number; y: number; w: number; rise: number; layers?: number; seed?: number}> = ({
	x,
	y,
	w,
	rise,
	layers = 13,
	seed = 0,
}) => {
	const Hmax = w * 0.46;
	const Ht = Hmax * (0.12 + 0.88 * rise);
	const width = w * (0.86 + 0.14 * rise);
	const items = [];
	for (let i = 0; i < layers; i++) {
		const u = i / layers;
		const lw = width * Math.sqrt(Math.max(0, 1 - u * u)) * (0.98 + 0.04 * Math.sin(i * 1.7 + seed));
		const lh = lw * 0.26;
		const cy = y - u * Ht;
		const shade = 0.86 + 0.14 * u;
		items.push(
			<div
				key={i}
				style={{
					position: 'absolute',
					left: x - lw / 2 + Math.sin(i * 2.3 + seed) * w * 0.006,
					top: cy - lh / 2,
					width: lw,
					height: lh,
					clipPath: wobbly(i + seed * 17),
					background: `radial-gradient(ellipse 70% 80% at 38% 35%, rgb(${252 * shade},${240 * shade},${214 * shade}) 0%, rgb(${232 * shade},${212 * shade},${172 * shade}) 70%, rgb(${205 * shade},${178 * shade},${134 * shade}) 100%)`,
					filter: `drop-shadow(0 ${w * 0.01}px ${w * 0.012}px rgba(90,55,20,0.45))`,
				}}
			/>,
		);
	}
	return <>{items}</>;
};
