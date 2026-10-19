import {HandLine} from '../components/Notebook';

// Notebook pages. Wording paraphrases the novel's progress reports in Charlie's voice (not a published translation).
// Crude pages: no punctuation, homophone mistakes, wobbly ("近步抱告").
const CR = {font: 'KuaiLe', wobble: 1.35};

export const NB0: HandLine[] = [
	{text: '近步抱告 1', line: 1, x: 205, size: 50, ...CR},
	{text: '3月3日', line: 1, x: 1250, size: 40, ...CR},
	{text: '斯特劳斯医生说我因该把想到的', line: 3, size: 42, ...CR},
	{text: '和记得的事都写下来', line: 4, size: 42, ...CR},
	{text: '我叫查理高登 在唐纳面包店工做', line: 5, size: 42, ...CR},
	{text: '我三十二岁了', line: 6, size: 42, ...CR},
];

export const NB2 = (t0: number): HandLine[] => [
	{text: '近步抱告', line: 1, x: 205, size: 46, ...CR, strike: [0, 4, t0 + 0.5]},
	{text: '进步报告 9', line: 1, x: 420, size: 44, font: 'KuaiLe', wobble: 0.7, start: t0 + 0.9, rate: 6},
	{text: '4月8日', line: 1, x: 1250, size: 38, font: 'KuaiLe', wobble: 0.7},
	{text: '金尼安小姐教我标点符号，', line: 3, size: 40, font: 'KuaiLe', wobble: 0.75},
	{text: '她说，标点；很重要？', line: 4, size: 40, font: 'KuaiLe', wobble: 0.75},
	{text: '我现在：每个字，都想、', line: 5, size: 40, font: 'KuaiLe', wobble: 0.75},
	{text: '加，标点！！', line: 6, size: 40, font: 'KuaiLe', wobble: 0.75, start: t0 + 2.4, rate: 5},
];

// Peak pages (dense, neat, multi-lingual) for the fast flip at the start of the bridge.
const NEAT = {font: 'WenKai', wobble: 0.08};
export const DENSE: HandLine[][] = [
	[
		{text: '进步报告 11　5月20日', line: 1, size: 34, ...NEAT},
		{text: '今天读完了图书馆里所有关于心理学的书。', line: 2, size: 30, ...NEAT},
		{text: 'I(t) = I₀ · e^(λt)　　λ > 0 ?', line: 3, size: 30, font: 'MinchoM', wobble: 0.05},
		{text: 'Il faut cultiver notre jardin.', line: 4, size: 30, font: 'MinchoM', wobble: 0.05},
		{text: '我开始能听懂别人说话里藏着的意思了。', line: 5, size: 30, ...NEAT},
		{text: 'Σ (xᵢ − x̄)² / n　　σ = 4.7', line: 6, size: 30, font: 'MinchoM', wobble: 0.05},
		{text: '阿尔吉侬今天走迷宫只用了一半的时间。', line: 7, size: 30, ...NEAT},
		{text: 'Ὁ βίος βραχύς, ἡ δὲ τέχνη μακρή.', line: 8, size: 30, font: 'MinchoM', wobble: 0.05},
		{text: '我比它快了。', line: 9, size: 30, ...NEAT},
	],
	[
		{text: '进步报告 12　6月2日', line: 1, size: 34, ...NEAT},
		{text: 'Ich denke — aber was denke ich?', line: 2, size: 30, font: 'MinchoM', wobble: 0.05},
		{text: '∂ψ/∂t = −(i/ħ) Ĥψ', line: 3, size: 32, font: 'MinchoM', wobble: 0.05},
		{text: '教授们的论文里有三处错误。我不知道该不该说。', line: 4, size: 30, ...NEAT},
		{text: 'IQ: 68 → 100 → 155 → 185', line: 5, size: 32, font: 'MinchoM', wobble: 0.05},
		{text: '金尼安小姐看我的眼神变了。', line: 6, size: 30, ...NEAT},
		{text: 'f(x) = ∫ g(t) dt　　lim t→∞ ?', line: 7, size: 30, font: 'MinchoM', wobble: 0.05},
		{text: '我好像离所有人都越来越远。', line: 8, size: 30, ...NEAT},
	],
	[
		{text: '进步报告 13　6月9日', line: 1, size: 34, ...NEAT},
		{text: '我终于想起了面包店的那些晚上。', line: 3, size: 36, ...NEAT},
		{text: '他们笑的时候，我也跟着笑。', line: 4, size: 36, ...NEAT},
		{text: '原来面包店的人一直在笑我。', line: 6, size: 44, ...NEAT},
	],
];

export const EFFECT = '阿尔吉侬—高登效应：人为诱发的智力，其衰退速度与增长幅度成正比。';
export const WALL_TEXT = [
	EFFECT,
	'Δt ∝ ΔI　　I(t) = I_max · (1 − e^(−kt))',
	'如果阿尔吉侬会退化，我也会。',
	'dI/dt = −k · ΔI　　k = ?',
	EFFECT,
	'还剩多少时间？',
];

export const NB_SLANT: HandLine[] = [
	{text: '进步报告 15　9月1日', line: 1, size: 34, ...NEAT},
	{text: '阿尔吉侬不肯走迷宫了，它咬了我的手指。', line: 3, size: 32, ...NEAT},
	{text: '我把它的笼子搬回了家。', line: 4, size: 32, ...NEAT},
	{text: '我必须在还记得的时候，把一切都写下来。', line: 5, size: 32, ...NEAT},
	{text: '我必须在还记得的时候，把一切都写下来。', line: 6, size: 32, ...NEAT},
];

export const NB4 = (fallAt: number): HandLine[] => [
	{text: '进步报告 16　10月', line: 1, size: 36, font: 'WenKai', wobble: 0.4, fallAt: fallAt + 2.6, fallSpread: 3},
	{text: '我在忘记。昨天读过的书，', line: 3, size: 38, font: 'WenKai', wobble: 0.55, fallAt, fallSpread: 5.5},
	{text: '今天看不懂了。', line: 4, size: 38, font: 'WenKai', wobble: 0.7, fallAt: fallAt + 0.8, fallSpread: 5},
	{text: '我记得我曾经知道很多东西', line: 5, size: 38, font: 'KuaiLe', wobble: 0.9, fallAt: fallAt + 1.6, fallSpread: 4.5},
	{text: '我不想忘记', line: 6, size: 42, font: 'KuaiLe', wobble: 1.1, fallAt: fallAt + 2.5, fallSpread: 0.8, fallLoosen: 0.5, fallGravity: 520},
];

export const NB5 = (t0: number): HandLine[] => [
	{text: '近步抱告', line: 1, x: 205, size: 50, ...CR, start: t0, rate: 7},
	{text: '11月21日', line: 1, x: 760, size: 40, ...CR, start: t0 + 0.3, rate: 9},
	{text: '付言 如过你有机会', line: 3, size: 46, ...CR, start: t0 + 0.6, rate: 7.5},
	{text: '请在后院阿尔吉侬的坟上', line: 4, size: 46, ...CR, start: t0 + 1.9, rate: 7.5},
	{text: '放一些花', line: 5, size: 46, ...CR, start: t0 + 3.5, rate: 5},
];

export const MAZE_NOTE: HandLine[] = [
	{text: '今天又跟阿尔吉侬比赛走迷公', line: 1, x: 205, size: 40, ...CR},
	{text: '它又赢了 我不生气', line: 2, x: 205, size: 40, ...CR},
];
