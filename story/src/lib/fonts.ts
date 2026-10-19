import {continueRender, delayRender, staticFile} from 'remotion';

const FONTS: [string, string][] = [
	['Mincho', 'fonts/ShipporiMinchoB1-SemiBold.ttf'],
	['MinchoM', 'fonts/ShipporiMinchoB1-Medium.ttf'],
	['Klee', 'fonts/KleeOne-SemiBold.ttf'],
	['WenKai', 'fonts/LXGWWenKai-Regular.ttf'],
	['KuaiLe', 'fonts/ZCOOLKuaiLe-Regular.ttf'],
];

let started = false;
export const loadFonts = () => {
	if (started || typeof document === 'undefined') return;
	started = true;
	const handle = delayRender('Loading fonts');
	Promise.all(
		FONTS.map(([family, file]) =>
			new FontFace(family, `url(${staticFile(file)})`).load().then((f) => document.fonts.add(f)),
		),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
};
