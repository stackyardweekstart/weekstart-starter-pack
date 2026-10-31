# Ask a Person Before Pay or Delete

**The problem:** "Don't delete prod" written in a prompt is not a control. An automatic check that later says yes is not a human checkpoint either.

**What it does:** A fixed list of risky steps waits for a person. The list lives in your code, not in the prompt.

## Steps

1. Write the list down in code: moving money, deleting, anything you can't undo, sending to someone new outside, changing access or credentials.
2. Before each step runs, check it against the list. If it matches, pause and ask a person.
3. Keep this check between the agent and the tool, so the model can't talk its way past it.
4. Nothing on the list runs without a yes. No answer counts as no.

## Copy-paste

`must_ask.py` in this folder: a tiny check you can call before each step.
