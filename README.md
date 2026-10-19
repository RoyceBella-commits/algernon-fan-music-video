# ヨルシカ《アルジャーノン》非官方 MV · 纸做的阿尔吉侬

![封面](docs/cover.png)

一支用代码搭起来的纸偶剧场。深夜的台灯下，查理撕下一页进步报告，剪出一只纸老鼠。他给它一颗红纸做的心，用蜡笔点上一大一小两只眼睛。纸老鼠看着他一点点变聪明，又看着他慢慢忘记。

- 4 分 14 秒，1080p24，36 个镜头
- 约 70 张生成原画：场景底图、角色设定稿，以及拆成 78 个元素的剪纸素材，另有 1 张封面
- 剪纸立体书：纸页在 3D 里沿折痕立起、合上；纸偶按 12 fps 的定格节奏抖动；迷宫由程序生成；头顶的树沿着枝干一帧帧长出来
- 手工的精细度就是智力曲线：粗剪 → 镂空 → 撕纸。笔记本上的字从错别字变成公式，最后一个个掉下去
- 每个歌词字都在它被唱出的时候浮现

> An unofficial, non-commercial music video for *アルジャーノン* (Algernon) by ヨルシカ (Yorushika), after Daniel Keyes' *Flowers for Algernon*, built with Remotion as a paper-puppet theatre. **No audio or lyrics are included**; bring your own legally obtained copy of the song and its lyrics.

## ⚠️ 本仓库不包含

歌曲音频和歌词原文。它们的权利属于原作者（见 [NOTICE.md](NOTICE.md)）。

歌词以“只有时间、没有文字”的形式保存在 `story/src/data/lyrics.public.json` 里。运行前，用你自己的歌词文件（LRC）把文字填回去，生成的 `lyrics.local.json` 只留在本地，已被 `.gitignore` 排除。不填也能渲染，只是画面上没有歌词。

## 它是怎么做的

```
正版音频 ─► analysis/ ─► 拍点网格（143.5 BPM）· Demucs 分离人声 · 音节起音 → 逐字时间 ─► lyrics.public.json · beats.json
分镜 ─► art/prompts ─► Codex CLI（image2.5）─► art/raw ─► 绿幕抠图 · 2× 超分 · 树的生长序列 ─► story/public
                                                                                    │
story/（Remotion）◄──────────────────────────────────────────────────────────────────┘
  ├─ CSS 3D 纸剧场：纸页沿折痕立起（带弹簧回弹）、投影与接触阴影、移轴景深
  ├─ 笔记本手写：逐字抖动的稚拙字迹、铅笔颗粒、划掉重写、松动后掉落
  ├─ 程序迷宫：随机生成、按拍立墙、铅笔线与纸老鼠赛跑
  └─ 歌词层：明朝体逐字浮现、长句自动折行、同一句唱三遍时排版逐级失序
```

所有动画都是“歌曲时间”的纯函数，同一帧无论渲染多少次都完全一样。

## 目录

| 路径 | 内容 |
|---|---|
| `story/` | Remotion 工程：`src/MV.tsx`（36 个镜头的时间表）、`src/scenes/`（各段镜头）、`src/components/`（纸剧场 `Stage`/`Sheet`、笔记本手写 `Notebook`、`Maze`、`Lyrics` 等）、`src/lyricLayout.ts`（每句歌词的位置）、`src/Cover.tsx`（封面） |
| `story/scripts/` | `sync-assets.sh`（准备素材）、`fetch-fonts.sh`（下载字体）、`lyrics.mjs`（歌词的剥离和回填）、`frames.sh`（抽帧拼图检查） |
| `art/` | 提示词 `prompts/`、Codex 原画 `raw/`；`gen.sh`、`run_jobs.sh`、`prompts_full.py`（生图）、`key.py`（绿幕抠图和拆分）、`upscale.py`（Real-ESRGAN 2×）、`tree_growth.py`（树的生长序列）、`cover_preview.py` |
| `analysis/` | `analyze.py`（拍点和能量）、`lrc_to_json.py`、`lyric_timing.py`（逐字时间） |
| `docs/` | 封面，以及分镜表 [`storyboard.md`](docs/storyboard.md) |

## 快速开始：渲染 MV

需要 Node 20+（开发时用的是 24）、ffmpeg，以及歌曲的正版音频和歌词 LRC（常见的 33 句版本）。

