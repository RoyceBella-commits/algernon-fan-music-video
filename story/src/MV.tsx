import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import {Lyrics} from './components/Lyrics';
import {Grain, Vignette, Black} from './components/Overlays';
import {lyricLayout} from './lyricLayout';
import {FPS, inv} from './lib/time';
import {S01, S02, S03, S04} from './scenes/Intro';
import {PageToBakery} from './scenes/PageToBakery';
import {BreadRise} from './scenes/BreadRise';
import {S10, S11, S12, S13, S14, S15} from './scenes/Verse2';
import {S16, S17, S18, S23a} from './scenes/Tree';
import {S20a, S20b, S23b, S23c, S24} from './scenes/Bridge';
import {S25, S26, S27, S28, S29, S31, S32, Seasons, BookClose} from './scenes/Ending';
import {MazeRace, RootRace, FormulaWalls, SlowMouse, CalmMaze} from './scenes/MazeScenes';

// The song is not in the repo: drop your own copy at public/audio/song.m4a (npm run sync -- song.flac) for preview.
export const HAS_AUDIO = () => getStaticFiles().some((f) => f.name === 'audio/song.m4a');

type Shot = {id: string; from: number; to: number; C?: React.FC<{t: number}>; xf?: number};

// Song-time edit list. xf = crossfade-in duration (s).
export const SHOTS: Shot[] = [
	{id: 'S01', from: 0, to: 7.13, C: S01},
	{id: 'S02', from: 7.13, to: 13.73, C: S02},
	{id: 'S03', from: 13.73, to: 20.43, C: S03},
	{id: 'S04', from: 20.43, to: 27.97, C: S04, xf: 0.5},
	{id: 'S05-06', from: 27.97, to: 44.05, C: PageToBakery, xf: 0.6},
	{id: 'S07', from: 44.05, to: 50.71, C: BreadRise},
	{id: 'S08', from: 50.71, to: 54.75, C: MazeRace},
	{id: 'S09', from: 54.75, to: 65.0, C: MazeRace},
	{id: 'S10', from: 65.0, to: 72.13, C: S10},
	{id: 'S11', from: 72.13, to: 78.7, C: S11},
	{id: 'S12', from: 78.7, to: 85.38, C: S12},
	{id: 'S13', from: 85.38, to: 91.27, C: S13},
	{id: 'S14', from: 91.27, to: 96.68, C: S14},
	{id: 'S15', from: 96.68, to: 100.93, C: S15},
	{id: 'S16', from: 100.93, to: 104.76, C: S16},
	{id: 'S17', from: 104.76, to: 114.1, C: S17},
	{id: 'S18', from: 114.1, to: 118.22, C: S18},
	{id: 'S19', from: 118.22, to: 127.26, C: RootRace},
	{id: 'S20a', from: 127.26, to: 129.9, C: S20a},
	{id: 'S20b', from: 129.9, to: 134.27, C: S20b},
	{id: 'S21', from: 134.27, to: 140.89, C: FormulaWalls},
	{id: 'S22', from: 140.89, to: 148.24, C: SlowMouse},
	{id: 'S23a', from: 148.24, to: 151.6, C: S23a},
	{id: 'S23b', from: 151.6, to: 154.83, C: S23b},
	{id: 'S23c', from: 154.83, to: 157.43, C: S23c},
	{id: 'S24', from: 157.43, to: 164.1, C: S24},
	{id: 'S25', from: 164.1, to: 170.85, C: S25},
	{id: 'S26', from: 170.85, to: 180.86, C: S26},
	{id: 'S27', from: 180.86, to: 187.63, C: S27},
	{id: 'S28', from: 187.63, to: 194.32, C: S28},
	{id: 'S29', from: 194.32, to: 198.06, C: S29},
	{id: 'S30', from: 198.06, to: 207.84, C: CalmMaze},
	{id: 'S31', from: 207.84, to: 220.5, C: S31},
	{id: 'S32', from: 220.5, to: 223.42, C: S32},
	{id: 'S33', from: 223.42, to: 238.0, C: Seasons},
	{id: 'S34', from: 238.0, to: 254.2, C: BookClose, xf: 0.25},
];

const Placeholder: React.FC<{id: string}> = ({id}) => (
	<AbsoluteFill style={{background: '#1a1512', alignItems: 'center', justifyContent: 'center', color: '#8a7a66', fontFamily: 'Mincho', fontSize: 60}}>{id}</AbsoluteFill>
);

const ShotView: React.FC<{s: Shot; t: number}> = ({s, t}) => (s.C ? <s.C t={t} /> : <Placeholder id={s.id} />);

export const MVBody: React.FC<{t: number}> = ({t}) => {
	const i = SHOTS.findIndex((s) => t >= s.from && t < s.to);
	const cur = SHOTS[Math.max(0, i)];
	const next = SHOTS[i + 1];
	const xfNext = next?.xf && t > next.from - next.xf ? inv(next.from - next.xf, next.from, t) : 0;
	return (
		<AbsoluteFill>
			<ShotView s={cur} t={t} />
			{xfNext > 0 ? (
				<AbsoluteFill style={{opacity: xfNext}}>
					<ShotView s={next} t={t} />
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};

export const MV: React.FC<{from?: number}> = ({from = 0}) => {
	const frame = useCurrentFrame();
	const t = from + frame / FPS;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{HAS_AUDIO() ? <Audio src={staticFile('audio/song.m4a')} startFrom={Math.round(from * FPS)} /> : null}
			<MVBody t={t} />
			<Lyrics t={t} layout={lyricLayout(t)} />
			<Vignette strength={0.5 * (1 - 0.6 * inv(249.5, 250.3, t))} />
			<Grain t={t} opacity={0.11} />
			<Black opacity={t < 0.5 ? 1 : 0} />
		</AbsoluteFill>
	);
};
