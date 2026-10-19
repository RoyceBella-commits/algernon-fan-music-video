# data/

本地工作目录，**不提交**（见 `.gitignore`）。从你自己的正版音频和歌词得到的中间文件放在这里：

- `song.wav`：解码后的音频
- `sep/`：Demucs 分离出的人声和伴奏
- `lyrics.json`：带歌词文字和逐字时间的完整文件
- `beats.json`、`energy.json`：拍点和能量曲线

提交到仓库的只有不含歌词文字的数值数据：`story/src/data/lyrics.public.json`（每句的起止时间、逐字出现时间、字数）和 `story/src/data/beats.json`。
