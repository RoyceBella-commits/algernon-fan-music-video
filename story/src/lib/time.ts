// All scene code works in *song time* (seconds), so cuts line up with the LRC / beat grid.
export const FPS = 24;
export const W = 1920;
export const H = 1080;

export const sec2f = (s: number) => Math.round(s * FPS);
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;

// Stop-motion: quantise song time to n frames per second (12 = "on twos").
export const stepT = (t: number, rate = 12) => Math.floor(t * rate + 1e-6) / rate;

export const hash = (n: number) => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
// Per-step random wobble in [-amp, amp]; changes every 1/rate s (paper "boil").
export const boil = (t: number, seed: number, amp: number, rate = 12) =>
	(hash(Math.floor(t * rate + 1e-6) * 7.13 + seed * 13.7) - 0.5) * 2 * amp;

// Damped spring step response (overshoots like a paper pop-up); x = seconds since trigger.
export const springT = (x: number, freq = 2.2, damp = 0.32) => {
	if (x <= 0) return 0;
	const w = 2 * Math.PI * freq;
	return 1 - Math.exp(-damp * w * x) * Math.cos(w * Math.sqrt(1 - damp * damp) * x);
};
