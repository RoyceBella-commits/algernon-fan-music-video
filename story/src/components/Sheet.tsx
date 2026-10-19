import React from 'react';
import {Img} from 'remotion';

/**
 * Items that live *on* a Floor sheet (sheet-local px, origin top-left, +y toward camera).
 * lie: 0 upright, 1 flat (folded back toward -y).
 */
export const StandOnSheet: React.FC<{
	src: string;
	w: number;
	h: number;
	x: number; // bottom-centre in sheet px
	y: number;
	lie?: number;
	tiltZ?: number;
	brightness?: number;
	blur?: number;
	shadow?: number;
	shadowLen?: number;
	shadowSkew?: number;
	flipX?: boolean;
	opacity?: number;
	shade?: number; // darken toward the feet (light falloff), clipped to the cut-out
	elev?: number; // hang above the sheet (px, no contact shadow)
	contact?: number; // small dark contact shadow at the base
	children?: React.ReactNode;
}> = ({src, w, h, x, y, lie = 0, tiltZ = 0, brightness = 1, blur = 0, shadow = 0.4, shadowLen = 0.5, shadowSkew = -30, flipX, opacity = 1, shade = 0.3, contact = 0.5, elev = 0, children}) => {
	const ang = -90 * (1 - lie);
	const up = Math.max(0, Math.min(1, 1 - lie));
	const k = 1 + (shadowLen - 1) * up;
	const base: React.CSSProperties = {position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, transformOrigin: '50% 100%'};
	const filt = [brightness !== 1 ? `brightness(${brightness})` : '', blur > 0.3 ? `blur(${blur}px)` : ''].filter(Boolean).join(' ');
	return (
		<>
			{shadow > 0 ? (
				<div style={{...base, transform: `translateZ(0.8px) skewX(${shadowSkew * up}deg) scaleY(${k})`, opacity: shadow * opacity * (0.25 + 0.75 * up)}}>
					<Img src={src} style={{width: '100%', height: '100%', filter: `brightness(0) blur(${6 + 12 * up}px)`, transform: flipX ? 'scaleX(-1)' : undefined}} />
				</div>
			) : null}
			{contact > 0 && up > 0.5 && elev === 0 ? (
				<div
					style={{
						position: 'absolute',
						left: x - w * 0.42,
						top: y - h * 0.035,
						width: w * 0.84,
						height: h * 0.07,
						borderRadius: '50%',
						background: 'rgba(20,10,4,0.9)',
						filter: `blur(${h * 0.012}px)`,
						opacity: contact * opacity * (up - 0.5) * 2,
						transform: 'translateZ(0.9px)',
					}}
				/>
			) : null}
			<div style={{...base, transformStyle: 'preserve-3d', transform: `translateZ(${1.2 + elev}px) rotateX(${ang}deg) rotateZ(${tiltZ}deg)`, opacity}}>
				<Img src={src} style={{width: '100%', height: '100%', filter: filt || undefined, transform: flipX ? 'scaleX(-1)' : undefined}} />
				{shade > 0 ? (
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: `linear-gradient(170deg, rgba(255,214,150,${shade * 0.35}) 0%, rgba(0,0,0,0) 45%, rgba(25,12,5,${shade}) 100%)`,
							WebkitMaskImage: `url(${src})`,
							WebkitMaskSize: '100% 100%',
							transform: flipX ? 'scaleX(-1)' : undefined,
						}}
					/>
				) : null}
				{children}
			</div>
		</>
	);
};

/** Two-sided turning page lying on a sheet; turn 0..1 rotates it over its left edge (spine). */
export const TurningPage: React.FC<{w: number; h: number; turn: number; front: React.ReactNode; back?: React.ReactNode; z?: number}> = ({
	w,
	h,
	turn,
	front,
	back,
	z = 2,
}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			top: 0,
			width: w,
			height: h,
			transformStyle: 'preserve-3d',
			transformOrigin: '0% 50%',
			transform: `translateZ(${z}px) rotateY(${-180 * turn}deg)`,
		}}
	>
		<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transformStyle: 'preserve-3d'}}>{front}</div>
		<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(0.5px)'}}>{back}</div>
	</div>
);
