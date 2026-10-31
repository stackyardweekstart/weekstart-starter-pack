# Retry With a Key

**The problem:** Your agent sends a write, the network times out, and it retries. The first one may have worked. A retry without the same key is a second write.

**What it does:** One key per real-world action. Retries reuse it. A local record stops repeats when the service has no key of its own.

## Steps

1. Before the first try, make one random key (a UUID) for this action and save it with the action.
2. Timeout, dropped connection or server error: retry with the **same** key and the **same** body. A timeout is not proof it failed.
3. You fixed a bad request? That's a new action, so make a new key.
4. Same key with a different body means stop and look. It's a bug, not a retry.
5. Send the key only in the field the service documents. If it documents none, keep your own record and check it before you create anything.
6. Don't tell anyone "done" until you have a receipt or object id.
7. Never use emails, account numbers or secrets as keys.

## Copy-paste

`write_key.py` in this folder: mint, reuse, and check-before-create in one small file.