```bash
cd story
npm ci
npm run fonts                                 # 下载字体（均为 OFL）
npm run sync -- /path/to/song.flac            # 准备素材；可选：转出 Studio 预览用的音轨
npm run lyrics -- merge /path/to/lyrics.lrc   # 把歌词填回 src/data/lyrics.local.json
npx remotion studio                           # 预览
```

渲染并封装音频（Remotion 只输出画面）：

```bash
npx remotion render MV ../out/mv_silent.mp4 --crf=16 --muted
ffmpeg -i ../out/mv_silent.mp4 -i /path/to/song.flac -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 320k -ar 48000 ../out/mv.mp4
```

封面：`npx remotion still Cover ../out/cover.png`；不带字的版本加 `--props='{"name":"cover_a","title":false}'`。4:3 安全区为 x = 240–1680。

`remotion.config.ts` 里把 Chromium 的 OpenGL 渲染器设成了 `angle`，适用于 macOS；在其他平台上，按 Remotion 文档调整。

## 可选：重新生成原画

需要已登录、可以生图的 Codex CLI（开发时用的是 0.158.0）。生图由 Codex 的 agent 调用 image2.5 完成，`CODEX_MODEL` 环境变量指定 agent 模型（默认 `gpt-6-astra`）。以下命令都在仓库根目录运行：

```bash
python3 art/prompts_full.py                     # 写出 art/prompts/*.txt 和任务表
art/run_jobs.sh art/logs/jobs.txt 6             # 并行生图 → art/raw/
art/gen.sh cover_a art/raw/ref_mouse.png        # 或者单张生成：提示词 + 参考图
uv venv --python 3.11 .venv && uv pip install --python .venv/bin/python -r art/requirements.txt
.venv/bin/python art/key.py cut_oven            # 绿幕抠图 → story/public/img/cut/（一张图里有多个物体时加 --split）
.venv/bin/python art/upscale.py s17_tree        # 2× 超分 → story/public/img/up/
.venv/bin/python art/tree_growth.py             # 树的生长序列 → story/public/seq/tree/
cd story && npm run sync
```

超分权重需要自己下载到 `art/models/`：[RealESRGAN_x4plus.pth](https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth)。不要用 realesrgan-ncnn-vulkan：在 Apple Silicon 上它会输出错位的图块。

设定稿和样张阶段的提示词是手写的，同样放在 `art/prompts/` 里；`prompts_full.py` 只负责全量素材那一批。

## 可选：从音频重新分析

仓库里已附带校准好的时间数据，通常不需要这一步。

```bash
uv pip install --python .venv/bin/python -r analysis/requirements.txt
ffmpeg -i /path/to/song.flac -ar 48000 data/song.wav
.venv/bin/python analysis/analyze.py data/song.wav data                  # 拍点 → data/beats.json（再复制到 story/src/data/）
.venv/bin/python -m demucs --two-stems=vocals -n htdemucs -o data/sep data/song.wav
python3 analysis/lrc_to_json.py /path/to/lyrics.lrc data/lyrics.json
.venv/bin/python analysis/lyric_timing.py data/sep/htdemucs/song/vocals.wav data/lyrics.json
cd story && npm run lyrics -- strip ../data/lyrics.json                # 重新生成不含歌词的 lyrics.public.json
```

最后一句的结束时间是按人耳校准后直接写在 `lyric_timing.py` 里的。

## 制作

创意方向、风格选择和所有修改意见来自人类创作者。分镜、代码、动画与提示词由 Claude Opus 5.5（Anthropic）编写。原画由 image2.5 绘制（通过 Codex CLI 调用）。人声分离用 Demucs，背景超分用 Real-ESRGAN。

## 许可

- 源代码：[MIT](LICENSE)
- 原画、剪纸元素、封面：[CC BY-NC 4.0](LICENSE-ART.md)
- 字体与第三方组件：见 [NOTICE.md](NOTICE.md)
- 歌曲、歌词：权利归原作者所有，不在本仓库中
- 原著小说：权利归原作者所有；笔记本上的中文是对原著进步报告的意译，不是已出版译本的原文

## 署名

《アルジャーノン》— ヨルシカ（Yorushika），2023。作词／作曲／编曲：n-buna；歌：suis。℗ 2023 Universal Music LLC。

原作：丹尼尔·凯斯（Daniel Keyes）《献给阿尔吉侬的花束》（*Flowers for Algernon*）。

谢谢ヨルシカ。
