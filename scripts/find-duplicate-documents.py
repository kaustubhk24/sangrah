#!/usr/bin/env python3
"""Find duplicate and similar Docusaurus documents."""

from __future__ import annotations

import argparse
import difflib
import re
import sys
import unicodedata
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path


FRONT_MATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n?", re.DOTALL)
HEADING_RE = re.compile(r"^#{1,6}\s+(.+?)\s*$", re.MULTILINE)
FIELD_RE = re.compile(r"^([A-Za-z][\w-]*):\s*(.*?)\s*$", re.MULTILINE)
MARKDOWN_RE = re.compile(r"[`*_>#\[\](){}|~]", re.UNICODE)
NON_WORD_RE = re.compile(r"[^\w\s-]", re.UNICODE)
NUMBERING_RE = re.compile(r"(?:^|\s)(?:\d+[.)-]?|[ivxlcdm]+[.)-]?)(?=\s|$)", re.IGNORECASE)
WHITESPACE_RE = re.compile(r"\s+", re.UNICODE)


@dataclass(frozen=True)
class Document:
    path: Path
    title: str
    slug: str
    content: str
    title_key: str
    slug_key: str
    content_key: str


def normalize(value: str, *, markdown: bool = False) -> str:
    value = unicodedata.normalize("NFKC", value).casefold()
    if markdown:
        value = MARKDOWN_RE.sub(" ", value)
    value = NUMBERING_RE.sub(" ", value)
    value = NON_WORD_RE.sub(" ", value)
    return WHITESPACE_RE.sub(" ", value).strip()


def words(value: str) -> set[str]:
    """Return meaningful tokens for order-independent content comparison."""
    return {word for word in value.split() if len(word) > 1}


def parse_document(path: Path, docs_dir: Path) -> Document:
    raw = path.read_text(encoding="utf-8")
    front_matter = FRONT_MATTER_RE.match(raw)
    metadata: dict[str, str] = {}
    body = raw
    if front_matter:
        metadata = dict(FIELD_RE.findall(front_matter.group(1)))
        body = raw[front_matter.end() :]

    heading = HEADING_RE.search(body)
    title = metadata.get("title", "") or (heading.group(1) if heading else path.stem)
    slug = metadata.get("slug", "") or "/" + path.relative_to(docs_dir).with_suffix("").as_posix()
    content = normalize(body, markdown=True)

    return Document(
        path=path,
        title=title.strip().strip("\"'"),
        slug=slug.strip().strip("\"'"),
        content=content,
        title_key=normalize(title),
        slug_key=normalize(slug),
        content_key=content,
    )


def similarity(left: str, right: str) -> float:
    """Combine ordered text similarity with order-independent word overlap."""
    if not left or not right:
        return 0.0
    sequence_score = difflib.SequenceMatcher(None, left, right, autojunk=False).ratio()
    left_words = words(left)
    right_words = words(right)
    union = left_words | right_words
    overlap_score = len(left_words & right_words) / len(union) if union else 0.0
    return max(sequence_score, overlap_score)


def grouped_by(documents: list[Document], key: str) -> list[list[Document]]:
    groups: defaultdict[str, list[Document]] = defaultdict(list)
    for document in documents:
        value = getattr(document, key)
        if value:
            groups[value].append(document)
    return [group for group in groups.values() if len(group) > 1]


def display_group(label: str, groups: list[list[Document]]) -> None:
    if not groups:
        return
    print(f"\n{label} ({sum(len(group) for group in groups)} documents)")
    for group_number, group in enumerate(groups, 1):
        print(f"  Group {group_number}:")
        for document in group:
            print(f"    {document.path} | {document.title} | {document.slug}")


def find_similar(
    documents: list[Document], threshold: float
) -> list[tuple[float, str, Document, Document]]:
    matches: list[tuple[float, str, Document, Document]] = []
    total_comparisons = len(documents) * (len(documents) - 1) // 2
    progress_step = max(1, total_comparisons // 20)
    comparisons_done = 0
    print(f"Comparing {total_comparisons:,} document pairs...", file=sys.stderr)
    for index, left in enumerate(documents):
        for right in documents[index + 1 :]:
            comparisons_done += 1
            title_score = similarity(left.title_key, right.title_key)
            slug_score = similarity(left.slug_key, right.slug_key)
            content_score = similarity(left.content_key, right.content_key)
            identity_score = title_score * 0.65 + slug_score * 0.35
            score = max(content_score, identity_score)
            if score >= threshold:
                reasons = []
                if content_score >= threshold:
                    reasons.append(f"content {content_score:.0%}")
                if identity_score >= threshold:
                    reasons.append(f"title/slug {identity_score:.0%}")
                matches.append((score, ", ".join(reasons), left, right))
            if comparisons_done % progress_step == 0 or comparisons_done == total_comparisons:
                percent = comparisons_done / total_comparisons * 100 if total_comparisons else 100
                print(
                    f"  compared {comparisons_done:,}/{total_comparisons:,} ({percent:.0f}%), "
                    f"found {len(matches):,} candidates",
                    file=sys.stderr,
                )
    return sorted(matches, key=lambda match: match[0], reverse=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", nargs="?", type=Path, default=Path("docs"))
    parser.add_argument("--threshold", type=float, default=0.82, help="Similarity threshold from 0 to 1 (default: 0.82)")
    parser.add_argument("--limit", type=int, default=100, help="Maximum similar pairs to print (default: 100)")
    args = parser.parse_args()

    if not 0 <= args.threshold <= 1:
        parser.error("--threshold must be between 0 and 1")
    docs_dir = args.directory.resolve()
    if not docs_dir.is_dir():
        parser.error(f"directory does not exist: {docs_dir}")

    paths = sorted(path for path in docs_dir.rglob("*") if path.suffix.lower() in {".md", ".mdx"})
    documents = []
    for index, path in enumerate(paths, 1):
        if path.name.lower() == "readme.md":
            continue
        documents.append(parse_document(path, docs_dir))
        if index % 100 == 0 or index == len(paths):
            print(f"Parsed {index:,}/{len(paths):,} files...", file=sys.stderr)
    print(f"Scanned {len(documents)} documents in {docs_dir}")

    display_group("Exact duplicate content", grouped_by(documents, "content_key"))
    display_group("Duplicate titles", grouped_by(documents, "title_key"))
    display_group("Duplicate slugs", grouped_by(documents, "slug_key"))

    matches = find_similar(documents, args.threshold)
    print(f"\nSimilar documents (threshold: {args.threshold:.2f}, showing: {min(args.limit, len(matches))})")
    for score, reason, left, right in matches[: args.limit]:
        print(f"  {score:.1%} ({reason})")
        print(f"    {left.path} | {left.title} | {left.slug}")
        print(f"    {right.path} | {right.title} | {right.slug}")


if __name__ == "__main__":
    main()