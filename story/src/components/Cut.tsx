import React from 'react';
import {Img} from 'remotion';
import {cut} from '../lib/assets';

/** 2D paper cut-out composited over a plate. (x,y) = bottom-centre (anchor 'bottom') or centre. h = height px. */
export const Cut: React.FC<{
	name: string;
	x: number;
	y: number;
	h: number;
	anchor?: 'bottom' | 'center' | 'top';
	rot?: number;
	flip?: boolean;
	opacity?: number;
	shadow?: number; // drop shadow strength 0..1
	shadowDx?: number;
	shadowDy?: number;
	shade?: number; // darken toward bottom, clipped to the cut-out
	filter?: string;
	origin?: string;
	sx?: number;
	sy?: number;
	style?: React.CSSProperties;
}> = ({name, x, y, h, anchor = 'bottom', rot = 0, flip, opacity = 1, shadow = 0.45, shadowDx = 10, shadowDy = 14, shade = 0.22, filter = '', origin, sx = 1, sy = 1, style}) => {
	const c = cut(name);
	const w = (h * c.w) / c.h;
	const top = anchor === 'bottom' ? y - h : anchor === 'center' ? y - h / 2 : y;
	const f = [shadow > 0 ? `drop-shadow(${shadowDx}px ${shadowDy}px ${h * 0.035 + 6}px rgba(18,9,3,${shadow}))` : '', filter].filter(Boolean).join(' ');
	return (
		<div
			style={{
				position: 'absolute',
				left: x - w / 2,
				top,
				width: w,
				height: h,
				opacity,
				transformOrigin: origin ?? (anchor === 'bottom' ? '50% 100%' : '50% 50%'),
				transform: `rotate(${rot}deg) scale(${(flip ? -1 : 1) * sx}, ${sy})`,
				filter: f || undefined,
				...style,
			}}
		>
			<Img src={c.src} style={{width: '100%', height: '100%', display: 'block'}} />
			{shade > 0 ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: `linear-gradient(175deg, rgba(255,214,150,${shade * 0.3}) 0%, rgba(0,0,0,0) 45%, rgba(25,12,5,${shade}) 100%)`,
						WebkitMaskImage: `url(${c.src})`,
						WebkitMaskSize: '100% 100%',
					}}
				/>
			) : null}
		</div>
	);
};

/** Size helper: width of cut-out at a given height. */
export const cutW = (name: string, h: number) => {
	const c = cut(name);
	return (h * c.w) / c.h;
};
