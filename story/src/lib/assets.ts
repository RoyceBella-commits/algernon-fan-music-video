import {staticFile} from 'remotion';
import sizes from '../data/images.json';

const S = sizes as unknown as Record<string, [number, number]>;

// Prefer the 2x upscale when present.
export const img = (name: string) => {
	const up = `img/up/${name}.png`;
	if (S[up]) return {src: staticFile(up), w: S[up][0], h: S[up][1]};
	for (const dir of ['cut', 'raw']) {
		const k = `img/${dir}/${name}.png`;
		if (S[k]) return {src: staticFile(k), w: S[k][0], h: S[k][1]};
	}
	throw new Error(`missing image ${name}`);
};
export const cut = (name: string) => {
	const k = `img/cut/${name}.png`;
	if (!S[k]) throw new Error(`missing cutout ${name}`);
	return {src: staticFile(k), w: S[k][0], h: S[k][1]};
};
