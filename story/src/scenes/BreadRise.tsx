import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {PaperDough} from '../components/PaperDough';
import {LightBand, Wash} from '../components/Overlays';
import {img, cut} from '../lib/assets';
import {boil, easeOut, inv, lerp, stepT, W, H} from '../lib/time';

// S07 (44.05-50.71): honeycomb-paper dough slowly rises on the tray, the crude paper mouse watches.
export const BreadRise: React.FC<{t: number}> = ({t}) => {
	const plate = img('plate_tray');
	const mouse = cut('cut_mouse_crude_sit');
	const st = stepT(t);
	const push = easeOut(inv(44.05, 50.7, t));
	const k = W / 1672; // plate px -> screen
	const loaves = [
		{x: 640, t0: 44.35},
		{x: 835, t0: 44.77},
		{x: 1030, t0: 45.19},
	];
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${lerp(1.0, 1.08, push)})`, transformOrigin: '52% 62%'}}>
				<Img src={plate.src} style={{width: W, height: H, objectFit: 'cover'}} />
				{/* dough: layered paper ellipses rising on twos */}
				{loaves.map((l, i) => {
					const o = easeOut(inv(l.t0, l.t0 + 5.2, st));
					return (
						<React.Fragment key={i}>
							<div
								style={{
									position: 'absolute',
									left: l.x * k - 125,
									top: 640 * k - 18,
									width: 250,
									height: 52,
									borderRadius: '50%',
									background: 'rgba(25,12,4,0.5)',
									filter: 'blur(10px)',
								}}
							/>
							<PaperDough x={l.x * k + boil(t, i, 1.5)} y={640 * k} w={225} rise={o} seed={i * 3} />
						</React.Fragment>
					);
				})}
				{/* the paper mouse watching */}
				<div
					style={{
						position: 'absolute',
						left: 1390,
						top: 778 - 330,
						width: 330 * (mouse.w / mouse.h),
						height: 330,
						transformOrigin: '60% 100%',
						transform: `scaleX(-1) rotate(${-2 + boil(t, 11, 1.2) + (st > 46.6 ? -4 : 0)}deg)`,
					}}
				>
					<div style={{position: 'absolute', left: '10%', bottom: -8, width: '80%', height: 24, borderRadius: '50%', background: 'rgba(15,8,3,0.5)', filter: 'blur(9px)'}} />
					<Img src={mouse.src} style={{width: '100%', height: '100%'}} />
				</div>
			</AbsoluteFill>
			<LightBand p={inv(44.0, 51.5, t)} opacity={0.22} angle={20} />
			<Wash color="rgba(255,150,70,0.18)" mode="soft-light" />
		</AbsoluteFill>
	);
};
