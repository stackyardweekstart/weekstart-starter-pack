# Session Budget Guard

**What it fixes:** Stops one run from retrying forever and running up the bill.

**Who it's for:** Anyone running agent loops unattended.

## Example

Before: a loop keeps calling the model with no total limit.
After: `python3 guard.py` (1,000-token ceiling, 300 per turn)

```text
Run budget hit. Review before continuing. {'used': 900}
```

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
