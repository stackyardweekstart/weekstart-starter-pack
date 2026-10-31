# write_key.py: pattern only; swap the dict for your real store.
import hashlib, json, uuid

class WriteConflict(Exception): pass
class OutcomeUnknown(Exception): pass   # raise on timeout / 5xx / still running

def fp(payload):
    return hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()

def mutating_call(store, intent_id, payload, call_fn):
    row = store.get(intent_id)
    if row and row["status"] == "succeeded":
        return row["receipt"]                       # already done: don't create again
    if row and row["status"] == "pending":
        if row["fp"] != fp(payload):
            raise WriteConflict("Same write key, different payload. Stop and inspect.")
        key = row["key"]                            # retry: same key, same body
    else:
        key = str(uuid.uuid4())                     # first try, or a fixed request
        store[intent_id] = {"key": key, "fp": fp(payload), "status": "pending", "receipt": None}
    try:
        receipt = call_fn(idempotency_key=key, payload=payload)
    except OutcomeUnknown:
        raise                                       # stays pending, keeps its key
    except Exception:
        store[intent_id]["status"] = "failed"
        raise
    store[intent_id].update(status="succeeded", receipt=receipt)
    return receipt
