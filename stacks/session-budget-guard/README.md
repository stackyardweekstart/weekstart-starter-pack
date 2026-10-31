# Session Budget Guard

**The problem:** An agent loop with no ceiling keeps apologizing and retrying. A per-reply limit is not a per-run total, so mixing them up still burns money.

**What it does:** Your own run-level ceiling. When the next call would go over, the guard refuses and shows a person a plain message.

## Steps

1. Pick a ceiling for one run, sized to the task. Put it in a config file (example below).
2. Wrap every model call in the guard.
3. When the ceiling hits: stop. Don't retry, don't schedule another turn.
4. Use your vendor's own caps too where they exist, but keep this guard. Vendor caps can run slightly over and don't cover a run that spans several sessions.

## Copy-paste config

```yaml
# session-budget.yaml (your own config, not a vendor format)
session:
  max_total_tokens: 200000
  on_budget_hit: fail_closed   # never soft_retry
  human_message: "Run budget hit. Review the run before continuing."
```

`guard.py` in this folder is the wrapper.
