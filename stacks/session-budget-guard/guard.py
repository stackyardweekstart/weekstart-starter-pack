# guard.py: pattern only; adapt to your client.
class BudgetHit(Exception):
    pass

def run_turn(state, ceiling, message, estimate, call_fn):
    used = state.get("used", 0)
    if used + estimate > ceiling:
        raise BudgetHit(message)
    result_tokens = call_fn()
    state["used"] = used + result_tokens
    if state["used"] >= ceiling:
        state["stopped"] = True   # do not schedule another turn
    return state

if __name__ == "__main__":
    s = {}
    try:
        for _ in range(10):
            run_turn(s, 1000, "Run budget hit. Review before continuing.", 300, lambda: 300)
    except BudgetHit as e:
        print(e, s)
