# Pin Your Tool Definitions

**The problem:** A tool that was safe when you connected it can change its description or inputs later. If nothing notices, the change goes through without a word.

**What it does:** Fingerprints each tool when you approve it and refuses, or asks again, when the fingerprint no longer matches.

## Steps

1. When you approve a tool, save a hash of its name, description and input schema.
2. Before each run, hash it again and compare.
3. On a mismatch: stop and ask again. Make it loud.
4. Try new rules in a dry run first, read the log, then turn them on. Then try them on a few agents before all of them.

## Copy-paste

`pin_tools.py` in this folder.
