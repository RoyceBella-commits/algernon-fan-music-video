"""Preview cover candidates: 16:9 with 4:3 crop guides, plus the 4:3 crop."""
import sys
from PIL import Image, ImageDraw, ImageFont
f = ImageFont.truetype("story/public/fonts/LXGWWenKai-Regular.ttf", 22)
names = sys.argv[2:]
rows = []
for n in names:
    im = Image.open(n).convert("RGB")
    W = 800; H = int(W * im.height / im.width)
    a = im.resize((W, H)); d = ImageDraw.Draw(a)
    cw = int(H * 4 / 3); x0 = (W - cw) // 2
    d.rectangle([x0, 0, x0 + cw, H - 1], outline=(255, 60, 60), width=3)
    d.text((8, 6), n.split("/")[-1], font=f, fill=(255, 255, 255))
    b = im.crop(((im.width - int(im.height * 4 / 3)) // 2, 0, (im.width + int(im.height * 4 / 3)) // 2, im.height)).resize((cw, H))
    row = Image.new("RGB", (W + cw + 20, H), (20, 20, 20)); row.paste(a, (0, 0)); row.paste(b, (W + 20, 0)); rows.append(row)
out = Image.new("RGB", (rows[0].width, sum(r.height + 10 for r in rows)), (20, 20, 20))
y = 0
for r in rows: out.paste(r, (0, y)); y += r.height + 10
out.save(sys.argv[1], quality=88)
