# Token Defrag

**What it fixes:** Cuts what you pay every turn to carry old context around.

**Who it's for:** Anyone running long agent sessions who watches the token bill.

## Example

Before: every turn re-sends a full pasted page, old tool output, and every tool you have.
After: fetch the page once and keep the extract, drop the old output, and turn on only this turn's tools. Same work, a smaller context each turn. Checklist below.

## Steps

1. Keep tool definitions steady, or only add to the end. Rewriting them mid-run breaks the prompt cache.
2. Drop old tool output you could fetch again. Keep the goal and recent results.
3. Fetch a page once, save what you pulled out, and point back to it. Don't paste the full page every turn.
4. Turn on only the tools this turn needs. Every tool you turn on costs tokens, even unused.
5. Reuse a long-lived workspace instead of starting a fresh one for every small step.

## Copy-paste checklist

```text
[ ] Tool definitions stable or append-only
[ ] Old, re-fetchable tool output cleared; goal kept
[ ] Fetch once -> save extract -> cite
[ ] Only this turn's tools enabled
[ ] Long-lived workspace reused
[ ] Unknown or missing permission = stop (no costly retry loops)
```
