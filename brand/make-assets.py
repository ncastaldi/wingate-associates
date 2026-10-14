"""Regenerate the site's icons and share image from brand/wingate-logo.png.

Usage, from the repo root (needs Pillow):
    python3 brand/make-assets.py brand/wingate-logo.png .

Writes src/app/icon.png, favicon.ico, apple-icon.png, opengraph-image.png and
public/logo-mark.png. The mark's centre and radius below are measured from the
current logo; re-measure them if the source image changes.
"""
import sys
from collections import Counter
from PIL import Image, ImageDraw
src, repo = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
px = im.load()
# Text navy: most common dark colour in the wordmark.
c = Counter()
for y in range(524, 600):
    for x in range(425, 950):
        p = px[x, y]
        if sum(p) < 200: c[p] += 1
navy = c.most_common(1)[0][0]
print("wordmark navy", "#%02x%02x%02x" % navy)
BG = (246, 246, 242)

# The source background carries faint texture and smudges; flatten anything
# close to the background colour so it reads as one clean tone.
def near_bg(p, t=40):
    return sum(abs(a - b) for a, b in zip(p, BG)) < t
w, h = im.size
for y in range(h):
    for x in range(w):
        if near_bg(px[x, y]):
            px[x, y] = BG


# Circular mark with an antialiased transparent edge.
cx, cy, r = 687.5, 309, 186
box = (int(cx - r - 2), int(cy - r - 2), int(cx + r + 2), int(cy + r + 2))
crop = im.crop(box).convert("RGBA")
S = 8
size = crop.size[0]
mask = Image.new("L", (size * S, size * S), 0)
d = ImageDraw.Draw(mask)
o = 2 * S
d.ellipse((o, o, (size * S) - o, (size * S) - o), fill=255)
mask = mask.resize(crop.size, Image.LANCZOS)
crop.putalpha(mask)
mark = crop

def sized(n):
    return mark.resize((n, n), Image.LANCZOS)

sized(256).save(f"{repo}/src/app/icon.png", optimize=True)
sized(96).save(f"{repo}/public/logo-mark.png", optimize=True)
icons = [sized(n) for n in (16, 32, 48)]
icons[2].save(f"{repo}/src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=icons[:2])
apple = Image.new("RGBA", (180, 180), BG + (255,))
m = sized(152)
apple.alpha_composite(m, (14, 14))
apple.convert("RGB").save(f"{repo}/src/app/apple-icon.png", optimize=True)

# Open Graph: whole logo centred on the logo's own background.
logo = im.crop((405, 105, 970, 663))
og = Image.new("RGB", (1200, 630), BG)
scale = 560 / logo.size[1]
logo = logo.resize((round(logo.size[0] * scale), 560), Image.LANCZOS)
og.paste(logo, ((1200 - logo.size[0]) // 2, 35))
og.save(f"{repo}/src/app/opengraph-image.png", optimize=True)
