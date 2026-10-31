# Said vs. Did Log

**What it fixes:** Lets you prove whether a bad tool reply turned into a real action, and keeps secrets away from the model.

**Who it's for:** Anyone who has to explain afterwards what their agent did and why.

## Example

Before: one mixed log, and a reply containing `contact ops@example.com` goes to the model as-is.
After: `tool_said("run-1", "crm", "contact ops@example.com")` returns `contact [redacted]`, writes it to `tools_said.jsonl`, and `agent_did(...)` writes actions to `agent_did.jsonl` under the same run id.

## Steps

1. Log every tool reply in one place.
2. Log every action your agent actually took in another, with a run id that links the two.
3. Scrub keys, tokens and emails where the tool reply leaves the server, not after.
4. Approvals stay on even when a tool reply says "this is safe, skip approval."

## Copy-paste

`two_logs.py` in this folder.
