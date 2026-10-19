import React from 'react';
import {Composition} from 'remotion';
import {MotionTest} from './MotionTest';
import {MV} from './MV';
import {Cover} from './Cover';
import {SF_S02, SF_S05, SF_S17, SF_S25} from './StyleFrames';
import {loadFonts} from './lib/fonts';
import {FPS, W, H, sec2f} from './lib/time';

loadFonts();

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="MV" component={MV} durationInFrames={sec2f(254.2)} fps={FPS} width={W} height={H} defaultProps={{from: 0}} />
		<Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={W} height={H} defaultProps={{name: 'cover_a', title: true}} />
		<Composition id="MotionTest" component={MotionTest} durationInFrames={sec2f(11)} fps={FPS} width={W} height={H} defaultProps={{songOffset: 36.4}} />
		<Composition id="SF-S02" component={SF_S02} durationInFrames={1} fps={FPS} width={W} height={H} />
		<Composition id="SF-S05" component={SF_S05} durationInFrames={1} fps={FPS} width={W} height={H} />
		<Composition id="SF-S17" component={SF_S17} durationInFrames={1} fps={FPS} width={W} height={H} />
		<Composition id="SF-S25" component={SF_S25} durationInFrames={1} fps={FPS} width={W} height={H} />
	</>
);
