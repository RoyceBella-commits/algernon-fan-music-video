// CSS matrix3d mapping an element of size w x h onto the quadrilateral q = [TL, TR, BR, BL] (screen px).
const adj = (m: number[]) => [
	m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
	m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
	m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
];
const mul = (a: number[], b: number[]) => {
	const c = new Array(9).fill(0);
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
	return c;
};
const mulv = (m: number[], v: number[]) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
const basis = (p: number[][]) => {
	const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
	const v = mulv(adj(m), [p[3][0], p[3][1], 1]);
	return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
};
export const quadMatrix = (w: number, h: number, q: number[][]) => {
	const s = basis([[0, 0], [w, 0], [0, h], [w, h]]);
	const d = basis([q[0], q[1], q[3], q[2]]);
	const t = mul(d, adj(s));
	for (let i = 0; i < 9; i++) t[i] /= t[8];
	return `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`;
};
