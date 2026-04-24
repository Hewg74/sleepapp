"""
Generate the custom Ruby meditation.

5 phases with progressive sleepiness settings. Each phase is one ElevenLabs v3
call. Stitches with 6s silence between phases. Output: original/ruby.mp3 — then
run extend_pauses.py to produce web-fixed/ruby.mp3.
"""

import re
import os
import sys
import time
import subprocess
import requests
from pathlib import Path

API_KEY = "sk_2d4d79b6829cde7b260b6ccd6cbbc9ad638f2afc28ef33c4"
VOICE_ID = "TKePFuDtAVp14EppI8GC"  # Emily
MODEL = "eleven_v3"
BASE_DIR = Path(__file__).parent
SCRIPT_FILE = BASE_DIR / "ruby-script.md"
CHUNKS_DIR = BASE_DIR / "ruby-chunks"
OUTPUT = BASE_DIR / "original" / "ruby.mp3"

PHASE_SETTINGS = [
    {"name": "arriving",    "stability": 0.45, "speed": 0.92, "style": 0.10},
    {"name": "descending",  "stability": 0.38, "speed": 0.88, "style": 0.12},
    {"name": "sinking-mem", "stability": 0.32, "speed": 0.85, "style": 0.15},
    {"name": "sinking-love","stability": 0.30, "speed": 0.84, "style": 0.15},
    {"name": "drifting",    "stability": 0.25, "speed": 0.82, "style": 0.15},
]

SILENCE_BETWEEN_PHASES = 6


def extract_phases(script_path):
    """Extract the 5 phases from the script in order."""
    with open(script_path, "r", encoding="utf-8") as f:
        content = f.read()

    phases = []
    pattern = re.compile(r"## PHASE (\d+):.*?```\n(.*?)\n```", re.DOTALL)

    for m in pattern.finditer(content):
        num = int(m.group(1))
        text = m.group(2).strip()
        phases.append({"num": num, "text": text, "order": num - 1})

    phases.sort(key=lambda p: p["num"])
    return phases


def generate_phase(phase_idx, text, settings, output_path, retries=3):
    if output_path.exists() and output_path.stat().st_size > 1000:
        print(f"  [skip] phase {phase_idx} exists")
        return True

    payload = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": {
            "stability": settings["stability"],
            "similarity_boost": 0.75,
            "style": settings["style"],
            "speed": settings["speed"],
            "use_speaker_boost": True,
        },
    }

    for attempt in range(retries):
        try:
            resp = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
                headers={"xi-api-key": API_KEY, "Content-Type": "application/json"},
                json=payload,
                timeout=300,
            )
            if resp.status_code == 200:
                with open(output_path, "wb") as f:
                    f.write(resp.content)
                kb = len(resp.content) / 1024
                print(f"  [ok]   phase {phase_idx} ({settings['name']})  {kb:.0f} KB  ({len(text)} chars)")
                return True
            elif resp.status_code == 429:
                wait = 20 * (attempt + 1)
                print(f"  [rate] phase {phase_idx}  waiting {wait}s")
                time.sleep(wait)
            else:
                print(f"  [err]  phase {phase_idx}  HTTP {resp.status_code}: {resp.text[:300]}")
                if attempt < retries - 1:
                    time.sleep(5)
        except Exception as e:
            print(f"  [err]  phase {phase_idx}  {e}")
            if attempt < retries - 1:
                time.sleep(5)
    return False


def gen_silence(duration_s, path):
    if path.exists():
        return
    cmd = ["ffmpeg", "-y", "-f", "lavfi",
           "-i", "anullsrc=r=44100:cl=mono",
           "-t", str(duration_s), "-b:a", "96k", str(path)]
    subprocess.run(cmd, capture_output=True)


def stitch_phases(phases, chunks_dir, output_path):
    concat_lines = []
    for i, phase in enumerate(phases):
        phase_path = chunks_dir / f"phase_{phase['order']:02d}.mp3"
        if not phase_path.exists():
            print(f"  [missing] {phase_path.name}")
            continue
        concat_lines.append(f"file '{phase_path.resolve().as_posix()}'")
        if i < len(phases) - 1:
            silence_path = chunks_dir / f"silence_{SILENCE_BETWEEN_PHASES}s.mp3"
            gen_silence(SILENCE_BETWEEN_PHASES, silence_path)
            concat_lines.append(f"file '{silence_path.resolve().as_posix()}'")

    concat_file = chunks_dir / "concat.txt"
    with open(concat_file, "w", encoding="utf-8") as f:
        f.write("\n".join(concat_lines))

    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
           "-i", str(concat_file),
           "-b:a", "96k",
           str(output_path)]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if output_path.exists():
        mb = output_path.stat().st_size / (1024 * 1024)
        print(f"\n[done] {output_path.name}  {mb:.1f} MB")
    else:
        print(f"\n[FAIL] ffmpeg stitch")
        print(result.stderr[-400:])


def main():
    phases = extract_phases(SCRIPT_FILE)
    print(f"Found {len(phases)} phases\n")

    total_chars = sum(len(p["text"]) for p in phases)
    for p in phases:
        print(f"  [{p['order']}] Phase {p['num']}: {len(p['text']):,} chars")
    print(f"  TOTAL: {total_chars:,} chars\n")

    # Safety: v3 has 5000 char per request limit
    over_limit = [p for p in phases if len(p["text"]) > 4900]
    if over_limit:
        print(f"[ABORT] phase(s) exceed 4900 char safety cap: {[p['num'] for p in over_limit]}")
        sys.exit(1)

    if len(sys.argv) > 1 and sys.argv[1] == "dry":
        print("Dry run.")
        return

    CHUNKS_DIR.mkdir(exist_ok=True)
    OUTPUT.parent.mkdir(exist_ok=True)

    for i, phase in enumerate(phases):
        settings = PHASE_SETTINGS[i]
        output_path = CHUNKS_DIR / f"phase_{phase['order']:02d}.mp3"
        print(f"\n=== [{phase['order']}] {settings['name']} ({len(phase['text'])} chars) ===")
        generate_phase(phase["order"], phase["text"], settings, output_path)
        time.sleep(2)

    print(f"\n=== STITCHING ===")
    stitch_phases(phases, CHUNKS_DIR, OUTPUT)


if __name__ == "__main__":
    main()
