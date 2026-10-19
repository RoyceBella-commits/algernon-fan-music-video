import {LyricLayout, LyricLine} from './components/Lyrics';
import {inv} from './lib/time';

// Placement of each of the 33 lyric lines (by line number; the repo carries no lyric text).
const INK = {color: '#2a2320', shadow: '0 0 14px rgba(255,248,232,0.85), 0 0 3px rgba(255,248,232,0.9)'};
const BL = (size = 46): LyricLayout => ({x: 150, y: 985, size}); // bottom-left
const VR = (x = 1780, y = 150, size = 46): LyricLayout => ({x, y, vertical: true, size});
const VL = (x = 260, y = 130, size = 46): LyricLayout => ({x, y, vertical: true, size});
const TRIPLE = (k: number): LyricLayout => ({x: 960, y: 560, size: 64, align: 'center', scatter: [0, 0.45, 1.0][k], spacing: [0.14, 0.2, 0.32][k], ...(k === 1 ? INK : {})});

type F = (t: number, line: LyricLine) => LyricLayout | null;
const LAYOUT: F[] = [
	/* 0  S01 page      */ () => ({...VR(1790, 140, 46), ...INK}),
	/* 1  S02 eyes/POV  */ (t) => (t < 10.43 ? {...VL(330, 150, 48), ...INK} : VR(1790, 150, 48)),
	/* 2  S03 sky       */ () => BL(46),
	/* 3  S04 night     */ () => VR(1800, 170),
	/* 4  S05 barefoot  */ () => VR(1720, 190, 54),
	/* 5  S06 bakery    */ () => BL(46),
	/* 6  S07 bread     */ () => VL(290, 120),
	/* 7  S08 maze      */ () => BL(46),
	/* 8  S09 maze race — written on the maze floor (MazeScenes) */ () => null,
	/* 9  S10 name tag  */ (t) => (t < 69.6 ? {...VR(1760, 150, 48), ...INK} : VR(1760, 150, 48)),
	/* 10 S11 paws      */ () => VR(1780, 150),
	/* 11 S12 sea       */ () => BL(46),
	/* 12 S13 sun       */ () => VR(1790, 140),
	/* 13 S14 yawn      */ () => VR(1790, 200, 50),
	/* 14 S16 sleep     */ () => VR(1800, 160),
	/* 15 S17 tree      */ () => ({x: 1840, y: 80, vertical: true, size: 40, split: true}),
	/* 16 S18 roots     */ () => ({x: 960, y: 140, size: 46, align: 'center'}),
	/* 17 S19 root maze */ () => BL(46),
	/* 18 S20 city      */ () => BL(44),
	/* 19 S21 walls     */ () => ({x: 960, y: 150, size: 46, align: 'center'}),
	/* 20 S22 rain      */ () => BL(44),
	/* 21 S23a ×3       */ () => TRIPLE(0),
	/* 22 S23b          */ () => TRIPLE(1),
	/* 23 S23c          */ () => TRIPLE(2),
	/* 24 S24 forgetting*/ (t, l) => ({x: 960, y: 1000, size: 46, align: 'center', fall: inv(l.start + 4.0, l.end + 2.2, t), ...INK}),
	/* 25 S25 tower     */ () => ({x: 120, y: 1000, size: 44, color: '#ece8e2'}),
	/* 26 S26 box       */ () => BL(46),
	/* 27 S26 lid       */ () => BL(46),
	/* 28 S27 bakery    */ () => BL(46),
	/* 29 S28 backyard  */ () => VR(1800, 140, 46),
	/* 30 S29 running   */ () => BL(46),
	/* 31 S30 maze      */ () => BL(46),
	/* 32 S31 alone     */ () => ({x: 960, y: 590, size: 66, align: 'center', font: 'Klee', spacing: 0.22}),
];

export const lyricLayout = (t: number) => (i: number, line: LyricLine): LyricLayout | null => (LAYOUT[i] ? LAYOUT[i](t, line) : BL(46));
