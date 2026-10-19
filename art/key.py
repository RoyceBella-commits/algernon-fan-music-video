"""Cut out a generated element.
usage (repo root): .venv/bin/python art/key.py <name> [--split] [--rembg]
   reads art/raw/<name>.png -> story/public/img/cut/<name>.png (RGBA, trimmed)
Default: chroma-key green with despill. --rembg: use rembg isnet model instead."""
import sys, numpy as np
from PIL import Image
name = sys.argv[1]
src = Image.open(f"art/raw/{name}.png").convert("RGB")
a = np.asarray(src).astype(np.float32) / 255.0
r, g, b = a[..., 0], a[..., 1], a[..., 2]
if "--rembg" in sys.argv:
    from rembg import remove, new_session
    out = remove(src, session=new_session("isnet-general-use"))
    rgba = np.asarray(out).astype(np.float32) / 255.0
else:
    green = g - np.maximum(r, b)              # how much greener than other channels
    alpha = 1.0 - np.clip((green - 0.06) / (0.22 - 0.06), 0, 1)
    # erode alpha edge slightly to kill green fringe
    import cv2
    alpha = cv2.erode(alpha, np.ones((3, 3), np.uint8), iterations=1)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    # despill: clamp green to the max of r,b where green dominates
    g2 = np.where(g > np.maximum(r, b), np.maximum(r, b) * 0.6 + g * 0.4, g)
    g2 = np.where(alpha > 0.98, np.minimum(g, np.maximum(r, b) * 1.05 + 0.02), g2)
    rgba = np.dstack([r, g2, b, alpha])
img = Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8), "RGBA")
if "--split" in sys.argv:
    # save each connected object separately: <name>_1.png, <name>_2.png ... (left->right, top->bottom)
    import cv2
    A = (np.asarray(img.getchannel("A")) > 40).astype(np.uint8)
    A = cv2.morphologyEx(A, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, stats, cent = cv2.connectedComponentsWithStats(A)
    comps = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 0.004 * A.size]
    comps.sort(key=lambda i: (round(cent[i][1] / (img.height / 2)), cent[i][0]))
    full = np.asarray(img).copy()
    for k, i in enumerate(comps, 1):
        x, y, w, h = stats[i, :4]
        m = (lab == i)
        m = cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        part = full.copy(); part[~m, 3] = 0
        pad = 6
        crop = Image.fromarray(part, "RGBA").crop((max(0, x - pad), max(0, y - pad), min(img.width, x + w + pad), min(img.height, y + h + pad)))
        crop.save(f"story/public/img/cut/{name}_{k}.png")
        print(f"{name}_{k}", crop.size)
    sys.exit(0)
bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
if bbox:
    pad = 6
    bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(img.width, bbox[2]+pad), min(img.height, bbox[3]+pad))
    img = img.crop(bbox)
img.save(f"story/public/img/cut/{name}.png")
print(name, img.size)
