import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {HAS_AUDIO} from './MV';
import {PageToBakery} from './scenes/PageToBakery';
import {BreadRise} from './scenes/BreadRise';
import {Lyrics} from './components/Lyrics';
import {Grain, Vignette} from './components/Overlays';
import {FPS, sec2f} from './lib/time';

// 10-second motion test: end of S05 -> page turn -> pop-up bakery (S06) -> rising bread (S07)
export const MotionTest: React.FC<{songOffset: number}> = ({songOffset}) => {
	const frame = useCurrentFrame();
	const t = songOffset + frame / FPS;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{HAS_AUDIO() ? <Audio src={staticFile('audio/song.m4a')} startFrom={sec2f(songOffset)} /> : null}
			{t < 44.045 ? <PageToBakery t={t} /> : <BreadRise t={t} />}
			<Lyrics
				t={t}
				layout={(i) =>
					i === 4 ? {x: 1720, y: 190, vertical: true, size: 54} : i === 5 ? {x: 150, y: 985, size: 46} : i === 6 ? {x: 290, y: 120, vertical: true, size: 46} : null
				}
			/>
			<Vignette strength={0.5} />
			<Grain t={t} opacity={0.12} />
		</AbsoluteFill>
	);
};
