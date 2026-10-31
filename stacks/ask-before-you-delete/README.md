# Ask Before You Delete

**What it fixes:** Stops payments, deletes and other can't-undo steps from running without a person saying yes.

**Who it's for:** Anyone letting an agent touch money, data or access.

## Example

Before: the agent decides a `delete` on `customers` is fine and runs it.
After: `python3 must_ask.py` (nobody answered, so it waits)

```text
stopped: waiting for a person
```

## Steps

1. Write the list down in code: moving money, deleting, anything you can't undo, sending to someone new outside, changing access or credentials.
2. Before each step runs, check it against the list. If it matches, pause and ask a person.
3. Keep this check between the agent and the tool, so the model can't talk its way past it.
4. Nothing on the list runs without a yes. No answer counts as no.

## Copy-paste

`must_ask.py` in this folder: a tiny check you can call before each step.
