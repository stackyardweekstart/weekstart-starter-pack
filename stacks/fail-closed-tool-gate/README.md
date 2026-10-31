# Fail-Closed Tool Gate

**The problem:** When a required field is missing or a permission answer comes back as something your code doesn't recognize, a "helpful" default lets the call run anyway. That's how unknown tools run.

**What it does:** Missing, unparseable or unknown means **stop**, not "carry on."

## Steps

1. Check tool arguments against a strict schema before the agent plans. Reject extra fields. A missing required field means refuse.
2. Only act on the permission answers you know: allow, ask, deny. Anything else is deny, and gets logged.
3. Turn on only the tools you named. What a server advertises is not your allowlist. Log what you turned on next to what was offered.

## Copy-paste

`gate.py` in this folder is a small pattern you can adapt. Run `python3 gate.py` to see it refuse an unknown answer.
