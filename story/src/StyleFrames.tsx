import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PlateShot} from './scenes/PlateStill';
import {PageToBakery} from './scenes/PageToBakery';
import {LINES, LyricText} from './components/Lyrics';
import {Grain, Vignette, Wash} from './components/Overlays';

const lineAt = (i: number) => {
	const L = LINES[i];
	return {...L, start: L.start - 30, end: L.end + 30};
};
const at = (i: number) => LINES[i].start - 27;

// S02: the mouse's first look (POV)
export const SF_S02: React.FC = () => (
	<AbsoluteFill>
		<PlateShot name="s02_pov" p={0.5} bloom={0.35} filter="blur(2px) saturate(1.05)" />
		<LyricText line={lineAt(1)} t={at(1)} layout={{x: 1790, y: 150, vertical: true, size: 46}} />
		<Vignette strength={0.55} />
		<Grain t={13} opacity={0.12} />
	</AbsoluteFill>
);

// S05: barefoot on the diary page
export const SF_S05: React.FC = () => (
	<AbsoluteFill>
		<PageToBakery t={33.2} />
		<LyricText line={lineAt(4)} t={at(4)} layout={{x: 1720, y: 190, vertical: true, size: 54}} />
		<Vignette strength={0.6} />
		<Grain t={33} opacity={0.12} />
	</AbsoluteFill>
);

// S17: the tree growing from the centre of his head
export const SF_S17: React.FC = () => (
	<AbsoluteFill>
		<PlateShot name="s17_tree" p={0.5} bloom={0.25} />
		<LyricText line={lineAt(15)} t={at(15)} layout={{x: 1840, y: 80, vertical: true, size: 40, split: true}} />
		<Vignette strength={0.5} />
		<Grain t={105} opacity={0.11} />
	</AbsoluteFill>
);

// S25: the collapsing tower (forgetting)
export const SF_S25: React.FC = () => (
	<AbsoluteFill>
		<PlateShot name="s25_tower" p={0.5} filter="saturate(0.55) contrast(0.95) brightness(0.95)" />
		<Wash color="rgba(80,100,130,0.25)" mode="soft-light" />
		<LyricText line={lineAt(25)} t={at(25)} layout={{x: 120, y: 1000, size: 44, color: '#ece8e2'}} />
		<Vignette strength={0.45} />
		<Grain t={165} opacity={0.13} />
	</AbsoluteFill>
);
