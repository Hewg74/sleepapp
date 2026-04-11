"""
Extend natural pauses in existing audio by a multiplier.
Emily's [long pause] tags produce ~1s pauses. We want them to be ~4-5s for meditation.
This script detects every pause >= 0.8s in the existing audio and extends it.

No ElevenLabs calls. Operates on existing audio in web/ directory.
"""

import re
import os
import sys
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).parent
INPUT_DIR = BASE_DIR / "web"
OUTPUT_DIR = BASE_DIR / "web-fixed"
TEMP_DIR = BASE_DIR / "temp"

# Detection: anything below -35dB for >= 0.8s is a "long pause"
SILENCE_DB = "-35dB"
MIN_SILENCE = 0.8

# Extension config
# Each detected pause will be extended to this target (not multiplied)
# If natural pause is 1.2s and target is 4s, we add 2.8s of silence
PAUSE_TARGET_SHORT = 2.5   # for short detected (0.8-1.2s): ~[pause]
PAUSE_TARGET_MEDIUM = 4.5  # for medium detected (1.2-1.8s): ~[long pause]
PAUSE_TARGET_LONG = 7.0    # for long detected (1.8s+): stacked long pauses


def detect_silences(audio_path):
    """Run ffmpeg silencedetect and return list of (start, end, duration) tuples."""
    cmd = [
        "ffmpeg", "-i", str(audio_path),
        "-af", f"silencedetect=noise={SILENCE_DB}:d={MIN_SILENCE}",
        "-f", "null", "-"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    stderr = result.stderr

    silences = []
    starts = re.findall(r"silence_start:\s*([-\d.]+)", stderr)
    ends = re.findall(r"silence_end:\s*([-\d.]+).*?silence_duration:\s*([-\d.]+)", stderr)

    for i, (end_str, dur_str) in enumerate(ends):
        if i < len(starts):
            try:
                start = float(starts[i])
                end = float(end_str)
                duration = float(dur_str)
                if start < 0:
                    start = 0
                silences.append((start, end, duration))
            except ValueError:
                continue

    return silences


def get_duration(audio_path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration",
           "-of", "default=noprint_wrappers=1:nokey=1", str(audio_path)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return float(result.stdout.strip())
    except ValueError:
        return 0


def target_duration(natural_dur):
    """Return target duration for a detected pause based on its natural length."""
    if natural_dur >= 1.8:
        return PAUSE_TARGET_LONG
    elif natural_dur >= 1.2:
        return PAUSE_TARGET_MEDIUM
    else:
        return PAUSE_TARGET_SHORT


def extend_pauses(audio_path, output_path):
    silences = detect_silences(audio_path)
    total_duration = get_duration(audio_path)

    if not silences:
        print(f"  [warn] no pauses detected")
        subprocess.run(["ffmpeg", "-y", "-i", str(audio_path), "-c", "copy", str(output_path)], capture_output=True)
        return

    print(f"  [detect] {len(silences)} long pauses (>={MIN_SILENCE}s)")

    # Build segment list: alternating speech and silence
    TEMP_DIR.mkdir(exist_ok=True)
    track_stem = audio_path.stem
    for old in TEMP_DIR.glob(f"{track_stem}_seg*"):
        old.unlink()

    concat_lines = []
    prev_end = 0
    added_silence = 0

    for idx, (start, end, natural_dur) in enumerate(silences):
        # Speech segment before this pause
        seg_dur = start - prev_end
        if seg_dur > 0.05:
            seg_path = TEMP_DIR / f"{track_stem}_seg{idx:03d}.mp3"
            cmd = [
                "ffmpeg", "-y", "-ss", str(prev_end), "-t", str(seg_dur),
                "-i", str(audio_path),
                "-b:a", "96k", str(seg_path)
            ]
            subprocess.run(cmd, capture_output=True)
            if seg_path.exists():
                concat_lines.append(f"file '{seg_path.resolve().as_posix()}'")

        # Extended silence replaces natural pause
        target = target_duration(natural_dur)
        silence_path = TEMP_DIR / f"silence_{target}.mp3"
        if not silence_path.exists():
            cmd = [
                "ffmpeg", "-y", "-f", "lavfi",
                "-i", f"anullsrc=r=44100:cl=mono",
                "-t", str(target),
                "-b:a", "96k",
                str(silence_path)
            ]
            subprocess.run(cmd, capture_output=True)
        if silence_path.exists():
            concat_lines.append(f"file '{silence_path.resolve().as_posix()}'")
            added_silence += (target - natural_dur)

        prev_end = end

    # Final speech segment after the last pause
    if prev_end < total_duration:
        seg_dur = total_duration - prev_end
        if seg_dur > 0.05:
            seg_path = TEMP_DIR / f"{track_stem}_seg_final.mp3"
            cmd = [
                "ffmpeg", "-y", "-ss", str(prev_end), "-t", str(seg_dur),
                "-i", str(audio_path),
                "-b:a", "96k", str(seg_path)
            ]
            subprocess.run(cmd, capture_output=True)
            if seg_path.exists():
                concat_lines.append(f"file '{seg_path.resolve().as_posix()}'")

    # Concat everything
    concat_file = TEMP_DIR / f"{track_stem}_concat.txt"
    with open(concat_file, "w", encoding="utf-8") as f:
        f.write("\n".join(concat_lines))

    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file),
        "-b:a", "96k",
        str(output_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if output_path.exists():
        new_dur = get_duration(output_path)
        print(f"  [done] {total_duration:.0f}s -> {new_dur:.0f}s (+{new_dur - total_duration:.0f}s)")
    else:
        print(f"  [FAIL]")
        print(result.stderr[-300:])

    # Clean temp segments for this track
    for f in TEMP_DIR.glob(f"{track_stem}_seg*"):
        f.unlink()
    if concat_file.exists():
        concat_file.unlink()


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    OUTPUT_DIR.mkdir(exist_ok=True)
    TEMP_DIR.mkdir(exist_ok=True)

    files = sorted(INPUT_DIR.glob("*.mp3"))
    for f in files:
        if target and target not in f.stem:
            continue
        print(f"\n{f.stem}")
        out_path = OUTPUT_DIR / f.name
        extend_pauses(f, out_path)

    # Clean temp
    if TEMP_DIR.exists():
        for f in TEMP_DIR.glob("silence_*"):
            f.unlink()
        try:
            TEMP_DIR.rmdir()
        except OSError:
            pass

    print("\nDone. Files in web-fixed/")


if __name__ == "__main__":
    main()
