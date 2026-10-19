"""Re-grade the XORA loop video frame by frame so it tells the story:
red trades (left) -> XORA brain -> green rising chart (right).

- tracks the brain in every frame (camera zooms/pans), smooths it over time
- turns cyan chart pixels green only to the right of the brain
- turns the violet candles right of the brain mint-green
- enriches the red on the left
- writes a forward+reverse (boomerang) loop so there is no seam
"""
import subprocess
import sys

import cv2
import numpy as np

SRC, OUT, PREVIEW_DIR = sys.argv[1], sys.argv[2], sys.argv[3]

cap = cv2.VideoCapture(SRC)
frames = []
while True:
    ok, f = cap.read()
    if not ok:
        break
    frames.append(f)
cap.release()
H, W = frames[0].shape[:2]
fps = 24
print("frames", len(frames), W, H)

xs = np.arange(W, dtype=np.float32)[None, :].repeat(H, 0)
ys = np.arange(H, dtype=np.float32)[:, None].repeat(W, 1)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# --- 1. brain position --------------------------------------------------------
# Measured from keyframes every 30 frames: the brain holds still at ~x742,
# spanning ~540-945 px wide and ~70-440 px tall; only its colour changes.
BX, BY, BRX, BRY = 742.0, 255.0, 205.0, 190.0
cx = np.full(len(frames), BX)
bw = np.full(len(frames), BRX)
inside = np.sqrt(((xs - BX) / BRX) ** 2 + ((ys - BY) / BRY) ** 2)
brain_soft = 1 - smoothstep(0.85, 1.05, inside)  # 1 inside the brain

# --- 2. regrade each frame ----------------------------------------------------
out = []
for i, f in enumerate(frames):
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV).astype(np.float32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    c, w = cx[i], bw[i]

    # cyan (chart candles / lines) -> emerald, ramping in across the brain
    # strongly saturated cyan only, so the brain's pale-blue mesh is left alone
    cyan = smoothstep(72, 82, h) * (1 - smoothstep(98, 104, h)) * smoothstep(110, 160, s) * smoothstep(60, 120, v)
    ramp = smoothstep(c - 0.85 * w, c - 0.1 * w, xs) * (1 - smoothstep(H * 0.64, H * 0.69, ys))
    a = cyan * ramp
    h = h * (1 - a) + (h - 17) * a  # ~180-200deg -> ~146-166deg
    s = s * (1 - a) + np.minimum(255, s * 1.12) * a

    # violet candles right of the brain -> mint
    violet = smoothstep(122, 130, h) * (1 - smoothstep(162, 170, h)) * smoothstep(25, 60, s) * smoothstep(90, 140, v)
    ramp2 = smoothstep(c + 0.55 * w, c + 0.95 * w, xs) * (1 - smoothstep(H * 0.7, H * 0.8, ys))
    b = violet * ramp2 * (1 - brain_soft)
    h = h * (1 - b) + 76 * b
    s = s * (1 - b) + (s * 0.85) * b

    # blue/violet trend lines right of the brain -> teal-green
    blue = smoothstep(104, 110, h) * (1 - smoothstep(128, 136, h)) * smoothstep(50, 90, s) * smoothstep(70, 120, v)
    ramp3 = smoothstep(c + 0.8 * w, c + 1.3 * w, xs) * (1 - smoothstep(H * 0.62, H * 0.72, ys))
    d = blue * ramp3 * 0.85 * (1 - brain_soft)
    h = h * (1 - d) + 82 * d

    # richer red on the losing side
    red = (smoothstep(0, 1, 1 - smoothstep(6, 12, h)) + smoothstep(168, 174, h)).clip(0, 1) * smoothstep(60, 120, s)
    lr = red * (1 - smoothstep(c - 1.2 * w, c - 0.6 * w, xs))
    s = np.minimum(255, s * (1 + 0.12 * lr))
    v = np.minimum(255, v * (1 + 0.08 * lr))

    hsv = np.stack([np.clip(h, 0, 179), s, v], -1).astype(np.uint8)
    g = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    out.append(g)
    if i in (0, 60, 120, 180, 235):
        cv2.imwrite(f"{PREVIEW_DIR}/r{i}.jpg", g, [cv2.IMWRITE_JPEG_QUALITY, 88])

# --- 3. boomerang loop + encode ----------------------------------------------
seq = out + out[-2:0:-1]
enc = subprocess.Popen(
    [
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
        "-vf", "scale=1280:-2,format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-movflags", "+faststart", "-an", OUT,
    ],
    stdin=subprocess.PIPE,
)
for fr in seq:
    enc.stdin.write(fr.tobytes())
enc.stdin.close()
enc.wait()
print("wrote", OUT, len(seq), "frames")
