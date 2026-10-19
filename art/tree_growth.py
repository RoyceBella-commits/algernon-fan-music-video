"""Bake the S17 tree-growth frame sequence: s16 (no tree) -> s17 (tree), revealed along the branches from the head."""
import numpy as np, cv2, os
from PIL import Image
from skimage.graph import MCP_Geometric
A = np.asarray(Image.open("story/public/img/up/s16_sleep.png").convert("RGB")).astype(np.float32)
B = np.asarray(Image.open("story/public/img/up/s17_tree.png").convert("RGB")).astype(np.float32)
H, W = A.shape[:2]
# align s16 to s17 (small shift from regeneration)
ga = cv2.cvtColor(A.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
gb = cv2.cvtColor(B.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
lo = slice(int(H * 0.45), H)
(dx, dy), resp = cv2.phaseCorrelate(ga[lo], gb[lo])
print("shift", dx, dy, resp)
M = np.float32([[1, 0, dx], [0, 1, dy]])
A = cv2.warpAffine(A, M, (W, H), borderMode=cv2.BORDER_REPLICATE)
# tree mask = strong difference, mostly in the upper part
s = 4
a_s = cv2.resize(A, (W // s, H // s), interpolation=cv2.INTER_AREA)
b_s = cv2.resize(B, (W // s, H // s), interpolation=cv2.INTER_AREA)
diff = np.abs(cv2.cvtColor(b_s.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32) - cv2.cvtColor(a_s.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)).sum(axis=2)
mask = (diff > 38).astype(np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
h, w = mask.shape
# seed: top centre of the sleeping puppet's head (measured on the 1672px plate: ~(719, 430))
seed = (int(430 * H / 941 / s), int(719 * W / 1672 / s))
# tree = largest connected difference region; snap seed into it
n, lab, stats, _ = cv2.connectedComponentsWithStats(mask)
big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
tree = (lab == big).astype(np.uint8)
ys, xs = np.nonzero(tree)
k = np.argmin((ys - seed[0]) ** 2 + (xs - seed[1]) ** 2)
seed = (int(ys[k]), int(xs[k]))
print("seed", seed, "tree frac", tree.mean(), "mask frac", mask.mean())
cost = np.where(tree > 0, 1.0, 1e6)
mcp = MCP_Geometric(cost)
dist, _ = mcp.find_costs([seed])
inside = dist[tree > 0]
dmax = np.percentile(inside, 99.5)
D = np.where(tree > 0, np.clip(dist / dmax, 0, 1), 2.0).astype(np.float32)
T = cv2.resize(cv2.GaussianBlur(tree.astype(np.float32), (5, 5), 0), (W, H), interpolation=cv2.INTER_LINEAR)
D = cv2.resize(D, (W, H), interpolation=cv2.INTER_NEAREST)
D = cv2.GaussianBlur(D, (9, 9), 0)
os.makedirs("story/public/seq/tree", exist_ok=True)
N = 112  # 12 fps over ~9.3s
OW, OH = 2560, 1440
A2 = cv2.resize(A, (OW, OH), interpolation=cv2.INTER_AREA)
B2 = cv2.resize(B, (OW, OH), interpolation=cv2.INTER_AREA)
D2 = cv2.resize(D, (OW, OH), interpolation=cv2.INTER_LINEAR)
T2 = cv2.resize(T, (OW, OH), interpolation=cv2.INTER_LINEAR)[..., None]
for k in range(N + 1):
    p = k / N
    thr = p * 1.08
    edge = 0.04
    al_tree = np.clip((thr - D2) / edge, 0, 1)[..., None]
    q = np.clip((p - 0.72) / 0.28, 0, 1)
    al_rest = q * q * (3 - 2 * q)
    al = al_tree * T2 + al_rest * (1 - T2)
    al = np.maximum(al, al_rest * (D2[..., None] > 1.5))
    glow = np.clip(1 - np.abs(thr - D2) / 0.06, 0, 1)[..., None] * T2 * (1 - p) ** 0.5
    out = A2 * (1 - al) + B2 * al
    out = out + glow * np.array([255, 205, 130], np.float32) * 0.4
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(f"story/public/seq/tree/{k:03d}.jpg", quality=88)
print("frames", N + 1)
