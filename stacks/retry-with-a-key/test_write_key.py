# Regression tests for write_key.mutating_call (stdlib only).
import unittest
from write_key import WriteConflict, mutating_call, fp

class MutatingCallFingerprintTests(unittest.TestCase):
    def test_same_key_same_payload_returns_stored_receipt(self):
        store = {}
        calls = []

        def call_fn(*, idempotency_key, payload):
            calls.append((idempotency_key, payload))
            return "rcpt-1"

        payload = {"amount": 10, "to": "a@example.com"}
        first = mutating_call(store, "intent-1", payload, call_fn)
        second = mutating_call(store, "intent-1", payload, call_fn)
        self.assertEqual(first, "rcpt-1")
        self.assertEqual(second, "rcpt-1")
        self.assertEqual(len(calls), 1)  # second call must not hit the vendor again

    def test_same_key_different_payload_raises_write_conflict(self):
        store = {}

        def call_fn(*, idempotency_key, payload):
            return "rcpt-1"

        mutating_call(store, "intent-1", {"amount": 10}, call_fn)
        with self.assertRaises(WriteConflict):
            mutating_call(store, "intent-1", {"amount": 99}, call_fn)
        # also: pending row with a different payload
        store2 = {
            "intent-2": {
                "key": "k",
                "fp": fp({"amount": 1}),
                "status": "pending",
                "receipt": None,
            }
        }
        with self.assertRaises(WriteConflict):
            mutating_call(store2, "intent-2", {"amount": 2}, call_fn)

if __name__ == "__main__":
    unittest.main()
