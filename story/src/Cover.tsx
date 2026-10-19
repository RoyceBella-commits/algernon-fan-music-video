import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {img} from './lib/assets';

// YouTube/Bilibili cover. Title sits inside the central 4:3 safe area (x 240-1680).
export const Cover: React.FC<{name: string; title: boolean}> = ({name, title}) => (
	<AbsoluteFill style={{background: '#000'}}>
		<Img src={img(name).src} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 75% at 50% 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)'}} />
		{title ? (
			<>
				{/* soft dark halo behind the title so it separates from the bokeh */}
				<div style={{position: 'absolute', left: 1400, top: 90, width: 300, height: 760, background: 'radial-gradient(ellipse 50% 50% at 60% 50%, rgba(5,8,22,0.55), rgba(5,8,22,0) 75%)', filter: 'blur(10px)'}} />
				<div
					style={{
						position: 'absolute',
						left: 1632,
						top: 150,
						transform: 'translateX(-100%)',
						writingMode: 'vertical-rl',
						fontFamily: 'Mincho',
						fontSize: 82,
						letterSpacing: '0.1em',
						color: '#fdf4e1',
						textShadow: '0 0 22px rgba(6,10,26,0.95), 0 0 6px rgba(6,10,26,0.9), 0 2px 2px rgba(6,10,26,0.7), 0 0 40px rgba(255,200,120,0.3)',
						whiteSpace: 'nowrap',
					}}
				>
					アルジャーノン
				</div>
				<div
					style={{
						position: 'absolute',
						left: 1530,
						top: 650,
						transform: 'translateX(-100%)',
						writingMode: 'vertical-rl',
						fontFamily: 'Mincho',
						fontSize: 34,
						letterSpacing: '0.28em',
						color: '#f3e7cf',
						textShadow: '0 0 16px rgba(6,10,26,0.95), 0 0 4px rgba(6,10,26,0.9)',
						whiteSpace: 'nowrap',
					}}
				>
					ヨルシカ
				</div>
			</>
		) : null}
	</AbsoluteFill>
);
