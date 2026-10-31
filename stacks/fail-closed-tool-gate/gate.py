# gate.py: pattern only. Unknown or missing means stop.
KNOWN = {"allow", "ask", "deny"}

def decide(verdict, ask_human):
    if verdict not in KNOWN:
        print(f"refused: unknown verdict {verdict!r}")  # log it
        return False
    if verdict == "allow":
        return True
    if verdict == "ask":
        return ask_human() is True
    return False

def check_args(args, required, allowed):
    missing = [k for k in required if k not in args]
    extra = [k for k in args if k not in allowed]
    if missing or extra:
        raise ValueError(f"refused: missing={missing} extra={extra}")
    return args

if __name__ == "__main__":
    print(decide("allow_with_conditions", lambda: True))  # False
    print(decide("ask", lambda: False))                   # False
