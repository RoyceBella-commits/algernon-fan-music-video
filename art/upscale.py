"""2x upscale with Real-ESRGAN x4plus on Apple MPS (spandrel), then downsample 4x->2x.
usage (repo root): .venv/bin/python art/upscale.py name...   art/raw/<name>.png -> story/public/img/up/<name>.png
Weights: art/models/RealESRGAN_x4plus.pth (see README)"""
import sys, torch, numpy as np
from PIL import Image
from spandrel import ModelLoader
dev = "mps" if torch.backends.mps.is_available() else "cpu"
model = ModelLoader().load_from_file("art/models/RealESRGAN_x4plus.pth").to(dev).eval()
for name in sys.argv[1:]:
    im = Image.open(f"art/raw/{name}.png").convert("RGB")
    x = torch.from_numpy(np.asarray(im)).permute(2, 0, 1).float().div(255).unsqueeze(0).to(dev)
    with torch.no_grad():
        y = model(x).clamp(0, 1)
    out = Image.fromarray((y[0].permute(1, 2, 0).cpu().numpy() * 255).round().astype(np.uint8))
    out = out.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    out.save(f"story/public/img/up/{name}.png")
    print("up", name, out.size)
