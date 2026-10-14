# brand

`wingate-logo.png` is the source logo: the circular "WA" mark above the "WINGATE ASSOCIATES" wordmark, on an off-white background. Everything the site shows is generated from it by `make-assets.py`:

| Output | Used for |
|---|---|
| `src/app/icon.png`, `src/app/favicon.ico` | Browser tab icons (the mark, transparent corners) |
| `src/app/apple-icon.png` | iOS home-screen icon (the mark on the logo background) |
| `src/app/opengraph-image.png` | Link previews (the whole logo, 1200×630) |
| `public/logo-mark.png` | The mark beside the name in the site header |

To change the logo, replace `wingate-logo.png` and run `python3 brand/make-assets.py brand/wingate-logo.png .` from the repo root (needs Pillow). A vector (SVG) or larger transparent original would give sharper icons than this 1376×768 PNG.
