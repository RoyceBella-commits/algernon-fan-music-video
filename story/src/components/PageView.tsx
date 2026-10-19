import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Handwriting, HandLine, NB} from './Notebook';
import {img} from '../lib/assets';
import {W, H} from '../lib/time';

/**
 * Top-down notebook page on the desk (2D). The page is drawn in plate px * scale, placed at (px,py) with rotation.
 * cam: zoom about a focus point given in page-plate coords (fx,fy), shown at screen centre offset (sx,sy).
 */
export const PageView: React.FC<{
	t: number;
	lines: HandLine[];
	id: string;
	scale?: number;
	rot?: number;
	zoom?: number;
	fx?: number;
	fy?: number;
	sx?: number;
	sy?: number;
	pageFilter?: string;
	light?: number; // lamp brightness 0..1
	children?: React.ReactNode; // in page px space (plate px * scale)
	paper?: string;
}> = ({t, lines, id, scale = 1.3, rot = -2, zoom = 1, fx = 836, fy = 470, sx = W / 2, sy = H / 2, pageFilter, light = 1, children, paper = 'plate_notebook'}) => {
	const desk = img('plate_desk_top');
	const page = img(paper);
	const pw = NB.w * scale;
	const ph = NB.h * scale;
	// transform so that page point (fx,fy)*scale lands at screen (sx,sy) after zoom
	const tr = `translate(${sx}px, ${sy}px) scale(${zoom}) rotate(${rot}deg) translate(${-fx * scale}px, ${-fy * scale}px)`;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: `brightness(${light})`}}>
				<div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: tr}}>
					<Img src={desk.src} style={{position: 'absolute', left: -pw * 0.6, top: -ph * 0.6, width: pw * 2.2, height: ph * 2.2, filter: 'brightness(0.75)'}} />
					<div style={{position: 'absolute', left: 0, top: 0, width: pw, height: ph, boxShadow: '0 30px 60px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.4)'}}>
						<Img src={page.src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: pageFilter}} />
						<Handwriting lines={lines} t={t} scale={scale} id={id} />
						{children}
					</div>
				</div>
				{/* desk lamp pool */}
				<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 32% 28%, rgba(255,200,130,0.28) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)', mixBlendMode: 'multiply'}} />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 30% 25%, rgba(255,190,110,0.22) 0%, rgba(0,0,0,0) 70%)', mixBlendMode: 'screen'}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
