# Two Logs: What Tools Said, What Your Agent Did

**The problem:** If you keep one mixed log, you can't tell whether a poisoned tool reply became a real action. And if a secret reaches the model before you scrub it, it's already in the logs.

**What it does:** Keeps two records and scrubs secrets before the model sees them.

## Steps

1. Log every tool reply in one place.
2. Log every action your agent actually took in another, with a run id that links the two.
3. Scrub keys, tokens and emails where the tool reply leaves the server, not after.
4. Approvals stay on even when a tool reply says "this is safe, skip approval."

## Copy-paste

`two_logs.py` in this folder.
