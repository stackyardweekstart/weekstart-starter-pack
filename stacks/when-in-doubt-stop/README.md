# When in Doubt, Stop

**What it fixes:** Stops a tool call when a field is missing or a permission answer is one your code doesn't recognize.

**Who it's for:** Anyone whose agent calls tools that can change real things.

## Example

Before: the permission check returns `allow_with_conditions`, a default treats it as yes, and the call runs.
After: `python3 gate.py`

```text
refused: unknown verdict 'allow_with_conditions'
False
```

## Steps

1. Check tool arguments against a strict schema before the agent plans. Reject extra fields. A missing required field means refuse.
2. Only act on the permission answers you know: allow, ask, deny. Anything else is deny, and gets logged.
3. Turn on only the tools you named. What a server advertises is not your allowlist. Log what you turned on next to what was offered.

## Copy-paste

`gate.py` in this folder is a small pattern you can adapt. Run `python3 gate.py` to see it refuse an unknown answer.
