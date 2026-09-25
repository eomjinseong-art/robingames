#!/usr/bin/env python3
"""Build the 끝말잇기 noun list from the NIKL 표준국어대사전 XML.

Source
    https://github.com/spellcheck-ko/korean-dict-nikl
    표준국어대사전 업데이트 20260605
    (commit c31ae259de4cd0a355cf8a19b16e75578fd396e2)

License
    The dictionary is 국립국어원 표준국어대사전, CC BY-SA 2.0 KR.
    This script writes a filtered word list, not the raw XML.
    Do not commit the downloaded XML.

Filter
    - word unit is 단어 (phrases, idioms, and proverbs are left out)
    - part of speech is exactly 명사 (의존 명사 is left out)
    - drop an entry when every noun sense is categorized as
      인명, 지명, 책명, or 고유명 일반
    - strip a trailing homonym number (two digits) and "-" / "^" marks
    - keep Hangul syllables only, two or more syllables
    - dedupe

Usage
    pip install lxml
    python3 scripts/build-stdict-nouns.py
    python3 scripts/build-stdict-nouns.py --xml-dir /path/to/stdict
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from lxml import etree

COMMIT = "c31ae259de4cd0a355cf8a19b16e75578fd396e2"
REPO = "spellcheck-ko/korean-dict-nikl"
CONTENTS_URL = (
    f"https://api.github.com/repos/{REPO}/contents/stdict?ref={COMMIT}"
)
PROPER_CATS = {"인명", "지명", "책명", "고유명 일반"}
HANGUL_WORD = re.compile(r"^[가-힣]{2,}$")
HOMONYM_NUMBER = re.compile(r"\d{2}$")

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "games" / "game7" / "data" / "stdict-nouns.txt"


def normalize_headword(raw: str) -> str:
    word = raw.strip()
    word = HOMONYM_NUMBER.sub("", word)
    word = word.replace("-", "").replace("^", "")
    return word


def sense_categories(sense: etree._Element) -> list[str]:
    cats: list[str] = []
    for cat in sense.findall("cat_info/cat"):
        text = (cat.text or "").strip()
        if text:
            cats.append(text)
    return cats


def is_proper_sense(cats: list[str]) -> bool:
    return bool(cats) and all(cat in PROPER_CATS for cat in cats)


def noun_from_item(item: etree._Element) -> str | None:
    info = item.find("word_info")
    if info is None:
        return None
    if (info.findtext("word_unit") or "").strip() != "단어":
        return None
    word_el = info.find("word")
    if word_el is None:
        return None
    raw = "".join(word_el.itertext()).strip()
    if not raw:
        return None

    noun_senses: list[list[str]] = []
    for pos_info in info.findall("pos_info"):
        if (pos_info.findtext("pos") or "").strip() != "명사":
            continue
        for sense in pos_info.findall(".//sense_info"):
            noun_senses.append(sense_categories(sense))
    if not noun_senses:
        return None
    if all(is_proper_sense(cats) for cats in noun_senses):
        return None

    word = normalize_headword(raw)
    if not HANGUL_WORD.fullmatch(word):
        return None
    return word


def iter_xml_files(xml_dir: Path) -> list[Path]:
    files = sorted(path for path in xml_dir.glob("*.xml") if path.is_file())
    if not files:
        raise SystemExit(f"No XML files in {xml_dir}")
    return files


def collect_words(xml_dir: Path, stats: Counter[str]) -> set[str]:
    words: set[str] = set()
    for path in iter_xml_files(xml_dir):
        stats["files"] += 1
        for _, item in etree.iterparse(str(path), tag="item", recover=False):
            stats["items"] += 1
            word = noun_from_item(item)
            if word:
                if word in words:
                    stats["duplicates"] += 1
                else:
                    words.add(word)
                    stats["kept"] += 1
            item.clear()
        print(f"parsed {path.name}: {stats['kept']} nouns so far", file=sys.stderr)
    return words


def download_xml(dest: Path) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(
        CONTENTS_URL,
        headers={"User-Agent": "robingames-stdict-nouns", "Accept": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        listing = json.load(response)
    xml_files = [entry for entry in listing if entry.get("name", "").endswith(".xml")]
    if not xml_files:
        raise SystemExit("The stdict directory listing had no XML files.")

    def fetch(entry: dict) -> str:
        name = entry["name"]
        target = dest / name
        if target.is_file() and target.stat().st_size > 0:
            return name
        url = entry.get("download_url")
        if not url:
            url = (
                "https://raw.githubusercontent.com/"
                f"{REPO}/{COMMIT}/stdict/{name}"
            )
        urllib.request.urlretrieve(url, target)
        return name

    print(f"downloading {len(xml_files)} XML files into {dest}", file=sys.stderr)
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(fetch, entry) for entry in xml_files]
        done = 0
        for future in as_completed(futures):
            done += 1
            name = future.result()
            print(f"downloaded {done}/{len(xml_files)} {name}", file=sys.stderr)


def write_word_list(words: set[str], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    ordered = sorted(words)
    text = "\n".join(ordered) + "\n"
    output.write_text(text, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--xml-dir",
        type=Path,
        help="Directory of already downloaded stdict XML files. "
        "When omitted, the 2026-06-05 build is downloaded to a temp directory.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Newline-separated word list (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--keep-xml",
        action="store_true",
        help="Keep the downloaded XML when this script downloaded it.",
    )
    args = parser.parse_args()

    stats: Counter[str] = Counter()
    if args.xml_dir:
        words = collect_words(args.xml_dir, stats)
    else:
        with tempfile.TemporaryDirectory(prefix="stdict-xml-") as tmp:
            xml_dir = Path(tmp)
            download_xml(xml_dir)
            words = collect_words(xml_dir, stats)
            if args.keep_xml:
                kept = Path("/tmp/stdict-xml")
                kept.mkdir(parents=True, exist_ok=True)
                for path in xml_dir.glob("*.xml"):
                    target = kept / path.name
                    if not target.exists():
                        target.write_bytes(path.read_bytes())

    write_word_list(words, args.output)
    print(
        f"wrote {args.output} words={len(words)} "
        f"items={stats['items']} files={stats['files']} "
        f"duplicate_heads={stats['duplicates']}"
    )


if __name__ == "__main__":
    main()
