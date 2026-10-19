import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {W, H} from '../lib/time';

/**
 * Paper-theatre 3D stage built from CSS 3D transforms.
 * World: x right, y down (floor at y=0, things stand at negative y), z toward camera.
 */
export type Cam = {
	x: number; // look-at point
	y: number;
	z: number;
	dist: number; // camera distance to look-at point
	tilt: number; // degrees looking down
	pan?: number; // degrees
	roll?: number;
	persp?: number; // CSS perspective (focal length-ish)
};

export const Stage: React.FC<{cam: Cam; children: React.ReactNode; bg?: string}> = ({cam, children, bg}) => {
	const p = cam.persp ?? 1500;
	return (
		<AbsoluteFill style={{perspective: p, perspectiveOrigin: '50% 50%', overflow: 'hidden', background: bg}}>
			<div
				style={{
					position: 'absolute',
					left: W / 2,
					top: H / 2,
					width: 0,
					height: 0,
					transformStyle: 'preserve-3d',
					transform: `translateZ(${p - cam.dist}px) rotateZ(${cam.roll ?? 0}deg) rotateX(${-cam.tilt}deg) rotateY(${cam.pan ?? 0}deg) translate3d(${-cam.x}px, ${-cam.y}px, ${-cam.z}px)`,
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};

/** A horizontal sheet lying on the floor (y), centred at (x,z). Children are in sheet-local px. */
export const Floor: React.FC<{
	w: number;
	d: number;
	x?: number;
	y?: number;
	z?: number;
	src?: string;
	filter?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}> = ({w, d, x = 0, y = 0, z = 0, src, filter, children, style}) => (
	<div
		style={{
			position: 'absolute',
			left: -w / 2,
			top: -d / 2,
			width: w,
			height: d,
			transformStyle: 'preserve-3d',
			transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(90deg)`,
			...style,
		}}
	>
		{src ? <Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter}} /> : null}
		{children}
	</div>
);

/**
 * Upright paper cut-out standing on the floor with its bottom-centre at (x, z).
 * lie: 0 = standing, 1 = folded flat backwards (pop-up closed). Values <0 lean forward (spring overshoot).
 * Casts a blurred shadow onto the floor away from the light.
 */
export const Standing: React.FC<{
	src: string;
	w: number;
	h: number;
	x: number;
	z: number;
	lie?: number;
	rotY?: number;
	tiltZ?: number;
	brightness?: number;
	blur?: number;
	shadow?: number; // opacity
	shadowLen?: number; // relative length when upright
	shadowSkew?: number; // degrees
	opacity?: number;
	flipX?: boolean;
	extraFilter?: string;
}> = ({
	src,
	w,
	h,
	x,
	z,
	lie = 0,
	rotY = 0,
	tiltZ = 0,
	brightness = 1,
	blur = 0,
	shadow = 0.38,
	shadowLen = 0.55,
	shadowSkew = -28,
	opacity = 1,
	flipX = false,
	extraFilter = '',
}) => {
	const ang = lie * 90;
	const up = Math.cos((Math.min(90, Math.max(0, ang)) * Math.PI) / 180); // 1 upright, 0 flat
	const k = 1 + (shadowLen - 1) * up;
	const base: React.CSSProperties = {
		position: 'absolute',
		left: -w / 2,
		top: -h,
		width: w,
		height: h,
		transformOrigin: '50% 100%',
	};
	const filt = [brightness !== 1 ? `brightness(${brightness})` : '', blur > 0.3 ? `blur(${blur}px)` : '', extraFilter]
		.filter(Boolean)
		.join(' ');
	return (
		<>
			{shadow > 0 ? (
				<div
					style={{
						...base,
						transform: `translate3d(${x}px, 0.6px, ${z}px) rotateX(90deg) skewX(${shadowSkew * up}deg) scaleY(${k})`,
						opacity: shadow * opacity * (0.3 + 0.7 * up),
					}}
				>
					<Img
						src={src}
						style={{
							width: '100%',
							height: '100%',
							filter: `brightness(0) blur(${8 + 10 * up}px)`,
							transform: flipX ? 'scaleX(-1)' : undefined,
						}}
					/>
				</div>
			) : null}
			<div
				style={{
					...base,
					transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotY}deg) rotateZ(${tiltZ}deg) rotateX(${ang}deg)`,
					opacity,
				}}
			>
				<Img
					src={src}
					style={{width: '100%', height: '100%', filter: filt || undefined, transform: flipX ? 'scaleX(-1)' : undefined}}
				/>
			</div>
		</>
	);
};
