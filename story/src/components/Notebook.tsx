import React from 'react';
import {Img} from 'remotion';
import {clamp} from '../lib/time';

// Geometry of the generated notebook plate (plate_notebook.png, 1672x941).
export const NB = {w: 1672, h: 941, line0: 78, gap: 54.9, margin: 177};
export const ruled = (i: number) => NB.line0 + i * NB.gap;

const rnd = (n: number) => {
	const x = Math.sin(n * 78.233 + 12.9898) * 43758.5453;
	return x - Math.floor(x);
};

export type HandLine = {
	text: string;
	line: number; // ruled line index used as baseline
	y?: number; // explicit baseline (plate px), overrides line
	x?: number; // plate px
	size?: number; // plate px
	font?: string;
	wobble?: number; // 0 neat .. 1 very crude
	start?: number; // song time writing starts
	rate?: number; // chars per second
	color?: string;
	strike?: [number, number, number]; // strike chars [from,to) at song time
	fallAt?: number; // song time the characters start dropping off the line
	fallSeed?: number;
	fallSpread?: number; // seconds over which characters start to drop
	fallLoosen?: number; // seconds a character wobbles before it drops
	fallGravity?: number; // plate px / s^2
	dissolveAt?: number; // characters erode away (eraser / forgetting), one after another
	dissolveStagger?: number;
	dissolveDur?: number;
};

/** Pencil handwriting laid on notebook-plate coordinates. Renders inside a box of plate size * scale. */
export const Handwriting: React.FC<{lines: HandLine[]; t: number; scale: number; id: string}> = ({lines, t, scale, id}) => (
	<div style={{position: 'absolute', inset: 0}}>
		<svg width={0} height={0} style={{position: 'absolute'}}>
			<filter id={`pencil-${id}`}>
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
				<feDisplacementMap in="SourceGraphic" in2="n" scale={3.2 * scale} xChannelSelector="R" yChannelSelector="G" result="d" />
				<feComponentTransfer in="n" result="n2">
					<feFuncA type="linear" slope={1.4} intercept={-0.1} />
				</feComponentTransfer>
				<feComposite in="d" in2="n2" operator="in" />
			</filter>
		</svg>
		{lines.map((L, li) => {
			const size = (L.size ?? 40) * scale;
			const wob = L.wobble ?? 0.6;
			const chars = Array.from(L.text);
			const rate = L.rate ?? 7;
			let cx = (L.x ?? NB.margin + 26) * scale;
			const baseY = (L.y ?? ruled(L.line)) * scale;
			return chars.map((c, i) => {
				const r1 = rnd(li * 100 + i);
				const r2 = rnd(li * 100 + i + 0.5);
				const r3 = rnd(li * 100 + i + 0.25);
				const s = size * (1 + (r3 - 0.5) * 0.42 * wob);
				const adv = c === ' ' ? size * 0.55 : s * (1.0 + (r1 - 0.5) * 0.22 * wob) + size * 0.04;
				const x = cx;
				cx += adv;
				const shown = L.start === undefined || t >= L.start + i / rate;
				if (!shown || c === ' ') return null;
				const struck = L.strike && i >= L.strike[0] && i < L.strike[1] && t >= L.strike[2];
				let loosen = 0;
				let fall = 0;
				if (L.fallAt !== undefined) {
					const d = t - (L.fallAt + rnd(li * 37 + i * 3 + (L.fallSeed ?? 0)) * (L.fallSpread ?? 4.2));
					const lo = L.fallLoosen ?? 0.9;
					loosen = clamp(d / lo);
					fall = Math.max(0, d - lo);
				}
				let dz = 0;
				if (L.dissolveAt !== undefined) dz = clamp((t - (L.dissolveAt + i * (L.dissolveStagger ?? 0.35))) / (L.dissolveDur ?? 1.4));
				if (dz >= 1) return null;
				const dy = (0.5 * (L.fallGravity ?? 230) * fall * fall + loosen * 7 - dz * 14) * scale;
				const fadeFall = fall > 0 ? clamp(1 - fall / 3.2) : 1;
				return (
					<span
						key={`${li}-${i}`}
						style={{
							position: 'absolute',
							left: x,
							top: baseY - s * 1.02 + (r2 - 0.5) * size * 0.3 * wob + dy,
							fontFamily: L.font ?? 'KuaiLe',
							fontSize: s,
							lineHeight: 1,
							color: L.color ?? '#2a2726',
							opacity: 0.9 * fadeFall,
							transform: `rotate(${(r1 - 0.5) * 22 * wob + loosen * (r2 - 0.5) * 26 + fall * (r2 - 0.5) * 50}deg) skewX(${(r3 - 0.5) * 14 * wob}deg)`,
							filter: dz > 0 ? `url(#pencil-${id}) url(#dz-${id}-${li}-${i}) blur(${dz * 2.2}px)` : `url(#pencil-${id})`,
							mixBlendMode: 'multiply',
						}}
					>
						{dz > 0 ? (
							<svg width={0} height={0} style={{position: 'absolute'}}>
								<filter id={`dz-${id}-${li}-${i}`} x="-20%" y="-20%" width="140%" height="140%">
									<feTurbulence type="fractalNoise" baseFrequency={0.09 / scale} numOctaves={2} seed={i * 7 + li} result="n" />
									<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="na" />
									<feComponentTransfer in="na" result="m">
										<feFuncA type="linear" slope={7} intercept={3.4 - 8.2 * dz} />
									</feComponentTransfer>
									<feComposite in="SourceGraphic" in2="m" operator="in" />
								</filter>
							</svg>
						) : null}
						{dz > 0
							? Array.from({length: 7}).map((_, k) => {
									const a = rnd(li * 13 + i * 5 + k);
									const b = rnd(li * 17 + i * 3 + k + 0.5);
									return (
										<span
											key={`d${k}`}
											style={{position: 'absolute', left: `${a * 100}%`, top: `${30 + b * 50}%`, width: 3 * scale, height: 3 * scale, borderRadius: '50%', background: '#3a3634', opacity: Math.sin(Math.PI * dz) * 0.7, transform: `translate(${(a - 0.5) * 40 * dz * scale}px, ${-dz * (40 + b * 50) * scale}px)`}}
										/>
									);
								})
							: null}
						{c}
						{struck ? (
							<span
								style={{
									position: 'absolute',
									left: '-8%',
									width: '116%',
									top: '50%',
									height: Math.max(2, size * 0.07),
									background: L.color ?? '#33302d',
									transform: `rotate(${(r2 - 0.5) * 8}deg)`,
								}}
							/>
						) : null}
					</span>
				);
			});
		})}
	</div>
);

/** Notebook plate + handwriting, as a flat block (use inside Floor or 2D). */
export const NotebookPage: React.FC<{src: string; scale: number; lines: HandLine[]; t: number; id: string; filter?: string}> = ({
	src,
	scale,
	lines,
	t,
	id,
	filter,
}) => (
	<div style={{position: 'absolute', left: 0, top: 0, width: NB.w * scale, height: NB.h * scale}}>
		<Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter}} />
		<Handwriting lines={lines} t={t} scale={scale} id={id} />
	</div>
);
