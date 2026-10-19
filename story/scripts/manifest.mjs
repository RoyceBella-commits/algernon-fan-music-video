// Writes src/data/images.json: {"img/<dir>/<name>.png": [width, height]} for every PNG under public/img
import fs from 'node:fs';
import path from 'node:path';

const pngSize = (file) => {
	const b = Buffer.alloc(24);
	const fd = fs.openSync(file, 'r');
	fs.readSync(fd, b, 0, 24, 0);
	fs.closeSync(fd);
	return [b.readUInt32BE(16), b.readUInt32BE(20)];
};
const out = {};
for (const dir of ['cut', 'raw', 'up']) {
	const d = path.join('public/img', dir);
	if (!fs.existsSync(d)) continue;
	for (const f of fs.readdirSync(d).sort()) if (f.endsWith('.png')) out[`img/${dir}/${f}`] = pngSize(path.join(d, f));
}
fs.writeFileSync('src/data/images.json', JSON.stringify(out, null, 0).replace(/\],/g, '],\n'));
console.log(Object.keys(out).length, 'images');
