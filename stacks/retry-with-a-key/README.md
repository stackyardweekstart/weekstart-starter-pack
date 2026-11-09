# Retry With a Key

**What it fixes:** Stops a timeout-and-retry from creating a second charge, ticket or pull request.

**Who it's for:** Anyone whose agent writes to payments, tickets, repos or other real systems.

## Example

Before: the write times out, the agent retries with a fresh request, and you get two charges.
After: `mutating_call(store, "refund-42", body, call_fn)` keeps the same key on the retry, and once it succeeds a second call returns the saved receipt instead of writing again.

## Steps

1. Before the first try, make one random key (a UUID) for this action and save it with the action.
2. Timeout, dropped connection or server error: retry with the **same** key and the **same** body. A timeout is not proof it failed.
3. You fixed a bad request? That's a new action, so make a new key.
4. Same key with a different body means stop and look. It's a bug, not a retry.
5. Send the key only in the field the service documents. If it documents none, keep your own record and check it before you create anything.
6. Don't tell anyone "done" until you have a receipt or object id.
7. Never use emails, account numbers or secrets as keys.

## Copy-paste

`write_key.py` in this folder: mint, reuse, and check-before-create in one small file. `test_write_key.py` covers same-key same-payload and same-key different-payload.

Want the full version with more cases? It's on https://stackyard.fyi.
