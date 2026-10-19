import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {img} from '../lib/assets';
import {lerp, W, H} from '../lib/time';

/** Full-frame generated plate with slow camera drift and optional grade. */
export const PlateShot: React.FC<{
	name: string;
	p: number; // 0..1 progress through the shot
	from?: {s: number; x: number; y: number};
	to?: {s: number; x: number; y: number};
	filter?: string;
	bloom?: number;
}> = ({name, p, from = {s: 1.02, x: 0, y: 0}, to = {s: 1.08, x: 0, y: 0}, filter, bloom = 0}) => {
	const im = img(name);
	const s = lerp(from.s, to.s, p);
	const x = lerp(from.x, to.x, p);
	const y = lerp(from.y, to.y, p);
	const tr = `translate(${x}px, ${y}px) scale(${s})`;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<Img src={im.src} style={{position: 'absolute', width: W, height: H, objectFit: 'cover', transform: tr, filter}} />
			{bloom > 0 ? (
				<Img
					src={im.src}
					style={{position: 'absolute', width: W, height: H, objectFit: 'cover', transform: tr, filter: `blur(28px) brightness(1.2) ${filter ?? ''}`, mixBlendMode: 'screen', opacity: bloom}}
				/>
			) : null}
		</AbsoluteFill>
	);
};
