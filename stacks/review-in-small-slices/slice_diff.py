#!/usr/bin/env python3
"""Split a big change into review slices of at most N changed lines.

Reads `git diff --numstat` output (added, deleted, path per line).
Risky paths go first, in their own slices, so they get your fresh attention.
Usage: git diff --numstat main | python3 slice_diff.py [max_lines]
With nothing piped in, it runs on a built-in sample.
"""
import sys

RISKY_WORDS = ("auth", "payment", "billing", "delete", "migration",
               "secret", "permission", "deploy", ".github/workflows")

SAMPLE = """\
12\t3\tsrc/api/routes.py
240\t0\tsrc/ui/settings_page.tsx
8\t2\tsrc/auth/session.py
35\t30\tdb/migrations/0042_drop_old_users.sql
60\t5\ttests/test_routes.py
4\t4\tREADME.md
-\t-\tassets/logo.png
"""


def parse(text):
    files = []
    for line in text.splitlines():
        if not line.strip():
            continue
        added, deleted, path = line.split("\t", 2)
        size = 0 if added == "-" else int(added) + int(deleted)  # "-" = binary
        risky = any(w in path.lower() for w in RISKY_WORDS)
        files.append((path, size, risky))
    return files


def slices(files, max_lines):
    risky = [f for f in files if f[2]]
    rest = [f for f in files if not f[2]]
    out = [[f] for f in risky]  # one risky file per slice
    cur, n = [], 0
    for f in rest:
        if cur and n + f[1] > max_lines:
            out.append(cur)
            cur, n = [], 0
        cur.append(f)
        n += f[1]
    if cur:
        out.append(cur)
    return out


def main():
    max_lines = int(sys.argv[1]) if len(sys.argv) > 1 else 200
    text = "" if sys.stdin.isatty() else sys.stdin.read()
    text = text if text.strip() else SAMPLE
    files = parse(text)
    total = sum(f[1] for f in files)
    parts = slices(files, max_lines)
    print(f"{len(files)} file{'' if len(files)==1 else 's'}, {total} changed lines -> {len(parts)} slice{'' if len(parts)==1 else 's'} (max {max_lines} lines each)")
    for i, part in enumerate(parts, 1):
        size = sum(f[1] for f in part)
        tag = "RISKY, review first" if part[0][2] else "normal"
        flag = "  <- over budget: split this file or ask for a smaller change" if size > max_lines else ""
        print(f"\nSlice {i} ({size} lines, {tag}){flag}")
        for path, n, _ in part:
            print(f"  {path} ({'binary' if n == 0 else str(n) + ' lines'})")


if __name__ == "__main__":
    main()
