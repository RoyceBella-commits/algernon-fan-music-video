# NOTICE

## 原作版权 / Original work

歌曲《アルジャーノン》（ヨルシカ，2023）的**录音、词曲和歌词**，其权利归原作者及权利人所有：

- 作词／作曲／编曲：n-buna
- 歌：suis
- ℗ 2023 Universal Music LLC

MV 的故事取材自丹尼尔·凯斯（Daniel Keyes）的小说《献给阿尔吉侬的花束》（*Flowers for Algernon*），小说及其人物的权利归原作者及权利人所有。笔记本上的中文文字是对原著“进步报告”的意译，不是任何已出版译本的原文。

本仓库是**非官方、非商业**的个人创作，与艺人及其厂牌、原著出版方无关，**不包含**：

- 歌曲音频，以及由音频解码、分离得到的任何文件（人声分轨等）
- 歌词原文（`lyrics.public.json` 只保留每句的起止时间、逐字出现时间和字数）

要渲染 MV，请使用你自己合法获得的歌曲文件和歌词（见 README）。

仓库中的 `story/src/data/lyrics.public.json` 与 `beats.json` 是对原曲分析得到的数值数据（逐字时间、拍点），无法还原出音频或歌词。它们仅为复现这支 MV 提供，不在 MIT 许可范围内另行授权。

## 第三方组件 / Third-party components

| 组件 | 用途 | 许可 |
|---|---|---|
| Shippori Mincho B1 | 歌词、标题 | SIL OFL 1.1（由 `npm run fonts` 下载，附 `OFL-ShipporiMinchoB1.txt`） |
| Klee One | 最后一句歌词 | SIL OFL 1.1 |
| 霞鹜文楷 LXGW WenKai | 天才期的笔记本字迹、飘起的文字 | SIL OFL 1.1 |
| 站酷快乐体 ZCOOL KuaiLe | 稚拙的笔记本字迹 | SIL OFL 1.1 |
| [Remotion](https://www.remotion.dev) | 逐帧合成与渲染 | Remotion License：个人、3 人以下公司、非营利组织免费；更大规模的营利组织需购买公司许可 |
| React | 渲染 | MIT |
| Real-ESRGAN（RealESRGAN_x4plus 权重） | 背景 2× 超分 | BSD-3-Clause |
| spandrel、PyTorch | 加载与运行超分模型 | MIT、BSD-3-Clause |
| Demucs（htdemucs） | 分离人声（仅用于分析，不随仓库分发） | MIT |
| librosa | 拍点与音节起音 | ISC |
| OpenCV、scikit-image、NumPy、SciPy、Pillow | 抠图、树的生长路径、图像处理 | Apache-2.0、BSD-3-Clause、BSD-3-Clause、BSD-3-Clause、MIT-CMU |

## 图像生成 / AI-generated images

`art/raw/` 中的原画由图像生成模型 image2.5 绘制（通过 Codex CLI 调用），提示词见 `art/prompts/`。之后经 `art/key.py` 抠图拆分、`art/upscale.py` 超分、`art/tree_growth.py` 合成生长序列，再由代码排进纸剧场，加上动画和排版。图像许可见 `LICENSE-ART.md`。
